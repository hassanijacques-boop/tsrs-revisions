import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../_layout';
import * as WebBrowser from 'expo-web-browser';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function OfferScreen() {
  const router = useRouter();
  const { diagnostic_id } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handlePurchase = async () => {
    // Aller directement au paiement Stripe sans connexion Google
    setLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/payment/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          origin_url: origin,
          diagnostic_session_id: diagnostic_id || null,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        if (Platform.OS === 'web') {
          // Sur web, redirection directe
          window.location.href = data.url;
        } else {
          // Sur mobile (Expo Go), utiliser WebBrowser pour une meilleure expérience
          try {
            await WebBrowser.openBrowserAsync(data.url);
          } catch (browserError) {
            // Fallback vers Linking si WebBrowser échoue
            console.log('WebBrowser failed, trying Linking:', browserError);
            const canOpen = await Linking.canOpenURL(data.url);
            if (canOpen) {
              await Linking.openURL(data.url);
            } else {
              Alert.alert(
                'Erreur',
                'Impossible d\'ouvrir la page de paiement. Veuillez réessayer.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      } else {
        Alert.alert('Erreur', 'Impossible de créer la session de paiement.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={24} color="#10b981" />
          </View>
          <Text style={styles.title}>PROTOCOLE DE RESTAURATION</Text>
          <Text style={styles.subtitle}>7 JOURS</Text>
        </View>

        {/* Warning message */}
        <View style={styles.warningBox}>
          <Ionicons name="alert-circle" size={24} color="#f59e0b" />
          <Text style={styles.warningText}>
            Le diagnostic est sans appel. Ton architecture ne tiendra pas seule.
          </Text>
        </View>

        {/* What you get */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>CE QUI T'ATTEND</Text>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="play-circle" size={24} color="#10b981" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>BRIEFING SENTINELLE MATINAL</Text>
              <Text style={styles.featureDesc}>Un audio calibrateur chaque jour pour lancer ta mission.</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="list" size={24} color="#3b82f6" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>4 MISSIONS QUOTIDIENNES</Text>
              <Text style={styles.featureDesc}>Actions concrètes sur chaque pôle. Non négociables.</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="medical" size={24} color="#ef4444" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>BOUTON SOS D'URGENCE</Text>
              <Text style={styles.featureDesc}>Respiration forcée + Audit flash en cas de rupture.</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="analytics" size={24} color="#8b5cf6" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>RAPPORT FINAL DE SOUVERAINETÉ</Text>
              <Text style={styles.featureDesc}>Comparaison avant/après pour mesurer tes gains.</Text>
            </View>
          </View>
        </View>

        {/* Quote */}
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            "Tu échanges 7 jours de confort contre une vie de clarté."
          </Text>
          <Text style={styles.quoteAuthor}>— Le Filtre Sowell</Text>
        </View>

        {/* Price */}
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>ACCÈS COMPLET</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>17€</Text>
            <Text style={styles.pricePer}>paiement unique</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, loading && styles.ctaButtonDisabled]}
          onPress={handlePurchase}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.ctaButtonText}>CHARGEMENT...</Text>
          ) : (
            <>
              <Text style={styles.ctaButtonText}>REJOINDRE LA NATION</Text>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </>
          )}
        </TouchableOpacity>

        {/* Guarantee */}
        <View style={styles.guaranteeBox}>
          <Ionicons name="shield-checkmark" size={16} color="#6b7280" />
          <Text style={styles.guaranteeText}>Paiement sécurisé par Stripe</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 10,
    padding: 10,
    alignSelf: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#10b981',
    letterSpacing: 4,
    marginTop: 4,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#fcd34d',
    lineHeight: 20,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 2,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#9ca3af',
    lineHeight: 18,
  },
  quoteBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    padding: 24,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    marginBottom: 32,
  },
  quoteText: {
    fontSize: 16,
    color: '#d1d5db',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 12,
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 2,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  price: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
  },
  pricePer: {
    fontSize: 14,
    color: '#6b7280',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 10,
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
  loginNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 12,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  guaranteeText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
