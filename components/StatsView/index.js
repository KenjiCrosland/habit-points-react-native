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
		this._bind('_getTotalDailyPoints', '_getArrayOfDaysByMonth', '_getLargestPointValue', '_getArrayOfDaysByWeek', '_pickIntervalValue');
		this.state = {
			intervalType: 'Week',
			intervals: this._getArrayOfDaysByWeek(),
		};
		//TODO: Get new stats every time we go to this view....May need event listeners
		//We also need to be able to cycle through
	}
	// _getArrayOfIntervals(){
	// 	//TODO...switcth through intervals
	// 	//getArrayOfDaysByWeek
	// 	//getArrayOfLastEightWeeks
	// 	//getYearly array
	// }
	_getArrayOfWeeks(){
		//Get the sunday from 8 weeks ago
		//Get the total of the total for each day
		//Add labels to the bottom of each
	}
	_getArrayOfDaysByWeek(){
		let self = this;
		let arrayOfDays = [];
		const DAYS_IN_WEEK = 7;

		for(i = 0; i < DAYS_IN_WEEK; i++) {
			let current = moment().day(i).toDate();
			let number = i + 1;
			arrayOfDays.push({[number]: current});
		}

		arrayOfDays.forEach(function(day, index){
			day.totalPoints = self._getTotalDailyPoints(day, index);
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
			day.totalPoints = self._getTotalDailyPoints(day, index);
		});
		console.log(arrayOfDays);
		return arrayOfDays;
	}
	_getTotalDailyPoints(intervalObj, index){
		let total = 0;
		index = (index + 1).toString();
		let startOfInterval = moment(intervalObj[index]).startOf('day').toDate();
		let endOfInterval = moment(intervalObj[index]).endOf('day').toDate();
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
		  		pickerType={"topBarMenu"}
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