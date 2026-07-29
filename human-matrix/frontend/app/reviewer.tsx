import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './_layout';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ReviewerLogin() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!code.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/reviewer?code=${code}`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        // Set user in context
        setUser({
          user_id: data.user_id,
          email: data.email,
          name: 'Google Play Reviewer',
          has_purchased_pack: true,
          current_day: 1,
        });
        
        // Redirect to protocol
        router.replace('/protocol');
      } else {
        Alert.alert('Erreur', data.detail || 'Code invalide');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={64} color="#10b981" />
        </View>

        <Text style={styles.title}>ACCÈS REVIEWER</Text>
        <Text style={styles.subtitle}>
          Réservé à l'équipe Google Play
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Code d'accès"
            placeholderTextColor="#6b7280"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Text style={styles.buttonText}>ACCÉDER</Text>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          Cette page est destinée uniquement aux reviewers Google Play pour tester l'application complète.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 2,
  },
  note: {
    marginTop: 32,
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
