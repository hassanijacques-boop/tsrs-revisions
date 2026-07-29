import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../_layout';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Diagnostic {
  djism_score: number;
  aql_score: number;
  nafs_score: number;
  qalb_score: number;
  created_at: string;
}

interface ReportData {
  initial_diagnostic: Diagnostic | null;
  final_diagnostic: Diagnostic | null;
  stats: {
    total_missions: number;
    completed_missions: number;
    completion_rate: number;
    sos_used: number;
  };
}

const POLE_INFO = [
  { key: 'djism', name: 'DJISM', label: 'Corps', color: '#ef4444', icon: 'body' as const },
  { key: 'aql', name: "'AQL", label: 'Esprit', color: '#3b82f6', icon: 'bulb' as const },
  { key: 'nafs', name: 'NAFS', label: 'Âme', color: '#f59e0b', icon: 'flame' as const },
  { key: 'qalb', name: 'QALB', label: 'Cœur', color: '#10b981', icon: 'heart' as const },
];

export default function FinalReportScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsFinalDiagnostic, setNeedsFinalDiagnostic] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/protocol/report`, {
        credentials: 'include',
      });
      const data = await response.json();
      setReport(data);
      
      // Check if user needs to take final diagnostic
      if (data.initial_diagnostic && !data.final_diagnostic) {
        setNeedsFinalDiagnostic(true);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreChange = (pole: string) => {
    if (!report?.initial_diagnostic || !report?.final_diagnostic) return null;
    const initial = report.initial_diagnostic[`${pole}_score` as keyof Diagnostic] as number;
    const final = report.final_diagnostic[`${pole}_score` as keyof Diagnostic] as number;
    return final - initial;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Génération du rapport...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Ionicons name="trophy" size={48} color="#10b981" />
          <Text style={styles.title}>RAPPORT DE SOUVERAINETÉ</Text>
          <Text style={styles.subtitle}>Bilan des 7 jours de protocole</Text>
        </View>

        {/* Stats */}
        {report?.stats && (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{report.stats.completed_missions}</Text>
              <Text style={styles.statLabel}>Missions complétées</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{report.stats.completion_rate}%</Text>
              <Text style={styles.statLabel}>Taux de complétion</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{report.stats.sos_used}</Text>
              <Text style={styles.statLabel}>SOS utilisés</Text>
            </View>
          </View>
        )}

        {/* Take Final Diagnostic CTA */}
        {needsFinalDiagnostic && (
          <View style={styles.ctaBox}>
            <Ionicons name="analytics" size={32} color="#8b5cf6" />
            <Text style={styles.ctaTitle}>Complète ton rapport</Text>
            <Text style={styles.ctaText}>
              Refais le diagnostic pour mesurer ta progression et voir la comparaison avant/après.
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push('/diagnostic/question')}
            >
              <Text style={styles.ctaButtonText}>FAIRE LE DIAGNOSTIC FINAL</Text>
              <Ionicons name="arrow-forward" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        )}

        {/* Comparison */}
        {report?.initial_diagnostic && report?.final_diagnostic && (
          <View style={styles.comparisonSection}>
            <Text style={styles.sectionTitle}>ÉVOLUTION DES PÔLES</Text>
            
            {POLE_INFO.map((pole) => {
              const initial = report.initial_diagnostic![`${pole.key}_score` as keyof Diagnostic] as number;
              const final = report.final_diagnostic![`${pole.key}_score` as keyof Diagnostic] as number;
              const change = getScoreChange(pole.key);
              const isPositive = change !== null && change > 0;
              const isNeutral = change === 0;

              return (
                <View key={pole.key} style={styles.poleComparison}>
                  <View style={styles.poleHeader}>
                    <View style={[styles.poleIcon, { backgroundColor: `${pole.color}20` }]}>
                      <Ionicons name={pole.icon} size={20} color={pole.color} />
                    </View>
                    <View style={styles.poleMeta}>
                      <Text style={[styles.poleName, { color: pole.color }]}>{pole.name}</Text>
                      <Text style={styles.poleLabel}>{pole.label}</Text>
                    </View>
                    {change !== null && (
                      <View style={[
                        styles.changeBadge,
                        isPositive ? styles.changeBadgePositive : isNeutral ? styles.changeBadgeNeutral : styles.changeBadgeNegative
                      ]}>
                        <Ionicons
                          name={isPositive ? 'arrow-up' : isNeutral ? 'remove' : 'arrow-down'}
                          size={14}
                          color={isPositive ? '#10b981' : isNeutral ? '#6b7280' : '#ef4444'}
                        />
                        <Text style={[
                          styles.changeText,
                          isPositive ? styles.changeTextPositive : isNeutral ? styles.changeTextNeutral : styles.changeTextNegative
                        ]}>
                          {isPositive ? '+' : ''}{change?.toFixed(0)}%
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Bars comparison */}
                  <View style={styles.barsComparison}>
                    <View style={styles.barRow}>
                      <Text style={styles.barLabel}>Avant</Text>
                      <View style={styles.barBg}>
                        <View style={[styles.barFillInitial, { width: `${initial}%` }]} />
                      </View>
                      <Text style={styles.barValue}>{initial?.toFixed(0)}%</Text>
                    </View>
                    <View style={styles.barRow}>
                      <Text style={styles.barLabel}>Après</Text>
                      <View style={styles.barBg}>
                        <View style={[styles.barFillFinal, { width: `${final}%`, backgroundColor: pole.color }]} />
                      </View>
                      <Text style={[styles.barValue, { color: pole.color }]}>{final?.toFixed(0)}%</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Initial only */}
        {report?.initial_diagnostic && !report?.final_diagnostic && (
          <View style={styles.comparisonSection}>
            <Text style={styles.sectionTitle}>DIAGNOSTIC INITIAL</Text>
            {POLE_INFO.map((pole) => {
              const score = report.initial_diagnostic![`${pole.key}_score` as keyof Diagnostic] as number;
              return (
                <View key={pole.key} style={styles.poleSimple}>
                  <View style={styles.poleHeader}>
                    <View style={[styles.poleIcon, { backgroundColor: `${pole.color}20` }]}>
                      <Ionicons name={pole.icon} size={20} color={pole.color} />
                    </View>
                    <Text style={styles.poleName}>{pole.name}</Text>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[styles.barFillFinal, { width: `${score}%`, backgroundColor: pole.color }]} />
                  </View>
                  <Text style={[styles.barValue, { color: pole.color }]}>{score?.toFixed(0)}%</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Conclusion */}
        <View style={styles.conclusionBox}>
          <Ionicons name="shield-checkmark" size={32} color="#10b981" />
          <Text style={styles.conclusionTitle}>PROTOCOLE TERMINÉ</Text>
          <Text style={styles.conclusionText}>
            Tu as complété les 7 jours de restauration. Continue à appliquer les principes appris pour maintenir ta souveraineté.
          </Text>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/protocol')}>
          <Text style={styles.homeButtonText}>RETOUR AU TABLEAU DE BORD</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 14,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#10b981',
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  ctaBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
  },
  ctaText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
  },
  comparisonSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 2,
    marginBottom: 16,
  },
  poleComparison: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  poleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  poleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poleMeta: {
    flex: 1,
    marginLeft: 12,
  },
  poleName: {
    fontSize: 14,
    fontWeight: '700',
  },
  poleLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  changeBadgePositive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  changeBadgeNeutral: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
  },
  changeBadgeNegative: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  changeTextPositive: {
    color: '#10b981',
  },
  changeTextNeutral: {
    color: '#6b7280',
  },
  changeTextNegative: {
    color: '#ef4444',
  },
  barsComparison: {
    gap: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    fontSize: 11,
    color: '#6b7280',
    width: 40,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFillInitial: {
    height: '100%',
    backgroundColor: '#4b5563',
    borderRadius: 4,
  },
  barFillFinal: {
    height: '100%',
    borderRadius: 4,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    width: 36,
    textAlign: 'right',
  },
  poleSimple: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  conclusionBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  conclusionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10b981',
    marginTop: 12,
    letterSpacing: 2,
  },
  conclusionText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  homeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
});
