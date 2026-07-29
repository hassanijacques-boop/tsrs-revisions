import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../_layout';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function PaymentSuccess() {
  const router = useRouter();
  const { session_id } = useLocalSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [attempts, setAttempts] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCreated, setUserCreated] = useState(false);

  useEffect(() => {
    if (session_id) {
      pollPaymentStatus();
    }
  }, [session_id]);

  const pollPaymentStatus = async () => {
    const maxAttempts = 10;
    const pollInterval = 2000;

    const checkStatus = async (attempt: number) => {
      if (attempt >= maxAttempts) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/payment/status/${session_id}`,
          { credentials: 'include' }
        );
        const data = await response.json();

        if (data.payment_status === 'paid') {
          setStatus('success');
          setUserEmail(data.user_email);
          setUserCreated(data.user_created);
          await refreshUser();
          // Redirect to protocol after 3 seconds
          setTimeout(() => {
            router.replace('/protocol');
          }, 3000);
          return;
        } else if (data.status === 'expired') {
          setStatus('error');
          return;
        }

        // Continue polling
        setAttempts(attempt + 1);
        setTimeout(() => checkStatus(attempt + 1), pollInterval);
      } catch (error) {
        console.error('Error checking payment:', error);
        setTimeout(() => checkStatus(attempt + 1), pollInterval);
      }
    };

    checkStatus(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {status === 'checking' && (
          <>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.title}>Vérification du paiement...</Text>
            <Text style={styles.subtitle}>Cela peut prendre quelques secondes</Text>
          </>
        )}

        {status === 'success' && (
          <>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color="#10b981" />
            </View>
            <Text style={styles.title}>BIENVENUE DANS LA NATION</Text>
            <Text style={styles.subtitle}>Ton accès au Protocole 7 Jours est activé</Text>
            
            {userEmail && (
              <View style={styles.accountInfo}>
                <Ionicons name="mail" size={20} color="#10b981" />
                <Text style={styles.accountText}>
                  Compte créé avec : {userEmail}
                </Text>
              </View>
            )}
            
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                <Ionicons name="information-circle" size={14} color="#6b7280" /> Tu peux te reconnecter avec Google ou cet email
              </Text>
            </View>
            
            <Text style={styles.redirectText}>Redirection vers le protocole...</Text>
          </>
        )}

        {status === 'error' && (
          <>
            <View style={styles.errorIcon}>
              <Ionicons name="close-circle" size={80} color="#ef4444" />
            </View>
            <Text style={styles.title}>Erreur de paiement</Text>
            <Text style={styles.subtitle}>Le paiement n'a pas pu être confirmé</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  successIcon: {
    marginBottom: 16,
  },
  errorIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  accountText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  infoBox: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  redirectText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 24,
  },
});
