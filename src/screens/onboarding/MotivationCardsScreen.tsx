import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  onNext: () => void;
  onBack?: () => void;
  selectedFears: string[];
}

interface MotivationCard {
  icon: keyof typeof Ionicons.glyphMap;
  mainText: string;
  highlightText: string;
}

export const MotivationCardsScreen: React.FC<Props> = ({ onNext, onBack, selectedFears }) => {
  const getMotivationCard = (fearId: string): MotivationCard => {
    const cards: { [key: string]: MotivationCard } = {
      weight_gain: {
        icon: 'fitness',
        mainText: "Sigarayı bırakmak metabolizmanı hızlandırır ve sağlıklı bir yaşam tarzına geçmeni kolaylaştırır",
        highlightText: "Daha fit bir sen için ilk adım",
      },
      strong_urge: {
        icon: 'shield-checkmark',
        mainText: "Her geçen gün nikotin bağımlılığın azalacak ve kontrol tamamen sende olacak",
        highlightText: "Özgürlüğüne kavuşmana az kaldı",
      },
      stress: {
        icon: 'leaf',
        mainText: "Sigara stresi azaltmaz, aksine nikotin yoksunluğu stresi tetikler",
        highlightText: "Gerçek huzuru keşfet",
      },
      depression: {
        icon: 'sunny',
        mainText: "Sigarayı bırakmak ruh halini iyileştirir ve doğal mutluluk hormonlarını artırır",
        highlightText: "Daha mutlu günler yakında",
      },
      focus_loss: {
        icon: 'bulb',
        mainText: "Temiz hava ve oksijen beyninin daha iyi çalışmasını sağlayacak",
        highlightText: "Zihinsel berraklığa kavuş",
      },
      withdrawal: {
        icon: 'timer',
        mainText: "Yoksunluk belirtileri geçici, her gün biraz daha azalacak",
        highlightText: "Bu süreç geçici, sen kalıcısın",
      },
      social_missing: {
        icon: 'people',
        mainText: "Sigarasız sosyalleşmek mümkün, üstelik daha enerjik ve present olacaksın",
        highlightText: "Yeni deneyimlere hazır ol",
      },
      failure: {
        icon: 'trophy',
        mainText: "Her başarısızlık seni hedefe biraz daha yaklaştırır, bu sefer yanındayız",
        highlightText: "Başarı senin karakterinde var",
      },
    };
    return cards[fearId] || cards.failure;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '99%' }]} />
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Geri Dön</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>
        Sigara bırakmanın göz korkutucu görünebileceğini biliyoruz
      </Text>

      <ScrollView style={styles.content}>
        <View style={styles.cardsContainer}>
          {selectedFears.map((fearId) => {
            const card = getMotivationCard(fearId);
            return (
              <View key={fearId} style={styles.card}>
                <Ionicons name={card.icon} size={40} color="#00D48A" style={styles.cardIcon} />
                <Text style={styles.cardText}>{card.mainText}</Text>
                <Text style={styles.cardHighlight}>{card.highlightText}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

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
  title: {
    color: '#00D48A',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardsContainer: {
    gap: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#586286',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 16,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  cardHighlight: {
    color: '#00D48A',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
