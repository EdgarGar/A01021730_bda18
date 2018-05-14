import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  AsyncStorage,
  AlertIOS
} from "react-native";

import { StackNavigator } from "react-navigation";
import {registerUser} from '../API/APICommunication.js';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      password: "",
      password_confirmation: ""
    };
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#16a085",
      elevation: null
    }
  };

  async onRegisterPress() {
    const { name, email, password } = this.state;
    if(email == "" || name == "" || password == ""){
      AlertIOS.alert(
        'Please fill all the fields',
      );
      return 0;
    }
    if(email.includes('@') == false){
      AlertIOS.alert(
        'Add a valid email',
      );
    }
    if(password != this.state.password_confirmation){
      AlertIOS.alert(
        'The passwords dont match',
      );
    }
    let callback = function setToken(token){
      if(token.true){
        try {
          AsyncStorage.setItem('userToken', token.token);
        } catch (error) {
          console.warn("error al guardar el token");
        }
        Actions.nav();
      }
      else{
        AlertIOS.alert(
          'No se pudo crear el usuario',
          'por favor intenta de nuevo mas tarde'
        );
      }

    }.bind(this)
    registerUser(name, email, password, callback);
  }

  renderError(){
    if(this.state.password != this.state.password_confirmation){
      return(
        <View>
          <Text style={styles.error}>Passwords don't match</Text>
        </View>
      )
    }
  }

  renderEmailError(){
    let email = this.state.email
    if(email != '' && email.includes('@')== false){
      return(
        <View>
          <Text style={styles.error}>Enter a valid email</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.subtext}>Sign Up</Text>

        <KeyboardAvoidingView>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="next"
            onSubmitEditing={() => this.emailInput.focus()}
          />
          <Text style={styles.inputTitle}>Email</Text>
          {this.renderEmailError()}
          <TextInput
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            style={styles.input}
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="next"
            ref={input => (this.emailInput = input)}
            onSubmitEditing={() => this.passwordCInput.focus()}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="johnny@falsemail.com"
          />
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            onChangeText={password => this.setState({ password })}
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="rgba(255,255,255,0.7)"
            onSubmitEditing={() => this.passwordInput.focus()}
            returnKeyType="next"
            secureTextEntry
          />
          <TextInput
            onChangeText={password_confirmation => this.setState({ password_confirmation })}
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="go"
            secureTextEntry
          />
          {this.renderError()}
        </KeyboardAvoidingView>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity style={styles.button} onPress={() => this.onRegisterPress()}>
            <Text
              style={styles.buttonText}
              title="Sign up"
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#16a085",
    padding: 20,
    paddingTop: 100
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 200,
    height: 200
  },
  input: {
    height: 40,
    width: 350,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    paddingHorizontal: 10
  },
  buttonText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700"
  },
  button: {
    flex:1,
    backgroundColor: "#0c8358",
    paddingVertical: 10,
    marginTop: 50
  },
  subtext: {
    color: "#ffffff",
    width: 160,
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 40
  },
  inputTitle:{
    color:'#FFF',
    fontSize: 18,
    marginBottom: 15,
    opacity: 0.9
  },
  error:{
    fontSize: 20,
    color:'#ed2222',
    textAlign:'center',

  }
});

AppRegistry.registerComponent("Register", () => Register);
