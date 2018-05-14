import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, KeyboardAvoidingView, TouchableOpacity, ScrollView, AsyncStorage, FlatList } from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {Actions} from "react-native-router-flux";
// import Card from './RecipeCard';
import {deleteRecipe, getIngredients} from '../API/APICommunication.js';
import Card from './IngredientCardDetail';

export default class RecipeDetail extends Component {

  constructor(props){

    super(props);
    // console.warn(this.props.data);
    this.state = {
      name:this.props.data.name,
      category: this.props.data.category,
      cost: this.props.data.cost,
      id: this.props.data.id,
      ingredients:[],
    };
  }

  componentDidMount(){
    let callback = function updateState(data){
      this.setState({
        ingredients: data
      });
    }.bind(this);
    AsyncStorage.getItem('userToken').then((value) => {
      if(value !== null){
        getIngredients(value, this.state.id, callback);
      }
    }).done();
  }

  newProduct(){
    Actions.pop();
  }

  deleteItem(){
    AsyncStorage.getItem('userToken').then((value) => {
      if(value !== null){
          deleteRecipe(this.state.id, value);
      }
    }).done();
    Actions.pop();
  }


  renderIngredients(){
    if(this.state.ingredients.length){
      return(
        <View>
          <FlatList
            data = {this.state.ingredients}
            renderItem={({item}) => (
              <TouchableOpacity  style={{paddingHorizontal: 10}}onPress={() => this.selectIngredient(item)}>
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
  render() {
    return (
      <KeyboardAvoidingView benhavior="padding" style={styles.container}>
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.detailContainer}>
              <Text style={styles.title}>{this.state.name}</Text>

              <Image style={styles.image}source={require('../../Images/placeholderRecipe.png')}/>
              {/* {<Text style={styles.textDetail}>{this.state.name}</Text>} */}
              <Text style={styles.textDetailSec}>Category: {this.state.category}</Text>
              <Text style={styles.textDetailSec}>Cost: {this.state.cost}</Text>
              <Text style={styles.textDetailSec}>Ingredients:</Text>
            </View>
            {this.renderIngredients()}
          </ScrollView>
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
    }
});
