import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Image,
  RefreshControl
} from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { REACT_APP_API_URL } from "@env";
import { Icon } from "../components";
import { materialTheme } from "../constants";

export default class Reservations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reservations: [],
      isLoading: true,
      refreshing: false,
      clientDetails: {},
    };
  }

  componentDidMount() {
    this.fetchReservations();
  }

  fetchReservations = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_URL}/api/reservations`);
      const data = await response.json();
      this.setState({ reservations: data });
      this.fetchClientDetails();
      this.setState({ isLoading: false });
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      this.setState({ isLoading: false });
    }
  };

  fetchClientDetails = async () => {
    try {
      const clientId = "67459d2ada2477563583432a"; // ID client fixe
      const response = await fetch(`${REACT_APP_API_URL}/api/users/${clientId}`);
      const data = await response.json();
      
      this.setState(prevState => ({
        clientDetails: {
          ...prevState.clientDetails,
          [clientId]: data
        }
      }));
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.fetchReservations();
    this.setState({ refreshing: false });
  };

  formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return materialTheme.COLORS.SUCCESS;
      case 'pending':
        return materialTheme.COLORS.WARNING;
      case 'cancelled':
        return materialTheme.COLORS.ERROR;
      default:
        return materialTheme.COLORS.MUTED;
    }
  };

  getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  renderReservation = (reservation) => {
    const clientId = "67459d2ada2477563583432a"; // ID client fixe
    const clientDetails = this.state.clientDetails[clientId] || {};
    const isSpecificClient = reservation.client === clientId;
    const imageBase64 = clientDetails.image 
      ? `data:image/jpeg;base64,${clientDetails.image}`
      : "https://via.placeholder.com/150";

    return (
      <Block card shadow style={styles.reservationCard} key={reservation._id}>
        {isSpecificClient && (
          <Block style={styles.specialClientBadge}>
            <Text color={theme.COLORS.WHITE}>Client Spécial</Text>
          </Block>
        )}
        
        <Block row style={styles.clientInfo}>
          <Image
            source={{ uri: imageBase64 }}
            style={styles.clientImage}
          />
          <Block flex>
            <Text size={16} bold>{clientDetails.name || 'Client'}</Text>
            <Text size={14} muted>{clientDetails.email || 'Email non disponible'}</Text>
          </Block>
        </Block>

        <Block style={styles.reservationDetails}>
          <Block row space="between" style={styles.detailRow}>
            <Text size={14}>Date:</Text>
            <Text size={14} bold>{this.formatDate(reservation.date)}</Text>
          </Block>

          <Block row space="between" style={styles.detailRow}>
            <Text size={14}>Lieu:</Text>
            <Text size={14} bold>{reservation.lieu || 'Non spécifié'}</Text>
          </Block>

          <Block row space="between" style={styles.detailRow}>
            <Text size={14}>Téléphone:</Text>
            <Text size={14} bold>{reservation.telephone || 'Non spécifié'}</Text>
          </Block>

          <Block row space="between" style={styles.detailRow}>
            <Text size={14}>Statut:</Text>
            <Text 
              size={14} 
              bold 
              color={this.getStatusColor(reservation.status)}
            >
              {this.getStatusText(reservation.status)}
            </Text>
          </Block>
        </Block>
      </Block>
    );
  };

  render() {
    const { isLoading, reservations, refreshing } = this.state;

    if (isLoading) {
      return (
        <Block flex center>
          <ActivityIndicator size="large" color={theme.COLORS.PRIMARY} />
        </Block>
      );
    }

    return (
      <Block flex style={styles.container}>
        <Block flex style={styles.header}>
          <Text h5>Mes Réservations</Text>
          <Text muted size={14}>
            {reservations.length} réservation(s) au total
          </Text>
        </Block>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <Block style={styles.reservationsContainer}>
            {reservations.map(this.renderReservation)}
          </Block>
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.WHITE,
    paddingHorizontal: theme.SIZES.BASE,
  },
  header: {
    paddingVertical: theme.SIZES.BASE * 2,
  },
  reservationsContainer: {
    paddingBottom: theme.SIZES.BASE * 4,
  },
  reservationCard: {
    padding: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
  },
  specialClientBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: materialTheme.COLORS.INFO,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    zIndex: 1,
  },
  clientInfo: {
    marginBottom: theme.SIZES.BASE,
  },
  clientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.SIZES.BASE,
  },
  reservationDetails: {
    marginTop: theme.SIZES.BASE,
  },
  detailRow: {
    marginBottom: theme.SIZES.BASE / 2,
    alignItems: 'center',
  },
});