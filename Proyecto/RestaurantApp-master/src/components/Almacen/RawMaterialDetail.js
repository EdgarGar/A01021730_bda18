import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, KeyboardAvoidingView, TouchableOpacity, ScrollView, TextInput, AlertIOS, AsyncStorage } from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {Actions} from "react-native-router-flux";
import Card from './RawMaterialCard';
import {deleteRawMaterial, addRawMaterial} from '../API/APICommunication.js';

export default class RawMaterialDetail extends Component {

  constructor(props){
    super(props);
    this.state = {
      name:this.props.data.name,
      category: this.props.data.category,
      cost: this.props.data.cost,
      id: this.props.data.id,
      addingMaterial: false,
      quantity: 1,
      expirationDate: '',
    };
  }
  //
  // componentDidMount(){
  //   console.warn(this.props.data);
  // }

  newProduct(){
    Actions.pop();
  }

  deleteItem(){
    deleteRawMaterial(this.state.id, 'none');
    Actions.pop();
  }

  addingMaterial(){
    if(this.state.addingMaterial == false){
      var isAdding = !this.state.addingMaterial;
      this.setState({
        addingMaterial: isAdding
      });
    }
    else{
      let date = new Date(this.state.expirationDate)
      if(date == null){
        AlertIOS.alert(
          'Fecha invalida',
          'ingrese la fecha como el formato especificado'
        );
        return 0;
      }
      let milliseconds = date.getTime();
      AsyncStorage.getItem('userToken').then((value) => {
        if(value !== null){
          addRawMaterial(value, this.state.id, this.state.quantity, milliseconds);
        }
      }).done();
      Actions.pop();
    }
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
  renderAddMaterial(){
    if(this.state.addingMaterial){
      return(
        <View style={{flex:1, alignItems: 'center'}}>
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
          <Text style={styles.inputTitle}>Cantidad</Text>
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
      )
    }
  }
  render() {
    return (
      <KeyboardAvoidingView benhavior="padding" style={styles.container}>
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.detailContainer}>
              <Text style={styles.title}>{this.state.name}</Text>

              <Image style={styles.image}source={require('../../Images/placeholderIngredients.png')}/>
              {/* {<Text style={styles.textDetail}>{this.state.name}</Text>} */}
              <Text style={styles.textDetailSec}>Categoria: {this.state.category}</Text>
              <Text style={styles.textDetailSec}>Costo: {this.state.cost}</Text>
            </View>
            {this.renderAddMaterial()}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={()=> {this.addingMaterial()}}style={styles.buttonG}>
              <Text style={styles.buttonText}>Add material</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={()=> {this.newProduct()}}style={styles.button}>
              <Text style={styles.buttonText}>Return to list</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> {this.deleteItem()}}style={styles.buttonDelete}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
      </View>
    </KeyboardAvoidingView>
  );
  }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center'

    },
    detailContainer:{
      flex:1 ,
      alignItems: 'center',
      flexGrow: 1,
      justifyContent: 'center',
    },
    logo:{
      width: 100,
      height: 1000
    },
    title:{
      flex:1,
      color:'#FFF',
      fontSize: 50,
      marginTop: 30,
      marginBottom: 30,
      textAlign: 'center',
      opacity: 0.8
    },
    button:{
      flex:1,
      backgroundColor: '#2980b9',
      paddingVertical: 10
    },
    buttonG:{
      flex:1,
      backgroundColor: '#29b99b',
      paddingVertical: 10
    },
    buttonDelete:{
      flex:1,
      backgroundColor: '#b84141',
      paddingVertical: 10
    },
    buttonContainer:{
      flexDirection:'row',
    },
    buttonText:{
      textAlign: 'center',
      color: '#FFFFFF',
      fontWeight: '700'
    },
    image:{
      width: 200,
      height: 200,
      borderRadius: 100

    },
    textDetail:{
      flex:1,
      color:'#FFF',
      fontSize: 30,
      textAlign: 'center',
    },
    textDetailSec:{
      flex:1,
      color:'#FFF',
      fontSize: 20,
      textAlign: 'center',
      opacity: 0.8
    },
    quantityContainer:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
    },
    quantityButton:{
      marginHorizontal: 10,
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
    input:{
      height:40,
      width: '70%',
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginBottom: 5,
      color: '#FFF',
      paddingHorizontal: 10
    },
    inputTitle:{
      color:'#FFF',
      fontSize: 20,
      marginBottom: 10,
      marginTop: 10,
      opacity: 0.9
    },
});
