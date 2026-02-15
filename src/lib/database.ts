import { supabase } from './supabase';

// ============================================================
// Types
// ============================================================

export type DbProfile = {
  id: string;
  username: string;
  balance_satoshi: number;
  total_earned: number;
  today_earned: number;
  ads_watched: number;
  links_visited: number;
  offers_completed: number;
  mining_earned: number;
  referral_code: string;
  referral_count: number;
  referral_earnings: number;
  level: number;
  xp: number;
  xp_to_next: number;
  referred_by: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type DbTransaction = {
  id: string;
  user_id: string;
  type: string;
  description: string;
  amount: number;
  created_at: string;
};

export type DbWithdrawal = {
  id: string;
  user_id: string;
  method: string;
  amount: number;
  fee: number;
  net_amount: number;
  address: string;
  status: string;
  tx_hash: string | null;
  processed_at: string | null;
  created_at: string;
};

export type DbReferral = {
  id: string;
  referrer_id: string;
  referred_id: string;
  commission_earned: number;
  created_at: string;
};

// ============================================================
// Profile
// ============================================================

export async function fetchProfile(userId: string): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }
  return data as DbProfile;
}

export async function updateProfile(userId: string, updates: Partial<DbProfile>) {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) console.error('Error updating profile:', error.message);
  return { error };
}

// ============================================================
// Transactions
// ============================================================

export async function addTransaction(
  userId: string,
  type: string,
  description: string,
  amount: number
) {
  const { error } = await supabase
    .from('transactions')
    .insert({ user_id: userId, type, description, amount });
  if (error) console.error('Error adding transaction:', error.message);
  return { error };
}

export async function fetchTransactions(
  userId: string,
  limit = 20
): Promise<DbTransaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Error fetching transactions:', error.message);
    return [];
  }
  return (data || []) as DbTransaction[];
}

// ============================================================
// Withdrawals
// ============================================================

export async function createWithdrawal(
  userId: string,
  method: string,
  amount: number,
  fee: number,
  address: string
) {
  const netAmount = amount - fee;
  const { error } = await supabase
    .from('withdrawals')
    .insert({
      user_id: userId,
      method,
      amount,
      fee,
      net_amount: netAmount,
      address,
    });
  if (error) console.error('Error creating withdrawal:', error.message);
  return { error };
}

export async function fetchWithdrawals(
  userId: string,
  limit = 10
): Promise<DbWithdrawal[]> {
  const { data, error } = await supabase
    .from('withdrawals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Error fetching withdrawals:', error.message);
    return [];
  }
  return (data || []) as DbWithdrawal[];
}

// ============================================================
// Referrals
// ============================================================

export async function fetchReferrals(
  userId: string
): Promise<DbReferral[]> {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching referrals:', error.message);
    return [];
  }
  return (data || []) as DbReferral[];
}
