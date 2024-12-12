import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage, UserProfile } from '../services/storage';

export const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile>({
    cigarettesPerDay: 20,
    pricePerPack: 30,
    cigarettesPerPack: 20,
    goals: []
  });
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const savedProfile = await storage.getUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  };

  const handleSaveProfile = async () => {
    await storage.saveUserProfile(profile);
    Alert.alert('Başarılı', 'Profil bilgileriniz kaydedildi.');
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      const updatedProfile = {
        ...profile,
        goals: [...profile.goals, newGoal.trim()]
      };
      setProfile(updatedProfile);
      setNewGoal('');
      storage.saveUserProfile(updatedProfile);
    }
  };

  const handleRemoveGoal = (index: number) => {
    const updatedProfile = {
      ...profile,
      goals: profile.goals.filter((_, i) => i !== index)
    };
    setProfile(updatedProfile);
    storage.saveUserProfile(updatedProfile);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sigara Kullanım Bilgileri</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Günlük içilen sigara</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={profile.cigarettesPerDay.toString()}
            onChangeText={(text) => setProfile({
              ...profile,
              cigarettesPerDay: parseInt(text) || 0
            })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Paket fiyatı (TL)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={profile.pricePerPack.toString()}
            onChangeText={(text) => setProfile({
              ...profile,
              pricePerPack: parseInt(text) || 0
            })}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hedeflerim</Text>
        <View style={styles.goalsInputContainer}>
          <TextInput
            style={styles.goalInput}
            placeholder="Yeni hedef ekle"
            value={newGoal}
            onChangeText={setNewGoal}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {profile.goals.map((goal, index) => (
          <View key={index} style={styles.goalItem}>
            <Text style={styles.goalText}>{goal}</Text>
            <TouchableOpacity 
              onPress={() => handleRemoveGoal(index)}
              style={styles.removeButton}
            >
              <Ionicons name="close-circle" size={24} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  goalsInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  goalInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#2C3E50',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  goalText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  removeButton: {
    padding: 5,
  },
  saveButton: {
    backgroundColor: '#2C3E50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
