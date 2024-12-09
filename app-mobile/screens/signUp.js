import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { REACT_APP_API_URL } from '@env';

export default function SignUp({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.role || !form.dateOfBirth) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${REACT_APP_API_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert('Succès', 'Inscription réussie !');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Erreur', 'Impossible de terminer l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={form.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleInputChange('password', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Rôle (admin, prestataire, user)"
        value={form.role}
        onChangeText={(text) => handleInputChange('role', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date de naissance (YYYY-MM-DD)"
        value={form.dateOfBirth}
        onChangeText={(text) => handleInputChange('dateOfBirth', text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Vous avez déjà un compte ? Connectez-vous</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});
