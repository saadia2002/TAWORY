import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity 
} from 'react-native';
import { theme } from 'galio-framework';
import { REACT_APP_API_URL } from '@env';

const { width } = Dimensions.get('screen');
const CARD_WIDTH = (width - (theme.SIZES.BASE * 4)) / 2;

const ChatbotScreen = () => {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!message) {
      setError('Message is required.');
      return;
    }

    setError(null);
    setResponse(null);

    try {
      const res = await fetch(`${REACT_APP_API_URL}/api/reservations/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: userId || '67459d2ada2477563583432a', text: message }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong.');
      }

      const data = await res.json();
      setResponse(data.refinedResponse);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chatbot</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your User ID (optional)"
        value={userId}
        onChangeText={setUserId}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Response:</Text>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.SIZES.BASE,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.SIZES.BASE,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: theme.COLORS.PRIMARY,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: theme.SIZES.BASE,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: theme.SIZES.BASE,
    textAlign: 'center',
  },
  responseContainer: {
    marginTop: theme.SIZES.BASE,
    padding: theme.SIZES.BASE,
    backgroundColor: '#e6f7ff',
    borderRadius: 5,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  responseText: {
    fontSize: 14,
    color: '#333',
  },
});

export default ChatbotScreen;
