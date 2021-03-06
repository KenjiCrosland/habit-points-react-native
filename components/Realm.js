'use strict';

import Realm from 'realm';

class Habit extends Realm.Object {}

Habit.schema = {
	name: 'Habit',
	primaryKey: 'id',
	properties: {
		id: 'string', 
		name: 'string',
		description: 'string',
		pointValue: 'int',
		//Bonus interval: day, week, month
		bonusInterval: {type: 'string', default: 'day'},
		bonusFrequency: 'int',
		snoozeActive: 'bool',
		snoozeInterval: {type: 'string', default: 'hour'},
		snoozeIncrement: 'int',
		intervals: {type:'list', objectType: 'Interval'}
	}
}

class Interval extends Realm.Object {}

Interval.schema = {
	name: 'Interval',
	primaryKey: 'id',
	properties: {
		id: 'string', 
		intervalStart: 'date',
		intervalEnd: 'date',
		snoozeEnd: 'date',
		allComplete: 'bool',
		completions: {type: 'list', objectType: 'Completion'}
	}
}

class Completion extends Realm.Object {}

Completion.schema = {
	name: 'Completion',
	primaryKey: 'id',
	properties: {
	    id: 'string',
	    habitId: 'string',
	    habitName: 'string', 
		completedOn: 'date',
		pointValue: 'int'
	}
}

export default new Realm({schema: [Habit, Interval, Completion]});