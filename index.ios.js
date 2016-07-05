/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import {HabitScreen} from './components/HabitScreen';

class HabitPoints extends Component {
  render() {
    return (
          <HabitScreen />
    );
  }
}

AppRegistry.registerComponent('HabitPoints', () => HabitPoints);
