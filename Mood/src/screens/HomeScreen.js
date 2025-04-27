import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

function HomeScreen({ navigation }) {
  const defaultColor = '#FFF5F2';
  const [backgroundColor, setBackgroundColor] = useState(defaultColor);
  const [selectedMood, setSelectedMood] = useState(null);
  
  const moods = [
    { name: 'Happy', color: '#FFD700', emoji: '😊' },
    { name: 'Sad', color: '#4682B4', emoji: '😢' },
    { name: 'Angry', color: '#FF6B6B', emoji: '😠' },
    { name: 'Excited', color: '#FFA500', emoji: '🤩' },
    { name: 'Loved', color: '#FF69B4', emoji: '🥰' },
    { name: 'Stressed', color: '#800000', emoji: '😫' }
  ];

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

  const handleMoodSelect = (color, index) => {
    if (selectedMood === index) {
      setBackgroundColor(defaultColor);
      setSelectedMood(null);
      // Reset the tab params
      navigation.navigate('Add', { mood: null });
    } else {
      setBackgroundColor(color);
      setSelectedMood(index);
      // Pass the complete mood object
      navigation.navigate('Add', { 
        mood: moods[index] 
      });
    }
};

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{getCurrentDate()}</Text>
      </View>
      
      <View style={[styles.contentContainer,{backgroundColor }]}>
        <Text style={styles.title}>How are you feeling today?</Text>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.moodContainer}
          showsVerticalScrollIndicator={false}
        >
          {moods.map((mood, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.moodButton,
                { backgroundColor: mood.color },
                selectedMood === index && styles.selectedMood,
                
              ]}
              onPress={() => handleMoodSelect(mood.color, index)}
              activeOpacity={0.7}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodText}>{mood.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {selectedMood !== null && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedText}>
              You're feeling {moods[selectedMood].name.toLowerCase()} today
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F2',
  },
  dateContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(91, 60, 60, 0.3)',
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scrollView: {
    width: '100%',
    maxHeight: '80%',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  moodButton: {
    width: '45%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    marginBottom: 15,
    transform: [{ scale: 1 }],
  },
  selectedMood: {
    transform: [{ scale: 1.05 }],
    borderWidth: 3,
    borderColor: '#fff',
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  moodText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  selectedContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
});

export default HomeScreen;