import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, ScrollView, View, TouchableOpacity, Platform, Image, Dimensions, TextInput } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import Dialog from 'react-native-dialog';  // Importation de la bibliothèque de dialogues
import { REACT_APP_API_URL } from '@env';

const { width } = Dimensions.get('screen');
const IMAGE_SIZE = width * 0.25;

export default function AddService({ route, navigation }) {
  const { category } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: category._id,
    serviceProvider: '67435f93e583c8349d1a79df',
  });
  const [errors, setErrors] = useState({});
  const [visibleDialog, setVisibleDialog] = useState(false);  // État pour contrôler l'affichage de l'alerte
  const [dialogMessage, setDialogMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.price.trim()) newErrors.price = 'Le prix est requis';
    if (isNaN(Number(formData.price))) newErrors.price = 'Le prix doit être un nombre';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch(`${REACT_APP_API_URL}/api/services/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error('Erreur lors du parsing JSON:', error);
        data = null;
      }

      if (response.status === 200 || response.status === 201) {
        setDialogMessage("Le service a été créé avec succès !");
        setVisibleDialog(true);  // Afficher le dialogue de succès
      } else {
        setErrors({ submit: data?.message || 'Erreur lors de la création du service' });
      }
    } catch (error) {
      console.error('Erreur générale:', error);
      setErrors({ submit: 'Erreur de connexion ou problème réseau' });
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryHeader = () => (
    <View style={styles.categoryHeader}>
      {category.icon ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${category.icon}` }}
          style={styles.categoryIcon}
        />
      ) : (
        <View style={[styles.categoryIcon, styles.placeholderIcon]}>
          <Text size={30} color={theme.COLORS.MUTED}>
            {category.name.charAt(0)}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {renderCategoryHeader()}

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom du service</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Nom du service"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Prix (DH)</Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="Prix"
            keyboardType="numeric"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Description du service"
            multiline
            numberOfLines={4}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {errors.submit && (
          <Text style={[styles.errorText, styles.submitError]}>{errors.submit}</Text>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.COLORS.WHITE} />
          ) : (
            <Text style={styles.submitButtonText}>Créer le service</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Dialog personnalisé pour le succès */}
      <Dialog.Container visible={visibleDialog}>
        <Dialog.Title style={{ color: '#4CAF50',fontSize: 24 }}>Succès</Dialog.Title>
        <Dialog.Description style={{ color: 'black' }}>
          {dialogMessage}
        </Dialog.Description>
        <Dialog.Button 
          label="OK" 
          onPress={() => { setVisibleDialog(false); navigation.navigate('ServicesList', { categoryId: category._id }) }} 
          style={{ backgroundColor: '#4CAF50', color: 'white' }} 
        />
      </Dialog.Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.SIZES.BASE,
  },
  categoryHeader: {
    alignItems: 'center',
    marginBottom: theme.SIZES.BASE,
  },
  categoryIcon: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  placeholderIcon: {
    backgroundColor: theme.COLORS.GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    paddingHorizontal: theme.SIZES.BASE,
  },
  formGroup: {
    marginBottom: theme.SIZES.BASE,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    color: theme.COLORS.GRAY,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.COLORS.GREY,
    borderRadius: 8,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: theme.SIZES.BASE * 0.75,
    fontSize: 16,
    backgroundColor: theme.COLORS.WHITE,
  },
  inputError: {
    borderColor: theme.COLORS.ERROR,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: theme.COLORS.ERROR,
    fontSize: 12,
    marginTop: 4,
  },
  submitError: {
    textAlign: 'center',
    marginBottom: theme.SIZES.BASE,
  },
  submitButton: {
    backgroundColor: '#17611b',
    padding: theme.SIZES.BASE,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: theme.SIZES.BASE,
  },
  submitButtonText: {
    color: theme.COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});

