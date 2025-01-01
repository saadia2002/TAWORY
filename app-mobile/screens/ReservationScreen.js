import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Platform, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { REACT_APP_API_URL } from '@env';
import { Block } from 'galio-framework';

export default function ReservationScreen({ route }) {
  const { serviceId } = route.params;
  const { userId } = { userId: '67459d2ada2477563583432a' };
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reservation, setReservation] = useState({
    date: new Date(),
    lieu: '',
    telephone: ''
  });

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_URL}/api/services/${serviceId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch service');
      }
      const data = await response.json();
      setService(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setReservation(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const handleInputChange = (name, value) => {
    setReservation(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const validateForm = () => {
    if (!reservation.lieu.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un lieu');
      return false;
    }
    if (!reservation.telephone.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone');
      return false;
    }
    // Validation basique du numéro de téléphone
    if (!/^\+?[\d\s-]{8,}$/.test(reservation.telephone)) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide');
      return false;
    }
    return true;
  };

  const handleReservationSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`${REACT_APP_API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: serviceId,
          client: userId,
          date: reservation.date.toISOString(),
          lieu: reservation.lieu,
          telephone: reservation.telephone,
          status: 'pending'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit reservation');
      }

      const data = await response.json();
      console.log('Reservation submitted:', data);
      Alert.alert('Succès', 'Réservation soumise avec succès');
    } catch (error) {
      console.error('Error submitting reservation:', error);
      Alert.alert('Erreur', error.message || 'Échec de la soumission de la réservation');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Failed to load service: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      {service && (
        <>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceTitle}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <Text style={styles.servicePrice}>{service.price} €</Text>
          </View>
          <View style={styles.form}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                Date: {formatDate(reservation.date)}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={reservation.date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Lieu de la réservation"
              value={reservation.lieu}
              onChangeText={(value) => handleInputChange('lieu', value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Numéro de téléphone"
              value={reservation.telephone}
              onChangeText={(value) => handleInputChange('telephone', value)}
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.button} onPress={handleReservationSubmit}>
              <Text style={styles.buttonText}>Réserver</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  serviceInfo: {
    marginBottom: 20,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 16,
    color: '#666',
    marginVertical: 8,
  },
  servicePrice: {
    fontSize: 16,
    color: '#000',
    marginVertical: 8,
  },
  form: {
    marginTop: 20,
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
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: '#000',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});