import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {Actions} from "react-native-router-flux";

export default class DishCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      name:this.props.data.name,
      category: this.props.data.category,
      cost: this.props.data.cost,
      id: this.props.data.id
    };
  }

  detail(){
    // Actions.rawDetail();
    // console.warn(this.props.data);
    // console.warn(this.props.data);
    Actions.dishDetail({data: this.props.data})
  }
  render() {
    // console.warn(this.props.data.elaborado);
    var date = new Date(this.props.data.elaborado[0].expiration)
    date = date.toString("dd mmmm YYYY").split("00:")[0];
    return (
      <TouchableOpacity behavior="padding" style={styles.container} onPress={()=> {this.detail()}}>
        <View style={styles.imageContainer}>
          <Image style={styles.image}source={require('../../Images/placeholder.jpg')}/>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.title}>{this.state.name}</Text>
          {/* <Text style={styles.details}>Quantity: {this.props.data.elaborado[0].quantity}</Text> */}
          <Text style={styles.details}>Ordered: {this.props.data.elaborado.length}</Text>
          {/* <Text style={styles.details}>Expiration: {date}</Text> */}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        height: 100,
        backgroundColor: '#1069a3',
        borderRadius: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
        flexDirection: 'row',
    },
    title:{
      color:'#FFF',
      fontSize: 20,
      textAlign: 'center',
      opacity: 0.9
    },
    details:{
      color:'#FFF',
      fontSize: 14,
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
    image:{
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
    imageContainer:{
      width: '30%',
      height: '100%',
      borderBottomLeftRadius: 15,
      borderTopLeftRadius: 15,
      overflow: "hidden",
      marginRight: '15%',
    },
    detailContainer:{
      flexDirection: 'column',
    }
});
