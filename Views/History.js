import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, Image, StyleSheet } from "react-native";
import { Card, ListItem, Button,Divider } from "react-native-elements";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome5";
// You can then use your `FadeInView` in place of a `View` in your components:
export default ({ route, navigation }) => {
  const { history } = route.params;
  // const { test } = route.params;
  // const { info } = route.params;

  // const [vaccinated, setVaccinated] = useState(false);
  // const [tested, setTested] = useState(false);
  // const [vaccineResults, setVaccineResult] = useState([]);
  // const [testResults, setTestResult] = useState([]);
  // const [lastResult, setLastResult] = useState(false);

  // useEffect(() => {
  //   var vaccineResult = vaccination;

  //   console.log("Vaccination Result =", vaccineResult);

  //   var testResult = test;

  //   console.log("Tests Result =", testResult);

  //   if (vaccineResult.length > 0) {
  //     setVaccinated(true);
  //     setVaccineResult(vaccineResult);
  //   }

  //   if (testResult.length > 0) {
  //     setTested(true);
  //     setTestResult(testResult);
  //     var last = testResult[testResult.length - 1]
  //     console.log("JSON Parse 1");
  //     var status = last
  //     console.log("Status = ", status)
  //     setLastResult(status.result)
  //   }
  // }, []);

  return (
    <View style={styles.container}>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
        <View style={{alignItems: 'center'}}>
      <Text style={[styles.text, {fontSize: 40}]}>Booking Records</Text>
      {
        history.map((v,i)=>{
          return(<View>
      <Text style={[styles.text, {fontSize: 20}]}>Booking # {i+1}</Text>
      <Text style={[styles.text, {fontSize: 20}]}>Booking Provider: {v.providerName}</Text>
      <Text style={[styles.text, {fontSize: 20}]}>Booking Area: {v.areaName}</Text>
      <Text style={[styles.text, {fontSize: 20}]}>Booking Time: {v.bookingTime}</Text>
      <Divider style={styles.mainDivider} />
          </View>)
        })
      }
      </View>
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
    margin:'auto',
    paddingTop: 50,
    paddingHorizontal: 10,
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

  // image: {
  //   flex: 1,
  //   width: undefined,
  //   height: undefined,
  // },
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
    marginVertical: 30,
    height: 2,
    width: 300,
    alignSelf: "center",
  }
});
