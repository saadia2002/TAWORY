import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  View,
  TouchableOpacity
} from 'react-native';
import { Block, Text, theme } from 'galio-framework';

const { width } = Dimensions.get('screen');
const CARD_WIDTH = (width - (theme.SIZES.BASE * 4)) / 2;

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
      const response = await fetch(`http://100.70.44.54:5000/api/services/services`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderServices = () => {
    const rows = [];
    for (let i = 0; i < services.length; i += 2) {
      rows.push(services.slice(i, i + 2));
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesContainer}
      >
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((service) => (
              <TouchableOpacity 
                key={service._id} 
                onPress={() => navigation.navigate('ServiceDetails', { serviceId: service._id })}
              >
                <Block style={styles.serviceCard}>
                  <Text size={16} style={styles.serviceName} numberOfLines={1}>
                    {service.name}
                  </Text>
                  <Text 
                    size={12} 
                    style={styles.serviceDescription}
                    numberOfLines={2}
                  >
                    {service.description}
                  </Text>
                  <Text size={14} style={styles.servicePrice}>
                    {service.price} €
                  </Text>
                </Block>
              </TouchableOpacity>
            ))}
            {row.length === 1 && <View style={styles.emptyCard} />}
          </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.SIZES.BASE,
  },
  serviceCard: {
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 12,
    padding: theme.SIZES.BASE,
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  emptyCard: {
    width: CARD_WIDTH,
  },
  serviceName: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  serviceDescription: {
    textAlign: 'center',
    marginBottom: 8,
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