import moment from 'moment/src/moment';
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Dimensions
} from 'react-native';
import realm from './Realm';
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
		this._bind('_getTotalDailyPoints', '_getArrayOfDaysByMonth', '_getLargestPointValue');
		this.state = {
			intervalType: 'day',
			intervals: this._getArrayOfDaysByMonth(),
		};
		//TODO: Get new stats every time we go to this view....May need event listeners
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

	render(){
		let bars = [];
		let xaxis = [];
		let yaxis = [];
		let count = 0;
		let scaleY = this._getLargestPointValue(this.state.intervals) * 1.25
		let scaleX = this.state.intervals.length;
		this.state.intervals.forEach(function(interval){
			count += 1;
			calculatedBarHeight = (chartHeight/scaleY) * interval.totalPoints;
			calculatedBarWidth = (chartWidth/scaleX) - 2; //TODO: Change this number to a variable
			bars.push(<View key={count.toString() + "-bar"} style={[styles.bar, {height: calculatedBarHeight, width: calculatedBarWidth}]}></View>);
			if (count === 1 || count === 15 || count === scaleX){
				xaxis.push(<Text key={count.toString() + "-barIncrement"} style={styles.xaxisText}>9/{count}</Text>);
			}
		});

		const INCREMENT_COUNT = 7;
		let yIncrement = 5;
		while (scaleY/INCREMENT_COUNT > yIncrement){
			yIncrement += 5;
		}
		let incrementHeight = yIncrement * (chartHeight/scaleY);
		//let yPadding = (yIncrement * (chartHeight/scaleY)) % yIncrement;
		for(i = 0; i < INCREMENT_COUNT; i++){
			let current = yIncrement * (i+1);
			if(yIncrement * (chartHeight/scaleY) * i + incrementHeight <= chartHeight){
			yaxis.unshift(
			<View key={i.toString() + "-yIncrement"} style={[styles.yIncrementText, {height: incrementHeight}]}>
				<Text>{current}</Text>
			</View>);
			}
		}
		


		return (
			<View style={styles.mainContainer}>
			<View style={styles.topBar}>
				<Text style={styles.topBarText}>Stats</Text>
			</View>

				<View style={styles.container}>
				<View style={[styles.yaxis]}>{yaxis}</View>
				<View style={styles.chart}>
				{bars}
				</View>
				<View style={styles.xaxis}>
					{xaxis}
				</View>
				</View>
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
	container:{
		flex: 1,
		flexDirection:'row',
		flexWrap: 'wrap',
		width: deviceWidth,
		marginTop: 20,
		marginBottom: 80,
		marginLeft: 10,
		marginRight: 10
	},
	bar: {
		marginLeft: 1,
		marginRight: 1,
		backgroundColor: '#FFBB20'
	},
	xaxisText:{
		textAlign: 'center',
		color: '#FA7B12'
	},
	yaxis: {
		flex:0,
		width: 20,
		height: chartHeight,
		justifyContent: 'flex-end',
		flexDirection: 'column'
	},
	yIncrementText: {
		flex: 0,
		flexDirection: 'column',
	},
	xaxis: {
		flex: 0,
		flexDirection: 'row',
		height: 20,
		marginLeft: 0,
		width: chartWidth,
		marginLeft: 20,
		alignSelf: 'flex-start',
		justifyContent: 'space-between'
	},
	chart: {
		flex: 1,
		height: chartHeight,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'flex-start',
		width: chartWidth,
		borderBottomWidth: 1,
		borderBottomColor: '#EEEEEE'
	}
})