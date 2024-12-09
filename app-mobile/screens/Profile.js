import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Block, Text, Button, theme } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";

import { REACT_APP_API_URL } from "@env";
import { Icon } from "../components";
import { materialTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    fetch(`${REACT_APP_API_URL}/api/users/67435f93e583c8349d1a79df`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ user: data, isLoading: false });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données:", error);
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { user, isLoading } = this.state;

    const name = user?.name || "Rachel Brown";
    const role = user?.role || "Seller";
    const dateOfBirth = user?.dateOfBirth;
    const email = user?.email || "Los Angeles, CA";
    const rating = user?.rating || 4.8;
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Intl.DateTimeFormat("en-US", options).format(
        new Date(dateString)
      );
    };

    const imageBase64 = user?.image
      ? `data:image/jpeg;base64,${user.image}`
      : "https://via.placeholder.com/150";

    if (isLoading) {
      return (
        <Block flex center>
          <ActivityIndicator size="large" color={theme.COLORS.PRIMARY} />
        </Block>
      );
    }

    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={{ uri: imageBase64 }}
            style={styles.profileContainer}
            imageStyle={styles.profileImage}
          >
            <Block flex style={styles.profileDetails}>
              <Block style={styles.profileTexts}>
                <Text color="white" size={25} style={{ paddingBottom: 8 }}>
                  {name}
                </Text>
                <Block row space="between">
                  <Block row>
                    <Text size={20} color={materialTheme.COLORS.WARNING}>
                      {rating}{" "}
                      <Icon name="star" family="font-awesome" size={20} />
                    </Text>
                  </Block>
                  <Block>
                    <Text color={theme.COLORS.MUTED} size={20}>
                      <Icon
                        name="envelope"
                        family="font-awesome"
                        color={theme.COLORS.MUTED}
                        size={20}
                      />
                      {``} {email}
                    </Text>
                  </Block>
                </Block>
              </Block>
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
                style={styles.gradient}
              />
            </Block>
          </ImageBackground>
        </Block>
        <Block flex style={styles.options}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Block row space="between" style={{ padding: theme.SIZES.BASE }}>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 8 }}>
                  <Icon
                    name="envelope"
                    family="font-awesome"
                    color={theme.COLORS.MUTED}
                    size={20}
                  />
                  {` `} {email}
                </Text>
                <Text muted size={15}>
                  Email
                </Text>
              </Block>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 8 }}>
                  <Icon
                    name="calendar"
                    family="font-awesome"
                    color={theme.COLORS.MUTED}
                    size={16}
                  />
                  {` `} {formatDate(user?.dateOfBirth)}
                </Text>
                <Text muted size={15}>
                  Date Of Birth
                </Text>
              </Block>
            </Block>
            <Block middle style={{ marginVertical: theme.SIZES.BASE }}>
              <Button
                onlyIcon
                icon="plus"
                iconFamily="font-awesome"
                iconSize={30}
                color="#c76cd9"
                style={{ width: 40, height: 40 }}
              />
               <Text bold size={12} style={{ marginBottom: 8 }}>
                  Ajouter une service
                </Text>
            </Block>
            <Text bold size={16} style={{ marginTop: 20, marginLeft: theme.SIZES.BASE }}>
              Mes services
            </Text>
          </ScrollView>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    marginBottom: -HeaderHeight * 2,
  },
  profileImage: {
    width: width * 1.1,
    height: "auto",
  },
  profileContainer: {
    width: width,
    height: height / 2,
  },
  profileDetails: {
    paddingTop: theme.SIZES.BASE * 4,
    justifyContent: "flex-end",
    position: "relative",
  },
  profileTexts: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
    zIndex: 2,
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: theme.SIZES.BASE / 2,
  },
  options: {
    position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE * 7,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: "30%",
    position: "absolute",
  },
});
