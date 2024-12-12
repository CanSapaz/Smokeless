import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../services/storage';
import { useTheme } from '../context/ThemeContext';

export const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: '',
    cigarettesPerDay: 0,
    pricePerPack: 0,
    cigarettesPerPack: 20,
    smokingYears: 0,
  });

  const { theme } = useTheme();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const savedProfile = await storage.getUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  };

  const InfoItem = ({ icon, label, value }: { icon: string; label: string; value: string | number }) => (
    <View style={[styles.infoItem, { borderBottomColor: theme.cardBorder }]}>
      <View style={styles.infoItemLeft}>
        <Ionicons name={icon as any} size={24} color={theme.text} />
        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#fff" />
        </View>
        <Text style={styles.name}>{profile.name}</Text>
      </View>

      <View style={[styles.infoCard, { 
        backgroundColor: theme.card,
        borderColor: theme.cardBorder,
      }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Sigara Kullanım Bilgileri</Text>
        <InfoItem
          icon="calendar-outline"
          label="Kaç Yıldır"
          value={`${profile.smokingYears} yıl`}
        />
        <InfoItem
          icon="flame-outline"
          label="Günlük Kullanım"
          value={`${profile.cigarettesPerDay} adet`}
        />
        <InfoItem
          icon="cash-outline"
          label="Paket Fiyatı"
          value={`${profile.pricePerPack} TL`}
        />
        <InfoItem
          icon="calculator-outline"
          label="Paket Başına"
          value={`${profile.cigarettesPerPack} adet`}
        />
      </View>

      <View style={[styles.infoCard, { 
        backgroundColor: theme.card,
        borderColor: theme.cardBorder,
      }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Hedefler</Text>
        <View style={styles.goalContainer}>
          <Ionicons name="trophy" size={40} color="#FFD700" />
          <Text style={[styles.goalText, { color: theme.text }]}>
            Hedeflerinizi belirleyerek motivasyonunuzu artırın!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoCard: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  goalContainer: {
    alignItems: 'center',
    padding: 20,
  },
  goalText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24,
  },
});
