import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function AuthCallback() {
  const router = useRouter();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Extract session_id from URL hash
        const hash = window.location.hash;
        const sessionIdMatch = hash.match(/session_id=([^&]+)/);
        
        if (!sessionIdMatch) {
          console.error('No session_id found in URL');
          router.replace('/');
          return;
        }

        const sessionId = sessionIdMatch[1];

        // Exchange session_id for session_token
        const response = await fetch(`${BACKEND_URL}/api/auth/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange session');
        }

        const userData = await response.json();
        setUser(userData);

        // Clear hash
        window.history.replaceState(null, '', window.location.pathname);
        
        // Check if user was redirected from offer page (after diagnostic)
        const redirectAfterLogin = await AsyncStorage.getItem('redirect_after_login');
        const pendingDiagnosticId = await AsyncStorage.getItem('pending_diagnostic_id');
        
        // Clear the stored values
        await AsyncStorage.removeItem('redirect_after_login');
        await AsyncStorage.removeItem('pending_diagnostic_id');
        
        // Navigate based on user status and redirect intent
        if (userData.has_purchased_pack) {
          router.replace('/protocol');
        } else if (redirectAfterLogin === 'offer') {
          // User came from offer page after doing diagnostic - redirect back to offer
          router.replace({
            pathname: '/offer',
            params: pendingDiagnosticId ? { diagnostic_id: pendingDiagnosticId } : {}
          });
        } else {
          router.replace('/diagnostic');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/');
      }
    };

    processAuth();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#10b981" />
      <Text style={styles.text}>Connexion en cours...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    gap: 20,
  },
  text: {
    color: '#9ca3af',
    fontSize: 16,
  },
});
