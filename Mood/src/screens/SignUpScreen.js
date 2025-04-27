import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {  createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from '../../firebaseConfig';
export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleSignup = async () => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^[A-Za-z0-9]{8,20}$/;
    
    try {
        // Check if any field is empty
        if (!username || !email || !password) {
            alert('Invalid Input', 'Please fill all fields');
            return;
        }
        // Validate username first
        if (!usernameRegex.test(username)) {
            alert(
                'Invalid Username',
                'Username should be 3-15 characters long and contain only letters, numbers, and underscores.'
            );
            return;
        }
        // Validate email
        if (!emailRegex.test(email)) {
            alert('Invalid Email', 'Please enter a valid email address');
            return;
        }
        // Validate password
        if (!passwordRegex.test(password)) {
            alert(
                'Weak Password',
                'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.'
            );
            return;
        }
        // Check if username or email already exists
        const usernameQuery = query(collection(db, "Users"), where("username", "==", username));
        const emailQuery = query(collection(db, "Users"), where("email", "==", email));
        
        const [usernameSnapshot, emailSnapshot] = await Promise.all([
            getDocs(usernameQuery),
            getDocs(emailQuery)
        ]);
    
        if (!usernameSnapshot.empty) {
            alert('Username Taken', 'This username is already in use');
            return;
        }
    
        if (!emailSnapshot.empty) {
            alert('Email Taken', 'This email is already registered');
            return;
        }
    
        // If no conflicts, proceed with registration
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db, "Users", user.uid), {
            email: email,
            username: username,
            profileImg: null  
        });
    
        alert('Success', 'Signup successful!');
        console.log("Signup Successful!");
        navigation.navigate("ProfileLogin",{userId:user.uid});
        
    } catch (error) {
        setError("Signing up failed!");
        console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />

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

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signupLink}>Already have an account? <Text style={{color:'#1E3D59'}}>Login</Text></Text>
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
});
