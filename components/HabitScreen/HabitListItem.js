import React, { Component } from 'react';
import {
	StyleSheet,
	TouchableHighlight,
	View,
	Text,
	Dimensions
} from 'react-native';
import {CompletionButton} from './CompletionButton';
import {FadeInView} from './FadeInView';
import {HabitFormScreen} from '../HabitFormScreen';
let deviceWidth = Dimensions.get('window').width;
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
			return '1 Pt';
		}
		return habit.pointValue + ' Pts';
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
		let indicators = [];
		for(let i = 0; i < habit.bonusFrequency; i++) {
			var completed;
			if (recentCompletions.length <= i)  {
				completed = false;
			} else {
				completed = true;
			}
			completions.push(<CompletionButton key={habit.id + i} completed={completed} addCompletion={this.props.addCompletion} removeCompletion={this.props.removeCompletion} habit={habit}/>);
			indicators.push(<View key={habit.id + i} style={[styles.indicator, completed && styles.completed]}></View>)
		}
		return(
			<TouchableHighlight onPress={this._onPressRow}>
			<View>

			{this.state.overlayVisible ? null :
			(<View style={styles.container}>
				<View style={styles.pointValueContainer}>
					<Text style={styles.pointValue}>{this._returnPointValueString(habit)}</Text>
			</View>
				<View style={styles.habitNameContainer}>
				<Text style={styles.habitName}>{habit.name}</Text>
				<View style={styles.indicatorRow}>
					<Text>{this._returnDisplayInterval(habit)} Bonus:</Text>{indicators}
				</View>
			</View>
			</View>
			)}
			{
				this.state.overlayVisible ? 

				(<FadeInView style={styles.habitNameContainer}>
					<View style={styles.overlayContainer}>
					<View style={styles.topRow}>
						<Text style={styles.habitNameExpanded}>{habit.name}</Text>
						<View style={styles.expandedPointValueContainer}>
						<Text style={styles.pointValue}>{this._returnDisplayInterval(habit)}</Text>
						<Text style={styles.pointValue}>{this._returnPointValueString(habit)}</Text>
						</View>
					</View>
					<View style={styles.completionRow}>
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
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		height: 75,
		borderTopWidth: 1,
		borderTopColor: '#dddddd',
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee'

	},
	overlayContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		borderTopWidth: 1,
		borderTopColor: '#dddddd',
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee',
		paddingBottom: 10
	},
	topRow:{
		flex: 0,
		flexDirection: 'row',
		width: deviceWidth,
		padding: 10,
		paddingBottom: 5,
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	alignFlexStart: {
		paddingLeft: 15,
		alignSelf: 'flex-start'
	},
	pointValueContainer:{
		flex: 1,
		width: 40,
		borderRadius: 10,
		margin: 5,
		marginLeft: 10,
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFBB20'
	},
	expandedPointValueContainer:{
		flex: 0,
		borderRadius: 10,
		padding: 5,
		flexDirection: 'column',
		backgroundColor: '#FFBB20'
	},
	indicator:{
		backgroundColor: '#CCCCCC',
		borderRadius: 100,
		height: 10,
		width: 10,
		margin: 2,
		justifyContent: 'center'
	},
	completed: {
		backgroundColor: '#59CC0D'
	},
	goalContainer: {
		alignSelf: 'flex-start',
		justifyContent: 'flex-start',
		padding: 5,
		width: 65,
		height: 75,
	},
	pointValue: {
		fontSize: 10,
		fontWeight: '700',
		color: '#FFFFFF',
		textAlign: 'center',
		
	},
	habitNameContainer: {
		flex: 0,
		paddingLeft: 7,
		width: deviceWidth - 42,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	habitName: {
		marginTop: 5,
		fontSize: 16,
		textAlign: 'left'
	},
	habitNameExpanded: {
		fontSize: 16,
	},
	indicatorRow: {
		flex: 0,
		marginTop: 5,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	completionRow:{
		flex: 0,
		marginTop: 5,
		marginBottom: 10,
		width: deviceWidth - 50,
		flexWrap: 'wrap',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	editButton:{
		color: '#E85305',
		textAlign: 'center'
	}
})