import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

function AddMoodScreen({ route, navigation }) {
  const { mood } = route.params || {};
  const [moment, setMoment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isUserLoggedIn = auth.currentUser;

  const getCurrentDate = () => {
    const date = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleSaveMoment = async () => {
    if (!moment.trim()) {
      alert('Please write something about your moment');
      return;
    }

    if (!auth.currentUser) {
      alert('Please login to save your moments');
      navigation.navigate('Profile');
      return;
    }

    setIsLoading(true);
    try {
      // Reference to the user document
      const userDocRef = doc(db, 'Users', auth.currentUser.uid);
      
      // Create the new mood entry without serverTimestamp
      const newMoodEntry = {
        mood: {
          name: mood.name,
          color: mood.color,
          emoji: mood.emoji
        },
        moment: moment.trim(),
        timestamp: new Date().getTime(), // Use regular timestamp instead
        createdAt: new Date().toISOString()
      };

      // Update the user document by adding the new mood to the history array
      await updateDoc(userDocRef, {
        history: arrayUnion(newMoodEntry)
      });

      setIsLoading(false);
      alert('Moment saved successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving mood:', error);
      setIsLoading(false);
      alert('Failed to save moment. Please try again.');
    }
  };

  if (!mood) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <View style={styles.dateCon}>
          <Text style={styles.dateT}>{getCurrentDate()}</Text>
        </View>
        <Text style={styles.noMoodText}>Please select a mood from the Home screen first</Text>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer,{ backgroundColor: mood?.color + '50' }]}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{getCurrentDate()}</Text>
      </View>
      <View style={[styles.container, { backgroundColor: mood?.color + '10' }]}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <View style={[styles.moodBubble, { backgroundColor: mood?.color }]}>
              <Text style={styles.emoji}>{mood?.emoji}</Text>
            </View>
            <Text style={[styles.moodText, { color: mood?.color }]}>
              Feeling {mood?.name.toLowerCase()}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Write about your moment:</Text>
            <TextInput
              style={[styles.input, { borderColor: mood?.color + '50' }]}
              multiline
              numberOfLines={6}
              placeholder="How are you feeling? What made you feel this way?"
              value={moment}
              onChangeText={setMoment}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.saveButton, 
              { 
                backgroundColor: mood?.color,
                opacity: isLoading ? 0.7 : 1,
                transform: [{ scale: isLoading ? 0.98 : 1 }]
              }
            ]}
            onPress={handleSaveMoment}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : (isUserLoggedIn ? 'Save Moment' : 'Login to Save')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF5F2',
    paddingTop: 0, // Add padding to account for the date container
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoodText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  dateContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  dateCon: {
    width: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateT: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 100,
  },
  moodBubble: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  emoji: {
    fontSize: 50,
  },
  moodText: {
    fontSize: 24,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    minHeight: 150,
    borderWidth: 2,
  },
  saveButton: {
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default AddMoodScreen;