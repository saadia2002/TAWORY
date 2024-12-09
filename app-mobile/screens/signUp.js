// import React, { useState } from 'react';
// import { 
//   StyleSheet, 
//   View, 
//   TextInput, 
//   TouchableOpacity, 
//   Text, 
//   Alert, 
//   ScrollView, 
//   Image,
//   Platform,
//   Pressable,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { Picker } from 'react-native';

// export default function SignUp({ navigation }) {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'client',
//     dateOfBirth: '',
//     image: '',
//     logo: '',
//   });
//   const [previewImage, setPreviewImage] = useState(null);
//   const [previewLogo, setPreviewLogo] = useState(null);

//   const handleInputChange = (field, value) => {
//     setForm({ ...form, [field]: value });
//   };

//   const openDatePicker = () => {
//     // Sur iOS, on ouvre un modal avec un picker de date
//     if (Platform.OS === 'ios') {
//       // Implementation spécifique iOS si nécessaire
//     } else {
//       // Sur Android, on ouvre le sélecteur de date natif
//       try {
//         const today = new Date();
//         const minDate = new Date();
//         minDate.setFullYear(today.getFullYear() - 100); 
//         const maxDate = new Date();
//         maxDate.setFullYear(today.getFullYear() - 18);

//         const options = {
//           value: maxDate,
//           mode: 'date',
//           display: 'spinner',
//           onChange: (event, selectedDate) => {
//             if (selectedDate) {
//               handleInputChange('dateOfBirth', selectedDate.toISOString().split('T')[0]);
//             }
//           },
//           minimumDate: minDate,
//           maximumDate: maxDate,
//         };
        
//         // Utilisez l'API native du système pour ouvrir le sélecteur de date
//         if (Platform.OS === 'android') {
//           const DateTimePickerAndroid = require('@react-native-community/datetimepicker').default;
//           DateTimePickerAndroid.open(options);
//         }
//       } catch (error) {
//         console.error('Error opening date picker:', error);
//       }
//     }
//   };

//   const pickImage = async (type) => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
//     if (status !== 'granted') {
//       Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à la galerie.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//       base64: true,
//     });

//     if (!result.canceled) {
//       if (type === 'profile') {
//         setForm({ ...form, image: result.assets[0].base64 });
//         setPreviewImage(result.assets[0].base64);
//       } else {
//         setForm({ ...form, logo: result.assets[0].base64 });
//         setPreviewLogo(result.assets[0].base64);
//       }
//     }
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.email || !form.password || !form.role || !form.dateOfBirth || !form.image) {
//       Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
//       return;
//     }

//     try {
//       const response = await fetch(`${REACT_APP_API_URL}/api/users/signup`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(form),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert('Succès', 'Inscription réussie !');
//         navigation.navigate('Login');
//       } else {
//         Alert.alert('Erreur', data.message || 'Une erreur est survenue.');
//       }
//     } catch (error) {
//       console.error('Error signing up:', error);
//       Alert.alert('Erreur', 'Impossible de terminer l\'inscription.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.logoContainer}>
//         {previewLogo ? (
//           <Image
//             source={{ uri: `data:image/jpeg;base64,${previewLogo}` }}
//             style={styles.logoImage}
//           />
//         ) : (
//           <TouchableOpacity onPress={() => pickImage('logo')} style={styles.logoUpload}>
//             <Text style={styles.uploadText}>Ajouter le logo de l'entreprise</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <Text style={styles.title}>Créer un compte</Text>
      
//       <TextInput
//         style={styles.input}
//         placeholder="Nom"
//         value={form.name}
//         onChangeText={(text) => handleInputChange('name', text)}
//       />
      
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={form.email}
//         onChangeText={(text) => handleInputChange('email', text)}
//       />

//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={form.role}
//           onValueChange={(value) => handleInputChange('role', value)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Client" value="client" />
//           <Picker.Item label="Prestataire" value="prestataire" />
//         </Picker>
//       </View>

//       <Pressable 
//         style={styles.dateInput}
//         onPress={openDatePicker}
//       >
//         <Text style={styles.dateText}>
//           {form.dateOfBirth || 'Sélectionner la date de naissance'}
//         </Text>
//       </Pressable>

//       <View style={styles.imageUploadContainer}>
//         <Text style={styles.uploadText}>Photo de profil</Text>
//         <Pressable onPress={() => pickImage('profile')}>
//           <Text style={styles.uploadButton}>Upload file</Text>
//         </Pressable>
//       </View>

//       {previewImage && (
//         <Image
//           source={{ uri: `data:image/jpeg;base64,${previewImage}` }}
//           style={styles.previewImage}
//         />
//       )}

//       <TextInput
//         style={styles.input}
//         placeholder="Mot de passe"
//         secureTextEntry
//         value={form.password}
//         onChangeText={(text) => handleInputChange('password', text)}
//       />
      
//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>S'inscrire</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//         <Text style={styles.link}>Vous avez déjà un compte ? Connectez-vous</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logoUpload: {
//     borderWidth: 2,
//     borderColor: '#ccc',
//     borderStyle: 'dashed',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logoImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//   },
//   dateInput: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//   },
//   dateText: {
//     color: '#000',
//   },
//   imageUploadContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   uploadText: {
//     marginRight: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   uploadButton: {
//     color: '#007BFF',
//     textDecorationLine: 'underline',
//   },
//   previewImage: {
//     width: 100,
//     height: 100,
//     marginBottom: 15,
//     borderRadius: 8,
//     alignSelf: 'center',
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   link: {
//     marginTop: 15,
//     textAlign: 'center',
//     color: '#007BFF',
//     textDecorationLine: 'underline',
//   },
// });