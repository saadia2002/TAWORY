import React from 'react';
import { StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

const { width, height } = Dimensions.get('screen');

// Importation des images locales
import clientImage from '../constants/client.png';
import prestataireImage from '../constants/pres.png';

export default class Home extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        {/* Texte explicatif */}
        <Block style={styles.header}>
          <Text size={21} bold style={styles.title}>
            Choisissez votre rôle
          </Text>
          <Text muted size={17} style={styles.subtitle}>
            Réservez un service ou proposez le vôtre
          </Text>
        </Block>

        {/* Sections pour Client et Prestataire */}
        <Block flex style={styles.choices}>
          <TouchableOpacity
            style={styles.choice}
            onPress={() => navigation.navigate('Categories')}
          >
            <Image source={clientImage} style={styles.image} />
            <Text size={20} bold style={styles.choiceText}>
              Client
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.choice}
            onPress={() => navigation.navigate('Categories')}
          >
            <Image source={prestataireImage} style={styles.image} />
            <Text size={20} bold style={styles.choiceText}>
              Prestataire
            </Text>
          </TouchableOpacity>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: theme.COLORS.WHITE,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 4,
    color: theme.COLORS.BLACK,
  },
  subtitle: {
    textAlign: 'center',
    color: theme.COLORS.BLOCK,
  },
  choices: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  choice: {
    width: width * 0.85, // Cadre large
    backgroundColor: theme.COLORS.WHITE, // Fond blanc
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20, // Espacement entre les cadres
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 14, // Ombre plus marquée
  },
  image: {
    width: 160, // Image agrandie
    height: 160,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  choiceText: {
    color: theme.COLORS.BLACK,
    textAlign: 'center',
  },
});
