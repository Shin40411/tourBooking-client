import axios, { endpoints } from 'src/lib/axios';

import { setSession } from './utils';
import { JWT_STORAGE_KEY, JWT_USER_INFO } from './constant';

// ----------------------------------------------------------------------

export type SignInParams = {
  username: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  username: string;
  phone: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password }: SignInParams): Promise<void> => {
  try {
    const params = { username, password };

    const res = await axios.post(endpoints.auth.signIn, params);
    const { token, role } = res.data;

    if (!token) {
      throw new Error('Không tìm thấy access token');
    }

    sessionStorage.setItem(JWT_USER_INFO, JSON.stringify(res.data));
    setSession(token);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  username,
  phone,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    username,
    phone,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const dt = res.data;
    return dt;
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
