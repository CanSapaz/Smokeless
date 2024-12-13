import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ResultsScreenProps {
  data: {
    currency: string;
    savings: number;
    cigarettesNotSmoked: number;
    timeSaved: number;
    waterSaved: number;
  };
  onNext: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ data, onNext }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>
          Verdiğin bilgilere göre, Smokeless'ı kullanarak bir yılda şunları başarabilirsin:
        </Text>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Icon name="cash" size={32} color="#00D48A" />
            <View style={styles.cardContent}>
              <Text style={styles.value}>
                {data.currency} {data.savings.toLocaleString()}
              </Text>
              <Text style={styles.label}>Tasarruf edilen para</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Icon name="smoking-off" size={32} color="#00D48A" />
            <View style={styles.cardContent}>
              <Text style={styles.value}>
                {data.cigarettesNotSmoked.toLocaleString()}
              </Text>
              <Text style={styles.label}>İçilmeyen sigara</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Icon name="clock-outline" size={32} color="#00D48A" />
            <View style={styles.cardContent}>
              <Text style={styles.value}>{data.timeSaved} Gün</Text>
              <Text style={styles.label}>Kazanılan zaman</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Icon name="water" size={32} color="#00D48A" />
            <View style={styles.cardContent}>
              <Text style={styles.value}>{data.waterSaved.toLocaleString()} Litre</Text>
              <Text style={styles.label}>Tasarruf edilmiş su</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>Devam Et</Text>
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    color: '#fff',
    marginTop: 120,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cardsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#586286',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    marginLeft: 15,
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#8E95B3',
  },
  button: {
    backgroundColor: '#00D48A',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
