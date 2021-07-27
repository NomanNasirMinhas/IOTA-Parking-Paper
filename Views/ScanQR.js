import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Overlay, Avatar } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";

export default function App({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [visible, setVisible] = useState(false);
  const [qrData, setData] = useState("");
  const [spinnerText, setSpinnerText] = useState("Please Wait...");
  const [finished, setFinished] = useState(false);
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [vaccinated, setVaccinated] = useState(false);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [icon, setIcon] = useState("../assets/remove.png");

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setFinished(false);
    // setData(data);
    try {
      console.log(data)
      var obj = await fetch(
        `https://iota-parking.herokuapp.com/getLastTx/${data.toString().trim()}&booking`
    );
    obj = await obj.json();
    console.log("Hash=",obj)
    if (obj == false)
    {
      Alert.alert("No Valid Booking Found")
      var tx = false;
    }
    else{var tx = await fetch(
        `https://iota-parking.herokuapp.com/getTx/${obj}`
    );
    tx = await tx.json();
    console.log("tx=",obj)
    let checkTime = Date.parse(tx.response.bookingTime);
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
    if(tx == false){
      Alert.alert("No Valid Booking Found")
    }
    else{
      console.log("Valid TX = ", tx.response)
      Alert.alert("Valid Booking found",`For Vehicle ${tx.response.vehicleID} for ${tx.response.providerName} in ${tx.response.areaName} booked at ${tx.response.bookingTime}`);
    }
  }
    // console.log(tx.response.LogType);
      
      setFinished(true);
    } catch (e) {
      setFinished(true);
      Alert.alert("Error. Please Try Again")
      console.log(e);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{
          height: 300,
          width: 300,
          backgroundColor: vaccinated ? "#D4EFDF" : "#FADBD8",
        }}
      >
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Avatar
            rounded
            source={require("../assets/vaccine.png")}
            style={styles.image}
          />
          <Text style={[styles.text, { color: "#34495E", fontSize: 25 }]}>
            {fname} {sname}
          </Text>
          <Text
            style={[
              styles.text,
              {
                fontSize: 30,
                color: vaccinated ? "#1E8449" : "#A93226",
                marginBottom: 20,
              },
            ]}
          >
            {vaccinated ? "Vaccinated" : "Not Vaccinated"}
          </Text>
        </View>
      </Overlay>

      <Spinner
        visible={scanned && !finished}
        textStyle={styles.text}
        textContent={spinnerText}
      />

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

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
  btnContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 20,
  },

  subtext: {
    // fontFamily: "Metropolis",
    color: "gray",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
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

  image: {
    flex: 0,
    top: 0,
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 50,
  },

  subDivider: {
    backgroundColor: "gray",
    marginVertical: 10,
    height: 2,
    width: 200,
    alignSelf: "center",
    opacity: 0.1,
  },

  mainDivider: {
    backgroundColor: "gray",
    marginVertical: 10,
    height: 2,
    width: 300,
    alignSelf: "center",
  },
});
