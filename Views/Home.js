import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, Image, StyleSheet } from "react-native";
import {
  Card,
  ListItem,
  Button,
  // Icon,
  Tile,
  Overlay,
  Avatar,
  Divider,
} from "react-native-elements";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { sha256 } from "react-native-sha256";
import Icon from "react-native-vector-icons/FontAwesome5";
// import RNLocation from 'react-native-location';
import * as Location from "expo-location";

export default ({ navigation, route }) => {
  const { seed, address, profile, nearby,last } = route.params;
  // console.log("Last", last);
  // const [seed, setSeed] = useState("");
  const [seedInfo, setSeedInfo] = useState("");
  const [iAddress, setIAddress] = useState("");
  const [location, setLocation] = useState([0, 0]);
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [providerName, setProviderName] = useState("");
  const [idnum, setIDnum] = useState("");
  const [reg_address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [visible, setVisible] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [nearAreas, setNearAreas] = useState([]);
  const [nearby_pos, setNearbyPos] = useState(false);
  const [bookSpot, setBookSpot] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState("");
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        var obj_info = profile;
        // console.log("Local Info = ", obj_info);
        setEmail(obj_info.email);
        setFname(obj_info.fname);
        setSname(obj_info.sname);
        setProviderName(obj_info.providerName);
        setAddress(obj_info.address);
        setIDnum(obj_info.idnum);
        setPhone(obj_info.phone);
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.LocationAccuracy.BestForNavigation,
        });
        // console.log("Location = ", loc.coords);
        let locArr = [loc.coords.longitude, loc.coords.latitude];
        setLocation(locArr);
        // cons
        if (nearby != false) {
          setNearbyPos(true);
        }
      } catch (e) {
        console.log("Error in Final Catch = ", e);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <Text style={[styles.text, { fontSize: 40 }]}>IOTA Parking</Text>
          <Text style={[styles.text, { fontSize: 20 }]}>{last == false ? "No Active Booking": `1 Active Booking for ${last.response.areaName} of ${last.response.providerName} booked at ${last.response.bookingTime}`}</Text>
          <View>
            <Button
              title="Book A Spot"
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
              onPress={() => setBookSpot(!bookSpot)}
              buttonStyle={[styles.button]}
              disabled = {(last == false)? false:true}
            />
            {nearby != false && bookSpot && (
              <View>
                <Text style={styles.text}>Near By Areas</Text>
                {nearby.map((v, i) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                      }}
                    >
                      <Text
                        style={[
                          styles.text,
                          { fontSize: 20, color: "#52BE80" },
                        ]}
                      >
                        {v.areaName}
                      </Text>
                      <Text style={[styles.text, { fontSize: 20 }]}>
                        {"  =====>  "}
                      </Text>
                      <Button
                        title={`Book ${v.areaName}`}
                        onPress={async () => {
                          console.log("Adding Data");
                          let now = new Date();
                          // let expire = new Date(now);
                          // expire.setMinutes(now.getMinutes() + 15)
                          setBookSpot(v.areaName);
                          try
                          {
                            let now = new Date();
                            await fetch(
                            "https://iota-parking.herokuapp.com/sendTx/",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                seed: seed,
                                address: address,
                                txType: "booking",
                                Data: JSON.stringify({
                                  bookingTime: now,
                                  vehicleID: idnum,
                                  areaName: v.areaName,
                                  providerName: v.providerName,
                                }),
                              }),
                            }
                          );
                          console.log("Data Added")
                        }catch(e){
                            console.log(e)
                          }
                        }}
                        buttonStyle={[styles.button, { width: 100 }]}
                      />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          <Button
            title="Check History"
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
            onPress={async() => {
              var response = await fetch(`https://iota-parking.herokuapp.com/getAllHash/${address}&${0}&booking`);
              response = await response.json();
              if (response == false){
                alert("No Previous Bookings");
              }
              else{
                let history = [];
                for (var i = 0; i < response.length; i++) {
                  var responseTx = await fetch(`https://iota-parking.herokuapp.com/getTx/${response[i].toString()}`);
                  var resObjTx = await responseTx.json();
                  if (resObjTx.response !== false) {
                      console.log(resObjTx.response)
                      history.push(resObjTx.response)
                  }
              }
              if(history.length > 0){
                navigation.navigate('History', {history: history});
              }
              else{
                alert("No Valid Bookings");
              }
              }
            }}
            buttonStyle={[styles.button]}
          />
          <View style={styles.btnContainer}>
            <Button
              title="Show My QR"
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
              onPress={toggleOverlay}
              buttonStyle={[styles.button]}
            />
            <Button
              icon={
                <Icon
                  name="user"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              buttonStyle={[styles.button, { marginBottom: 20 }]}
              title="My Profile"
              // titleStyle={{color:'#2E86C1'}}
              onPress={() => setShowProfile(true)}
            ></Button>
            <Button
              icon={
                <Icon
                  name="sign-out-alt"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              buttonStyle={[styles.button, { backgroundColor: "#C0392B" }]}
              title="Logout"
              // titleStyle={{color:'#2E86C1'}}
              onPress={async () => {
                await AsyncStorage.clear();
                navigation.navigate("Welcome");
              }}
            ></Button>
          </View>
          <Divider style={styles.mainDivider} />

          <View style={{ height: 20 }}></View>
          <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <QRCode logoSize={400} value={address.toString()}/>
          </Overlay>

          <Overlay isVisible={showProfile} onBackdropPress={toggleProfile}>
            <View
              style={
                (styles.container, { backgroundColor: "#1F618D", padding: 50 })
              }
            >
              <Text style={[styles.subtext]}>Name</Text>
              <Text style={styles.text}>
                {fname} {sname}
              </Text>
              <Divider style={styles.mainDivider} />

              <Text style={styles.subtext}>Email</Text>
              <Text style={styles.text}>{email}</Text>
              <Divider style={styles.mainDivider} />

              <Text style={styles.subtext}>Provider ID</Text>
              <Text style={styles.text}>{providerName}</Text>
              <Divider style={styles.mainDivider} />

              <Text style={styles.subtext}>Vehicle ID</Text>
              <Text style={styles.text}>{idnum}</Text>
              <Divider style={styles.mainDivider} />

              <Text style={styles.subtext}>Address</Text>
              <Text style={styles.text}>{reg_address}</Text>
              <Divider style={styles.mainDivider} />

              <Text style={styles.subtext}>Phone Number</Text>
              <Text style={styles.text}>{phone}</Text>
            </View>
          </Overlay>

          {/*  */}
        </View>

        {/* </ScrollView> */}
        {/* </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3E50",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    paddingTop: 100,
    paddingHorizontal: 0,
    borderWidth: 0,
    borderColor: "#273157",
  },
  btnContainer: {
    flexDirection: "column",
    alignSelf: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2980B9",
    color: "white",
    width: 250,
    height: 40,
    margin: 5,
    alignSelf: "center",
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "white",
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

  subtext: {
    // fontFamily: "Metropolis",
    color: "gray",
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
  },

  image: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    zIndex: 0,
    // alignSelf: "center",
    // marginBottom: 50,
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
    marginTop: 10,
    height: 2,
    width: "90%",
    alignSelf: "center",
  },
  infoContainer: {
    // marginHorizontal: 0,
    borderWidth: 2,
    borderColor: "#27AE60",
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 20,
    width: "90%",
    paddingHorizontal: 20,
    paddingBottom: 20,
    // flexDirection: "column",
  },
});
