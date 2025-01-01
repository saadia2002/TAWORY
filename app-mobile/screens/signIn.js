import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Dialog from "react-native-dialog";
import { REACT_APP_API_URL } from "@env";

export default function Login({ navigation }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    type: "default", 
    onClose: null,
  });

  const showDialog = (title, message, type = "default", onClose = null) => {
    setDialog({
      visible: true,
      title,
      message,
      type,
      onClose,
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

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      showDialog(
        "Champs manquants",
        "L'email et le mot de passe sont obligatoires",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${REACT_APP_API_URL}/api/auth/login2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }); 
      const data = await response.json();
      if (response.ok) {
        showDialog(
          "Connexion réussie",
          "Vous êtes maintenant connecté",
          "success",
          () => navigation.navigate("Categories")
        );
      } else {
        throw new Error(data.message || "Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      showDialog(
        "Erreur",
        error.message || "Échec de la connexion",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>📱</Text>
        <Text style={styles.title}>Se connecter</Text>
      </View>

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
        style={styles.forgotPassword}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.signupLink}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.link}>
          Pas encore de compte ? Inscrivez-vous
        </Text>
      </TouchableOpacity>

      <Dialog.Container visible={dialog.visible}>
        <Dialog.Title
          style={
            dialog.type === "success"
              ? styles.successTitle
              : dialog.type === "error"
              ? styles.errorTitle
              : styles.defaultTitle
          }
        >
          {dialog.title}
        </Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          {dialog.message}
        </Dialog.Description>
        <Dialog.Button label="OK" onPress={hideDialog} />
      </Dialog.Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#4CAF50",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  signupLink: {
    marginTop: 20,
  },
  link: {
    textAlign: "center",
    color: "#007BFF",
    fontSize: 14,
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
});