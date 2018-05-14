import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage
} from 'react-native';

import Login from './src/components/Login/Login'
import ForgotPassword from './src/components/Login/ForgetPassword'
import Register from './src/components/Login/Register'
import Navigation from './src/components/Navigation'
import NewRawMaterial from './src/components/Almacen/NewRawMaterial'
import NewDish from './src/components/Platillos/NewDish'
import NewRecipe from './src/components/Recetas/NewRecipe'
import RawMaterialDetail from './src/components/Almacen/RawMaterialDetail'
import RecipeDetail from './src/components/Recetas/RecipeDetail'
import DishDetail from './src/components/Platillos/DishDetail'
import User from './src/components/User/User'

import {Scene, Router} from 'react-native-router-flux';

export default class App extends Component<{}> {

  constructor() {
    super()
  }


  render() {
    return <Router>
      <Scene key="Root">
        <Scene key="login" component={Login} hideNavBar/>
        <Scene key="user" component={User} hideNavBar/>
        <Scene key="register" component={Register} hideNavBar/>
        <Scene key="noPass" component={ForgotPassword} hideNavBar/>
        <Scene key="nav" component={Navigation} hideNavBar/>
        <Scene key="newRaw" component={NewRawMaterial} hideNavBar/>
        <Scene key="newDish" component={NewDish} hideNavBar/>
        <Scene key="newRecipe" component={NewRecipe} hideNavBar/>
        <Scene key="rawDetail" component={RawMaterialDetail} hideNavBar/>
        <Scene key="recipeDetail" component={RecipeDetail} hideNavBar/>
        <Scene key="dishDetail" component={DishDetail} hideNavBar/>
      </Scene>
    </Router>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
});
