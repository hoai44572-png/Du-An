'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface SocialAuthProps {
  onSocialLogin?: (provider: 'google' | 'facebook' | 'microsoft') => void;
  title?: string;
  showMicrosoft?: boolean;
}

export function SocialAuth({ onSocialLogin, title = 'Hoặc tiếp tục với', showMicrosoft = true }: SocialAuthProps) {
  const handleLogin = (provider: 'google' | 'facebook' | 'microsoft') => {
    if (onSocialLogin) {
      onSocialLogin(provider);
    } else {
      // Default handler: Trigger OAuth redirect or mock popup
      console.log(`[OAuth Redirect] Triggering login for ${provider}...`);
      window.location.href = `/api/auth/${provider}`;
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/70" />
        </div>
        <div className="relative bg-background px-3 text-xs font-semibold text-foreground/45 uppercase tracking-wider">
          {title}
        </div>
      </div>

      <div className={`grid ${showMicrosoft ? 'grid-cols-3' : 'grid-cols-2'} gap-2.5`}>
        {/* Google */}
        <motion.button
          type="button"
          onClick={() => handleLogin('google')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-card border border-border/80 rounded-xl hover:bg-secondary/60 transition-all text-xs font-semibold text-foreground shadow-sm group"
          title="Đăng nhập bằng Google"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.1-6.68-4.93H1.28v3.15C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.28C.46 8.2.0 10.05.0 12c0 1.95.46 3.8 1.28 5.42l4.04-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.58l4.04 3.15c.94-2.83 3.57-4.98 6.68-4.98z"
            />
          </svg>
          <span className="hidden sm:inline">Google</span>
        </motion.button>

        {/* Facebook */}
        <motion.button
          type="button"
          onClick={() => handleLogin('facebook')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#1877F2] text-white rounded-xl hover:bg-[#166fe5] transition-all text-xs font-semibold shadow-sm shadow-[#1877F2]/20"
          title="Đăng nhập bằng Facebook"
        >
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="hidden sm:inline">Facebook</span>
        </motion.button>

        {/* Microsoft */}
        {showMicrosoft && (
          <motion.button
            type="button"
            onClick={() => handleLogin('microsoft')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-card border border-border/80 rounded-xl hover:bg-secondary/60 transition-all text-xs font-semibold text-foreground shadow-sm"
            title="Đăng nhập bằng Microsoft"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            <span className="hidden sm:inline">Microsoft</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
