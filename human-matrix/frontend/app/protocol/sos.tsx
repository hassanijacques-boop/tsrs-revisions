import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../_layout';

const { width } = Dimensions.get('window');
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const BREATHING_PHASES = [
  { name: 'INSPIRE', duration: 4000, instruction: 'Respire profondément par le nez' },
  { name: 'RETIENS', duration: 4000, instruction: 'Garde l\'air dans tes poumons' },
  { name: 'EXPIRE', duration: 6000, instruction: 'Relâche lentement par la bouche' },
  { name: 'PAUSE', duration: 2000, instruction: 'Attends avant le prochain cycle' },
];

const AUDIT_QUESTIONS = [
  { id: 1, question: 'As-tu mangé équilibré aujourd\'hui ?', pole: 'Djism' },
  { id: 2, question: 'As-tu dormi suffisamment ?', pole: 'Djism' },
  { id: 3, question: 'Ton esprit est-il encombré par des pensées négatives ?', pole: 'Aql' },
  { id: 4, question: 'As-tu cédé à une tentation récemment ?', pole: 'Nafs' },
  { id: 5, question: 'Te sens-tu déconnecté de ta mission ?', pole: 'Qalb' },
];

export default function SOSScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<'menu' | 'breathing' | 'audit'>('menu');
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [breathingCycle, setBreathingCycle] = useState(0);
  const [auditStep, setAuditStep] = useState(0);
  const [auditAnswers, setAuditAnswers] = useState<{ [key: number]: boolean }>({});
  
  const circleAnim = useRef(new Animated.Value(0.5)).current;
  const breathingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Record SOS usage
    recordSOSUsage();
    return () => {
      if (breathingInterval.current) {
        clearInterval(breathingInterval.current);
      }
    };
  }, []);

  const recordSOSUsage = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/protocol/sos`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error recording SOS:', error);
    }
  };

  const startBreathing = () => {
    setMode('breathing');
    setBreathingPhase(0);
    setBreathingCycle(0);
    runBreathingCycle(0);
  };

  const runBreathingCycle = (phaseIndex: number) => {
    const phase = BREATHING_PHASES[phaseIndex];
    
    // Animate circle
    const targetScale = phaseIndex === 0 ? 1 : phaseIndex === 2 ? 0.5 : circleAnim._value;
    Animated.timing(circleAnim, {
      toValue: targetScale,
      duration: phase.duration,
      useNativeDriver: true,
    }).start();

    breathingInterval.current = setTimeout(() => {
      const nextPhase = (phaseIndex + 1) % BREATHING_PHASES.length;
      if (nextPhase === 0) {
        setBreathingCycle((c) => c + 1);
      }
      setBreathingPhase(nextPhase);
      runBreathingCycle(nextPhase);
    }, phase.duration);
  };

  const stopBreathing = () => {
    if (breathingInterval.current) {
      clearTimeout(breathingInterval.current);
    }
    setMode('menu');
  };

  const startAudit = () => {
    setMode('audit');
    setAuditStep(0);
    setAuditAnswers({});
  };

  const answerAudit = (answer: boolean) => {
    setAuditAnswers({ ...auditAnswers, [AUDIT_QUESTIONS[auditStep].id]: answer });
    if (auditStep < AUDIT_QUESTIONS.length - 1) {
      setAuditStep(auditStep + 1);
    } else {
      setMode('menu');
    }
  };

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <View style={styles.sosHeader}>
        <View style={styles.sosIconContainer}>
          <Ionicons name="medical" size={48} color="#ef4444" />
        </View>
        <Text style={styles.sosTitle}>MODE URGENCE</Text>
        <Text style={styles.sosSubtitle}>Stabilise ton état immédiatement</Text>
      </View>

      <TouchableOpacity style={styles.actionCard} onPress={startBreathing}>
        <View style={[styles.actionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
          <Ionicons name="sync" size={28} color="#3b82f6" />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>RESPIRATION FORCÉE</Text>
          <Text style={styles.actionDesc}>Technique 4-4-6-2 pour calmer le système nerveux</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#6b7280" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard} onPress={startAudit}>
        <View style={[styles.actionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
          <Ionicons name="clipboard" size={28} color="#f59e0b" />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>AUDIT FLASH</Text>
          <Text style={styles.actionDesc}>5 questions pour identifier la source du problème</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#6b7280" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#6b7280" />
        <Text style={styles.backButtonText}>Retour au tableau de bord</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBreathing = () => {
    const phase = BREATHING_PHASES[breathingPhase];
    return (
      <View style={styles.breathingContainer}>
        <Text style={styles.breathingCycle}>Cycle {breathingCycle + 1}</Text>
        
        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.breathingCircle,
              { transform: [{ scale: circleAnim }] },
            ]}
          />
          <View style={styles.circleContent}>
            <Text style={styles.phaseName}>{phase.name}</Text>
            <Text style={styles.phaseInstruction}>{phase.instruction}</Text>
          </View>
        </View>

        <View style={styles.phaseIndicators}>
          {BREATHING_PHASES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.phaseIndicator,
                i === breathingPhase && styles.phaseIndicatorActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.stopButton} onPress={stopBreathing}>
          <Text style={styles.stopButtonText}>TERMINER</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAudit = () => {
    const question = AUDIT_QUESTIONS[auditStep];
    return (
      <View style={styles.auditContainer}>
        <Text style={styles.auditProgress}>
          Question {auditStep + 1}/{AUDIT_QUESTIONS.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((auditStep + 1) / AUDIT_QUESTIONS.length) * 100}%` },
            ]}
          />
        </View>

        <View style={styles.auditQuestionContainer}>
          <Text style={styles.auditPole}>{question.pole.toUpperCase()}</Text>
          <Text style={styles.auditQuestion}>{question.question}</Text>
        </View>

        <View style={styles.auditButtons}>
          <TouchableOpacity
            style={[styles.auditButton, styles.auditButtonNo]}
            onPress={() => answerAudit(false)}
          >
            <Ionicons name="close" size={24} color="#ef4444" />
            <Text style={styles.auditButtonNoText}>NON</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.auditButton, styles.auditButtonYes]}
            onPress={() => answerAudit(true)}
          >
            <Ionicons name="checkmark" size={24} color="#10b981" />
            <Text style={styles.auditButtonYesText}>OUI</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {mode === 'menu' && renderMenu()}
      {mode === 'breathing' && renderBreathing()}
      {mode === 'audit' && renderAudit()}
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
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButton: {
    padding: 8,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sosHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sosIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  sosTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ef4444',
    letterSpacing: 3,
  },
  sosSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  actionDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    padding: 16,
  },
  backButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  breathingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  breathingCycle: {
    fontSize: 14,
    color: '#6b7280',
    letterSpacing: 2,
    marginBottom: 40,
  },
  circleContainer: {
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 3,
    borderColor: '#3b82f6',
  },
  circleContent: {
    alignItems: 'center',
  },
  phaseName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#3b82f6',
    letterSpacing: 4,
  },
  phaseInstruction: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 12,
    textAlign: 'center',
  },
  phaseIndicators: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 40,
  },
  phaseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  phaseIndicatorActive: {
    backgroundColor: '#3b82f6',
  },
  stopButton: {
    marginTop: 48,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6b7280',
  },
  stopButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 2,
  },
  auditContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  auditProgress: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    letterSpacing: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 2,
  },
  auditQuestionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  auditPole: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f59e0b',
    letterSpacing: 3,
    marginBottom: 16,
  },
  auditQuestion: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
  },
  auditButtons: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 40,
  },
  auditButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    gap: 8,
  },
  auditButtonNo: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  auditButtonNoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  auditButtonYes: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  auditButtonYesText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
});
