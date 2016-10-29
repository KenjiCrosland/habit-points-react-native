import moment from 'moment/src/moment';
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableHighlight,
	Dimensions
} from 'react-native';
import realm from '../Realm';
import {Chart} from './Chart';
import {IntervalPicker} from '../IntervalPicker';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

class BaseComponent extends Component {
	 _bind(...methods) {
	  methods.forEach( (method) => this[method] = this[method].bind(this) );
	 }
}

export class StatsView extends BaseComponent {
	constructor(props) {
		super(props);
		this._bind(
			'_getTotalPoints', 
			'_getArrayOfDaysByMonth', 
			'_getLargestPointValue', 
			'_getArrayOfDaysByWeek', 
			'_pickIntervalValue',
			'_getArrayOfWeeks');
		this.state = {
			intervalType: 'Week',
			intervals: this._getArrayOfDaysByWeek(),
		};
		//TODO: Get new stats every time we go to this view....May need event listeners
		//We also need to be able to cycle through
	}

	_getArrayOfWeeks(){
		let self = this;
		//Get current week number of the year
		let currentWeek = moment().week();
		let firstWeek = currentWeek - 7;
		let arrayOfWeeks = [];
		let NUMBER_OF_WEEKS = 8;

		//This creates an array of week numbers

		for(i = 1; i <= NUMBER_OF_WEEKS; i++) {
			let current = moment().week(firstWeek).day(0).toDate();
			arrayOfWeeks.push({[i]: current});
			firstWeek += 1;
		}

		arrayOfWeeks.forEach(function(week, index){
			week.totalPoints = self._getTotalPoints(week, 'week', index);
		})

		console.log(arrayOfWeeks);
		return arrayOfWeeks;
		//Loop through each week and create and use a getTotalWeeklyPoints Method
	}
	_getTotalWeeklyPoints(){
		//Do the thing that it says

		//Array of sundays?

		//Probably could use get total daily points.
	}
	_getArrayOfDaysByWeek(){
		let self = this;
		let arrayOfDays = [];
		const DAYS_IN_WEEK = 7;

		//Turn this into its own function and loop through it 
		for(i = 0; i < DAYS_IN_WEEK; i++) {
			let current = moment().day(i).toDate();
			let number = i + 1;
			arrayOfDays.push({[number]: current});
		}

		arrayOfDays.forEach(function(day, index){
			day.totalPoints = self._getTotalPoints(day, 'day', index);
		});

		console.log(arrayOfDays);
		return arrayOfDays;
	}
	_getArrayOfDaysByMonth(){
		let self = this;
		let daysInMonth = moment().daysInMonth();
		let arrayOfDays = [];

		while(daysInMonth) {
			let current = moment().date(daysInMonth).toDate();
			arrayOfDays.unshift({[daysInMonth]: current});
			daysInMonth--;
		}
		arrayOfDays.forEach(function(day, index){
			day.totalPoints = self._getTotalPoints(day, 'day', index);
		});
		console.log(arrayOfDays);
		return arrayOfDays;
	}
	_getTotalPoints(intervalObj, intervalType, index){
		let total = 0;
		index = (index + 1).toString();
		//Something funky going on here. It's undefined
		console.log(intervalObj[index]);
		let startOfInterval = moment(intervalObj[index]).startOf(intervalType).toDate();
		let endOfInterval = moment(intervalObj[index]).endOf(intervalType).toDate();
		let intervalCompletions = realm.objects('Completion').filtered('completedOn > $0 && completedOn < $1', startOfInterval, endOfInterval);
		intervalCompletions.forEach(function(completion){
			total += completion.pointValue;
		});
		return total;
	}
	_getLargestPointValue(arrayOfIntervals){
		let pointValueArray = [];
		arrayOfIntervals.forEach(function(interval){ 
			pointValueArray.push(interval.totalPoints)
		});
		return pointValueArray.reduce(function(previous, next){
			return (previous > next ? previous : next);
		});
	}
	_pickIntervalValue(interval){
		this.setState({intervalType: interval})
	}
	render(){
		


		return (
			<View style={styles.mainContainer}>
			<View style={styles.topBar}>
				<Text style={styles.topBarText}>Stats</Text>
			</View>
			<View style={styles.menubar}>
				<IntervalPicker 
		  		currentInterval={this.state.intervalType}
		  		pickIntervalValue={this._pickIntervalValue}
		  		pickerType="topBarMenu"
		  		intervalArray={['Day', 'Week', '8-Week', 'Year', 'Total']}
		  		/>
			</View>
 			<Chart 
				scaleY={this._getLargestPointValue(this.state.intervals) * 1.25}
				scaleX={this.state.intervals.length}
				intervals={this.state.intervals}
			/>
			</View>
		)
	}
}
let chartHeight = deviceHeight - 200;
let chartWidth = deviceWidth - 50;

const styles = StyleSheet.create({
	mainContainer:{
		height: deviceHeight
	},
	topBar: {
		flex: 0,
		alignItems: 'center',
		backgroundColor: '#FFBB20',
		height: 64,
		width: deviceWidth
	},
	topBarText: {
		color: '#FFFFFF',
		top: 27,
	    fontWeight: '700',
	    fontSize: 16,
	    color: '#FFFFFF'
	},
	menubar: {
		flex: 0,
		width: deviceWidth,
		justifyContent: 'space-between',
		flexDirection: 'row'
	}
})