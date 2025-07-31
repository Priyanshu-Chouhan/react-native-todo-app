import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Avatar } from 'react-native-paper';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Avatar.Icon 
          size={80} 
          icon={isLogin ? "check" : "account-plus"} 
          style={styles.avatar}
        />
        
        <Text variant="headlineMedium" style={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </Text>
        
        <Text variant="bodyMedium" style={styles.subtitle}>
          {isLogin ? 'Sign in to your To-Do account' : 'Sign up for a new To-Do account'}
        </Text>
        
        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />
        
        {!isLogin && (
          <TextInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />
        )}
        
        <Button
          mode="contained"
          onPress={handleAuth}
          loading={loading}
          style={styles.button}
          buttonColor="#2c3e50"
        >
          {isLogin ? 'Login' : 'Register'}
        </Button>
        
        <Text style={styles.switchText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Text 
            style={styles.switchLink} 
            onPress={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Go to Register' : 'Go to Login'}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#6c7b7f',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#2c3e50',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#7f8c8d',
  },
  input: {
    marginBottom: 15,
    width: '100%',
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
    paddingVertical: 8,
  },
  switchText: {
    textAlign: 'center',
    color: '#7f8c8d',
  },
  switchLink: {
    color: '#3498db',
    fontWeight: 'bold',
  },
});