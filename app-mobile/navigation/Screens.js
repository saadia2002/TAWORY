import { Animated, Dimensions, Easing } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { Header, Icon } from "../components";
import { Images, materialTheme } from "../constants/";

import ComponentsScreen from "../screens/Components";
import CustomDrawerContent from "./Menu";
import HomeScreen from "../screens/Home";
import OnboardingScreen from "../screens/Onboarding";
import ProScreen from "../screens/Pro";
import ProfileScreen from "../screens/Profile";
import React from "react";
import SettingsScreen from "../screens/Settings";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import CategoriesScreen from "../screens/Categories";
import AddServiceScreen from "../screens/AddService";
import ServicesListScreen from "../screens/ServicesList";
import CategoriesPScreen from "../screens/CategoriesP";
import SignUp from "../screens/signUp";
import SingIn from "../screens/signIn";
import ServicesScreen from "../screens/ServicesScreen";
import ReservationScreen from "../screens/ReservationScreen";
import ChatbotScreen from "../screens/chatbot";
import ReservationsScreen from "../screens/Reservations";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const profile = {
  avatar: Images.Profile,
  name: "Rachel Brown",
  type: "Seller",
  plan: "Pro",
  rating: 4.8,
};
// Dans votre fichier de navigation
// import ServiceDetailsScreen from '../screens/ServiceDetailsScreen'; // À créer plus tard

// // Dans votre CategoriesStack, ajoutez les nouveaux écrans
// function CategoriesStack(props) {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         mode: "card",
//         headerShown: "screen",
//       }}
//     >
//       <Stack.Screen
//         name="Categories"
//         component={CategoriesScreen}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header
//               title="Categories"
//               scene={scene}
//               navigation={navigation}
//             />
//           ),
//         }}
//       />
//       <Stack.Screen
//         name="Services"
//         component={ServicesScreen}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header
//               back
//               title="Services"
//               scene={scene}
//               navigation={navigation}
//             />
//           ),
//         }}
//       />
//       <Stack.Screen
//         name="ServiceDetails"
//         component={ServiceDetailsScreen}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header
//               back
//               title="Service Details"
//               scene={scene}
//               navigation={navigation}
//             />
//           ),
//         }}
//       />
//     </Stack.Navigator>
//   );
// }
// Ajout du nouveau Stack pour Categories
function CategoriesStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Categories" scene={scene} navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="CategoriesP"
        component={CategoriesPScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Choisissez la catégorie du service :"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Reservations"
        component={ReservationsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Mes Reservations"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      />
      <Stack.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Complétez les infos de votre service :"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ServiceList"
        component={AddServiceScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Complétez les infos de votre service :"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      />

      <Stack.Screen
        name="ServicesList"
        component={ServicesListScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Liste des Services"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      /> 
      <Stack.Screen
      name="Services"
      component={ServicesScreen}
      options={{
        header: ({ navigation, scene }) => (
          <Header
            back
            title="Services"
            scene={scene}
            navigation={navigation}
          />
        ),
      }}
    />
      <Stack.Screen
        name="Reservation"
        component={ReservationScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Reservation"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

// Les autres stacks restent inchangés...
function ProfileStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              white
              transparent
              title="Profile"
              scene={scene}
              navigation={navigation}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Settings" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function ComponentsStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Components"
        component={ComponentsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Components" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              tabs
              title="Home"
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Pro"
        component={ProScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=""
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} profile={profile} />
      )}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintColor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: materialTheme.COLORS.ACTIVE,
        inactiveBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.74,
          paddingHorizontal: 12,
          justifyContent: "center",
          alignContent: "center",
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          fontWeight: "normal",
        },
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="shop"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      {/* Ajout de la nouvelle route Categories */}
      <Drawer.Screen
        name="Categories"
        component={CategoriesStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="grid"
              family="feather"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Woman"
        component={ProScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="md-woman"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginLeft: 4, marginRight: 4 }}
            />
          ),
        }}
      />
      {/* Le reste des Drawer.Screen reste inchangé... */}
      <Drawer.Screen
        name="Man"
        component={ProScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="man"
              family="entypo"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Kids"
        component={ProScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="baby"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="New Collection"
        component={ProScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="grid-on"
              family="material"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="circle-10"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="gears"
              family="font-awesome"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginRight: -3 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Components"
        component={ComponentsStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="md-switch"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginRight: 2, marginLeft: 2 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Sign In"
        component={SingIn}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="ios-log-in"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Sign Up"
        component={SignUp}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Sign Up"
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
      <Stack.Screen
        name="chatbot"
        component={ChatbotScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Chatbot"
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
      
    </Drawer.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}
