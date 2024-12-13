import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onNext: () => void;
}

const FinalStep = ({ onNext }: { onNext: () => void }) => {
  const topOpacity = React.useRef(new Animated.Value(0)).current;
  const bottomOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(topOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(bottomOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="leaf" size={32} color="#fff" />
          <Text style={styles.title}>Hoşgeldiniz</Text>
        </View>
      </View>

      <View style={styles.finalBubblesContainer}>
        <View style={styles.bubblesWrapper}>
          <Animated.View style={[styles.topBubble, { opacity: topOpacity }]}>
            <View style={styles.smallBubble}>
              <Text style={styles.bubbleText}>
                Smokeless ile yolculuğunuza başlamaya hazır mısınız? İlk olarak hesabınızı oluşturalım.
              </Text>
              <View style={[styles.bubbleTriangle, styles.rightTriangle]} />
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.bottomBubble, { opacity: bottomOpacity }]}>
            <View style={styles.smallBubble}>
              <Text style={styles.bubbleText}>
                Bu konuda size yardımcı olacağım!
              </Text>
              <View style={[styles.bubbleTriangle, styles.leftTriangle]} />
            </View>
          </Animated.View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={onNext}>
            <Text style={styles.buttonText}>Devam</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export const WelcomeScreen: React.FC<Props> = ({ onNext }) => {
  const [step, setStep] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  const messages = [
    "Tebrikler! Sigarayı bırakmak hayatınızda verdiğiniz en iyi karar!",
    "Dünya genelinde 1 milyondan fazla kişi Smokeless kullanıyor. Yüzbinlerce kişinin başarılı olarak sigarayı bırakmasına yardımcı olduğumuzu söylemekten gurur duyuyoruz. Sıradaki kişi olmaya hazır mısınız?",
    "Programımız yıllara dayanan davranış bilimi araştırmalarına dayanmaktadır. 3 ay boyunca Smokeless kullananların %84'ü hala sigara içmiyor."
  ];

  const animateTransition = (nextStep: number) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setStep(nextStep);
      translateY.setValue(50);
      
      if (nextStep < 3) {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  };

  const handleNext = () => {
    if (step < 3) {
      animateTransition(step + 1);
    }
  };

  if (step === 3) {
    return <FinalStep onNext={onNext} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="leaf" size={32} color="#fff" />
          <Text style={styles.title}>Hoşgeldiniz</Text>
        </View>
      </View>

      <View style={styles.bubbleContainer}>
        <View style={styles.mainBubble}>
          <Animated.View 
            style={[
              styles.messageContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY }],
              },
            ]}
          >
            <Text style={styles.bubbleText}>{messages[step]}</Text>
          </Animated.View>
          <View style={styles.bubbleTriangle} />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {step === 0 ? 'Hadi Başlayalım!' : 'Devam'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#98D8AA',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  bubbleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  finalBubblesContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bubblesWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  topBubble: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  bottomBubble: {
    alignItems: 'flex-start',
  },
  mainBubble: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    minHeight: 180,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBubble: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    position: 'relative',
  },
  messageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  bubbleText: {
    fontSize: 18,
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 26,
  },
  bubbleTriangle: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
  },
  rightTriangle: {
    left: 'auto',
    right: 20,
  },
  leftTriangle: {
    left: 20,
    marginLeft: 0,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#2C3E50',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
