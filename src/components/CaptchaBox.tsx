import { useRef, useEffect, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Shield, CheckCircle2 } from 'lucide-react';

const HCAPTCHA_SITE_KEY = 'a69418a6-d25e-4448-b400-8dc40802fe78';

interface CaptchaBoxProps {
  onStatusChange: (verified: boolean) => void;
  resetTrigger?: number;
  compact?: boolean;
}

export function CaptchaBox({ onStatusChange, resetTrigger = 0, compact = false }: CaptchaBoxProps) {
  const hcaptchaRef = useRef<HCaptcha>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (resetTrigger > 0) {
      setVerified(false);
      onStatusChange(false);
      hcaptchaRef.current?.resetCaptcha();
    }
  }, [resetTrigger, onStatusChange]);

  return (
    <div
      className={`flex flex-col items-center gap-3 ${compact ? 'p-3' : 'p-4'} rounded-xl border transition-all duration-300 ${
        verified
          ? 'bg-green-500/5 border-green-500/20'
          : 'bg-[#0d1220] border-amber-500/20'
      }`}
    >
      <div className="flex items-center gap-2">
        {verified ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-xs font-medium text-green-400">
              Verified ✓ You may proceed
            </span>
          </>
        ) : (
          <>
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-gray-400">
              {compact
                ? 'Verify you are human'
                : 'Complete the captcha to start earning'}
            </span>
          </>
        )}
      </div>
      {!verified && (
        <HCaptcha
          ref={hcaptchaRef}
          sitekey={HCAPTCHA_SITE_KEY}
          onVerify={() => {
            setVerified(true);
            onStatusChange(true);
          }}
          onExpire={() => {
            setVerified(false);
            onStatusChange(false);
          }}
          onError={() => {
            setVerified(false);
            onStatusChange(false);
          }}
          theme="dark"
          size={compact ? 'compact' : 'normal'}
        />
      )}
    </div>
  );
}
