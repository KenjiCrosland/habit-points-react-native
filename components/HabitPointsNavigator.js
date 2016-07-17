import React, { Component } from 'react';
import {
  Navigator, 
  Text, 
  TouchableHighlight 
} from 'react-native';

import {HabitScreen} from './HabitScreen';
import {NewHabitScreen} from './NewHabitScreen';
import realm from './Realm';

export class HabitPointsNavigator extends Component {
	constructor(props) {
		super(props);
		this._renderScene = this._renderScene.bind(this);
	}
	_renderScene(route, navigator) {
    	var Component = route.component;
    	return (
      		<Component {...route.props} navigator={navigator} route={route} events={this.props.events} />
    	);
  	}
  render() {
  	const routes = [
		{component: HabitScreen, index: 0},
		{component: NewHabitScreen, index: 1}
  	];
 
    return (
    	<Navigator
    	initialRoute={{
        component: HabitScreen,
        index: 0
      }}
    	renderScene={this._renderScene}
    	navigationBar={
    		  <Navigator.NavigationBar
    		  routeMapper={{
         LeftButton: (route, navigator, index, navState) =>
          { 
          	if(route.index === 0){
          		return null
          	} else {
          		return (
              <TouchableHighlight onPress={() => navigator.pop()}>
              <Text>Back</Text>
              </TouchableHighlight>
              ); 
          	}
          },
         RightButton: (route, navigator, index, navState) =>
           {
           if (route.index === 0){
            return (
              <TouchableHighlight onPress={() => navigator.push({
                component: NewHabitScreen,
                index: 1
              })}>
              <Text>New Habit!</Text>
              </TouchableHighlight>
            )
           } else {
            return null;
           } 
         },
         Title: (route, navigator, index, navState) =>
           { return null; },
       }}
    		  />
    	}

    	/>
    
  		);
  }
}