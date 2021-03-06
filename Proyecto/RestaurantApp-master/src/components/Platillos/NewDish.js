import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, View, Image, KeyboardAvoidingView, TouchableOpacity, AlertIOS, ScrollView, AsyncStorage, FlatList} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import {getRecipes, newDish} from '../API/APICommunication.js';
import {Actions} from "react-native-router-flux";
import Card from './RecipeCard';

export default class NewDish extends Component {

  constructor(props){
    super(props);
    this.state = {
      expirationDate: '',
      items: [],
      description: ''
    }
  }
  addDish(item){
    let callback = function returnMenu(resp){
      if(resp.success == true){
        AlertIOS.alert(
          'Dish ordered succesfully',
        );
        Actions.pop();
      }
      else{
        AlertIOS.alert(
          'There was a problem',
          resp.message
        );
        Actions.pop();
      }
    }.bind(this);
    AsyncStorage.getItem('userToken').then((value) => {
      if(value !== null){
        newDish(item, value, this.state.description, callback);
      }
    }).done();
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


  componentWillMount(){
    let callback = function updateState(data){
      this.setState({
        items: data
      });
    }.bind(this);
    AsyncStorage.getItem('userToken').then((value) => {
      if(value !== null){
        // console.warn(value);
        getRecipes(callback, value);
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
              <TouchableOpacity  style={{paddingHorizontal: 10}}onPress={() => this.addDish(item)}>
                <Card
                  data = {item}
                />
            </TouchableOpacity>
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

  getQuantity(id){
    const ingredients = this.state.ingredients;
    const index = ingredients.indexOf(id)
    return(
      <View>
        <Text style={styles.ingredients}>{this.state.quantityList[index]}</Text>
      </View>
    )
  }

  renderSelectedIngredients(){
    if(this.state.ingredients.length > 0){
      return(
        <View style={styles.container}>
        <FlatList
          data ={this.state.ingredients}
          extraData={this.state}
          renderItem={({item}) => (
            <View style={{backgroundColor: '#3d7a98', flex:1, flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
              <Text style={styles.ingredients}>{item}</Text>
              {this.getQuantity(item)}
          </View>
          )}
        />
      </View>
      );
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>New dish</Text>
          <View style={styles.container}>
            <View style={styles.inputContainer}>

              {/* <Text style={styles.inputTitle}>Precio</Text> */}
              {/* <TextInput
                placeholder="100"
                placeholderTextColor="rgba(255,255,255,0.7)"
                //Control de botones una ves se complete el campo
                returnKeyType="next"
                onSubmitEditing={()=>this.passwordInput.focus()}
                onChangeText={(cost) => this.setState({cost})}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              /> */}

              <Text style={styles.inputTitle}>Specifications</Text>
              <TextInput
                placeholder="Sin cebolla, sin jitomate"
                placeholderTextColor="rgba(255,255,255,0.7)"
                //Control de botones una ves se complete el campo
                returnKeyType="next"
                onSubmitEditing={()=>this.passwordInput.focus()}
                onChangeText={(description) => this.setState({description})}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>
            <View style={{alignItems:'center'}}>
            </View>
            <Text style={styles.availableRecipes}>Available recipes</Text>
            <View style={styles.container}>
              <View style={styles.items}>
                {this.renderItems()}
              </View>
            </View>

            {/* {this.renderSelectedIngredients()} */}
        </View>
      </ScrollView>
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
    availableRecipes:{
      color:'#FFF',
      fontSize: 20,
      marginBottom: 15,
      opacity: 0.9,
      textAlign:'center'
    },
    ingredients:{
      color:'#FFF',
      fontSize: 20,
      marginVertical: 15,
      marginHorizontal: 5,
      opacity: 0.9,
      textAlign: 'center'
    },
    logoContainer:{
      flex:1 ,
      alignItems: 'center',
      flexGrow: 1,
      justifyContent: 'center',
    },
    logo:{
      marginTop: 100,
      width: 100,
      height: 100,
      borderRadius: 100,
    },
});
