/**
 * Authentication & JWT Token Helper Utilities for Swift Coffee E-Commerce
 */

const TOKEN_KEY = 'swift_coffee_auth_token';
const USER_KEY = 'swift_coffee_user';
const REMEMBER_KEY = 'swift_coffee_remember_me';

export interface UserProfile {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  username?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  customerCode?: string;
  memberTier?: string;
  rewardPoints?: number;
  provider?: string;
  hasPassword?: boolean;
}

export const authStorage = {
  /**
   * Save JWT token to storage
   */
  setToken: (token: string, remember: boolean = true): void => {
    if (typeof window === 'undefined') return;
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REMEMBER_KEY, 'true');
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REMEMBER_KEY, 'false');
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  /**
   * Get JWT token from storage
   */
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  /**
   * Remove token & clear session
   */
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  /**
   * Save user profile info
   */
  setUser: (user: UserProfile): void => {
    if (typeof window === 'undefined') return;
    const remember = localStorage.getItem(REMEMBER_KEY) === 'true';
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Get user profile info
   */
  getUser: (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!authStorage.getToken();
  },
};
