import React, { useState,useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth, signOut,deleteUser } from "firebase/auth";

const ProfileLoginScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [name, setname] = useState(null);
  const [email, setemail] = useState(null);
  const [moodsHistory, setMoodsHistory] = useState([]); // Changed from cardHistory
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isHaveHistory, setHaveHistory] = useState(false); 
  const auth = getAuth();

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      alert('Please enter a valid username');
      return;
    }
  
    try {
      const userRef = doc(db, 'Users', userId);
      await updateDoc(userRef, {
        username: newUsername
      });
      setname(newUsername);
      setModalVisible(false);
      setNewUsername('');
      alert('Username updated successfully!');
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Failed to update username. Please try again.');
    }
  };
  const handleDeleteAccount = async () => {
    try {
      // First, delete the authentication account
      const user = auth.currentUser;
      if (!user) {
        alert('No authenticated user found');
        return;
      }
  
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'Users', userId));
      
      // Delete the authentication account
      await deleteUser(user);
      
      alert('Your account has been deleted successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error deleting account:", error);
      alert('Failed to delete account: ' + error.message);
      setDeleteModalVisible(false);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching data for userId:", userId);
        const userDoc = await getDoc(doc(db, 'Users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Fetched user data:", userData);
          setname(userData.username);
          setemail(userData.email);
          
          if (userData.history) { // Changed from cardHistory to history
            setMoodsHistory(userData.history);
          }
        }
      } catch (error) {
        console.error("Error Fetching User Data: ", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>PROFILE</Text>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.userName}>{name|| 'Loading'}</Text>
          </TouchableOpacity>
          <Text style={styles.userEmail}>{email || 'Loading...'}</Text>
        </View>
      </View>

        {/* Username Update Modal */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new username"
              value={newUsername}
              onChangeText={setNewUsername}
              autoFocus={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => {
                  setModalVisible(false);
                  setNewUsername('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.updateButton]} 
                onPress={handleUpdateUsername}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

        {/* Moods History Section */}
        <View style={styles.historySection}>
          <TouchableOpacity onPress={()=>setHaveHistory(true)}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>MOODS HISTORY</Text>
            </View>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isHaveHistory}
            onRequestClose={() => setHaveHistory(false)}>
            
              <View style={styles.historyModalOverlay}>
                <View style={styles.historyContainer}>
                  <Text style={styles.modalHistoryTitle}>Your Mood Journey</Text>
                  <ScrollView style={styles.scrollView}>
                    <View style={styles.moodContainer}>
                      {moodsHistory.length > 0 ? (
                        moodsHistory.map((item, index) => (
                          <View key={index} style={[styles.moodItem, { backgroundColor: item.mood.color + '10' }]}>
                            <View style={styles.moodHeader}>
                              <View style={[styles.emojiContainer, { backgroundColor: item.mood.color + '20' }]}>
                                <Text style={styles.moodEmoji}>{item.mood.emoji}</Text>
                              </View>
                              <View style={styles.moodInfo}>
                                <Text style={[styles.moodName, { color: item.mood.color }]}>
                                  Feeling {item.mood.name.toLowerCase()}
                                </Text>
                                <Text style={styles.moodDate}>
                                  {new Date(item.timestamp).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </Text>
                              </View>
                            </View>
                            <Text style={styles.moodMoment}>{item.moment}</Text>
                          </View>
                        ))
                      ) : (
                        <View style={styles.emptyStateContainer}>
                          <Text style={styles.emptyStateText}>No mood entries yet</Text>
                          <Text style={styles.emptyStateSubtext}>Start sharing your feelings!</Text>
                        </View>
                      )}
                    </View>
                  </ScrollView>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setHaveHistory(false)}>
                    <Text style={styles.backButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

          <View style={styles.cardsContainer}>
            <View style={styles.historyCard}>
              {moodsHistory.length > 0 ? (
                <View style={styles.recentMoodsContainer}>
                  <Text style={styles.recentMoodsTitle}>Recent Moods</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {moodsHistory.slice(0, 5).map((item, index) => (
                      <View key={index} style={[styles.recentMoodItem, { backgroundColor: item.mood.color + '20' }]}>
                        <Text style={styles.recentMoodEmoji}>{item.mood.emoji}</Text>
                        <Text style={[styles.recentMoodName, { color: item.mood.color }]}>{item.mood.name}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                <View style={styles.emptyHistoryContainer}>
                  <Text style={styles.emptyHistoryText}>No Moods history yet</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setDeleteModalVisible(true)}
          >
            <Ionicons name="sparkles-sharp" size={20} color="#E0A526" />
            <Text style={styles.actionButtonText}>DELETE ACCOUNT</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleLogout}
          >
            <Ionicons name="exit" size={20} color="#E0A526" />
            <Text style={styles.actionButtonText}>LOG OUT</Text>
          </TouchableOpacity>
          {/* Back to Home Button */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Tab', { userId: userId })}
          >
            <Ionicons name="home-outline" size={20} color="#060C18" />
            <Text style={[styles.actionButtonText, {color: '#060C18'}]}>BACK TO HOME</Text>
          </TouchableOpacity>
          {/* // Add the Delete confirmation modal */}
          <Modal
            animationType='fade'
            transparent={true}
            visible={isDeleteModalVisible}
            onRequestClose={() => setDeleteModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Delete Account</Text>
                <Text style={styles.modalText}>
                  Are you sure you want to delete your account? This action cannot be undone.
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]} 
                    onPress={() => setDeleteModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.deleteButton]} 
                    onPress={handleDeleteAccount}
                  >
                    <Text style={[styles.buttonText, { color: 'white' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          
          </View>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F2',
    paddingTop: '7%',
  },
  headerTitle: {
    color: 'tomato',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    letterSpacing: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    color: 'tomato',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    color: '#333',
    fontSize: 14,
    opacity: 0.7,
  },
  historySection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 99, 71, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  historyTitle: {
    color: 'tomato',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    paddingLeft: 12,
  },
  historyCard: {
    width: '100%',
    height: 160,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 99, 71, 0.2)',
  },
  cardImage: {
    width: 80, 
    height: 138,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'tomato',
  },
  emptyHistoryText: {
    color: '#333',
    fontSize: 14,
    opacity: 0.7,
  },
  actionButton: {
    width:'80%',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'tomato',
    backgroundColor: 'white',
    marginBottom: 12,
  },
  actionButtonText: {
    color: 'tomato',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  modalContent: {
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'tomato',
    shadowColor: 'tomato',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    color: 'tomato',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF5F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'tomato',
    padding: 12,
    marginBottom: 20,
    color: '#333',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#E0A526',
  },
  updateButton: {
    backgroundColor: '#E0A526',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0A526',
  },
  modalText: {
    color: 'tomato',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#FF4D4F',
    borderColor: '#FF4D4F',
  },
  historyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  historyContainer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#272B3B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0A526',
    shadowColor: '#E0A526',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHistoryTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#E0A526',
    marginBottom: 20,
    letterSpacing: 1,
  },
  scrollView: {
    width: '100%',
  },
  moodContainer: {
    padding: 10,
    gap: 15,
  },
  moodItem: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(224, 165, 38, 0.2)',
  },
  moodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emojiContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodInfo: {
    flex: 1,
  },
  moodName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  moodDate: {
    fontSize: 12,
    color: '#E0A526',
    opacity: 0.8,
  },
  moodMoment: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(224, 165, 38, 0.1)',
  },
  backButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: '#E0A526',
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#272B3B',
    fontSize: 16,
    fontWeight: '600',
  },
  recentMoodsContainer: {
    width: '100%',
    padding: 10,
  },
  recentMoodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'tomato',
    marginBottom: 10,
    textAlign: 'center',
  },
  recentMoodItem: {
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 70,
  },
  recentMoodEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E0A526',
    opacity: 0.7,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0A526',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 1

  }
});
export default ProfileLoginScreen;