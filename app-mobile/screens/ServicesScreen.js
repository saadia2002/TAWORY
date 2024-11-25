import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  View,
  TouchableOpacity
} from 'react-native';
import { Block, Text, theme } from 'galio-framework';

export default function ServicesScreen({ navigation, route }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const { categoryId } = route.params;

  useEffect(() => {
    fetchServices();
  }, [categoryId]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://100.89.163.214:5000/api/services/services2`);
      const data = await response.json();

      // Transform the service data to include provider details
      const updatedServices = data.map((service) => ({
        ...service,
        providerImage: service.serviceProvider?.image || '', // Assurez-vous que le backend envoie cette information en base64
        providerName: service.serviceProvider?.name || 'Unknown',
      }));
      setServices(updatedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderServices = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesContainer}
      >
        {services.map((service) => (
          <TouchableOpacity 
            key={service._id} 
            onPress={() => navigation.navigate('ServiceDetails', { serviceId: service._id })}
          >
            <Block style={styles.serviceCard}>
              <View style={styles.imageContainer}>
                {service.providerImage ? (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${service.providerImage}` }}
                    style={styles.providerImage}
                  />
                ) : (
                  <Text style={styles.imagePlaceholder}>No Image</Text>
                )}
              </View>
              <View style={styles.serviceDetails}>
                <Text size={16} style={styles.serviceName} numberOfLines={1}>
                  {service.name}
                </Text>
                <Text size={12} style={styles.serviceDescription} numberOfLines={2}>
                  {service.description}
                </Text>
                <Text size={14} style={styles.providerName}>
                  Provider: {service.providerName}
                </Text>
                <Text size={14} style={styles.servicePrice}>
                  {service.price} €
                </Text>
              </View>
            </Block>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <Block flex>
      {loading ? (
        <ActivityIndicator size="large" color={theme.COLORS.PRIMARY} style={styles.loader} />
      ) : (
        renderServices()
      )}
    </Block>
  );
}

const styles = StyleSheet.create({
  servicesContainer: {
    padding: theme.SIZES.BASE,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 12,
    padding: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.MUTED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    color: theme.COLORS.WHITE,
    fontSize: 10,
    textAlign: 'center',
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDescription: {
    color: theme.COLORS.MUTED,
    marginBottom: 4,
  },
  providerName: {
    fontStyle: 'italic',
    color: theme.COLORS.MUTED,
    marginBottom: 4,
  },
  servicePrice: {
    fontWeight: 'bold',
    color: theme.COLORS.PRIMARY,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
