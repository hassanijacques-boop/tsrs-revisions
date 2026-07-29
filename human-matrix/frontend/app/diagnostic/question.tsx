import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Question {
  id: number;
  pole: string;
  question_fr: string;
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

export default function DiagnosticQuestion() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/diagnostic/questions`);
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [questions[currentIndex].id]: score };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Submit all answers
      submitDiagnostic(newAnswers);
    }
  };

  const submitDiagnostic = async (finalAnswers: { [key: number]: number }) => {
    setLoading(true);
    try {
      const answersArray = Object.entries(finalAnswers).map(([qId, score]) => ({
        question_id: parseInt(qId),
        score,
      }));

      const response = await fetch(`${BACKEND_URL}/api/diagnostic/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ answers: answersArray }),
      });

      const result = await response.json();
      
      // Store result for verdict page
      await AsyncStorage.setItem('diagnostic_result', JSON.stringify(result));
      
      router.replace('/diagnostic/verdict');
    } catch (error) {
      console.error('Error submitting diagnostic:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      router.back();
    }
  };

  if (loading || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Analyse en cours par la Sentinelle...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const poleColor = POLE_COLORS[currentQuestion.pole] || '#10b981';
  const poleIcon = POLE_ICONS[currentQuestion.pole] || 'help-circle';
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.questionCount}>
          {currentIndex + 1}/{questions.length}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: poleColor }]} />
      </View>
      <Text style={styles.progressLabel}>Analyse en cours par la Sentinelle</Text>

      {/* Pole Badge */}
      <View style={[styles.poleBadge, { backgroundColor: `${poleColor}20`, borderColor: poleColor }]}>
        <Ionicons name={poleIcon} size={20} color={poleColor} />
        <Text style={[styles.poleName, { color: poleColor }]}>{currentQuestion.pole.toUpperCase()}</Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question_fr}</Text>
      </View>

      {/* Scale */}
      <View style={styles.scaleContainer}>
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>Pas du tout</Text>
          <Text style={styles.scaleLabel}>Totalement</Text>
        </View>
        <View style={styles.scaleButtons}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
            const isSelected = answers[currentQuestion.id] === score;
            return (
              <TouchableOpacity
                key={score}
                style={[
                  styles.scaleButton,
                  isSelected && { backgroundColor: poleColor, borderColor: poleColor },
                ]}
                onPress={() => handleAnswer(score)}
              >
                <Text
                  style={[
                    styles.scaleButtonText,
                    isSelected && { color: '#000' },
                  ]}
                >
                  {score}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Hint */}
      <Text style={styles.hintText}>1 = Pas du tout • 10 = Totalement</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 14,
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  questionCount: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
  },
  poleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 32,
    gap: 8,
  },
  poleName: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 34,
  },
  scaleContainer: {
    paddingBottom: 20,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scaleLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  scaleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  scaleButton: {
    width: (width - 40 - 54) / 10,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  scaleButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  hintText: {
    textAlign: 'center',
    color: '#4b5563',
    fontSize: 12,
    marginBottom: 30,
  },
});
