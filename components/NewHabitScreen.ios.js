import moment from 'moment/src/moment';
import React, { Component } from 'react';
import {
	StyleSheet,
	TextInput,
	SegmentedControlIOS,
	TouchableHighlight,
	View,
	Text
} from 'react-native';
import realm from './Realm';

class BaseComponent extends Component {
	 _bind(...methods) {
	  methods.forEach( (method) => this[method] = this[method].bind(this) );
	 }
}

export class NewHabitScreen extends BaseComponent {
	constructor(props) {
		super(props);
		this.state = {
			habitName: "",
			pointValue: null,
			bonusInterval: 'day',
			bonusFrequency: null
		}
		this._bind('_onPressButton');
	}

	_onPressButton(){
		realm.write(()=> {
			let newHabit = realm.create('Habit', {
					name: this.state.habitName,
					pointValue: parseInt(this.state.pointValue),
					bonusInterval: this.state.bonusInterval,
					bonusFrequency: parseInt(this.state.bonusFrequency),
				});
			newHabit.intervals.push({
				intervalStart: moment().startOf(this.state.bonusInterval).toDate(),
				intervalEnd: moment().endOf(this.state.bonusInterval).toDate(),
				allComplete: false
				});
			});
		
		 this.props.events.emit('habitSaved');
		 this.props.navigator.pop();
	}

	render(){
		return(
		<View style={styles.container}>
			<Text>Habit Name:</Text>
			 <TextInput
			    style={styles.input}
			    placeholder="Ex: Washing my dog"
			    onChangeText={(text) => this.setState({habitName: text})}
			    value={this.state.habitName}
	  		/>
	  		<Text>Point Value:</Text>
			 <TextInput
			    style={[styles.input, styles.numeric]}
			    keyboardType="numeric"
			    placeholder="1"
			    onChangeText={(num) => this.setState({pointValue: num})}
			    value={this.state.pointValue}
	  		/>
	  		<Text>Interval:</Text>
	  		<SegmentedControlIOS
	  		style={styles.input}
			values={['Daily', 'Weekly', 'Monthly']}
			selectedIndex={this.state.selectedIndex}
			onChange={(event) => {
				var intervals = ['day', 'week', 'month'];
			    this.setState({bonusInterval: intervals[event.nativeEvent.selectedSegmentIndex]});
			  }}
			/>
	  		<Text>Frequency:</Text>
			 <TextInput
			    style={[styles.input, styles.numeric]}
			    keyboardType="numeric"
			    placeholder="1"
			    onChangeText={(num) => this.setState({bonusFrequency: num})}
			    value={this.state.bonusFrequency}
	  		/>
	  		<TouchableHighlight onPress={this._onPressButton}>
		      <Text>Submit Habit!</Text>
		    </TouchableHighlight>
  		</View>
		)

	}
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 24
  },
  numeric: {
  	width: 25,
  },
  input: {
  	height: 40,
  	width: 400, 
  	borderColor: 'gray', 
  	borderWidth: 1
  }
  });