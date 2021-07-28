import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, Image, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import Spinner from "react-native-loading-spinner-overlay";
// You can then use your `FadeInView` in place of a `View` in your components:
export default ({ navigation }) => {
  const [processing, setProcessing] = useState(false);
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");

  const getData = async () => {
    try {
      const localEmail = await AsyncStorage.getItem("email");
      const localPass = await AsyncStorage.getItem("password");

      if (
        localEmail !== null &&
        localPass !== null &&
        localEmail === email &&
        localPass === password
      ) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log("Error in Getting Data");
    }
  };

  const loginBtn = async () => {
    try {
      setProcessing(true);
      var seed = await fetch(
        `https://iota-parking.herokuapp.com/getSeed/${cnic}&${password}`
      );
      var parsedSeed = await seed.json();
      if (parsedSeed[0]) {
        await AsyncStorage.setItem("seed", parsedSeed[1].SEED);
        await AsyncStorage.setItem("seedInfo", JSON.stringify(parsedSeed[1]));
        var doctorAddress = await fetch(
          `https://iota-parking.herokuapp.com/getAlphaAddress/${parsedSeed[1].SEED}`
        );
        doctorAddress = await doctorAddress.json();
        await AsyncStorage.setItem("address", doctorAddress.ADDRESS);
        setProcessing(false);
        navigation.navigate("Home");
      } else {
        setProcessing(false)
        alert("Login Failed");
      }
    } catch (e) {
      setProcessing(false);
      alert("Error While Loggin In");
      console.log("Error in Logging In ", e);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={processing}
        textStyle={[styles.text, { color: "white" }]}
        textContent={"Please Wait while You Are Logged In"}
      />
      <Text
        style={[
          styles.text,
          {
            fontSize: 20,
            fontWeight: "700",
            position: "absolute",
            top: 50,
          },
        ]}
      >
        Please Fill Below Information
      </Text>
      <View style={{ zIndex: 1, width: "80%" }}>
        <Input
          placeholder="CNIC Without Dashes"
          keyboardType="numeric"
          label="CNIC"
          onChangeText={(value) => setCnic(value)}
          style={styles.input}
        />

        <Input
          label="Password"
          placeholder="Password"
          style={styles.input}
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
        />

        <Button
          icon={
            <Icon
              name="sign-in-alt"
              size={20}
              color="white"
              solid
              style={{ position: "absolute", right: 20 }}
            />
          }
          iconRight
          buttonStyle={[styles.button, { alignSelf: "center" }]}
          title="Login"
          onPress={async () => await loginBtn()}
        ></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3E50",
    alignItems: "center",
    justifyContent: "center",
    margin:'auto',
    paddingTop: 0,
    paddingHorizontal: 0,
    borderWidth: 0,
    borderColor: "#273157",
    zIndex:2
  },
  image: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    zIndex: 0,
  },
  button: {
    backgroundColor: "#196F3D",
    color: "white",
    width: 150,
    height:40,
    margin: 5,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "#52BE80",
  },
  btnText:{
    position:'absolute',
    left:20
  },
  text: {
    // fontFamily: "Varela",
    color: "#F0F3F4",
    textAlign: "center",
    fontSize: 20,
  },
  input: {
    borderRadius: 90,
    borderColor: "#D3D4D5",
    borderWidth: 2,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
