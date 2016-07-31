import moment from 'moment/src/moment';
import React, { Component } from 'react';
import {
	StyleSheet,
	TextInput,
	Picker,
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
			pointValue: 1,
			bonusInterval: 'day',
			bonusFrequency: 1
		}
		this._bind('_onPressButton', '_incrementFrequency', '_decrementFrequency');
	}

	_onPressButton(){
		realm.write(()=> {
			var nextID = realm.objects('Habit').length + 1 + Date.now() || 0;
			let newHabit = realm.create('Habit', {
					id: nextID,
					name: this.state.habitName,
					pointValue: parseInt(this.state.pointValue),
					bonusInterval: this.state.bonusInterval,
					bonusFrequency: parseInt(this.state.bonusFrequency),
				});
			newHabit.intervals.push({
				id: nextID,
				intervalStart: moment().startOf(this.state.bonusInterval).toDate(),
				intervalEnd: moment().endOf(this.state.bonusInterval).toDate(),
				allComplete: false,
				completions: []
				});
			});
		
		 this.props.events.emit('habitSaved');
		 this.props.navigator.pop();
	}
	_incrementFrequency(){
		if (this.state.bonusFrequency < 7){
			this.setState({bonusFrequency: this.state.bonusFrequency + 1 })
		}
	}
	_decrementFrequency(){
		if (this.state.bonusFrequency > 1){
			this.setState({bonusFrequency: this.state.bonusFrequency - 1 })
		}
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
	  		<Text>Frequency:</Text>
	  		<View style={styles.fieldset}>
		  		<View style={styles.incrementer}>
			  		<TouchableHighlight onPress={this._incrementFrequency}>
				      <Text style={styles.centerText}>+</Text>
				    </TouchableHighlight>
					 <TextInput
					    style={[styles.input, styles.numeric]}
					    keyboardType="numeric"
					    placeholder={this.state.bonusFrequency.toString()}
					    onChangeText={(num) => this.setState({bonusFrequency: parseInt(num)})}
					    value={this.state.bonusFrequency.toString()}
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
	  		<Text>Point Value:</Text>
			 <TextInput
			    style={[styles.input, styles.numeric]}
			    keyboardType="numeric"
			    placeholder="1"
			    onChangeText={(num) => this.setState({pointValue: num})}
			    value={this.state.pointValue}
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