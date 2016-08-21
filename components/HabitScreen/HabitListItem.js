import React, { Component } from 'react';
import {
	StyleSheet,
	TouchableHighlight,
	View,
	Text
} from 'react-native';
import {CompletionButton} from './CompletionButton';
import {FadeInView} from './FadeInView';
import {HabitFormScreen} from '../HabitFormScreen';

export class HabitListItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			habit: this.props.habit,
			overlayVisible: false
		}
		this._onPressRow = this._onPressRow.bind(this);
		this._onPressEdit = this._onPressEdit.bind(this);
		this._returnDisplayInterval = this._returnDisplayInterval.bind(this);
		this._returnPointValueString = this._returnPointValueString.bind(this);
	}

	_onPressRow() {
		this.setState({overlayVisible: !this.state.overlayVisible});
	}
	_onPressEdit(habit) {
		 this.props.navigator.push({
		 	    component: HabitFormScreen,
                index: 2,
                props: { habit: this.state.habit }
		 });
	}

	_returnPointValueString(habit){
		if(habit.pointValue === 1){
			return '1 Point';
		}
		return habit.pointValue + ' Points';
	}

	_returnDisplayInterval(habit){
		switch(habit.bonusInterval){
			case 'day':
				return 'Daily';
			case 'week':
				return 'Weekly';
			case 'month':
				return 'Monthly';
			default:
				return 'Daily';
		}
	}

	render(){
		let habit = this.state.habit;
		var recentCompletions;
		if (!habit.intervals[habit.intervals.length - 1]){
			recentCompletions = [];
		} else { 
			recentCompletions = habit.intervals[habit.intervals.length - 1].completions;
		}
		let completions = [];
		for(let i = 0; i < habit.bonusFrequency; i++) {
			var completed;
			if (recentCompletions.length <= i)  {
				completed = false;
			} else {
				completed = true;
			}
			completions.push(<CompletionButton key={habit.id + i} completed={completed} addCompletion={this.props.addCompletion} removeCompletion={this.props.removeCompletion} habit={habit}/>);
		}
		return(
			<TouchableHighlight onPress={this._onPressRow}>
			<View style={[styles.container, this.state.overlayVisible && styles.expanded]}>
			<View style={styles.goalContainer}>
				<Text>{this._returnPointValueString(habit)}</Text>
			</View>
			{
				this.state.overlayVisible ? null :
				(<View style={styles.habitNameContainer}>
					<Text style={styles.habitName}>{habit.name}</Text>
					<Text style={styles.goal}>Goal: {recentCompletions.length}/{habit.bonusFrequency} {this._returnDisplayInterval(habit)}</Text>
				</View>)
			}
			{
				this.state.overlayVisible ? 

				(<FadeInView style={styles.habitNameContainer}>
					<View>
					<Text style={styles.habitName}>{habit.name}</Text>
					<Text style={styles.goal}>Goal: {recentCompletions.length}/{habit.bonusFrequency} {this._returnDisplayInterval(habit)}</Text>
					<View style={styles.row}>
						{completions}
					</View>

					<TouchableHighlight onPress={this._onPressEdit}>
						<Text style={styles.editButton}>
							Edit Habit
						</Text>
					</TouchableHighlight>
					</View>
				</FadeInView>) : null
			}
			</View>
			</TouchableHighlight>
			)
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		height: 75,
		borderTopWidth: 1,
		borderTopColor: '#dddddd',
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee'

	},
	goalContainer: {
		alignSelf: 'flex-start'
		width: 55
	},
	habitNameContainer: {
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center',
		paddingTop: 10,
		width: 250
	},
	expanded:{
		height: 135,
		paddingBottom: 10
	},
	habitName: {
		fontSize: 18,
		textAlign: 'center'
	},
	goal: {
		textAlign: 'center'
	},
	row:{
		flex: 1,
		marginTop: 10,
		marginBottom: 10,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	editButton:{
		color: '#1D62F0',
		textAlign: 'center'
	}
})