import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, KeyboardAvoidingView, TouchableOpacity, AsyncStorage} from 'react-native';
import {Actions} from "react-native-router-flux";

export default class User extends Component {


  constructor() {
    super();
    this.state = {
      username: 'Anon'
    };
  }

  logout(){
    try {
      AsyncStorage.setItem('userToken', '');
      AsyncStorage.setItem('username', '');
    } catch (error) {
      console.warn("error al salir de sesion");
    }
    Actions.login();
  }


  componentDidMount() {
    AsyncStorage.getItem('username').then((value) => {
      if(value !== null){
        if(value !== ''){
          this.setState({username:value})
        }
      }
    }).done();
  }



  render() {
    return (
      <KeyboardAvoidingView benhavior="padding" style={styles.container}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image style={styles.image}source={require('../../Images/user.png')}/>
            <Text style={styles.title}>{this.state.username}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={()=> {this.logout()}}style={styles.buttonDelete}>
              <Text style={styles.buttonText}>Log out</Text>
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
        alignItems:'center',

    },
    logoContainer: {
      alignItems: "center",
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
    },
    title:{
      color:'#FFF',
      fontSize: 50,
      marginTop: 15,
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
});
