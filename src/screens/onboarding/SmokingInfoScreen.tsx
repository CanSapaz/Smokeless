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
  onNext: (cigarettesPerDay: number, pricePerPack: number) => void;
}

export const SmokingInfoScreen: React.FC<Props> = ({ onNext }) => {
  const [cigarettesPerDay, setCigarettesPerDay] = useState('');
  const [pricePerPack, setPricePerPack] = useState('');

  const handleNext = () => {
    const cigarettes = parseInt(cigarettesPerDay);
    const price = parseInt(pricePerPack);
    if (cigarettes > 0 && price > 0) {
      onNext(cigarettes, price);
    }
  };

  const isValid = cigarettesPerDay.trim() !== '' && 
                 pricePerPack.trim() !== '' && 
                 parseInt(cigarettesPerDay) > 0 && 
                 parseInt(pricePerPack) > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Sigara Kullanımınız</Text>
        <Text style={styles.subtitle}>Bu bilgiler ilerlemenizi takip etmemize yardımcı olacak</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Günde kaç sigara içiyorsunuz?</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 20"
            value={cigarettesPerDay}
            onChangeText={setCigarettesPerDay}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bir paket sigara kaç TL?</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 30"
            value={pricePerPack}
            onChangeText={setPricePerPack}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!isValid}
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
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
    marginTop: 20,
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
