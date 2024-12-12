import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface Props {
  onComplete: (years: number) => void;
}

export const SmokingYearsScreen: React.FC<Props> = ({ onComplete }) => {
  const [years, setYears] = useState('');

  const handleComplete = () => {
    const smokingYears = parseInt(years);
    if (smokingYears > 0) {
      onComplete(smokingYears);
    }
  };

  const isValid = years.trim() !== '' && parseInt(years) > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Son Bir Soru</Text>
        <Text style={styles.subtitle}>Kaç yıldır sigara içiyorsunuz?</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Yıl sayısını girin"
            value={years}
            onChangeText={setYears}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleComplete}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>Başla</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
