import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WelcomeScreen } from './WelcomeScreen';
import { NameScreen } from './NameScreen';
import { GenderScreen } from './GenderScreen';
import { BirthYearScreen } from './BirthYearScreen';
import { MotivationScreen } from './MotivationScreen';
import { FearsScreen } from './FearsScreen';
import { MotivationCardsScreen } from './MotivationCardsScreen';
import { QuitTimeScreen } from './QuitTimeScreen';
import { QuitDateScreen } from './QuitDateScreen';
import { QuitPreparationScreen } from './QuitPreparationScreen';
import { SmokingStartAgeScreen } from './SmokingStartAgeScreen';
import { QuitAttemptsScreen } from './QuitAttemptsScreen';
import { QuitChallengesScreen } from './QuitChallengesScreen';
import { CigarettesPerDayScreen } from './CigarettesPerDayScreen';
import { CigarettesPerPackScreen } from './CigarettesPerPackScreen';
import { PackPriceScreen } from './PackPriceScreen';
import { CalculatingScreen } from './CalculatingScreen';
import { ResultsScreen } from './ResultsScreen';
import { AchievementScreen } from './AchievementScreen';
import { storage } from '../../services/storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [step, setStep] = useState<
    | 'welcome'
    | 'name'
    | 'gender'
    | 'birthYear'
    | 'motivation'
    | 'fears'
    | 'motivationCards'
    | 'quitTime'
    | 'quitDate'
    | 'quitPreparation'
    | 'startAge'
    | 'quitAttempts'
    | 'quitChallenges'
    | 'cigarettesPerDay'
    | 'cigarettesPerPack'
    | 'packPrice'
    | 'calculating'
    | 'results'
    | 'achievement'
  >('welcome');

  const [userData, setUserData] = useState({
    name: '',
    gender: '',
    birthYear: '',
    motivation: '',
    fears: [] as string[],
    quitTime: '',
    quitDate: null as Date | null,
    startAge: '',
    quitAttempts: '',
    quitChallenge: '',
    cigarettesPerDay: '',
    cigarettesPerPack: '',
    packPrice: {
      amount: '',
      currency: '₺',
    },
    smokingYears: '',
  });

  const handleWelcomeNext = () => {
    setStep('name');
  };

  const handleNameNext = (name: string) => {
    setUserData(prev => ({ ...prev, name }));
    setStep('gender');
  };

  const handleGenderNext = (gender: string) => {
    setUserData(prev => ({ ...prev, gender }));
    setStep('birthYear');
  };

  const handleBirthYearNext = (year: number) => {
    setUserData(prev => ({ ...prev, birthYear: year.toString() }));
    setStep('motivation');
  };

  const handleMotivationNext = (motivation: string) => {
    setUserData(prev => ({ ...prev, motivation }));
    setStep('fears');
  };

  const handleFearsNext = (fears: string[]) => {
    setUserData(prev => ({ ...prev, fears }));
    setStep('motivationCards');
  };

  const handleMotivationCardsNext = () => {
    setStep('quitTime');
  };

  const handleQuitTimeSelection = (choice: string) => {
    setUserData(prev => ({ ...prev, quitTime: choice }));
    if (choice === 'unknown') {
      setStep('quitPreparation');
    } else {
      setStep('quitDate');
    }
  };

  const handleQuitDateSelection = (date: Date) => {
    setUserData(prev => ({ ...prev, quitDate: date }));
    setStep('quitPreparation');
  };

  const handleQuitPreparationNext = () => {
    setStep('startAge');
  };

  const handleStartAgeNext = (startAge: string) => {
    setUserData(prev => ({ ...prev, startAge }));
    setStep('quitAttempts');
  };

  const handleQuitAttemptsNext = (attempts: string) => {
    setUserData(prev => ({ ...prev, quitAttempts: attempts }));
    if (attempts === 'never') {
      setStep('cigarettesPerDay');
    } else {
      setStep('quitChallenges');
    }
  };

  const handleQuitChallengesNext = (challenge: string) => {
    setUserData(prev => ({ ...prev, quitChallenge: challenge }));
    setStep('cigarettesPerDay');
  };

  const handleCigarettesPerDayNext = (count: string) => {
    setUserData(prev => ({ ...prev, cigarettesPerDay: count }));
    setStep('cigarettesPerPack');
  };

  const handleCigarettesPerPackNext = (count: string) => {
    setUserData(prev => ({ ...prev, cigarettesPerPack: count }));
    setStep('packPrice');
  };

  const handlePackPriceNext = (price: { amount: string; currency: string }) => {
    setUserData(prev => ({ ...prev, packPrice: price }));
    setStep('calculating');
  };

  const handleCalculatingComplete = () => {
    setStep('results');
  };

  const calculateResults = () => {
    const cigarettesPerDay = parseInt(userData.cigarettesPerDay);
    const cigarettesPerYear = cigarettesPerDay * 365;
    const pricePerPack = parseFloat(userData.packPrice.amount);
    const cigarettesPerPack = parseInt(userData.cigarettesPerPack);

    // Yıllık tasarruf
    const packsPerYear = cigarettesPerYear / cigarettesPerPack;
    const savings = Math.round(packsPerYear * pricePerPack);

    // İçilmeyen sigara sayısı
    const cigarettesNotSmoked = cigarettesPerYear;

    // Kazanılan zaman (gün)
    const timePerCigarette = 5; // dakika
    const totalMinutes = cigarettesPerYear * timePerCigarette;
    const timeSaved = Math.round(totalMinutes / 60 / 24);

    // Su tasarrufu (litre)
    const waterPerDay = 74; // litre
    const waterSaved = Math.round(waterPerDay * 365);

    return {
      currency: userData.packPrice.currency,
      savings,
      cigarettesNotSmoked,
      timeSaved,
      waterSaved,
    };
  };

  const handleResultsNext = () => {
    setStep('achievement');
  };

  const handleAchievementClose = async () => {
    const finalUserData = {
      name: userData.name,
      cigarettesPerDay: parseInt(userData.cigarettesPerDay),
      pricePerPack: parseFloat(userData.packPrice.amount),
      cigarettesPerPack: parseInt(userData.cigarettesPerPack),
      smokingYears: parseInt(userData.smokingYears),
      goals: [],
    };

    await storage.saveUserProfile(finalUserData);
    await storage.setOnboardingCompleted(true);
    navigation.navigate('TabNavigator');
  };

  const handleBack = () => {
    switch (step) {
      case 'name':
        setStep('welcome');
        break;
      case 'gender':
        setStep('name');
        break;
      case 'birthYear':
        setStep('gender');
        break;
      case 'motivation':
        setStep('birthYear');
        break;
      case 'fears':
        setStep('motivation');
        break;
      case 'motivationCards':
        setStep('fears');
        break;
      case 'quitTime':
        setStep('motivationCards');
        break;
      case 'quitDate':
        setStep('quitTime');
        break;
      case 'quitPreparation':
        setStep('quitTime');
        break;
      case 'startAge':
        setStep('quitPreparation');
        break;
      case 'quitAttempts':
        setStep('startAge');
        break;
      case 'quitChallenges':
        setStep('quitAttempts');
        break;
      case 'cigarettesPerDay':
        if (userData.quitAttempts === 'never') {
          setStep('quitAttempts');
        } else {
          setStep('quitChallenges');
        }
        break;
      case 'cigarettesPerPack':
        setStep('cigarettesPerDay');
        break;
      case 'packPrice':
        setStep('cigarettesPerPack');
        break;
      case 'calculating':
        setStep('packPrice');
        break;
      case 'results':
        setStep('calculating');
        break;
      case 'achievement':
        setStep('results');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {step === 'welcome' && <WelcomeScreen onNext={handleWelcomeNext} />}
      {step === 'name' && <NameScreen onNext={handleNameNext} />}
      {step === 'gender' && <GenderScreen onNext={handleGenderNext} onBack={handleBack} />}
      {step === 'birthYear' && <BirthYearScreen onNext={handleBirthYearNext} onBack={handleBack} />}
      {step === 'motivation' && <MotivationScreen onNext={handleMotivationNext} onBack={handleBack} />}
      {step === 'fears' && <FearsScreen onNext={handleFearsNext} onBack={handleBack} />}
      {step === 'motivationCards' && (
        <MotivationCardsScreen
          onNext={handleMotivationCardsNext}
          onBack={handleBack}
          selectedFears={userData.fears}
        />
      )}
      {step === 'quitTime' && (
        <QuitTimeScreen
          onNext={handleQuitTimeSelection}
          onBack={handleBack}
          userName={userData.name}
        />
      )}
      {step === 'quitDate' && (
        <QuitDateScreen
          onNext={handleQuitDateSelection}
          onBack={handleBack}
        />
      )}
      {step === 'quitPreparation' && (
        <QuitPreparationScreen
          onNext={handleQuitPreparationNext}
          onBack={handleBack}
        />
      )}
      {step === 'startAge' && (
        <SmokingStartAgeScreen
          onNext={handleStartAgeNext}
          onBack={handleBack}
        />
      )}
      {step === 'quitAttempts' && (
        <QuitAttemptsScreen
          onNext={handleQuitAttemptsNext}
          onBack={handleBack}
        />
      )}
      {step === 'quitChallenges' && (
        <QuitChallengesScreen
          onNext={handleQuitChallengesNext}
          onBack={handleBack}
        />
      )}
      {step === 'cigarettesPerDay' && (
        <CigarettesPerDayScreen
          onNext={handleCigarettesPerDayNext}
          onBack={handleBack}
        />
      )}
      {step === 'cigarettesPerPack' && (
        <CigarettesPerPackScreen
          onNext={handleCigarettesPerPackNext}
          onBack={handleBack}
        />
      )}
      {step === 'packPrice' && (
        <PackPriceScreen
          onNext={handlePackPriceNext}
          onBack={handleBack}
        />
      )}
      {step === 'calculating' && (
        <CalculatingScreen onComplete={handleCalculatingComplete} />
      )}
      {step === 'results' && (
        <ResultsScreen
          data={calculateResults()}
          onNext={handleResultsNext}
        />
      )}
      {step === 'achievement' && (
        <AchievementScreen
          onClose={handleAchievementClose}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
