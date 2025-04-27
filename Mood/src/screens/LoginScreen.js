import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
import { auth,db } from '../../firebaseConfig';
import { doc,  getDoc } from "firebase/firestore";
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

    const handleForgotPassword = () => {
      if (!email) {
          alert('Email Required', 'Please enter your email address to reset your password');
          return;
      }
      
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
          alert('Invalid Email', 'Please enter a valid email address');
          return;
      }
      
      sendPasswordResetEmail(auth, email)
          .then(() => {
              alert(
                  'Password Reset Email Sent', 
                  'Check your email for instructions to reset your password'
              );
          })
          .catch((error) => {
              console.error("Error sending password reset email:", error);
              alert('Error', 'Failed to send password reset email. Please try again.');
          });
  };

  const handleLogin = async() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^[A-Za-z0-9]{8,20}$/;
    try {
      // Basic validation
      if (!email || !password) {
        setError('Please fill in both fields');
        return;
      }
      if(!emailRegex.test(email)){
        setError('Please enter a valid email');
        return;
      }
      if(!passwordRegex.test(password)){
        setError('Please enter a valid password');
        return;
      }
      // Perform login logic here
      const userCredentials=await signInWithEmailAndPassword(auth,email,password);
      const user=userCredentials.user;
      // Check if user exists in Firestore
      // Change "User" to "Users" to match your collection name
      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if(userDoc.exists()){
        alert('User Login Success');
      }
      navigation.navigate("ProfileLogin", { userId: user.uid });
    } catch (error) {
      console.log(error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError("No account found with this email. Please sign up.");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again.");
          break;
        case 'auth/invalid-email':
          setError("Invalid email address.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotLink}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupLink}>Don't have an account?<Text style={{color:'#1E3D59'}}>Sign Up</Text> </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF5F2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'tomato',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'tomato',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  signupLink: {
    color: 'tomato',
    fontSize: 16,
  },
  forgotLink: {
    color: '#1E3D59',
    fontSize: 16,
    marginTop: 5,
  },
});
