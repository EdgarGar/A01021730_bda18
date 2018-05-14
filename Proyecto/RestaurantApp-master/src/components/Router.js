import React from 'react';
import { TabNavigator } from 'react-navigation';
import  { NavigationComponent } from 'react-native-material-bottom-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Login from './Login/Login'
import Recetas from './Recetas/Recetas'
import Almacen from './Almacen/Almacen'
import Platillos from './Platillos/Platillos'
import User from './User/User'
export const Tabs = TabNavigator({
  Almacen: { screen: Almacen },
  Recetas: { screen: Recetas},
  Platillos: { screen: Platillos},
  User:{screen:User}
}, {
  tabBarComponent: NavigationComponent,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    bottomNavigationOptions: {
      labelColor: 'rgb(46, 101, 166)',
      rippleColor: 'rgb(46, 101, 166)',
      tabs: {
        Almacen: {
          label: 'Raw Material',
          barBackgroundColor: 'rgb(241,241,241)',
          icon: <Icon size={24} color="rgb(46, 101, 166)" name="assignment" />
        },
        Recetas: {
          label: 'Recipes',
          barBackgroundColor: 'rgb(241,241,241)',
          icon: <Icon2 size={24} color="rgb(46, 101, 166)" name="food-variant" />
        },
        Platillos: {
          label: 'Dishes',
          barBackgroundColor: 'rgb(241,241,241)',
          icon: <Icon2 size={24} color="rgb(46, 101, 166)" name="food-fork-drink" />
        },
        User: {
          label: 'User',
          barBackgroundColor: 'rgb(241,241,241)',
          icon: <Icon2 size={24} color="rgb(46, 101, 166)" name="account-circle" />
        }
      }
    }
  }
});
