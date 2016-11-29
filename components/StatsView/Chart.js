import moment from 'moment/src/moment';
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableHighlight,
	Dimensions
} from 'react-native';
import {IntervalPicker} from '../IntervalPicker';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

class BaseComponent extends Component {
	 _bind(...methods) {
	  methods.forEach( (method) => this[method] = this[method].bind(this) );
	 }
}

export class Chart extends BaseComponent {
	constructor(props) {
		super(props);
	}

	render(){
		let bars = [];
		let xaxis = [];
		let yaxis = [];
		let count = 0;
		let date = "";
		let scaleY = this.props.scaleY;
		let scaleX = this.props.scaleX;
		//Choose interval type here.
		this.props.intervals.forEach(function(interval){
			count += 1;
			calculatedBarHeight = (chartHeight/scaleY) * interval.totalPoints;
			calculatedBarWidth = (chartWidth/scaleX) - 2; //TODO: Change this number to a variable
			date = moment(interval[count]).format("M/DD");
			bars.push(<View key={count.toString() + "-bar"} style={[styles.bar, {height: calculatedBarHeight, width: calculatedBarWidth}]}></View>);
			xaxis.push(
				<View key={count.toString() + "-barIncrement"} style={{width: calculatedBarWidth}}>
				<Text  style={styles.xaxisText}>
				{date}
				</Text>
				</View>);
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
			<View key={i.toString() + "-yIncrement"} style={[styles.yIncrementView, {height: incrementHeight}]}>
				<Text style={styles.yIncrementText}>{current}</Text>
			</View>);
			}
		}
		


		return (
			<View style={styles.mainContainer}>
			<View style={styles.container}>
				<View style={[styles.yaxis]}>{yaxis}</View>
				<View style={styles.chart}>
				{bars}
				</View>



			</View>
				<View style={styles.xaxis}>
					{xaxis}
				</View>
			</View>
		)
	}
}
let chartHeight = deviceHeight - 200;
let chartWidth = deviceWidth - 30;

const styles = StyleSheet.create({
	mainContainer:{
		flex: 1,
		flexDirection: 'column'
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
	},
	container:{
		flex: 1,
		flexDirection:'row',
		flexWrap: 'wrap',
		width: deviceWidth,
		marginTop: 20,
		marginLeft: 10
	},
	bar: {
		marginLeft: 1,
		marginRight: 1,
		backgroundColor: '#FFBB20'
	},
	xaxisText:{
		alignSelf: 'center',
		textAlign: 'center',
		color: '#FA7B12',
		fontSize: 10
	},
	yaxis: {
		flex:0,
		width: 20,
		height: chartHeight,
		justifyContent: 'flex-end',
		flexDirection: 'column'
	},
	yIncrementView: {
		flex: 0,
		flexDirection: 'column'
	},
	yIncrementText: {
		fontSize: 12
	},
	xaxis: {
		flex: 0,
		flexDirection: 'row',
		height: 20,
		width: chartWidth,
		marginLeft: 30,
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