import * as React from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// import Header from "./shared/header";

import Welcome from "./Views/Welcome";
import Login from "./Views/Login";
import Signup from "./Views/Signup";
import Home from "./Views/Home";
import Profile from "./Views/Profile";
import ScanQR from "./Views/ScanQR";
import AddRecord from "./Views/AddRecord";
import History from "./Views/History";



const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            title: "Welcome",
            headerTitleAlign: "center",
            backgroundColor: "#E1E9EA",
            headerShown: false,
            headerStyle: {
              backgroundColor: "#154360",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              color: "white",
              fontWeight: "bold",
              alignItems: "center",
            },
          }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: "Login",
            backgroundColor: "#E1E9EA",
            headerStyle: {
              backgroundColor: "#273157",
            },
            headerTitleAlign: "center",
            headerTintColor: "#fff",
            headerTitleStyle: {
              color: "white",
              fontWeight: "bold",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        />

        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            title: "Profile",
            headerLeft: null,
            headerTitleAlign: "center",
            backgroundColor: "#E1E9EA",

            headerStyle: {
              backgroundColor: "#273157",
              height: 70,
            },

            headerTintColor: "#fff",
            headerShown: false,
            headerTitleStyle: {
              color: "white",
              fontSize: 28,
              fontWeight: "700",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        />

        <Stack.Screen
          name="SignUp"
          component={Signup}
          options={{
            title: "SignUp",
            headerTitleAlign: "center",
            backgroundColor: "#E1E9EA",
            headerStyle: {
              backgroundColor: "#273157",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              color: "white",
              fontWeight: "bold",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Home",
            headerShown: false,
            headerTitleAlign: "center",
            backgroundColor: "#E1E9EA",
            headerStyle: {
              backgroundColor: "#273157",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              color: "white",
              fontWeight: "bold",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        />

  <Stack.Screen
            name="History"
            component={History}
            options={{
              title: "Booking Profile",
              headerShown: true,
              headerTitleAlign: "center",
              backgroundColor: "#E1E9EA",
              headerStyle: {
                backgroundColor: "#273157",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                color: "white",
                fontWeight: "bold",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          />

        <Stack.Screen
          name="Scan"
          component={ScanQR}
          options={{
            title: "Scan",
            headerShown: true,
            headerTitleAlign: "center",
            backgroundColor: "#E1E9EA",
            headerStyle: {
              backgroundColor: "#273157",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              color: "white",
              fontWeight: "bold",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        />

<Stack.Screen
          name="AddRecord"
          component={AddRecord}
          options={{
            title: "Add Record",
            headerShown: true,
            headerTitleAlign: "center",
            backgroundColor: "#E1E9EA",
            headerStyle: {
              backgroundColor: "#273157",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              color: "white",
              fontWeight: "bold",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
