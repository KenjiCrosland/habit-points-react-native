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
import {DailyView} from './DailyView';
import {Chart} from './Chart';
import {IntervalPicker} from '../IntervalPicker';
import reactMixin from 'react-mixin'
import Subscribable from 'Subscribable';





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
			'_getArrayOfWeeks',
			'_getArrayOfMonthsByYear',
			'_getTotalDailyPoints',
			'_loadData');
		this.state = {
			intervalType: 'Week',
			day: 'day',
			thisWeek: this._getArrayOfDaysByWeek(),
			multipleWeeks: this._getArrayOfWeeks(),
			year: this._getArrayOfMonthsByYear(),
			intervals: this._getArrayOfDaysByWeek(),
		};
	}

	componentDidMount(){
		 this.addListenerOn(this.props.events, 'tabSwitch', this._loadData);
		 this._loadData();
	};

	_loadData(){
		let thisWeek = this._getArrayOfDaysByWeek();
		let multipleWeeks = this._getArrayOfWeeks();
		this.setState({
			thisWeek: thisWeek,
			multipleWeeks: multipleWeeks,
			year: this._getArrayOfMonthsByYear(),
			intervals: thisWeek
		})
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

		return arrayOfWeeks;
		
	}
	_getArrayOfMonthsByYear(){
//Do we even need this for an MVP?
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
		return arrayOfDays;
	}
	_getTotalPoints(intervalObj, intervalType, index){
		let total = 0;
		index = (index + 1).toString();
		let startOfInterval = moment(intervalObj[index]).startOf(intervalType).toDate();
		let endOfInterval = moment(intervalObj[index]).endOf(intervalType).toDate();
		let intervalCompletions = realm.objects('Completion').filtered('completedOn > $0 && completedOn < $1', startOfInterval, endOfInterval);
		intervalCompletions.forEach(function(completion){
			total += completion.pointValue;
		});
		return total;
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

		let intervalMap = {
			'Day': 'day',
			'Week': 'thisWeek',
			'8-Week': 'multipleWeeks',
			'Year': 'year'
		}
		let current = intervalMap[this.state.intervalType];
		if (this.state[current] === 'day'){
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
			  		intervalArray={['Day', 'Week', '8-Week']}
			  		/>
				</View>
				<DailyView events={this.props.events} />
			</View>
			)
		}else{
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
		  		intervalArray={['Day', 'Week', '8-Week']}
		  		/>
			</View>
 			<Chart 
				scaleY={this._getLargestPointValue(this.state[current]) * 1.25}
				scaleX={this.state[current].length}
				intervals={this.state[current]}
			/>
			</View>
		)
	}
}
}
let chartHeight = deviceHeight - 200;
let chartWidth = deviceWidth - 50;

reactMixin(StatsView.prototype, Subscribable.Mixin);

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