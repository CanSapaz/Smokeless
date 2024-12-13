import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  onNext: () => void;
  onBack?: () => void;
}

export const QuitPreparationScreen: React.FC<Props> = ({ onNext, onBack }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '74.7%' }]} />
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Geri Dön</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Bırakmak için hazır olun!</Text>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="rocket" size={80} color="#00D48A" />
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Henüz sigarayı bırakmadınız ama bu adımı atmak mı istiyorsunuz? Tebrikler! Kalıcı başarı için Smokeless size 9 adımlı hazırlık programını sunar:
        </Text>

        {/* Steps */}
        <View style={styles.stepsList}>
          <Text style={styles.step}>
            • Nikotin ve kendiniz hakkında daha fazla bilgi edinin
          </Text>
          <Text style={styles.step}>
            • Sigara içme alışkanlıklarınızı analiz edin
          </Text>
          <Text style={styles.step}>
            • Arzuların üstesinden gelmek için yeni stratejiler keşfedin
          </Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onNext}
        >
          <Text style={styles.buttonText}>Devam</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E5A84',
    paddingTop: 60,
  },
  progressBarContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  progress: {
    height: '100%',
    backgroundColor: '#00D48A',
    borderRadius: 1,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  title: {
    color: '#00D48A',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    alignSelf: 'center',
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: 30,
    alignSelf: 'center',
  },
  description: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
    marginBottom: 20,
  },
  stepsList: {
    width: '100%',
    paddingHorizontal: 0,
  },
  step: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  bottomContainer: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00D48A',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
