import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import Dialog from "react-native-dialog";
import { Block, Text, theme } from "galio-framework";
import { REACT_APP_API_URL } from "@env";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ServicesList({ navigation, route }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});
  const categoryId = route.params?.categoryId;
  const serviceProvider = "67435f93e583c8349d1a79df";
  const [dialogVisible, setDialogVisible] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null); // Stocke l'ID du service à supprimer

  useEffect(() => {
    fetchServices();
  }, [categoryId]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${REACT_APP_API_URL}/api/services/services`
      );
      const data = await response.json();

      const filteredServices = categoryId
        ? data.filter((service) => service.serviceProvider === serviceProvider)
        : data;

      setServices(filteredServices);

      // Charger les catégories pour chaque service
      fetchCategoriesForServices(filteredServices);
    } catch (err) {
      setError("Erreur lors du chargement des services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (service) => {
    navigation.navigate("EditService", { service });
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await fetch(
        `${REACT_APP_API_URL}/api/services/services/${serviceToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setDialogVisible(false);
        setServiceToDelete(null);
        fetchServices();
      } else {
        Alert.alert("Erreur", "Impossible de supprimer le service");
      }
    } catch (err) {
      Alert.alert("Erreur", "Une erreur s'est produite");
    }
  };

  const showDeleteDialog = (serviceId) => {
    setServiceToDelete(serviceId);
    setDialogVisible(true);
    console.log("Dialog visible:", dialogVisible); // Vérifiez si cela passe à true
  };

  const hideDialog = () => {
    setDialogVisible(false);
    setServiceToDelete(null);
  };

  const fetchCategoriesForServices = async (services) => {
    try {
      const categoriesMap = {};
      for (const service of services) {
        if (service.category) {
          const response = await fetch(
            `${REACT_APP_API_URL}/api/categories/${service.category}`
          );
          const categoryData = await response.json();
          categoriesMap[service.category] = categoryData;
        }
      }
      setCategories(categoriesMap);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories :", err);
    }
  };

  const renderServiceCard = (service) => {
    const category = categories[service.category] || {
      name: "Catégorie inconnue",
      icon: null,
    };
    const iconUri = category.icon
      ? `data:image/jpeg;base64,${category.icon}`
      : null;

    return (
      <View key={service._id} style={styles.serviceCard}>
        <View style={styles.serviceHeader}>
          {iconUri ? (
            <Image source={{ uri: iconUri }} style={styles.categoryIcon} />
          ) : (
            <View style={[styles.categoryIcon, styles.placeholderIcon]}>
              <Text size={20}>{category.name.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name || "Sans nom"}</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
          </View>
          <Text style={styles.servicePrice}>{service.price} DH</Text>
        </View>

        <Text style={styles.serviceDescription}>
          {service.description || "Aucune description"}
        </Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(service)}
          >
            <Icon name="edit" size={20} color="#fff" />
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => showDeleteDialog(service._id)}
          >
            <Icon name="delete" size={20} color="#fff" />
            <Text style={styles.buttonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <Block flex middle>
        <ActivityIndicator size="large" color={theme.COLORS.PRIMARY} />
      </Block>
    );
  }

  if (error) {
    return (
      <Block flex middle>
        <Text>{error}</Text>
      </Block>
    );
  }

  return (
    <Block flex>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {services.length === 0 ? (
          <Text style={styles.noServices}>Aucun service trouvé</Text>
        ) : (
          services.map(renderServiceCard)
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Categories")}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Dialog.Container
        contentStyle={styles.dialogContainer}
        visible={dialogVisible}
      >
        <Dialog.Title style={styles.dialogTitle}>Confirmation</Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          Voulez-vous vraiment supprimer ce service ?
        </Dialog.Description>
        <View style={styles.dialogButtonsContainer}>
          <TouchableOpacity
            style={[styles.dialogButton, styles.cancelButton]}
            onPress={hideDialog}
          >
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialogButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </Dialog.Container>
    </Block>
  );
}

const styles = StyleSheet.create({
  dialogContainer: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  dialogDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  dialogButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialogButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    padding: theme.SIZES.BASE,
  },
  serviceCard: {
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 8,
    padding: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.SIZES.BASE,
  },
  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: theme.SIZES.BASE,
  },
  placeholderIcon: {
    backgroundColor: theme.COLORS.GREY,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: theme.COLORS.GRAY,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#17611b",
  },
  serviceDescription: {
    fontSize: 14,
    color: theme.COLORS.GRAY,
    marginBottom: theme.SIZES.BASE,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: theme.SIZES.BASE,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: "#17611b",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: theme.COLORS.WHITE,
    marginLeft: 4,
  },
  addButton: {
    position: "absolute",
    right: theme.SIZES.BASE * 2,
    bottom: theme.SIZES.BASE * 2,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#17611b",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 8,
  },
  noServices: {
    textAlign: "center",
    fontSize: 16,
    color: theme.COLORS.GRAY,
    marginTop: theme.SIZES.BASE * 2,
  },
});
