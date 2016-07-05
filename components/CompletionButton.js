import React, { Component } from 'react';
import {
	StyleSheet,
	TouchableHighlight,
	View,
	Text
} from 'react-native';

export class CompletionButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			completed: this.props.completed
		}

		this._onPressIn = this._onPressIn.bind(this);
	}

	_onPressIn(){
		this.setState({completed: this.state.completed ? false : true});
		//Function to pass up when we have a db
	}

	render(){
		return(
			<TouchableHighlight 
			onPress={this._onPressIn}
style={[styles.base, this.state.completed && styles.completed]}>
				<View style={styles.transparent}>
				<Text style={styles.checkmark}>
				{this.state.completed ? '\u2713' : ''}
				</Text>
				</View>
			</TouchableHighlight>
			);
	}
}

var styles = StyleSheet.create({
	base: {
		backgroundColor: '#CCCCCC',
		borderRadius: 100,
		height: 40,
		width: 40,
		margin: 3,
		justifyContent: 'center'
	},
	touchable: {
		borderRadius: 100,
		height: 40,
		width: 40
	},
	completed: {
		backgroundColor: '#33CC33'
	},
	transparent: {
		borderRadius: 100,
		backgroundColor: 'rgba(0,0,0,0)'
	},
	checkmark: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 24,
		color: '#FFFFFF'
	}


})

// var CompletionButton = React.createClass({
//   getInitialState: function () {
//     return {
//         completed: this.props.completed || false
//      };
//   },
// 	render: function() {
// 		var completionChange = this.props.onHabitCompletion;
// 		var habitId = this.props.habit._id;
// 		var toggleCheck = this.toggleCheck;
// 		return (
// 			<li>
// 			<label>
// 			<input type="checkbox" 
// 				checked={this.state.checked}
// 				onChange={function(e){
// 					toggleCheck(e);
// 					completionChange(habitId, e.target.checked);
// 				}}
// 				/>
// 			</label>
// 			</li>
// 		)
// 	},
// 	toggleCheck: function(e){
// 		this.setState({checked: e.target.checked});
// 	}
// });