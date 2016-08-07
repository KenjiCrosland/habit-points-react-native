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

	render(){

		var habit = this.state.habit;
		if (!habit.intervals[habit.intervals.length - 1]){
			recentCompletions = [];
		} else { 
			recentCompletions = habit.intervals[habit.intervals.length - 1].completions;
		}
		var completions = [];
		for(var i = 0; i < habit.bonusFrequency; i++) {
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
			<View>
			{
				this.state.overlayVisible ? null :
				(<View style={styles.container}>
					<Text>{habit.name}</Text>
					</View>)
			}
			{
				this.state.overlayVisible ? 
				(<FadeInView style={styles.overlay}>
					<Text>{habit.name}</Text>
					<View style={styles.row}>
					{completions}
					</View>
					<TouchableHighlight onPress={this._onPressEdit}>
					<Text style={styles.editButton}>
					Edit Habit
					</Text>
					</TouchableHighlight>
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
		flexDirection: 'column',
		height: 125
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