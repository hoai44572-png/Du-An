'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  isPassword?: boolean;
}

export function InputField({
  label,
  icon,
  error,
  isPassword = false,
  type = 'text',
  className = '',
  id,
  required,
  ...props
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5 w-full">
      <label
        htmlFor={inputId}
        className="block text-[11px] font-extrabold tracking-wider text-[#2B160C] uppercase"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-[#A89C92] pointer-events-none transition-colors">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          type={inputType}
          required={required}
          className={[
            'w-full bg-[#FAFAFA] border border-[#E5DFD7] rounded-xl text-xs sm:text-sm text-[#1F120A] transition-all duration-200',
            'placeholder:text-[#B5A89E] placeholder:font-normal',
            'focus:outline-none focus:bg-white focus:border-[#3C1505] focus:ring-2 focus:ring-[#3C1505]/15',
            icon ? 'pl-10 pr-4' : 'px-4',
            isPassword ? 'pr-10' : '',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'hover:border-[#CFC5B8]',
            'py-3',
            className,
          ].join(' ')}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 p-1 text-[#A89C92] hover:text-[#3C1505] transition-colors rounded-lg"
            tabIndex={-1}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-red-600 font-medium flex items-center gap-1.5 pt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
