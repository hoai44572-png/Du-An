import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrencyVN(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0₫'
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + '₫'
}

export function formatVND(amount: number): string {
  return formatCurrencyVN(amount)
}
