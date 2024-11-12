import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  View,
} from 'react-native';
import { Block, Text, theme } from 'galio-framework';

const { width } = Dimensions.get('screen');
const CARD_WIDTH = (width - (theme.SIZES.BASE * 4)) / 2;

export default function Categories({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://100.70.44.126:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.log('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategories = () => {
    // Grouper les catégories par paires
    const rows = [];
    for (let i = 0; i < categories.length; i += 2) {
      rows.push(categories.slice(i, i + 2));
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((category) => (
              <Block key={category._id} style={styles.categoryCard}>
                {category.icon && (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${category.icon}` }}
                    style={styles.categoryIcon}
                  />
                )}
                {!category.icon && (
                  <View style={[styles.categoryIcon, styles.placeholderIcon]}>
                    <Text size={20} color={theme.COLORS.MUTED}>
                      {category.name.charAt(0)}
                    </Text>
                  </View>
                )}
                <Text size={16} style={styles.categoryName} numberOfLines={1}>
                  {category.name}
                </Text>
                <Text 
                  size={12} 
                  color={theme.COLORS.MUTED} 
                  style={styles.categoryDescription}
                  numberOfLines={2}
                >
                  {category.description}
                </Text>
              </Block>
            ))}
            {/* Ajouter un bloc vide si la dernière ligne n'a qu'une seule catégorie */}
            {row.length === 1 && <View style={styles.emptyCard} />}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <Block flex>
      <Block style={styles.header}>
        <Text h5 style={styles.headerTitle}>Catégories</Text>
      </Block>
      {loading ? (
        <ActivityIndicator size="large" color={theme.COLORS.PRIMARY} style={styles.loader} />
      ) : (
        renderCategories()
      )}
    </Block>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 3,
    paddingBottom: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  headerTitle: {
    fontWeight: '600',
    textAlign: 'center'
  },
  categoriesContainer: {
    padding: theme.SIZES.BASE,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.SIZES.BASE,
  },
  categoryCard: {
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 12,
    padding: theme.SIZES.BASE,
    width: CARD_WIDTH,
    alignItems: 'center',
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
    aspectRatio: 1, // Rend la carte carrée
  },
  emptyCard: {
    width: CARD_WIDTH,
  },
  categoryIcon: {
    width: CARD_WIDTH * 0.5,
    height: CARD_WIDTH * 0.5,
    borderRadius: (CARD_WIDTH * 0.5) / 2,
    marginBottom: theme.SIZES.BASE,
  },
  placeholderIcon: {
    backgroundColor: theme.COLORS.GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryDescription: {
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});