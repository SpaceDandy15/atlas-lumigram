import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)'); // redirect to home
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

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
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      {/* ---------- REGISTER LINK ---------- */}
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.linkText}>Create a new account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#001F3F',
  },
  titleWrapper: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  atlas: {
    fontSize: 60,
    color: 'white',
    fontWeight: '900',
    includeFontPadding: false,
    textAlignVertical: 'bottom',
    lineHeight: 60,
  },
  school: {
    fontSize: 28,
    color: '#1ED2AF',
    fontWeight: '700',
    marginLeft: 100,
    marginTop: -8,
  },
  loginTitle: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
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
  button: {
    backgroundColor: '#1ED2AF',
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
  linkText: {
    marginTop: 16,
    color: '#66d9ef',
    textAlign: 'center',
    fontWeight: '500',
  },
});
