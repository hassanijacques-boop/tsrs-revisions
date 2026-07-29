import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './_layout';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const { user, login, loading } = useAuth();

  const handleStart = () => {
    if (user?.has_purchased_pack) {
      router.push('/protocol');
    } else {
      router.push('/diagnostic');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={40} color="#10b981" />
            <Text style={styles.logoText}>MENTAL NATION</Text>
          </View>
          {user ? (
            <View style={styles.userBadge}>
              <Ionicons name="person-circle" size={24} color="#10b981" />
              <Text style={styles.userName}>{user.name?.split(' ')[0]}</Text>
            </View>
          ) : null}
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>REPRENDS LE CONTRÔLE</Text>
          <Text style={styles.heroSubtitle}>DE TON ARCHITECTURE MENTALE</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.heroDescription}>
            7 jours de protocole intensif pour stabiliser les 4 piliers de ta souveraineté intérieure.
          </Text>
        </View>

        {/* CTA Section - MOVED UP */}
        <View style={styles.ctaSection}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : user ? (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={handleStart}>
                <Text style={styles.primaryButtonText}>
                  {user.has_purchased_pack ? 'ACCÉDER AU PROTOCOLE' : 'COMMENCER LE DIAGNOSTIC'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
              </TouchableOpacity>
              {user.has_purchased_pack && (
                <Text style={styles.packStatus}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" /> Pack 7 jours actif - Jour {user.current_day || 1}
                </Text>
              )}
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/diagnostic')}>
                <Ionicons name="analytics" size={20} color="#000" />
                <Text style={styles.primaryButtonText}>DIAGNOSTIC GRATUIT</Text>
              </TouchableOpacity>
              <Text style={styles.ctaHint}>Découvre ton profil de souveraineté</Text>
            </>
          )}
        </View>

        {/* Quadrant Preview */}
        <View style={styles.quadrantSection}>
          <Text style={styles.sectionTitle}>LES 4 PÔLES</Text>
          <View style={styles.quadrantGrid}>
            <View style={styles.quadrantItem}>
              <Ionicons name="body" size={28} color="#ef4444" />
              <Text style={styles.quadrantLabel}>DJISM</Text>
              <Text style={styles.quadrantDesc}>Corps</Text>
            </View>
            <View style={styles.quadrantItem}>
              <Ionicons name="bulb" size={28} color="#3b82f6" />
              <Text style={styles.quadrantLabel}>'AQL</Text>
              <Text style={styles.quadrantDesc}>Esprit</Text>
            </View>
            <View style={styles.quadrantItem}>
              <Ionicons name="flame" size={28} color="#f59e0b" />
              <Text style={styles.quadrantLabel}>NAFS</Text>
              <Text style={styles.quadrantDesc}>Âme</Text>
            </View>
            <View style={styles.quadrantItem}>
              <Ionicons name="heart" size={28} color="#10b981" />
              <Text style={styles.quadrantLabel}>QALB</Text>
              <Text style={styles.quadrantDesc}>Cœur</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>LA SENTINELLE VEILLE</Text>
          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={() => router.push('/legal/privacy')}>
              <Text style={styles.legalLink}>Confidentialité</Text>
            </TouchableOpacity>
            <Text style={styles.legalSeparator}>•</Text>
            <TouchableOpacity onPress={() => router.push('/legal/terms')}>
              <Text style={styles.legalLink}>CGU</Text>
            </TouchableOpacity>
            <Text style={styles.legalSeparator}>•</Text>
            <TouchableOpacity onPress={() => router.push('/legal/mentions')}>
              <Text style={styles.legalLink}>Mentions légales</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  userName: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 14,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 3,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 2,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#10b981',
    marginVertical: 24,
    borderRadius: 2,
  },
  heroDescription: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  quadrantSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 20,
  },
  quadrantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  quadrantItem: {
    width: (width - 64) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quadrantLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    marginTop: 12,
    letterSpacing: 1,
  },
  quadrantDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  ctaSection: {
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
    width: '100%',
    maxWidth: 320,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    maxWidth: 320,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  packStatus: {
    fontSize: 14,
    color: '#10b981',
    marginTop: 8,
  },
  ctaHint: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    padding: 20,
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 14,
  },
  footer: {
    marginTop: 60,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#374151',
    letterSpacing: 4,
    fontWeight: '600',
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  legalLink: {
    fontSize: 12,
    color: '#6b7280',
  },
  legalSeparator: {
    fontSize: 12,
    color: '#4b5563',
  },
});
