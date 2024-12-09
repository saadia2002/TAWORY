import React, { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { useSafeArea } from "react-native-safe-area-context";

import { Icon, Drawer as DrawerCustomItem } from "../components/";
import { materialTheme } from "../constants/";
import { REACT_APP_API_URL } from "@env";

function CustomDrawerContent({
  drawerPosition,
  navigation,
  focused,
  state,
  ...rest
}) {
  const insets = useSafeArea();
  const screens = ["Home", "Profile", "Settings"];

  // État pour stocker les données utilisateur
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${REACT_APP_API_URL}/api/users/67435f93e583c8349d1a79df`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données:", error);
        setIsLoading(false); // Arrêter le chargement même en cas d'erreur
      });
  }, []);

  if (isLoading) {
    return (
      <Block flex center>
        <ActivityIndicator size="large" color={theme.COLORS.PRIMARY} />
      </Block>
    );
  }
  const avatar = user?.image
    ? `data:image/jpeg;base64,${user.image}`
    : "https://via.placeholder.com/150";

  // Valeurs par défaut si les données manquent
  // const  = user?.image || "https://via.placeholder.com/90"; // Image par défaut
  const name = user?.name || "John Doe";
  const email = user?.email || "johndoe@example.com";

  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block flex={0.25} style={styles.header}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Profile")}
        >
          <Block style={styles.profile}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text h5 color={"white"}>
              {name}
            </Text>
            <Text size={14} color={"white"}>
              {email}
            </Text>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
      <Block flex style={{ paddingLeft: 7, paddingRight: 14 }}>
        <ScrollView
          contentContainerStyle={[
            {
              paddingTop: insets.top * 0.4,
              paddingLeft: drawerPosition === "left" ? insets.left : 0,
              paddingRight: drawerPosition === "right" ? insets.right : 0,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
          <DrawerCustomItem
            title="Sign In"
            navigation={navigation}
            focused={state.index === screens.length ? true : false}
          />
          <DrawerCustomItem
            title="Sign Up"
            navigation={navigation}
            onPress={() => navigation.navigate("Sign Up")} // Naviguer vers votre nouvelle page
          />
        </ScrollView>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#4B1958",
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 2,
    justifyContent: "center",
    alignItems: "center",
  },
  profile: {
    alignItems: "center",
    marginBottom: theme.SIZES.BASE / 2,
  },
  avatar: {
    height: 90,
    width: 90,
    borderRadius: 50,
    marginBottom: theme.SIZES.BASE,
  },
});

export default CustomDrawerContent;
