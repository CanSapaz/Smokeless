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
  onNext: (name: string) => void;
}

export const NameScreen: React.FC<Props> = ({ onNext }) => {
  const [name, setName] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Hoş Geldiniz!</Text>
        <Text style={styles.subtitle}>Size nasıl hitap etmemizi istersiniz?</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Adınızı girin"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={() => name.trim() && onNext(name.trim())}
          disabled={!name.trim()}
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 30,
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
