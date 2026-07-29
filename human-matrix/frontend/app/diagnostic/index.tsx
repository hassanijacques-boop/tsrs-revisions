import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../_layout';

export default function DiagnosticIntro() {
  const router = useRouter();
  const { user, login } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="pulse" size={60} color="#10b981" />
        </View>

        {/* Title */}
        <Text style={styles.title}>DIAGNOSTIC DE SOUVERAINETÉ</Text>
        <Text style={styles.subtitle}>Analyse de ton architecture mentale</Text>

        {/* Description */}
        <View style={styles.descriptionBox}>
          <Text style={styles.description}>
            15 questions. 4 pôles. 1 verdict sans appel.
          </Text>
          <Text style={styles.description}>
            La Sentinelle va scanner l'état réel de tes fondations intérieures.
          </Text>
        </View>

        {/* Poles Info */}
        <View style={styles.polesContainer}>
          <Text style={styles.polesTitle}>PÔLES ANALYSÉS</Text>
          <View style={styles.poleItem}>
            <View style={[styles.poleDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.poleName}>DJISM</Text>
            <Text style={styles.poleDesc}>- Corps & Énergie</Text>
          </View>
          <View style={styles.poleItem}>
            <View style={[styles.poleDot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.poleName}>'AQL</Text>
            <Text style={styles.poleDesc}>- Esprit & Clarté</Text>
          </View>
          <View style={styles.poleItem}>
            <View style={[styles.poleDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.poleName}>NAFS</Text>
            <Text style={styles.poleDesc}>- Âme & Discipline</Text>
          </View>
          <View style={styles.poleItem}>
            <View style={[styles.poleDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.poleName}>QALB</Text>
            <Text style={styles.poleDesc}>- Cœur & Mission</Text>
          </View>
        </View>

        {/* Warning */}
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={20} color="#f59e0b" />
          <Text style={styles.warningText}>
            Réponds avec une honnêteté brutale. Ton ego n'est pas ton allié ici.
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/diagnostic/question')}
        >
          <Text style={styles.startButtonText}>LANCER L'ANALYSE</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

        {!user && (
          <TouchableOpacity style={styles.loginHint} onPress={login}>
            <Text style={styles.loginHintText}>
              <Ionicons name="information-circle" size={14} color="#6b7280" /> Connecte-toi pour sauvegarder ton diagnostic
            </Text>
          </TouchableOpacity>
        )}
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
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
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
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
  },
  descriptionBox: {
    marginTop: 32,
    padding: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  description: {
    fontSize: 15,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  polesContainer: {
    marginTop: 32,
  },
  polesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 2,
    marginBottom: 16,
  },
  poleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  poleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  poleName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    width: 60,
  },
  poleDesc: {
    fontSize: 14,
    color: '#9ca3af',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    padding: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#f59e0b',
    lineHeight: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 32,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
  loginHint: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginHintText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
