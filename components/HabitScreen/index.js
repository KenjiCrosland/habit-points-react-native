import moment from 'moment/src/moment';
import uuid from 'react-native-uuid';
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';
import { ListView } from 'realm/react-native';
import {HabitListItem} from './HabitListItem';
import realm from '../Realm';

import reactMixin from 'react-mixin'
import Subscribable from 'Subscribable';

class BaseComponent extends Component {
	_bind(...methods) {
		methods.forEach( (method) => this[method] = this[method].bind(this) );
	}
}

export class HabitScreen extends BaseComponent {
	constructor(props) {
		super(props);
		this._bind(
			'_renderRow',
			'_loadInitialData', 
			'_refreshData', 
			'_renderHeader', 
			'_renderFooter', 
			'_addCompletion', 
			'_removeCompletion', 
			'_isComplete',
			'_hasPendingIntervals',
			'_getTotalDailyPoints',
			'_dateRangeIsCurrent');
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		this.state = {
			dataSource: ds.cloneWithRows([]),
			dailyPointTotal: 0,
		}
	}

	componentDidMount(){
		this.addListenerOn(this.props.events, 'habitSaved', this._refreshData);
		this.addListenerOn(this.props.events, 'allCompleted', this._refreshData);
		this._loadInitialData();
	}

	_addCompletion(habit){
		let completedOn = new Date();
		let currentInterval = habit.intervals[habit.intervals.length - 1];
				console.log(currentInterval.intervalStart);
		//current interval may not be defined. This completion code needs a look
		realm.write(() => {
			if (!habit.intervals.length ||
				moment(currentInterval.intervalEnd).isBefore(completedOn) ||
				currentInterval.allComplete === true){
				let nextID = habit.intervals.length + 1 + Date.now();
				habit.intervals.push({
					id: uuid.v1(),
					intervalStart: moment().startOf(habit.bonusInterval).toDate(),
					intervalEnd: moment().endOf(habit.bonusInterval).toDate(),
					allComplete: false,
					completions:[]
				});
		}
		if (habit.intervals.length ){
			let nextID = currentInterval.completions.length + 1 + Date.now();
			currentInterval.completions.push({
				id: uuid.v1(),
				habitId: habit.id,
				habitName: habit.name,
				completedOn: completedOn,
				pointValue: habit.pointValue
			});
			if(currentInterval.completions.length === habit.bonusFrequency) {
				currentInterval.allComplete = true;
				let nextID = habit.intervals.length + 1 + Date.now();
				let durationToAdd = moment.duration(1, habit.bonusInterval);
				habit.intervals.push({
					id: uuid.v1(),
					intervalStart: moment().startOf(habit.bonusInterval).add(durationToAdd).toDate(),
					intervalEnd: moment().endOf(habit.bonusInterval).add(durationToAdd).toDate(),
					allComplete: false,
					completions:[]
				});
				this.props.events.emit('allCompleted');
			}
		}
	});
		this._refreshData();
	}

	_removeCompletion(habit){
		if (habit.intervals.length && habit.intervals[habit.intervals.length - 1].completions.length) {
			realm.write(() => {
				let completions = habit.intervals[habit.intervals.length - 1].completions;
				let lastCompletion = completions[completions.length - 1];
				realm.delete(lastCompletion);
			})
		}
		this._refreshData();
	}
	_loadInitialData(){
		let habits = realm.objects('Habit').sorted('pointValue');
		for (h in habits){
			let habit = habits[h];
			if(!this._dateRangeIsCurrent(habit) && !this._hasPendingIntervals(habit)){
			realm.write(() => {
				let nextID = habit.intervals.length + 1 + Date.now();
				habit.intervals.push({
					id: nextID,
					intervalStart: moment().startOf(habit.bonusInterval).toDate(),
					intervalEnd: moment().endOf(habit.bonusInterval).toDate(),
					allComplete: false,
					completions:[]
				});
			})
			}
		}

		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(habits),
			dailyPointTotal: this._getTotalDailyPoints()
		})
	}

	_getTotalDailyPoints(){
		let total = 0;
		let startOfDay = moment().startOf('day').toDate();
		let dailyCompletions = realm.objects('Completion').filtered('completedOn > $0', startOfDay);
		dailyCompletions.forEach(function(completion){
			total += completion.pointValue;
		});
		return total;
	}
	
	_refreshData(){
		let habits = realm.objects('Habit');
		this._getTotalDailyPoints();
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(habits),
			dailyPointTotal: this._getTotalDailyPoints()
		})
	}
	_isComplete(habit) {
		//Check to see if the habit array is completed
		if (habit.intervals.length && habit.intervals[habit.intervals.length - 1].allComplete === true) {
			return true;
		} else {
			return false;
		}
	}

	_hasPendingIntervals(habit){
		let lastInterval = habit.intervals[habit.intervals.length - 1];
		if (moment(new Date).isBefore(lastInterval.intervalStart)) {
			return true;
		} else {
			return false;
		}
	}

	_dateRangeIsCurrent(habit) {
		let lastInterval = habit.intervals[habit.intervals.length - 1];
		if (moment(new Date).isBetween(lastInterval.intervalStart, lastInterval.intervalEnd)) {
			return true;
		} else {
			return false;
		}
	}
	_renderRow(rowData){
		 if(!this._isComplete(rowData) && this._dateRangeIsCurrent(rowData)){
			return <HabitListItem 
					style={styles.listitem}
					habit={rowData} 
					navigator={this.props.navigator} 
					addCompletion={this._addCompletion}
					removeCompletion={this._removeCompletion}/>;
		 }  else {
		 	return null;
		 }
	}

	_renderHeader(){
		return null;

	}

	_renderFooter(){
		return null;
	}

	render(){
		return(
<View>
			<ListView
			style={styles.listview}
			dataSource={this.state.dataSource}
			enableEmptySections={true}
			renderRow={this._renderRow}
			renderHeader={this._renderHeader}
			renderFooter={this._renderFooter}
			/>
			<View>
				<Text>Today's point count: {this.state.dailyPointTotal}</Text>
			</View>
						</View>
			)

	}
}
reactMixin(HabitScreen.prototype, Subscribable.Mixin);

var styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		paddingTop: 24
	},
	listview:{
		flex: 1,
		marginTop: 60,
	},
	listitem:{
		borderTopWidth: 1,
		borderTopColor: '#dddddd',
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee'
	}
});