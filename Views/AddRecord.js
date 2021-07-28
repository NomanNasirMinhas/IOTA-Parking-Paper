import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, Image, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from "react-native-gesture-handler";
import Spinner from "react-native-loading-spinner-overlay";
import Icon from 'react-native-vector-icons/FontAwesome5';
// You can then use your `FadeInView` in place of a `View` in your components:
export default ({ navigation }) => {
  const [vaccineeID, setVaccineeID] = useState('');
  const [vaccinatorID, setvaccinatorID] = useState('');
  const [testeeID, setTesteeID] = useState('');
  const [testerID, setTesterID] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [txType, setTxType] = useState('VACCINATION')
  const [hasCovid, setHasCovid] = useState(false);
  const [processing, setProcessing] = useState(false);


  const addVaccine = async (key, value) => {
    try {
      setProcessing(true)
      var msg = {"vaccineeID":vaccineeID, "vaccinatorID":vaccinatorID, "location":location, "txType":txType, "date":date};
      msg = JSON.stringify(msg)
      var iaddress = await fetch(
        `https://iota-parking.herokuapp.com/getAddressAdmin/${vaccineeID}`
      );
      iaddress = await iaddress.json();
      console.log("Patients Seed&Address", iaddress);
      if(iaddress != false)
      {
        await fetch("https://iota-parking.herokuapp.com/sendTx", {
          method: "POST",
          body: JSON.stringify({
              seed: iaddress[0],
              address: iaddress[1],
              txType: txType,
              Data: msg
          }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
      }
      setProcessing(false)
      alert("Vaccination Record Added")
    } catch (e) {
      setProcessing(false)
      console.log("Error API ", e)
    }
  }

  const addTest = async (key, value) => {
    try {
      setProcessing(true)
      var msg = {"testeeID":testeeID, "testerID":testerID, "location":location, "txType":txType, "date":date, "result": hasCovid};
      msg = JSON.stringify(msg)
      var iaddress = await fetch(
        `https://iota-parking.herokuapp.com/getAddressAdmin/${testeeID}`
      );
      iaddress = await iaddress.json();
      console.log("Patients Seed&Address", iaddress);
      if(iaddress != false)
      {
        await fetch("https://iota-parking.herokuapp.com/sendTx", {
          method: "POST",
          body: JSON.stringify({
              seed: iaddress[0],
              address: iaddress[1],
              txType: txType,
              Data: msg
          }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
      }
      setProcessing(false)
      alert("Covid Test Record Added")
    } catch (e) {
      setProcessing(false)
      console.log("Error API ", e)
    }
  }


    return (
        <View style={styles.container}>
          <View style={{zIndex:1}}>
          <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>

        <View style={{alignItems: 'center'}}>
        <Spinner
        visible={processing}
        textStyle={[styles.text, {color:'white'}]}
        textContent={"Please Wait while your record is being Added"}
      />
        <Text style={[styles.text, { fontSize: 20 }]}>
              Please Select The Record Type
            </Text>

            <View style={styles.btnContainer}>

            <Button
              buttonStyle={[styles.button, { width: 150, marginRight:5, backgroundColor: (txType === "VACCINATION") ? "#E1E9EA":"#154360",  }]}
              title="COVID Vaccine"
              titleStyle={{ fontFamily: "MetropolisBold", color: (txType === "VACCINATION") ? "black":"white" }}
              onPress={() => setTxType("VACCINATION")}
            ></Button>

            <Button
              buttonStyle={[styles.button, { width: 150, marginLeft:5, backgroundColor: (txType === "COVIDTEST") ? "#E1E9EA":"#154360" }]}
              title="COVID Test"
              titleStyle={{ fontFamily: "MetropolisBold", color: (txType === "COVIDTEST") ? "black":"white" }}
              onPress={() => setTxType("COVIDTEST")}
            ></Button>
          </View>

          <Text style={[styles.text, { fontSize: 20, marginVertical:20 }]}>
              {(txType === "VACCINATION") ? "Adding Record For COVID Vaccination" : "Adding Record For COVID Test"}
            </Text>

          {(txType === "VACCINATION") && <View style={{width: '100%'}}>
          <Input style={styles.input} placeholder="CNIC of Patient" onChangeText={value => setVaccineeID(value)}/>
          <Input style={styles.input} placeholder="ID of Vaccinator" onChangeText={value => setvaccinatorID(value)}/>
          <Input style={styles.input} placeholder="Location" onChangeText={value => setLocation(value)}/>
          <Input style={styles.input} placeholder="Date" onChangeText={value => setDate(value)}/>
          </View>}

          {(txType === "COVIDTEST") && <View style={{width: '100%'}}>
          <Input style={styles.input} placeholder="CNIC of Patient" onChangeText={value => setTesteeID(value)}/>
          <Input style={styles.input} placeholder="ID of Testing Entity" onChangeText={value => setTesterID(value)}/>
          <Input style={styles.input} placeholder="Location" onChangeText={value => setLocation(value)}/>
          <Input style={styles.input} placeholder="Date" onChangeText={value => setDate(value)}/>
          <Text style={[styles.text, { fontSize: 20 }]}>Result</Text>

          <View style={{marginVertical: 10, flexDirection: 'row', alignSelf:'center',}}>

            <Button
              buttonStyle={[styles.button, { width: 100, marginRight:5, borderColor:"#1C2833", backgroundColor: hasCovid ? "#E74C3C":"#CCD1D1" }]}
              title="Positive"
              titleStyle={{ fontFamily: "MetropolisBold" }}
              onPress={() => setHasCovid(true)}
            ></Button>

            <Button
              buttonStyle={[styles.button, { width: 100, marginLeft:5, borderColor:"#1C2833", backgroundColor: hasCovid ? "#CCD1D1":"#1E8449" }]}
              title="Negative"
              titleStyle={{ fontFamily: "MetropolisBold" }}
              onPress={() => setHasCovid(false)}
            ></Button>
          </View>

          </View>}

          <Button
            buttonStyle={[styles.button, {width:250}]}
            title="Add Record"
            icon={
              <Icon
                name="plus-circle"
                size={20}
                color="white"
                solid
                style={{position:'absolute', right:20}}
              />
            }
            iconRight
            onPress={async () => {
              try{
              (txType === "VACCINATION") ? await addVaccine() : await addTest()
              navigation.navigate("Welcome")
              }catch(e){
                alert("Error")
              }
            }}
          ></Button>
          <View><Text></Text></View>
        </View>
        </ScrollView>
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

  btnContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 20,
    marginTop:20,
    width:'100%',
    padding:10,
    backgroundColor:'#154360',
    borderRadius:90
  },
  input: {
    borderRadius:90,
    borderColor: '#D3D4D5',
    borderWidth:2,
    paddingHorizontal:10,
    marginBottom:10
  },
});
