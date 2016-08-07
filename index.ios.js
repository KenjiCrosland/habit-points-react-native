import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import {HabitPointsNavigator} from './components/HabitPointsNavigator';
import EventEmitter from 'EventEmitter';
import Subscribable from 'Subscribable';

class HabitPoints extends Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
        this.eventEmitter = new EventEmitter();
    }
  render() {
    return (<HabitPointsNavigator events={this.eventEmitter}/>);
  }
}

AppRegistry.registerComponent('HabitPoints', () => HabitPoints);
