import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import {HabitPointsNavigator} from './components/HabitPointsNavigator';
import {StatsView} from './components/StatsView';
import EventEmitter from 'EventEmitter';
import Subscribable from 'Subscribable';

class HabitPoints extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 'home'
		}
	}
	componentWillMount() {
        this.eventEmitter = new EventEmitter();
    }
  render() {
  	let nav = <HabitPointsNavigator events={this.eventEmitter}/>;
  	let stats = <StatsView />
    return (
    	<TabNavigator>
    	<TabNavigator.Item
    	    selected={this.state.selectedTab === 'home'}
            title="Home"
            onPress={() => this.setState({ selectedTab: 'home' })}>
            {nav}
    	</TabNavigator.Item>
    	 <TabNavigator.Item
    	    selected={this.state.selectedTab === 'stats'}
            title="Stats"
            onPress={() => this.setState({ selectedTab: 'stats' })}>
            {stats}
    	</TabNavigator.Item>
    	</TabNavigator>);
  }
}

AppRegistry.registerComponent('HabitPoints', () => HabitPoints);
