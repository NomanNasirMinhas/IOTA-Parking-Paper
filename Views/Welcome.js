import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, Image, StyleSheet, Alert } from "react-native";
import { SimpleAnimation } from "react-native-simple-animations";
import { ScrollView } from "react-native-gesture-handler";
import Spinner from "react-native-loading-spinner-overlay";
import {
  Card,
  ListItem,
  Button,
  // Icon,
  Overlay,
  Divider,
  Avatar,
  Input
} from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { QRCode } from "react-native-custom-qr-codes-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

// You can then use your `FadeInView` in place of a `View` in your components:
export default ({ navigation }) => {
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDOB] = useState("");
  const [idnum, setIDnum] = useState("");
  const [placeofbirth, setPlaceOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [residence, setResidence] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [visible, setVisible] = useState(false);
  const [hash, setHash] = useState("");
  const [hasData, setHasData] = useState(false);
  const [ins_Status, setInsStatus] = useState(0);
  const [in_CNIC, setIN_CNIC] = useState("");
  const [in_ID, setInID] = useState("");
  const [processing, setProcessing] = useState(false);
  var profile = {
    FirstName: fname,
    LastName: sname,
    Email: email,
    DateOfBirth: dob,
    GovernmentID: idnum,
    PlaceOfBirth: placeofbirth,
    Nationality: nationality,
    CountryOfResidence: residence,
    ResidentialAddress: address,
    ContactNumber: phone,
  };
  useEffect(() => {
    (async () => {
  let { status } = await Location.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied');
  }
  setProcessing(true);
  await fetch(`https://iota-parking.herokuapp.com/`);
  setProcessing(false);


})();
}, []);

const addCredit = async () => {
  setProcessing(true);
  await fetch(
    "https://iota-parking.herokuapp.com/sendTx/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seed: "XANZDGBBKGI9PAAPLU9GEAKWEG9GNEUEQDLXRQAXBTRWTQ9L99JJ9WNPEZXBSJ9UJYEHNZDJHAB99INLI",
        address: "WE9WZMIJRCCYHQAGHDASCRXOOOTOIYNIDEKIBXDSDOHLIOD9UZBIMDCETNEYZKYNDK9ZJJ9JDQEX9SYPX",
        txType: "credit",
        Data: JSON.stringify({
          credit: 100
        }),
      }),
    }
  );
  console.log("Credit Added");
  setProcessing(false);
}

  const handleAddData = async () => {
    try {
      setProcessing(true);
      // setInsStatus(0);
      let res = await fetch(`https://iota-parking.herokuapp.com/addProviders/`);
      res = await res.json()
      console.log("Data Added=", res);

      setProcessing(false);
    } catch (e) {
      setProcessing(false);
      console.log(e);
    }
  };

  const handleSubmit = async () => {
    try {
      setProcessing(true);
      // setInsStatus(0);
      var profileData = await fetch(`https://iota-parking.herokuapp.com/getSeed/${in_CNIC}&${in_ID}`);
      profileData = await profileData.json();
      // console.log("Profile Res = ", profileData[1].Profile);

      var address = await fetch(`https://iota-parking.herokuapp.com/getAddressAdmin/${in_CNIC}&${in_ID}`);
      address = await address.json();
      // console.log("Address Res = ", address);
      if (address != false && profileData != false){
        console.log("Login Successful");
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.LocationAccuracy.BestForNavigation,
        });
        // console.log("Location = ", loc.coords);
        let locArr = [loc.coords.longitude, loc.coords.latitude];
        // setLocation(locArr);
        var addLoc = await fetch(
          `https://iota-parking.herokuapp.com/addLocation/${address[0]}&${loc.coords.longitude}&${loc.coords.latitude}`
        );
        var nearbyLoc = await fetch(
          `https://iota-parking.herokuapp.com/getAllLocations/${address[0]}&${profileData[1].Profile.providerName}`
        );
        nearbyLoc = await nearbyLoc.json();
        console.log("Address = ", address[1]);
        var obj = await fetch(
          `https://iota-parking.herokuapp.com/getLastTx/${address[1]}&booking`
      );
      obj = await obj.json();

      var credit = await fetch(
        `https://iota-parking.herokuapp.com/getLastTx/${address[1]}&credit`
    );
    credit = await credit.json();
        if(credit == false){
          console.log("Credit = ", credit);
          credit = 0;
        }
        else{
          var credit_tx = await fetch(
            `https://iota-parking.herokuapp.com/getTx/${credit}`
        );
        credit_tx = await credit_tx.json();
        console.log("Credit Obj = ", credit_tx);
        credit = Number.parseFloat(credit_tx.response.credit);
        }
      let checkTime;
      if (obj == false)
      {
        var tx = false;
        checkTime = false;
      }
      else{
        var tx = await fetch(
          `https://iota-parking.herokuapp.com/getTx/${obj}`
      );
      tx = await tx.json();
      checkTime = Date.parse(tx.response.bookingTime);
      // console.log("Time difference = ", time_diff);
      let now = new Date();
      // console.log("Time Now = ", now);
      let time_diff = now.getTime() - checkTime;
      console.log("Time difference = ", time_diff);
      let isExpired = (time_diff > 900000) ? true:false;
      // console.log("Is Expired = ", isExpired);
      if (isExpired){
        var tx = false;
        console.log("Expired");
        await fetch(
          "https://iota-parking.herokuapp.com/changePresDescription/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              txHash: obj,
              address: address[1],
              status: false,
            }),
          }
        );
      }
    }
      // console.log(tx.response.LogType);
        navigation.navigate('Home', {seed: address[0], address:address[1], profile:profileData[1].Profile, nearby: nearbyLoc, last:tx, hash:obj, time: checkTime, credit:credit});

      }
      else{
        console.log("Login Failed")
      }
      setProcessing(false);
    } catch (e) {
      setProcessing(false);
      console.log(e);
    }
  };
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  {
    return (

      <View style={styles.container}>
        <Spinner
        visible={processing}
        textStyle={[styles.text, { color: "white" }]}
        textContent={"Please Wait while You Are Logged In"}
      />

          <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <QRCode content={JSON.stringify(profile)} />
          </Overlay>
          <Text
            style={[
              styles.text,
              {
                fontSize: 30,
                fontWeight: "400",
                color: "#2893C1",
                marginBottom: 20,
              },
            ]}
          >
            Welcome
          </Text>

          <Text
            style={[
              styles.text,
              { fontSize: 50, fontWeight: "500", marginBottom: 30 },
            ]}
          >
            IOTA Parking
          </Text>


          {/* <View> */}
            <Input
              // style={styles.input}
              label="Username"
              onChangeText={(value) => setIN_CNIC(value)}
            />
            <Input
              // style={styles.input}
              label="Password"
              onChangeText={(value) => setInID(value)}
            />
            {/* </View> */}

          <View style={styles.btnContainer}>
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
              buttonStyle={styles.button}
              title="Login"
              // titleStyle={styles.btnText}
              onPress={handleSubmit
                // () => navigation.navigate("Login")
              }
            ></Button>

            <Button
              icon={
                <Icon
                  name="user-plus"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              buttonStyle={styles.button}
              title="Sign Up"
              // titleStyle={styles.btnText}
              onPress={() => navigation.navigate("SignUp")}
            ></Button>

          </View>

          <View style={styles.btnContainer}>
            <Button
              icon={
                <Icon
                  name="plus"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              buttonStyle={styles.button}
              title="Add Data"
              disabled = {true}
              // titleStyle={styles.btnText}
              onPress={handleAddData
                // () => navigation.navigate("Login")
              }
            ></Button>
            <Button
              icon={
                <Icon
                  name="qrcode"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              buttonStyle={styles.button}
              title="Scan QR"
              // titleStyle={styles.btnText}
              onPress={
                () => navigation.navigate("Scan")
              }
            ></Button>

          </View>

          <View style={styles.btnContainer}>
            <Button
              icon={
                <Icon
                  name="plus"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              buttonStyle={styles.button}
              title="Add Credit"
              // disabled = {true}
              // titleStyle={styles.btnText}
              onPress={addCredit
                // () => navigation.navigate("Login")
              }
            ></Button>

          </View>

      </View>

    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3E50",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    paddingTop: 50,
    paddingBottom:20,
    paddingHorizontal: 0,
    borderWidth: 0,
    borderColor: "#273157",
    // zIndex: 2,
  },

  button: {
    backgroundColor: "#196F3D",
    color: "white",
    width: 150,
    height: 40,
    margin: 5,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "#52BE80",
  },
  btnText: {
    position: "absolute",
    left: 20,
  },
  text: {
    // fontFamily: "Varela",
    color: "#F0F3F4",
    textAlign: "center",
    fontSize: 20,
  },

  image: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    zIndex: 1,
  },

  btnContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 20,
  },
  mainDivider: {
    backgroundColor: "gray",
    marginVertical: 10,
    height: 2,
    width: 300,
    alignSelf: "center",
  },
});
