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

export class PointPicker extends BaseComponent {
	constructor(props) {
		super(props);
	}
	render(){
		var buttons = [];
		for (var i = 1; i <= this.props.numberOfButtons; i++){
			buttons.push(
				<PointPickerButton
					key={i.toString()}
					number={i.toString()} 
					pickPointValue={this.props.pickPointValue} 
					selected={this.props.currentPointValue === i ? true : false} 
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

class PointPickerButton extends Component {
	constructor(props) {
		super(props);
	}
	render(){
		return (
			<TouchableHighlight
				onPress={() => this.props.pickPointValue(this.props.number)} 
				style={[styles.base, this.props.selected && styles.selected]}>
				<View style={styles.transparent}>
					<Text style={[styles.pickerText, this.props.selected && styles.whitePickerText]}>{this.props.number.toString()}</Text>
				</View>
			</TouchableHighlight>
		)
	}
}

var styles = StyleSheet.create({
	base:{
		borderRadius: 100,
		height: 40,
		width: 40,
		margin: 3,
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
		fontSize: 18
	},
	whitePickerText: {
		color: '#FFFFFF'
	},
	buttonRow: {
		flex: 0,
		padding: 5,
		flexDirection: 'row',
		justifyContent: 'space-around'
	}
})