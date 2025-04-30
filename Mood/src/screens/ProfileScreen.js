import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
function ProfileScreen(route) {
    const { mood } = route.params || {};
    const navigation = useNavigation();
  return (
    <View style={[styles.container,{ backgroundColor: mood?.color + '50' }]}>
      <Text style={styles.title}>Ready to track your Mood?</Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
            <View style={styles.btn}>
                <Text style={styles.btnText}>Login</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Signup')}>
            <View style={styles.btn}>
                <Text style={styles.btnText}>Sign Up</Text>
            </View>
        </TouchableOpacity>
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFF5F2',
    },
    title: {
      fontSize: 20,
      marginBottom:150,
    },
    btnText:{
      fontSize: 18,
      color: 'white',
      fontWeight: 'bold',
    },
    btn:{
        backgroundColor: 'tomato',
        paddingVertical: 20,
        paddingHorizontal: 42,
        borderRadius: 10,
        alignItems: 'center',         // Center text inside the button
        justifyContent: 'center',     // Center text vertically
        marginVertical: 10,
    },
    btnContainer:{
        display: 'flex',
        flexDirection: 'row',      // Side-by-side layout
        justifyContent: 'space-between', // Creates spacing between buttons
        alignItems: 'center',      // Align items in the center vertically
        width: '90%',              // Adjust width as needed
        marginTop: 20,
    }
  });

export default ProfileScreen