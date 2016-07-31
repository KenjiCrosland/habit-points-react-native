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

export class EditHabitScreen extends BaseComponent {
	constructor(props) {
		super(props);
		let habit = this.props.habit;

		//ITS PASSING!
		console.log(habit.bonusInterval);
		this.state = {
			id: habit.id,
			habitName: habit.name,
			pointValue: habit.pointValue,
			bonusInterval: habit.bonusInterval,
			bonusFrequency: habit.bonusFrequency
		}
		this._bind('_onPressButton');
	}

	_onPressButton(){
		let habit = this.props.habit;
		realm.write(()=> {
			habit.name = this.state.habitName;
			habit.pointValue = parseInt(this.state.pointValue);
			habit.bonusInterval = this.state.bonusInterval;
			habit.bonusFrequency = parseInt(this.state.bonusFrequency);
			});
		
		 this.props.events.emit('habitSaved');
		 this.props.navigator.pop();
	}
	//A method that changes numbers to text and back and forth
	render(){
		let segmentedValues = ['day', 'week', 'month'];
		return(
		<View style={styles.container}>
			<Text>Habit Name:</Text>
			 <TextInput
			    style={styles.input}
			    placeholder={this.state.habitName}
			    onChangeText={(text) => this.setState({habitName: text})}
			    value={this.state.habitName}
	  		/>
	  		<Text>Point Value:</Text>
			 <TextInput
			    style={[styles.input, styles.numeric]}
			    keyboardType="numeric"
			    placeholder={this.state.pointValue.toString()}
			    onChangeText={(num) => this.setState({pointValue: parseInt(num)})}
			    value={this.state.pointValue.toString()}
	  		/>
	  		<Text>Interval:</Text>
	  		<SegmentedControlIOS
	  		style={styles.input}
			values={['Daily', 'Weekly', 'Monthly']}
			selectedIndex={segmentedValues.indexOf(this.state.bonusInterval)}
			onChange={(event) => {
				var intervals = ['day', 'week', 'month'];
			    this.setState({bonusInterval: intervals[event.nativeEvent.selectedSegmentIndex]});
			  }}
			/>
	  		<Text>Frequency:</Text>
			 <TextInput
			    style={[styles.input, styles.numeric]}
			    keyboardType="numeric"
			    placeholder={this.state.bonusFrequency.toString()}
			    onChangeText={(num) => this.setState({bonusFrequency: parseInt(num)})}
			    value={this.state.bonusFrequency.toString()}
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