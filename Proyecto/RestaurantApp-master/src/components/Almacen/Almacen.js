import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, KeyboardAvoidingView, TouchableOpacity, ScrollView, FlatList, AsyncStorage } from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {Actions} from "react-native-router-flux";
import Card from './RawMaterialCard';
import {getRawMaterials} from '../API/APICommunication.js';

export default class Almacen extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: []
    };
  }
  newProduct(){
    Actions.newRaw();
  }

  // getData(){
  //   const data = getRawMaterials();
  //   if(data){
  //     this.setState({
  //       materials: data.items
  //     })
  //   }
  //   console.warn(data);
  // }


  componentWillMount(){
    let callback = function updateState(data){
      this.setState({
        items: data
      });
    }.bind(this);
    AsyncStorage.getItem('userToken').then((value) => {
      if(value !== null){
        // console.warn(value);
        getRawMaterials(callback, value);
              // var newUID = this.generateUID()
              // AsyncStorage.setItem('UID', newUID);
      }
    }).done();

  }

  renderItems(){
    if(this.state.items.length){
      return(
        <View>
          <FlatList
            data = {this.state.items}
            keyExtractor={(item, index) => index}
            renderItem={({item}) => (
              <Card
                data = {item}
              />
            )}
          />
        </View>
      )
    }
    else{
      return(
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require("../../Images/foodLoader.gif")} />
        </View>
      );
    }
  }
  render() {
    return (
      <KeyboardAvoidingView benhavior="padding" style={styles.container}>
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.logoContainer}>
              <Text style={styles.title}>Almacen</Text>
            </View>
            <View style={styles.items}>
              {this.renderItems()}
            </View>
          </ScrollView>
          <TouchableOpacity onPress={()=> {this.newProduct()}}style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Nueva materia prima</Text>
          </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
  }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#3498db'
    },
    logoContainer:{
      flex:1 ,
      alignItems: 'center',
      flexGrow: 1,
      justifyContent: 'center',
    },
    logo:{
      marginTop: 100,
      width: 200,
      height: 200,
      borderRadius: 100,
    },
    title:{
      flex:1,
      color:'#FFF',
      fontSize: 50,
      marginTop: 15,
      textAlign: 'center',
      opacity: 0.8
    },
    buttonContainer:{
      backgroundColor: '#2980b9',
      paddingVertical: 10
    },
    buttonText:{
      textAlign: 'center',
      color: '#FFFFFF',
      fontWeight: '700'
    },
    items:{
      justifyContent: 'center',

    }
});
