import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      {/* ---------- ATLAS SCHOOL LOGO ---------- */}
      <View style={styles.titleWrapper}>
        <Text style={styles.atlas}>Atlas</Text>
        <Text style={styles.school}>School</Text>
      </View>

      {/* ---------- LOGIN HEADING ---------- */}
      <Text style={styles.loginTitle}>Login</Text>

      {/* ---------- EMAIL INPUT ---------- */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* ---------- PASSWORD INPUT ---------- */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* ---------- SIGN IN BUTTON ---------- */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* ---------- REGISTER LINK ---------- */}
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.linkText}>Create a new account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- Page container ---
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#001F3F', // dark navy
  },

  // --- Atlas / School title group ---
  titleWrapper: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  atlas: {
    fontSize: 60,
    color: 'white',
    fontWeight: '900',
    includeFontPadding: false, // prevents top clipping on Android
    textAlignVertical: 'bottom',
    lineHeight: 60,
  },
  school: {
    fontSize: 28,
    color: '#1ED2AF',       // teal color
    fontWeight: '700',
    marginLeft: 100,
    marginTop: -8,
  },

  // --- "Login" heading ---
  loginTitle: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  // --- Inputs ---
  input: {
    width: '100%',
    backgroundColor: '#ffffff20',
    color: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },

  // --- Button ---
  button: {
    backgroundColor: '#1ED2AF', // teal
    padding: 16,
    borderRadius: 10,
    width: '100%',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // --- Link text ---
  linkText: {
    marginTop: 16,
    color: '#66d9ef',
    textAlign: 'center',
    fontWeight: '500',
  },
});
