import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useAuth } from '../_layout';

const { width } = Dimensions.get('window');
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// Briefing audio via backend proxy (bypasses CORS)
const getBriefingAudioUrl = (day: number): string => {
  return `${BACKEND_URL}/api/audio/briefing/${day}`;
};

const MIN_LISTEN_DURATION = 10; // seconds - minimum time to "complete" briefing

export default function BriefingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const listenedDurationRef = useRef(0);

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Get audio URL for current day via backend proxy
      const currentDay = user?.current_day || 1;
      const audioUrl = getBriefingAudioUrl(currentDay);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      // Track listened duration
      if (status.isPlaying) {
        listenedDurationRef.current = status.positionMillis / 1000;
      }

      // Check if minimum listen time reached
      if (listenedDurationRef.current >= MIN_LISTEN_DURATION && !completed) {
        setCompleted(true);
      }
    }
  };

  const togglePlayback = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await fetch(`${BACKEND_URL}/api/protocol/briefing/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          day: user?.current_day || 1,
          duration: Math.floor(listenedDurationRef.current),
        }),
      });
      router.back();
    } catch (error) {
      console.error('Error completing briefing:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (millis: number) => {
    if (!millis || !isFinite(millis) || isNaN(millis)) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.dayLabel}>JOUR {user?.current_day || 1}</Text>
      </View>

      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleSection}>
          <View style={styles.sentinelBadge}>
            <Ionicons name="shield" size={20} color="#10b981" />
          </View>
          <Text style={styles.title}>BRIEFING SENTINELLE</Text>
          <Text style={styles.subtitle}>Calibration Matinale</Text>
        </View>

        {/* Audio Player */}
        <View style={styles.playerContainer}>
          <View style={styles.waveformPlaceholder}>
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.waveformBar,
                  {
                    height: Math.random() * 40 + 10,
                    backgroundColor: isPlaying
                      ? `rgba(16, 185, 129, ${0.3 + Math.random() * 0.7})`
                      : 'rgba(255, 255, 255, 0.2)',
                  },
                ]}
              />
            ))}
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Play Button */}
          <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color="#000"
            />
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsBox}>
          <Ionicons name="information-circle" size={20} color="#6b7280" />
          <Text style={styles.instructionsText}>
            {completed
              ? 'Briefing complété. Les missions sont maintenant débloquées.'
              : `Écoute au moins ${MIN_LISTEN_DURATION} secondes pour débloquer les missions.`}
          </Text>
        </View>

        {/* Complete Button */}
        {completed && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            disabled={loading}
          >
            <Text style={styles.completeButtonText}>
              {loading ? 'VALIDATION...' : 'MISSIONS DÉBLOQUÉES'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#000" />
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 2,
    marginRight: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  sentinelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    color: '#10b981',
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  playerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  waveformPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 4,
    marginBottom: 24,
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    fontVariant: ['tabular-nums'],
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  instructionsText: {
    flex: 1,
    fontSize: 13,
    color: '#9ca3af',
    lineHeight: 18,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
});
