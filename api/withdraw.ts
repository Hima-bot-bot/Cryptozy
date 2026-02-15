// ============================================================
// Vercel Serverless Function: /api/withdraw
// Handles real crypto withdrawals via FaucetPay
// ============================================================
// 
// Environment variables required (set in Vercel Dashboard):
//   FAUCETPAY_API_KEY       — your FaucetPay API key
//   SUPABASE_URL            — your Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (SECRET)
//   HCAPTCHA_SECRET_KEY     — hCaptcha secret key
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const FAUCETPAY_API_KEY = process.env.FAUCETPAY_API_KEY!;
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ovypgcqkypgqglwmdkar.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY;

// Map frontend method IDs to FaucetPay currency codes
const CURRENCY_MAP: Record<string, string> = {
  btc: 'btc',
  ltc: 'ltc',
  doge: 'doge',
  usdt: 'usdt',
  trx: 'trx',
  faucetpay: 'btc', // FaucetPay internal = BTC by default
};

// Fee schedule (satoshi)
const FEE_MAP: Record<string, number> = {
  btc: 1000,
  ltc: 200,
  doge: 100,
  usdt: 500,
  trx: 50,
  faucetpay: 0,
};

// Minimum withdrawal amounts (satoshi)
const MIN_MAP: Record<string, number> = {
  btc: 50000,
  ltc: 20000,
  doge: 10000,
  usdt: 30000,
  trx: 15000,
  faucetpay: 5000,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Check server config
  if (!FAUCETPAY_API_KEY || !SUPABASE_SERVICE_KEY) {
    console.error('Missing environment variables: FAUCETPAY_API_KEY or SUPABASE_SERVICE_ROLE_KEY');
    return res.status(500).json({ success: false, error: 'Server configuration error. Contact admin.' });
  }

  try {
    const { amount, address, methodId, captchaToken } = req.body;

    // ──────────────────────────────────────────────
    // 1. Validate input
    // ──────────────────────────────────────────────
    if (!amount || !address || !methodId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    const currency = CURRENCY_MAP[methodId];
    if (!currency) {
      return res.status(400).json({ success: false, error: 'Invalid withdrawal method' });
    }

    const fee = FEE_MAP[methodId] || 0;
    const minAmount = MIN_MAP[methodId] || 5000;
    const netAmount = numAmount - fee;

    if (numAmount < minAmount) {
      return res.status(400).json({
        success: false,
        error: `Minimum withdrawal is ${minAmount.toLocaleString()} satoshi for ${methodId.toUpperCase()}`,
      });
    }

    if (netAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Amount too small after fees' });
    }

    if (address.length < 10) {
      return res.status(400).json({ success: false, error: 'Invalid wallet address' });
    }

    // ──────────────────────────────────────────────
    // 2. Verify user authentication (Supabase JWT)
    // ──────────────────────────────────────────────
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized — no token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired session. Please log in again.' });
    }

    // ──────────────────────────────────────────────
    // 3. Verify hCaptcha (server-side)
    // ──────────────────────────────────────────────
    if (HCAPTCHA_SECRET) {
      if (!captchaToken) {
        return res.status(400).json({ success: false, error: 'Captcha verification required' });
      }

      const captchaRes = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: HCAPTCHA_SECRET,
          response: captchaToken,
        }).toString(),
      });

      const captchaData = await captchaRes.json();
      if (!captchaData.success) {
        return res.status(400).json({ success: false, error: 'Captcha verification failed. Please try again.' });
      }
    }

    // ──────────────────────────────────────────────
    // 4. Check user balance in database
    // ──────────────────────────────────────────────
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('balance_satoshi')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(400).json({ success: false, error: 'Profile not found' });
    }

    if (profile.balance_satoshi < numAmount) {
      return res.status(400).json({
        success: false,
        error: `Insufficient balance. You have ${profile.balance_satoshi.toLocaleString()} sat but tried to withdraw ${numAmount.toLocaleString()} sat.`,
      });
    }

    // ──────────────────────────────────────────────
    // 5. Send payment via FaucetPay API
    // ──────────────────────────────────────────────
    const fpPayload = new URLSearchParams({
      api_key: FAUCETPAY_API_KEY,
      amount: netAmount.toString(),
      to: address,
      currency: currency,
    });

    const fpRes = await fetch('https://faucetpay.io/api/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: fpPayload.toString(),
    });

    const fpData = await fpRes.json();

    // ──────────────────────────────────────────────
    // 6. Handle FaucetPay response
    // ──────────────────────────────────────────────
    if (fpData.status !== 200) {
      // Payment failed — log it but don't deduct balance
      await supabaseAdmin.from('withdrawals').insert({
        user_id: user.id,
        method: currency.toUpperCase(),
        amount: numAmount,
        fee,
        net_amount: netAmount,
        address,
        status: 'failed',
        tx_hash: null,
      });

      // Map common FaucetPay errors to user-friendly messages
      let errorMsg = fpData.message || 'Payment failed';
      if (fpData.status === 456) errorMsg = 'FaucetPay: Insufficient balance in the faucet. Please try again later or contact admin.';
      if (fpData.status === 401) errorMsg = 'FaucetPay: Invalid API credentials. Contact admin.';
      if (fpData.status === 402) errorMsg = 'FaucetPay: Invalid wallet address. Please check your address.';
      if (fpData.status === 403) errorMsg = 'FaucetPay: Address not registered on FaucetPay. Please register at faucetpay.io first.';
      if (fpData.status === 404) errorMsg = 'FaucetPay: This currency is not supported.';
      if (fpData.status === 405) errorMsg = 'FaucetPay: Amount is below the minimum allowed.';

      return res.status(400).json({
        success: false,
        error: errorMsg,
        faucetpay_code: fpData.status,
      });
    }

    // ──────────────────────────────────────────────
    // 7. Success! Update database
    // ──────────────────────────────────────────────
    const newBalance = profile.balance_satoshi - numAmount;
    const txHash = fpData.payout_id?.toString() || fpData.payout_user_hash || `FP-${Date.now()}`;

    // Update balance
    await supabaseAdmin
      .from('profiles')
      .update({
        balance_satoshi: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // Create withdrawal record
    await supabaseAdmin.from('withdrawals').insert({
      user_id: user.id,
      method: currency.toUpperCase(),
      amount: numAmount,
      fee,
      net_amount: netAmount,
      address,
      status: 'completed',
      tx_hash: txHash,
      processed_at: new Date().toISOString(),
    });

    // Create transaction record
    await supabaseAdmin.from('transactions').insert({
      user_id: user.id,
      type: 'withdraw',
      description: `Withdrawal: ${numAmount.toLocaleString()} sat via ${currency.toUpperCase()} (Fee: ${fee} sat)`,
      amount: numAmount,
    });

    // ──────────────────────────────────────────────
    // 8. Return success
    // ──────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: `Successfully sent ${netAmount.toLocaleString()} sat to ${address}`,
      tx_hash: txHash,
      net_amount: netAmount,
      fee,
      currency: currency.toUpperCase(),
      new_balance: newBalance,
    });
  } catch (error: any) {
    console.error('Withdrawal API error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    });
  }
}
