"use server"

import AuthService from '../../lib/auth-service';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string || '';
    const lastName = formData.get('lastName') as string || '';
    const university = formData.get('university') as string || undefined;
    const phone = formData.get('phone') as string || undefined;

    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
      university,
      phone,
    });

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { success: true, message: 'Account created successfully!', user: result.user };
  } catch (error: any) {
    return { error: error.message || 'Registration failed' };
  }
}

export async function signIn(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    const result = await AuthService.login({
      email,
      password,
    });

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    redirect('/dashboard');
  } catch (error: any) {
    return { error: error.message || 'Login failed' };
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (token) {
      await AuthService.logout(token);
    }

    // Clear auth cookie
    cookieStore.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });

    redirect('/');
  } catch (error: any) {
    // Always clear cookie even if logout fails
    const cookieStore = await cookies();
    cookieStore.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });

    redirect('/');
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const user = await AuthService.verifyToken(token);
    return user;
  } catch (error) {
    return null;
  }
}