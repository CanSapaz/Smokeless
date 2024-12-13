import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface AchievementScreenProps {
  onClose: () => void;
}

export const AchievementScreen: React.FC<AchievementScreenProps> = ({ onClose }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Sigarayı bırakmaya karar verdim! ${format(new Date(), 'dd MMMM yyyy', { locale: tr })} tarihinde yeni bir hayata başlıyorum. 🎉`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Icon name="share-variant" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Icon name="trophy" size={120} color="#00D48A" />
        <Text style={styles.title}>Yeni bir başlangıç</Text>
        <Text style={styles.description}>
          Bu kupayı sigarayı bırakmayı taahhüt ederek kazandınız, tebrikler!
        </Text>
        <Text style={styles.date}>
          {format(new Date(), 'dd MMMM yyyy', { locale: tr })}
        </Text>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Kapat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E5A84',
    padding: 20,
  },
  shareButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  date: {
    fontSize: 16,
    color: '#8E95B3',
    textAlign: 'center',
  },
  closeButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
