import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
  Modal,
} from 'react-native';

interface Props {
  onNext: (price: { amount: string; currency: string }) => void;
  onBack?: () => void;
}

export const PackPriceScreen: React.FC<Props> = ({ onNext, onBack }) => {
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('₺');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const currencies = [
    { symbol: '₺', name: 'Türk Lirası' },
    { symbol: '$', name: 'Amerikan Doları' },
    { symbol: '€', name: 'Euro' },
    { symbol: '£', name: 'İngiliz Sterlini' },
    { symbol: '¥', name: 'Japon Yeni' },
    { symbol: '₽', name: 'Rus Rublesi' },
    { symbol: '₴', name: 'Ukrayna Grivnası' },
    { symbol: '₸', name: 'Kazak Tengesi' },
  ];

  const handleSubmit = () => {
    if (price.trim()) {
      onNext({ amount: price, currency });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '99.6%' }]} />
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
              Bir sigara paketi ne kadar tutuyordu?
            </Text>
            <View style={styles.bubbleTriangle} />
          </View>
        </View>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.currencyButton}
            onPress={() => setShowCurrencyModal(true)}
          >
            <Text style={styles.currencyText}>{currency}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="Fiyat girin"
            placeholderTextColor="#8E95B3"
          />
        </View>

        {/* Currency Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCurrencyModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Para Birimi</Text>
                <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                  <Text style={styles.saveButton}>Kaydet</Text>
                </TouchableOpacity>
              </View>
              {currencies.map((item) => (
                <TouchableOpacity
                  key={item.symbol}
                  style={styles.currencyOption}
                  onPress={() => {
                    setCurrency(item.symbol);
                    setShowCurrencyModal(false);
                  }}
                >
                  <Text style={styles.currencySymbol}>{item.symbol}</Text>
                  <Text style={styles.currencyName}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.button, !price && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!price}
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
    borderBottomColor: 'transparent',
    borderRightColor: '#586286',
  },
  inputContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyButton: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#8E95B3',
    borderRadius: 8,
    marginRight: 10,
    width: 60,
    alignItems: 'center',
  },
  currencyText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    flex: 1,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#8E95B3',
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButton: {
    fontSize: 16,
    color: '#00D48A',
    fontWeight: 'bold',
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  currencySymbol: {
    fontSize: 18,
    marginRight: 15,
    color: '#fff',
  },
  currencyName: {
    fontSize: 16,
    color: '#fff',
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
