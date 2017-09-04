import React from 'react'
import { AppRegistry } from 'react-native'
 
//import Root from './app/root'
//import Share from './app/share.ios'
//import App from './app/app.ios'

//AppRegistry.registerComponent('KenestoShareEx', () => Share)
//AppRegistry.registerComponent('KenestoToGo', () => App)


AppRegistry.registerComponent('KenestoShareEx', () => require( './app/share').default);
AppRegistry.registerComponent('KenestoToGo', () => require('./app/root').default);


