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

interface Mission {
  mission_id: string;
  pole: string;
  title: string;
  description: string;
  duration_minutes: number;
  completed: boolean;
}

interface ProtocolStatus {
  current_day: number;
  pack_start_date: string;
  missions: {
    day: number;
    missions: Mission[];
    briefing_completed: boolean;
    all_completed: boolean;
  };
  progress: {
    briefing_listened: boolean;
    missions_completed: string[];
  } | null;
}

const POLE_COLORS: { [key: string]: string } = {
  Djism: '#ef4444',
  Aql: '#3b82f6',
  Nafs: '#f59e0b',
  Qalb: '#10b981',
};

const POLE_ICONS: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  Djism: 'body',
  Aql: 'bulb',
  Nafs: 'flame',
  Qalb: 'heart',
};

export default function ProtocolDashboard() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const [status, setStatus] = useState<ProtocolStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/protocol/status`, {
        credentials: 'include',
      });
      
      if (response.status === 403) {
        // No pack, redirect to offer
        router.replace('/offer');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Chargement du protocole...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!status) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Erreur de chargement</Text>
        </View>
      </SafeAreaView>
    );
  }

  const briefingCompleted = status.missions?.briefing_completed || status.progress?.briefing_listened;
  const missionsCompleted = status.progress?.missions_completed?.length || 0;
  const totalMissions = status.missions?.missions?.length || 4;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="shield-checkmark" size={28} color="#10b981" />
            <Text style={styles.logoText}>MENTAL NATION</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Day Counter */}
        <View style={styles.daySection}>
          <Text style={styles.dayLabel}>JOUR</Text>
          <Text style={styles.dayNumber}>{status.current_day}</Text>
          <Text style={styles.dayOf}>/ 7</Text>
          <View style={styles.dayProgress}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <View
                key={day}
                style={[
                  styles.dayDot,
                  day <= status.current_day && styles.dayDotActive,
                  day === status.current_day && styles.dayDotCurrent,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Briefing Section */}
        <TouchableOpacity
          style={[
            styles.briefingCard,
            briefingCompleted && styles.briefingCompleted,
          ]}
          onPress={() => router.push('/protocol/briefing')}
        >
          <View style={styles.briefingIcon}>
            <Ionicons
              name={briefingCompleted ? 'checkmark-circle' : 'play-circle'}
              size={40}
              color={briefingCompleted ? '#10b981' : '#fff'}
            />
          </View>
          <View style={styles.briefingContent}>
            <Text style={styles.briefingLabel}>BRIEFING SENTINELLE</Text>
            <Text style={styles.briefingTitle}>Calibration Matinale</Text>
            <Text style={styles.briefingStatus}>
              {briefingCompleted ? 'Complété' : 'Écouter pour débloquer les missions'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#6b7280" />
        </TouchableOpacity>

        {/* Missions Section */}
        <View style={styles.missionsSection}>
          <View style={styles.missionsSectionHeader}>
            <Text style={styles.missionsSectionTitle}>MISSIONS DU JOUR</Text>
            <Text style={styles.missionsCount}>
              {missionsCompleted}/{totalMissions}
            </Text>
          </View>

          {!briefingCompleted ? (
            <View style={styles.lockedOverlay}>
              <Ionicons name="lock-closed" size={32} color="#6b7280" />
              <Text style={styles.lockedText}>Écoute le briefing pour débloquer</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.missionsCard}
              onPress={() => router.push('/protocol/missions')}
            >
              <View style={styles.missionsPoles}>
                {status.missions?.missions?.map((mission: Mission) => {
                  const color = POLE_COLORS[mission.pole] || '#10b981';
                  const icon = POLE_ICONS[mission.pole] || 'help-circle';
                  const isCompleted = status.progress?.missions_completed?.includes(mission.mission_id);
                  
                  return (
                    <View key={mission.mission_id} style={styles.missionPoleItem}>
                      <View style={[styles.missionPoleIcon, { backgroundColor: `${color}20` }]}>
                        <Ionicons name={icon} size={20} color={color} />
                        {isCompleted && (
                          <View style={styles.completedBadge}>
                            <Ionicons name="checkmark" size={10} color="#fff" />
                          </View>
                        )}
                      </View>
                      <Text style={styles.missionPoleTitle} numberOfLines={1}>
                        {mission.title}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.viewMissionsButton}>
                <Text style={styles.viewMissionsText}>VOIR LES MISSIONS</Text>
                <Ionicons name="arrow-forward" size={16} color="#10b981" />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* SOS Button */}
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => router.push('/protocol/sos')}
        >
          <Ionicons name="medical" size={24} color="#ef4444" />
          <Text style={styles.sosText}>SOS - URGENCE</Text>
        </TouchableOpacity>

        {/* Final Report - Day 7 */}
        {status.current_day >= 7 && (
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => router.push('/protocol/report')}
          >
            <Ionicons name="analytics" size={24} color="#8b5cf6" />
            <Text style={styles.reportText}>VOIR LE RAPPORT FINAL</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  logoutButton: {
    padding: 8,
  },
  daySection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 3,
  },
  dayNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: '#10b981',
    lineHeight: 80,
  },
  dayOf: {
    fontSize: 20,
    color: '#6b7280',
    marginTop: -8,
  },
  dayProgress: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  dayDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayDotActive: {
    backgroundColor: '#10b981',
  },
  dayDotCurrent: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  briefingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    gap: 16,
  },
  briefingCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  briefingIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  briefingContent: {
    flex: 1,
  },
  briefingLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: 2,
    marginBottom: 4,
  },
  briefingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  briefingStatus: {
    fontSize: 12,
    color: '#6b7280',
  },
  missionsSection: {
    marginBottom: 24,
  },
  missionsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionsSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 2,
  },
  missionsCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  lockedOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  lockedText: {
    fontSize: 14,
    color: '#6b7280',
  },
  missionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  missionsPoles: {
    gap: 12,
    marginBottom: 16,
  },
  missionPoleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  missionPoleIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  completedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionPoleTitle: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  viewMissionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  viewMissionsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: 1,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 16,
  },
  sosText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
    letterSpacing: 1,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  reportText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8b5cf6',
    letterSpacing: 1,
  },
});
