import moment from 'moment/src/moment';
import React, { Component } from 'react';
import {
	StyleSheet,
	TextInput,
	Picker,
	TouchableHighlight,
	View,
	Text
} from 'react-native';
import realm from './Realm';
import {PointPicker} from './PointPicker';

class BaseComponent extends Component {
	 _bind(...methods) {
	  methods.forEach( (method) => this[method] = this[method].bind(this) );
	 }
}

export class HabitFormScreen extends BaseComponent {
	constructor(props) {
		super(props);
		let habit = this.props.habit;
		this.state = {
			habitName: habit ? habit.name : "",
			pointValue: habit ? habit.pointValue.toString() : "1",
			bonusInterval: habit ? habit.bonusInterval : 'day',
			bonusFrequency: habit ? habit.bonusFrequency.toString() : "1"
		}
		this._bind('_onPressButton', '_incrementFrequency', '_decrementFrequency', '_pickPointValue');
	}

	_onPressButton(){
		realm.write(()=> {
			var nextID = realm.objects('Habit').length + 1 + Date.now() || 0;
			let habit = this.props.habit || realm.create('Habit', {
					id: nextID,
					name: this.state.habitName,
					pointValue: parseInt(this.state.pointValue),
					bonusInterval: this.state.bonusInterval,
					bonusFrequency: parseInt(this.state.bonusFrequency),
				});
			if(this.props.habit) {
				habit.name = this.state.habitName;
				habit.pointValue = parseInt(this.state.pointValue);
				habit.bonusInterval = this.state.bonusInterval;
				habit.bonusFrequency = parseInt(this.state.bonusFrequency);
			}
			if (!this.props.habit) {
				habit.intervals.push({
					id: nextID,
					intervalStart: moment().startOf(this.state.bonusInterval).toDate(),
					intervalEnd: moment().endOf(this.state.bonusInterval).toDate(),
					allComplete: false,
					completions: []
					});
				}
			});
		
		 this.props.events.emit('habitSaved');
		 this.props.navigator.pop();
	}
	_incrementFrequency(){
		var num = parseInt(this.state.bonusFrequency);
		if (num < 7){
			this.setState({bonusFrequency: (num + 1).toString() })
		}
	}
	_decrementFrequency(){
		var num = parseInt(this.state.bonusFrequency);
		if (num > 1){
			this.setState({bonusFrequency: (num - 1).toString() })
		}
	}
	_pickPointValue(num){
		num = num.toString()
		this.setState({pointValue: num});
	}

	render(){
		let intervals = ['day', 'week', 'month'];
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
	  		<PointPicker 
	  		numberOfButtons={7} 
	  		currentPointValue={parseInt(this.state.pointValue)} 
	  		pickPointValue={this._pickPointValue} />
	  		<Text>Frequency:</Text>
	  		<View style={styles.fieldset}>
		  		<View style={styles.incrementer}>
			  		<TouchableHighlight onPress={this._incrementFrequency}>
				      <Text style={styles.centerText}>+</Text>
				    </TouchableHighlight>
					 <TextInput
					    style={[styles.input, styles.numeric]}
					    keyboardType="numeric"
					    placeholder={this.state.bonusFrequency}
					    onChangeText={(num) => this.setState({bonusFrequency: num})}
					    value={this.state.bonusFrequency}
			  		/>
			  		<TouchableHighlight onPress={this._decrementFrequency}>
				      <Text style={styles.centerText}>-</Text>
				    </TouchableHighlight>
		  		</View>
		  		<Text>Times a </Text>
		  		<Picker
		  		style={styles.picker}
				  selectedValue={this.state.bonusInterval}
				  onValueChange={(interval) => this.setState({bonusInterval: interval})}>
				  <Picker.Item label="Day" value="day" />
				  <Picker.Item label="Week" value="week" />
				  <Picker.Item label="Month" value="month" />
				</Picker>
		  	</View>

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
    marginTop: 60
  },
  picker: {
    width: 100,
  },
  fieldset: {
  	flex: 0,
  	height: 130,
  	width: 35,
  	flexDirection: 'row',
  	justifyContent: 'center',
  	alignItems: 'center'
  },
  incrementer: {
  	flexDirection: 'column'
  },
  centerText: {
  	textAlign: 'center'
  },
  numeric: {
  	width: 25,
  },
  input: {
  	textAlign: 'center',
  	height: 35,
  	width: 350, 
  	borderColor: 'gray', 
  	borderWidth: 1
  }
  });