import React, { Component } from 'react';
import {
	StyleSheet,
	TouchableHighlight,
	View,
	Text
} from 'react-native';

class BaseComponent extends Component {
	 _bind(...methods) {
	  methods.forEach( (method) => this[method] = this[method].bind(this) );
	 }
}

export class IntervalPicker extends BaseComponent {
	constructor(props) {
		super(props);
	}
	render(){
		var buttons = [];
		for (var i = 0; i < this.props.intervalArray.length; i++){
			buttons.push(
			<IntervalPickerButton
			key={this.props.intervalArray[i] + i.toString()}
			interval={this.props.intervalArray[i]}
			pickIntervalValue={this.props.pickIntervalValue} 
			selected={this.props.currentInterval === this.props.intervalArray[i] ? true : false} 
		   />
			);
		}
		return (
			<View style={styles.buttonRow}>
				{buttons}
			</View>
		)
	}
}

class IntervalPickerButton extends Component {
	constructor(props) {
		super(props);
	}
	render(){
		return (
			<TouchableHighlight
				onPress={() => this.props.pickIntervalValue(this.props.interval)} 
				style={[styles.base, this.props.selected && styles.selected]}>
				<View style={styles.transparent}>
					<Text style={[styles.pickerText, this.props.selected && styles.whitePickerText]}>{this.props.interval}</Text>
				</View>
			</TouchableHighlight>
		)
	}
}

var styles = StyleSheet.create({
	base:{
		borderRadius: 15,
		height: 35,
		width: 55,
		justifyContent: 'center'
	},
	selected: {
		backgroundColor: '#FA7B12'
	},
	transparent: {
		borderRadius: 100,
		backgroundColor: 'rgba(0,0,0,0)'
	},
	pickerText: {
		color: '#000000',
		textAlign: 'center',
		fontSize: 16
	},
	whitePickerText: {
		color: '#FFFFFF'
	},
	buttonRow: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around'
	}
})