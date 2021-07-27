import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, Image, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome5";
import Spinner from "react-native-loading-spinner-overlay";
// You can then use your `FadeInView` in place of a `View` in your components:
export default ({ navigation }) => {
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [providerName, setProviderName] = useState("");
  const [idnum, setIDnum] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);

  const [providers, setProviders] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        var p_res = await fetch(`https://iota-parking.herokuapp.com/getAllProviders/`);
        p_res = await p_res.json();

        var unique = p_res.filter((value, index, self)=>{
          return self.indexOf(value.providerName) === index;
        });
        console.log("All Providers = ", unique);
        // if(nearbyLoc != false)
        // setNearbyPos(true)
      } catch (e) {
        console.log("Error in Final Catch = ", e);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    try
{    setProcessing(true);
    var profile = {
      fname,
      sname,
      email,
      password,
      providerName,
      address,
      idnum,
      phone
    }

    var seed = await fetch('https://iota-parking.herokuapp.com/addSeed/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: email,
            password: password,
            info: profile
        }
        )
    });
    var x = await seed.json()
    if (x[0] === true) {
        // SetParsedSeed(x[1])
        // actions.setSubmitting(false)
        console.log("Done")
        // setOpen(true)
        await fetch(
            "https://iota-parking.herokuapp.com/addAddress/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    seed: x[1],
                    deviceNum: 0,
                    secLevel: 3,
                    id: x[1],
                    password: "This is the address of Patient",
                    info: null,
                }),
            }
        ).then((result) =>
            result.json().then((resp) => {
                if (resp[0] === true) {
                  setProcessing(false);
                  navigation.navigate("Welcome");
                } else {
                  setProcessing(false);
                    alert(
                        "Issue occured while adding patient. Contact administrator"
                    );
                    // window.location.reload(false);
                }
            })
        );

    }
    else {
      setProcessing(false);
        alert("Unknown error occured. Try contacting administrator")
    }}catch(e){
      setProcessing(false)
      console.log("Error = ",e);
      alert("TRY-CATH ERROR")
    }
}

  return (
    <View style={styles.container}>
      <View style={{ alignSelf:'center', zIndex:1, paddingTop:0 }}>
      {/* <ScrollView horizontal={false} showsVerticalScrollIndicator={true}> */}
        <Spinner
          visible={processing}
          textStyle={[styles.text, { color: "white" }]}
          textContent={"Please Wait while your Account is being Created"}
        />

          <Text
            style={[
              styles.text,
              { fontSize: 20, marginBottom: 30 },
            ]}
          >
            Please Fill Below Information
          </Text>

          {step === 0 && (
            <View style={{ width: 300 }}>
              <Input
                style={styles.input}
                label="First Name"
                onChangeText={(value) => setFname(value)}
              />
              <Input
                style={styles.input}
                label="Last Name"
                onChangeText={(value) => setSname(value)}
              />
              <Input
                style={styles.input}
                label="Email"
                onChangeText={(value) => setEmail(value)}
              />
              <Input
                style={styles.input}
                label="Password"
                secureTextEntry={true}
                onChangeText={(value) => setPassword(value)}
              />
            </View>
          )}
          {step === 1 && (
            <View style={{ width: 300 }}>
              <Input
                style={styles.input}
                label="Provider ID"
                onChangeText={(value) => setProviderName(value)}
              />
              <Input
                style={styles.input}
                label="Postal Address"
                onChangeText={(value) => setAddress(value)}
              />
              <Input
                style={styles.input}
                label="Car Number"
                onChangeText={(value) => setIDnum(value)}
              />
              <Input
                style={styles.input}
                label="Phone Number"
                onChangeText={(value) => setPhone(value)}
              />
            </View>
          )}

          {step === 1 && (
            <Button
              buttonStyle={styles.button}
              icon={
                <Icon
                  name="check-circle"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              title="Sign Up"
              onPress={async () => await handleSubmit()}
            ></Button>
          )}
          {step < 1 && (
            <Button
              buttonStyle={[styles.button, { backgroundColor: "#F1C40F" }]}
              icon={
                <Icon
                  name="arrow-right"
                  size={20}
                  color="white"
                  solid
                  style={{ position: "absolute", right: 20 }}
                />
              }
              iconRight
              title="Continue"
              onPress={() => setStep(step + 1)}
            ></Button>
          )}

      {/* </ScrollView> */}
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

  button: {
    backgroundColor: "#196F3D",
    color: "white",
    width: 150,
    height:40,
    alignSelf:'center',
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
    position:'absolute',
    bottom: 0,
    width: "100%",
    height: 100,
    zIndex:0
  },

  input: {
    borderRadius: 90,
    borderColor: "#D3D4D5",
    borderWidth: 2,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
