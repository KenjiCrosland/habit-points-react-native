import moment from 'moment/src/moment';
import React, { Component } from 'react';
import {
	Text,
	View,
	StyleSheet
} from 'react-native';
import { ListView } from 'realm/react-native';
import realm from '../Realm';

class BaseComponent extends Component {
	 _bind(...methods) {
	  methods.forEach( (method) => this[method] = this[method].bind(this) );
	 }


}
 export class DailyView extends BaseComponent {
   constructor(props) {
     super(props);
		this._bind(
			'_getTotalDailyPoints',
			'_renderRow');
		let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
			dataSource: ds.cloneWithRows([]),
			dailyPointTotal: 0,
		}
    }
    componentDidMount(){
		this._loadInitialData();
	}

	_loadInitialData(){
		let dataArray = []
		let todaysCompletions = {};
		let startOfInterval = moment().startOf('day').toDate();
		let endOfInterval = moment().endOf('day').toDate();
		let intervalCompletions = realm.objects('Completion').filtered('completedOn > $0 && completedOn < $1', startOfInterval, endOfInterval).sorted('pointValue', true);
		//Create an object. If the name doesn't exist create the name and do a plus one for each

		intervalCompletions.forEach(function(completion){
			if (!todaysCompletions[completion.habitName]){
				todaysCompletions[completion.habitName] = {}
				todaysCompletions[completion.habitName].total = 1;
				todaysCompletions[completion.habitName].pointValue = completion.pointValue;
			} else {
				todaysCompletions[completion.habitName].total += 1
			}
		});
		for (key in todaysCompletions){
			dataArray.push({habitName: key, total: todaysCompletions[key].total, pointValue: todaysCompletions[key].pointValue });
		}
		console.log(dataArray);

	
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(dataArray),
		});
	}
	_renderRow(rowData){
			return (
				<View>
				<Text>{rowData.habitName}</Text>
				</View>
				);
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
   render() {
     return (
     	<View>
		<Text>Total Points: {this._getTotalDailyPoints()}</Text>
		 <ListView
        dataSource={this.state.dataSource}
        enableEmptySections={true}
        renderHeader={null}
		renderFooter={null}
        renderRow={this._renderRow} />
        </View>
   
     );
   }
 }

 var styles = StyleSheet.create({

 })

