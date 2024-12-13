import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
  onNext: (date: Date) => void;
  onBack?: () => void;
}

export const QuitDateScreen: React.FC<Props> = ({ onNext, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${day}/${month}/${year} ${displayHours}:${minutes} ${ampm}`;
  };

  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
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
          <View style={[styles.progress, { width: '66.4%' }]} />
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
              Sigarayı bırakmak için bir tarih seçin
            </Text>
            <View style={styles.bubbleTriangle} />
          </View>
        </View>

        {/* Date Selection */}
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(selectedDate)}
          </Text>
        </TouchableOpacity>

        {/* Modal Date Picker */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <Pressable 
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => {
                const lastYear = new Date(selectedDate);
                lastYear.setFullYear(lastYear.getFullYear() - 1);
                setSelectedDate(lastYear);
              }}>
                <Text style={styles.headerButton}>Geçen Yıl</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.headerButton}>Kaydet</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                display="spinner"
                onChange={onChange}
                style={styles.picker}
                textColor="#fff"
                locale="tr-TR"
              />
            </View>
          </Pressable>
        </Modal>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNext(selectedDate)}
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
    borderRightColor: '#586286',
    borderBottomColor: 'transparent',
  },
  dateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8E95B3',
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
    color: '#00D48A',
    fontSize: 16,
    fontWeight: '500',
  },
  pickerContainer: {
    backgroundColor: '#1E1E1E',
  },
  picker: {
    height: 200,
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
