import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, KeyboardAvoidingView, TouchableOpacity, ScrollView, TextInput, AlertIOS, AsyncStorage, FlatList } from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {Actions} from "react-native-router-flux";
import Card from './DishCard';
import {deleteDish, addRawMaterial, newDish} from '../API/APICommunication.js';

export default class DishDetail extends Component {

  constructor(props){
    super(props);
    this.state = {
        name: this.props.data.name,
        elaborados: this.props.data.elaborado
    };
  }
  //
  // componentDidMount(){
  //   console.warn(this.props.data);
  // }


  orderMore(){
    const item = {
      id: this.props.data.recetaId
    };
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
        newDish(item, value, "none", callback);
      }
    }).done();
  }
  newProduct(){
    Actions.pop();
  }

  deleteItem(){
    let callback = function returnMenu(resp){
      if(resp.success == true){
        AlertIOS.alert(
          'Dish deleted succesfully',
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
          deleteDish(this.state.id, value, callback);
      }
    }).done();
  }

  getExpDate(item){
    var date = new Date(this.props.data.elaborado[0].expiration)
    date = date.toString("dd mmmm YYYY").split("00:")[0];
    if(date != null){
      return(
        <Text style={styles.ingredients}>{date}</Text>
      );
    }

  }

  renderDishes(){

    if(this.state.elaborados.length > 0){
      return(
        <View style={{flex:1, flexDirection: 'column'}}>
          <View style={styles.container}>
            <FlatList
              data ={this.state.elaborados}
              keyExtractor={(item, index) => index}
              extraData={this.state}
              renderItem={({item}) => (
                <View style={{backgroundColor: '#3d7a98', flex:1, flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
                  {this.getExpDate(item)}
              </View>
              )}
            />
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
              <Image style={styles.image}source={require('../../Images/placeholder.jpg')}/>
              <Text style={styles.textDetail}>Cooked dishes: {this.state.elaborados.length}</Text>
              {this.renderDishes()}


            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={()=> {this.orderMore()}}style={styles.buttonG}>
              <Text style={styles.buttonText}>Order more</Text>
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
    ingredients:{
      color:'#FFF',
      fontSize: 16,
      marginVertical: 15,
      marginHorizontal: 5,
      opacity: 0.9,
      textAlign: 'center'
    },
});
