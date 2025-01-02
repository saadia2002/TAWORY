import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import Dialog from "react-native-dialog";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { REACT_APP_API_URL } from "@env";

export default function SignUp({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    dateOfBirth: new Date(),
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    type: "default", // 'success', 'error', 'default'
    onClose: null
  });

  const showDialog = (title, message, type = "default", onClose = null) => {
    setDialog({
      visible: true,
      title,
      message,
      type,
      onClose
    });
  };

  const hideDialog = () => {
    if (dialog.onClose) {
      dialog.onClose();
    }
    setDialog({ ...dialog, visible: false });
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      handleInputChange("dateOfBirth", selectedDate);
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showDialog(
          "Permission refusée",
          "Nous avons besoin de votre permission pour accéder à la galerie",
          "error"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        try {
          const optimizedImage = await optimizeImage(result.assets[0].uri);
          handleInputChange("image", optimizedImage);
        } catch (error) {
          showDialog("Erreur", error.message, "error");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      showDialog("Erreur", "Impossible de sélectionner l'image", "error");
    }
  };

  const optimizeImage = async (uri) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 400, height: 400 } }],
        {
          compress: 0.4,
          format: ImageManipulator.SaveFormat.JPEG
        }
      );

      const response = await fetch(manipResult.uri);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          const sizeInMB = (base64.length * 0.75) / (1024 * 1024);

          if (sizeInMB > 1) {
            reject(new Error("Image trop volumineuse après optimisation (>1MB)"));
            return;
          }
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Erreur lors de l'optimisation:", error);
      throw new Error("Échec de l'optimisation de l'image");
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      showDialog(
        "Champs manquants",
        "Tous les champs sont obligatoires",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      
      Object.keys(form).forEach(key => {
        if (key === 'dateOfBirth') {
          formData.append(key, form[key].toISOString());
        } else if (key === 'image' && form[key]) {
          formData.append('image', {
            uri: `data:image/jpeg;base64,${form[key]}`,
            type: 'image/jpeg',
            name: 'profile.jpg'
          });
        } else if (key !== 'image') {
          formData.append(key, form[key]);
        }
      });

      const response = await fetch(`${REACT_APP_API_URL}/api/users/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        showDialog(
          "Félicitations !",
          "Votre compte a été créé avec succès",
          "success",
          () => navigation.navigate("Categories")
        );
      } else {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      showDialog(
        "Erreur",
        error.message || "Échec de l'inscription",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {form.image ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${form.image}` }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>Ajouter une photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={form.name}
        onChangeText={(text) => handleInputChange("name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleInputChange("password", text)}
      />

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          Date de naissance: {formatDate(form.dateOfBirth)}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={form.dateOfBirth}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>
          Vous avez déjà un compte ? Connectez-vous
        </Text>
      </TouchableOpacity>

      <Dialog.Container visible={dialog.visible}>
        <Dialog.Title style={dialog.type === 'success' ? styles.successTitle : dialog.type === 'error' ? styles.errorTitle : styles.defaultTitle}>
          {dialog.title}
        </Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          {dialog.message}
        </Dialog.Description>
        <Dialog.Button
          label="OK"
          onPress={hideDialog}
          style={dialog.type === 'success' ? styles.successButton : dialog.type === 'error' ? styles.errorButton : styles.defaultButton}
        />
      </Dialog.Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  imageContainer: {
    alignSelf: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    color: "#666",
    textAlign: "center",
    padding: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dateButtonText: {
    color: "#000",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  // Styles pour les dialogues
  successTitle: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  errorTitle: {
    color: "#f44336",
    fontWeight: "bold",
  },
  defaultTitle: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  dialogDescription: {
    fontSize: 16,
    marginVertical: 10,
  },
  successButton: {
    color: "#4CAF50",
  },
  errorButton: {
    color: "#f44336",
  },
  defaultButton: {
    color: "#2196F3",
  },
});