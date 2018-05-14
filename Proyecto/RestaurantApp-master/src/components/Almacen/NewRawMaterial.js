import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, View, Image, KeyboardAvoidingView, TouchableOpacity, AlertIOS} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import {newRawMaterial} from '../API/APICommunication.js';
import {Actions} from "react-native-router-flux";

export default class NewRawMaterial extends Component {

  constructor(props){
    super(props);
    this.state = {
      quantity: 1,
      expirationDate: '',
    }
  }
  newProduct(){
    const material = {
      name: this.state.name,
      category: this.state.category,
      cost: this.state.cost
    };
    let date = new Date(this.state.expirationDate)
    if(date == null){
      AlertIOS.alert(
        'Fecha invalida',
        'ingrese la fecha como el formato especificado'
      );
      return 0;
    }
    let milliseconds = date.getTime();
    newRawMaterial(material, "none", this.state.quantity, milliseconds );
    Actions.pop();
  }


  updateQuantity(updateNum){
    var quantity = this.state.quantity + updateNum;
    if(quantity < 0){
      AlertIOS.alert(
        'Numero invalido',
        'no puedes tener cantidad abajo de 0'
      );

    }
    else{
      this.setState({
        quantity: quantity
      });
    }
  }

  // <TextInput
  //   placeholder="Cantidad"
  //   placeholderTextColor="rgba(255,255,255,0.7)"
  //   //Control de botones una ves se complete el campo
  //   returnKeyType="next"
  //   onSubmitEditing={()=>this.passwordInput.focus()}
  //   onChangeText={(name) => this.setState({name})}
  //   keyboardType="email-address"
  //   autoCapitalize="none"
  //   autoCorrect={false}
  //   style={styles.input}
  // />

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Agregar materia prima</Text>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Nombre</Text>
            <TextInput
              placeholder="Aguacates"
              placeholderTextColor="rgba(255,255,255,0.7)"
              //Control de botones una ves se complete el campo
              returnKeyType="next"
              onSubmitEditing={()=>this.passwordInput.focus()}
              onChangeText={(name) => this.setState({name})}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <Text style={styles.inputTitle}>Precio</Text>
            <TextInput
              placeholder="10"
              placeholderTextColor="rgba(255,255,255,0.7)"
              //Control de botones una ves se complete el campo
              returnKeyType="next"
              onSubmitEditing={()=>this.passwordInput.focus()}
              onChangeText={(cost) => this.setState({cost})}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <Text style={styles.inputTitle}>Caducidad</Text>
            <TextInput
              placeholder="DD/MM/AAAA"
              placeholderTextColor="rgba(255,255,255,0.7)"
              //Control de botones una ves se complete el campo
              returnKeyType="next"
              onSubmitEditing={()=>this.passwordInput.focus()}
              onChangeText={(expirationDate) => this.setState({expirationDate})}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <Text style={styles.inputTitle}>Categoria</Text>
            <TextInput
              placeholder="Verduras"
              placeholderTextColor="rgba(255,255,255,0.7)"
              //Control de botones una ves se complete el campo
              returnKeyType="next"
              onSubmitEditing={()=>this.passwordInput.focus()}
              onChangeText={(category) => this.setState({category})}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <View style={{alignItems: 'center'}}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => this.updateQuantity(1)} style={styles.quantityButton}>
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{this.state.quantity}</Text>
                <TouchableOpacity onPress={() => this.updateQuantity(-1)}style={styles.quantityButton}>
                  <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
          <TouchableOpacity onPress={() => this.newProduct()}style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Agregar</Text>
          </TouchableOpacity>
      </View>
    </View>
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
      justifyContent: 'center',
    },
    logo:{
      width: 100,
      height: 1000
    },
    title:{
      color:'#FFF',
      fontSize: 45,
      marginTop: 15,
      textAlign: 'center',
      opacity: 0.8
    },
    buttonContainer:{
      backgroundColor: '#29b99b',
      paddingVertical: 10,
      marginTop: 2
    },
    buttonText:{
      textAlign: 'center',
      color: '#FFFFFF',
      fontWeight: '700'
    },
    input:{
      height:40,
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginBottom: 20,
      color: '#FFF',
      paddingHorizontal: 10
    },
    inputContainer: {
      padding: 20
    },
    quantityContainer:{
      width: '50%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    quantityButton:{
      marginHorizontal: 20,
      width:50,
      height:50,
      backgroundColor: '#0a4d6e',
      alignItems: 'center',
      justifyContent: 'center',
    },
    qtyText:{
      color:'#FFF',
      fontSize: 30,
    },
    inputTitle:{
      color:'#FFF',
      fontSize: 20,
      marginBottom: 15,
      opacity: 0.9
    },
});
