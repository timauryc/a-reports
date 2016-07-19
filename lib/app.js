'use strict';

var schedule = require('node-schedule');
var request = require('request');
var pipedriveController = require('./controllers').pipedriveController;
var databaseController = require('./controllers').databaseController;
var async = require('async');

process.title = 'Axpo Report Service';

console.log('Im running');


/*schedule.scheduleJob('0 0 0 * * *', function() {
	
});*/

function callUpdate(data, start, limit, moreData) {
	databaseController.updateDatabase(data, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log(result);
			if (moreData) {
				askDeals(start + 500, limit + 500);
			}
		}
	});
}

function askDeals(start, limit) {
	pipedriveController.getDeals(start, limit, function(err, res) {
		if (err) {
			console.log('err ', err);
		} else {
			var moreData = res.additional_data.pagination.more_items_in_collection;
			callUpdate(res.data, start, limit, moreData);
		}
	});
}


async.parallel({
		dealFields: function(callback) {
			pipedriveController.getDealFields(function(err) {
				if (err) {
					callback(err);
				} else {
					callback(null);
				}
			});
		},
		pipelineFields: function(callback) {
			pipedriveController.getPipelineFields(function(err) {
				if (err) {
					callback(err);
				} else {
					callback(null);
				}
			});
		},
		stageFields: function(callback) {
			pipedriveController.getStageFields(function(err) {
				if (err) {
					callback(err);
				} else {
					callback(null);
				}
			});
		}
	},
	function(err) {
		if (err) {
			console.log('err ', err);
		} else {
			askDeals(0, 500);
		}
	});