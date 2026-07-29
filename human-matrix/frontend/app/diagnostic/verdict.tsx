import React, { useState, useEffect } from 'react';
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
import { RadarChart } from 'react-native-gifted-charts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface DiagnosticResult {
  diagnostic_id: string;
  djism_score: number;
  aql_score: number;
  nafs_score: number;
  qalb_score: number;
  unstable_poles: string[];
}

const POLE_NAMES: { [key: string]: string } = {
  Djism: 'DJISM (Corps)',
  Aql: "'AQL (Esprit)",
  Nafs: 'NAFS (Âme)',
  Qalb: 'QALB (Cœur)',
};

const POLE_COLORS: { [key: string]: string } = {
  Djism: '#ef4444',
  Aql: '#3b82f6',
  Nafs: '#f59e0b',
  Qalb: '#10b981',
};

export default function DiagnosticVerdict() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  useEffect(() => {
    loadResult();
  }, []);

  const loadResult = async () => {
    try {
      const stored = await AsyncStorage.getItem('diagnostic_result');
      if (stored) {
        setResult(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading result:', error);
    }
  };

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement du verdict...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasUnstablePoles = result.unstable_poles.length > 0;
  const radarData = [
    { value: result.djism_score, label: 'Djism', frontColor: '#ef4444' },
    { value: result.aql_score, label: "'Aql", frontColor: '#3b82f6' },
    { value: result.nafs_score, label: 'Nafs', frontColor: '#f59e0b' },
    { value: result.qalb_score, label: 'Qalb', frontColor: '#10b981' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="analytics" size={40} color="#10b981" />
          <Text style={styles.title}>VERDICT</Text>
          <Text style={styles.subtitle}>Analyse de Souveraineté</Text>
        </View>

        {/* Alert if unstable */}
        {hasUnstablePoles && (
          <View style={styles.alertBox}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning" size={24} color="#ef4444" />
              <Text style={styles.alertTitle}>ARCHITECTURE INSTABLE</Text>
            </View>
            <Text style={styles.alertText}>
              Risque de rupture détecté sur {result.unstable_poles.length} pôle{result.unstable_poles.length > 1 ? 's' : ''}
            </Text>
            <View style={styles.unstablePoles}>
              {result.unstable_poles.map((pole) => (
                <View key={pole} style={[styles.unstablePoleTag, { borderColor: POLE_COLORS[pole] }]}>
                  <Text style={[styles.unstablePoleText, { color: POLE_COLORS[pole] }]}>
                    {POLE_NAMES[pole]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Radar Chart Alternative - Bar visualization */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>ÉTAT DE TES FONDATIONS</Text>
          <View style={styles.barsContainer}>
            {[
              { pole: 'Djism', score: result.djism_score, icon: 'body' as const },
              { pole: 'Aql', score: result.aql_score, icon: 'bulb' as const },
              { pole: 'Nafs', score: result.nafs_score, icon: 'flame' as const },
              { pole: 'Qalb', score: result.qalb_score, icon: 'heart' as const },
            ].map((item) => {
              const isUnstable = result.unstable_poles.includes(item.pole);
              return (
                <View key={item.pole} style={styles.barItem}>
                  <View style={styles.barLabelContainer}>
                    <Ionicons name={item.icon} size={20} color={POLE_COLORS[item.pole]} />
                    <Text style={styles.barLabel}>{item.pole}</Text>
                    {isUnstable && <Ionicons name="alert-circle" size={16} color="#ef4444" />}
                  </View>
                  <View style={styles.barBackground}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${item.score}%`,
                          backgroundColor: isUnstable ? '#ef4444' : POLE_COLORS[item.pole],
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barScore, isUnstable && styles.unstableScore]}>
                    {Math.round(item.score)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Overall Assessment */}
        <View style={styles.assessmentBox}>
          <Text style={styles.assessmentTitle}>
            {hasUnstablePoles ? 'DIAGNOSTIC CRITIQUE' : 'DIAGNOSTIC STABLE'}
          </Text>
          <Text style={styles.assessmentText}>
            {hasUnstablePoles
              ? 'Ton architecture ne tiendra pas seule. Un protocole de restauration est nécessaire pour stabiliser tes bases avant l\'effondrement.'
              : 'Tes fondations sont solides mais peuvent être renforcées. Le Protocole 7 Jours peut t\'amener au niveau supérieur.'}
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push({
            pathname: '/offer',
            params: { diagnostic_id: result.diagnostic_id }
          })}
        >
          <Text style={styles.ctaButtonText}>VOIR LA SOLUTION</Text>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.retakeButton} onPress={() => router.replace('/diagnostic')}>
          <Text style={styles.retakeButtonText}>Refaire le diagnostic</Text>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 14,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  alertBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ef4444',
    letterSpacing: 1,
  },
  alertText: {
    fontSize: 14,
    color: '#fca5a5',
    marginBottom: 16,
  },
  unstablePoles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unstablePoleTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  unstablePoleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chartSection: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  barsContainer: {
    gap: 16,
  },
  barItem: {
    gap: 8,
  },
  barLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  barBackground: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  barScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9ca3af',
    textAlign: 'right',
  },
  unstableScore: {
    color: '#ef4444',
  },
  assessmentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  assessmentTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 12,
    textAlign: 'center',
  },
  assessmentText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 22,
    textAlign: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 10,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
  retakeButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 12,
  },
  retakeButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
