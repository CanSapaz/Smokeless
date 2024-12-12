import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NameScreen } from './NameScreen';
import { SmokingInfoScreen } from './SmokingInfoScreen';
import { SmokingYearsScreen } from './SmokingYearsScreen';
import { storage } from '../../services/storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingScreen = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    cigarettesPerDay: 0,
    pricePerPack: 0,
    smokingYears: 0,
  });

  const navigation = useNavigation<NavigationProp>();

  const handleNameNext = (name: string) => {
    setUserData(prev => ({ ...prev, name }));
    setStep(2);
  };

  const handleSmokingInfoNext = (cigarettesPerDay: number, pricePerPack: number) => {
    setUserData(prev => ({ ...prev, cigarettesPerDay, pricePerPack }));
    setStep(3);
  };

  const handleComplete = async (years: number) => {
    const finalUserData = {
      ...userData,
      smokingYears: years,
      cigarettesPerPack: 20,
      goals: [],
    };

    await storage.saveUserProfile(finalUserData);
    await storage.setOnboardingCompleted(true);
    
    // Navigation'ı değiştiriyoruz
    navigation.navigate('TabNavigator');
  };

  return (
    <View style={styles.container}>
      {step === 1 && <NameScreen onNext={handleNameNext} />}
      {step === 2 && <SmokingInfoScreen onNext={handleSmokingInfoNext} />}
      {step === 3 && <SmokingYearsScreen onComplete={handleComplete} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
