import moment from 'moment/src/moment';
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
			'_dateRangeIsCurrent');
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		this.state = {
			dataSource: ds.cloneWithRows([])
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
					id: nextID,
					intervalStart: moment().startOf(habit.bonusInterval).toDate(),
					intervalEnd: moment().endOf(habit.bonusInterval).toDate(),
					allComplete: false,
					completions:[]
				});
		}
		if (habit.intervals.length ){
			let nextID = currentInterval.completions.length + 1 + Date.now();
			currentInterval.completions.push({
				id: nextID,
				completedOn: completedOn,
				pointValue: habit.pointValue
			});
			if(currentInterval.completions.length === habit.bonusFrequency) {
				currentInterval.allComplete = true;
				let nextID = habit.intervals.length + 1 + Date.now();
				let durationToAdd = moment.duration(1, habit.bonusInterval);
				habit.intervals.push({
					id: nextID,
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
				habit.intervals[habit.intervals.length - 1].completions.pop()
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
			dataSource: this.state.dataSource.cloneWithRows(habits)
		})
	}
	
	_refreshData(){
		let habits = realm.objects('Habit');
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(habits)
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
			<ListView
			style={styles.listview}
			dataSource={this.state.dataSource}
			enableEmptySections={true}
			renderRow={this._renderRow}
			renderHeader={this._renderHeader}
			renderFooter={this._renderFooter}
			/>
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


//Mockdata in case I need it.
var mockdata = {
	habits:[{"_id":"574f9962221dcc0439baefde","startDate":"2016-06-02T02:26:42.347Z","name":"Drink a glass of water","bonusInterval":"day","pointValue":1,"bonusFrequency":6,"__v":3,"intervals":[{"intervalStart":"2016-06-01T07:00:00.000Z","intervalEnd":"2016-06-02T06:59:59.999Z","allComplete":false,"_id":"574f9967221dcc0439baefdf","completions":[{"pointValue":1,"_id":"574f9967221dcc0439baefe0"},{"pointValue":1,"_id":"574f9968221dcc0439baefe1"},{"pointValue":1,"_id":"574f9968221dcc0439baefe2"}]}]},{"_id":"574f9985221dcc0439baefe3","startDate":"2016-06-02T02:27:17.068Z","name":"5 minute meditation","bonusInterval":"day","pointValue":1,"bonusFrequency":3,"__v":2,"intervals":[{"intervalStart":"2016-06-05T07:00:00.000Z","intervalEnd":"2016-06-06T06:59:59.999Z","allComplete":false,"_id":"57548b2c221dcc0439baefea","completions":[{"pointValue":1,"_id":"57548b2c221dcc0439baefeb"},{"pointValue":1,"_id":"57548b33221dcc0439baefec"}]}]},{"_id":"57548e79221dcc0439baeff0","startDate":"2016-06-05T20:41:29.131Z","name":"Work on Habit Points","bonusInterval":"week","pointValue":4,"bonusFrequency":5,"__v":0,"intervals":[]}]
}