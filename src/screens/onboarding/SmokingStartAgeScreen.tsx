import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';

interface Props {
  onNext: (startAge: string) => void;
  onBack?: () => void;
}

export const SmokingStartAgeScreen: React.FC<Props> = ({ onNext, onBack }) => {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  const ageRanges = [
    { id: 'under18', text: '18 yaş altı' },
    { id: '18-24', text: '18-24 yaş arası' },
    { id: '25-34', text: '25-34 yaş arası' },
    { id: '35-49', text: '35-49 yaş arası' },
    { id: '50-64', text: '50-64 yaş arası' },
    { id: 'over65', text: '65 yaş üstü' },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '83%' }]} />
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Geri Dön</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Header with app icon and chat bubble */}
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/app-icon.png')} 
            style={styles.appIcon}
          />
          <View style={styles.chatBubble}>
            <Text style={styles.chatText}>
              Sigara içmeye ne zaman başladın?
            </Text>
            <View style={styles.bubbleTriangle} />
          </View>
        </View>

        {/* Age Range Options */}
        <View style={styles.optionsContainer}>
          {ageRanges.map((range) => (
            <TouchableOpacity
              key={range.id}
              style={[
                styles.optionButton,
                selectedAge === range.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedAge(range.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedAge === range.id && styles.selectedOptionText,
                ]}
              >
                {range.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.button, !selectedAge && styles.buttonDisabled]}
          onPress={() => selectedAge && onNext(selectedAge)}
          disabled={!selectedAge}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  appIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  chatBubble: {
    flex: 1,
    backgroundColor: '#586286',
    borderRadius: 20,
    padding: 15,
    position: 'relative',
  },
  chatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  bubbleTriangle: {
    position: 'absolute',
    left: -10,
    top: '50%',
    marginTop: 0,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderRightColor: '#586286',
    borderBottomColor: 'transparent',
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#8E95B3',
  },
  selectedOption: {
    backgroundColor: '#00D48A',
    borderColor: '#00D48A',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedOptionText: {
    fontWeight: 'bold',
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
