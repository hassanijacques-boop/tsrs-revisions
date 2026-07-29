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

const POLE_NAMES: { [key: string]: string } = {
  Djism: 'Corps',
  Aql: 'Esprit',
  Nafs: 'Âme',
  Qalb: 'Cœur',
};

export default function MissionsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/protocol/status`, {
        credentials: 'include',
      });
      const data = await response.json();
      setMissions(data.missions?.missions || []);
      setCompletedIds(data.progress?.missions_completed || []);
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeMission = async (missionId: string) => {
    setCompleting(missionId);
    try {
      await fetch(`${BACKEND_URL}/api/protocol/mission/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          mission_id: missionId,
          day: user?.current_day || 1,
        }),
      });
      setCompletedIds([...completedIds, missionId]);
    } catch (error) {
      console.error('Error completing mission:', error);
    } finally {
      setCompleting(null);
    }
  };

  const completedCount = completedIds.length;
  const allCompleted = completedCount === missions.length && missions.length > 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MISSIONS JOUR {user?.current_day || 1}</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{completedCount}/{missions.length}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Completion Status */}
        {allCompleted && (
          <View style={styles.completedBanner}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <Text style={styles.completedText}>Toutes les missions complétées !</Text>
          </View>
        )}

        {/* Missions List */}
        {missions.map((mission, index) => {
          const isCompleted = completedIds.includes(mission.mission_id);
          const isCompleting = completing === mission.mission_id;
          const color = POLE_COLORS[mission.pole] || '#10b981';
          const icon = POLE_ICONS[mission.pole] || 'help-circle';

          return (
            <View
              key={mission.mission_id}
              style={[
                styles.missionCard,
                isCompleted && styles.missionCompleted,
              ]}
            >
              <View style={styles.missionHeader}>
                <View style={[styles.poleIcon, { backgroundColor: `${color}20` }]}>
                  <Ionicons name={icon} size={24} color={color} />
                </View>
                <View style={styles.missionMeta}>
                  <Text style={[styles.poleName, { color }]}>
                    {mission.pole.toUpperCase()} - {POLE_NAMES[mission.pole]}
                  </Text>
                  <Text style={styles.duration}>
                    <Ionicons name="time-outline" size={12} color="#6b7280" /> {mission.duration_minutes} min
                  </Text>
                </View>
                {isCompleted && (
                  <View style={styles.completedIcon}>
                    <Ionicons name="checkmark-circle" size={28} color="#10b981" />
                  </View>
                )}
              </View>

              <Text style={styles.missionTitle}>{mission.title}</Text>
              <Text style={styles.missionDescription}>{mission.description}</Text>

              {!isCompleted && (
                <TouchableOpacity
                  style={[styles.completeButton, { borderColor: color }]}
                  onPress={() => completeMission(mission.mission_id)}
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    <ActivityIndicator size="small" color={color} />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={18} color={color} />
                      <Text style={[styles.completeButtonText, { color }]}>MARQUER TERMINÉE</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* Back to Dashboard */}
        <TouchableOpacity
          style={styles.backToDashboard}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={18} color="#6b7280" />
          <Text style={styles.backToDashboardText}>Retour au tableau de bord</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  progressBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
  missionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  missionCompleted: {
    opacity: 0.6,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  poleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionMeta: {
    flex: 1,
    marginLeft: 12,
  },
  poleName: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  duration: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  completedIcon: {
    marginLeft: 8,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  missionDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 22,
    marginBottom: 16,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  backToDashboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    padding: 16,
  },
  backToDashboardText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
