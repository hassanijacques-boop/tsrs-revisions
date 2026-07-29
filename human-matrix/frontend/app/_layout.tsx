import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface User {
  user_id: string;
  email: string;
  name: string;
  picture?: string;
  has_purchased_pack: boolean;
  pack_start_date?: string;
  current_day: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {},
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      // Check for session_id in URL (handled by callback page)
      if (typeof window !== 'undefined' && window.location.hash?.includes('session_id=')) {
        setLoading(false);
        return;
      }

      // Check stored session
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    console.log('Login function called, Platform:', Platform.OS);
    
    if (Platform.OS === 'web') {
      // Web browser
      if (typeof window !== 'undefined') {
        const redirectUrl = window.location.origin + '/auth/callback';
        window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
      }
    } else {
      // Mobile (iOS/Android) - use Linking to open browser
      try {
        // For Expo Go, we need to use the web URL as redirect
        // After auth, user will be redirected to the web version which can be opened in Expo Go
        const webUrl = BACKEND_URL || 'https://protocol-7j.preview.emergentagent.com';
        const redirectUrl = `${webUrl}/auth/callback`;
        const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
        
        console.log('Opening auth URL:', authUrl);
        
        // Open in external browser
        const supported = await Linking.canOpenURL(authUrl);
        if (supported) {
          await Linking.openURL(authUrl);
        } else {
          console.error('Cannot open URL:', authUrl);
        }
      } catch (error) {
        console.error('Mobile login error:', error);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
    setUser(null);
    router.replace('/');
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.log('Refresh user error:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0a0a' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/callback" />
        <Stack.Screen name="diagnostic/index" />
        <Stack.Screen name="diagnostic/question" />
        <Stack.Screen name="diagnostic/verdict" />
        <Stack.Screen name="offer/index" />
        <Stack.Screen name="offer/success" />
        <Stack.Screen name="protocol/index" />
        <Stack.Screen name="protocol/briefing" />
        <Stack.Screen name="protocol/missions" />
        <Stack.Screen name="protocol/sos" />
        <Stack.Screen name="protocol/report" />
      </Stack>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
});
