'use strict';

var request = require('request');
var config = require('../config');
var logger = require('../logger/logger');
var auth_token = require('../../conf/axpo-reports').AUTH_TOKEN;


function getDeals(start, limit, callback) {
    request('' + start + '&limit=' + limit + '&api_token=' + auth_token, function(err, response, body) {
        if (err) {
            logger.writeLog('error', 'Error on request to the API.' +
                '. File: pipedrive-controller.js' +
                '. Function: getDeals' +
                '. ErrorMessage: ' + err);
            callback(err);
        } else {
            logger.writeLog('info', 'Success on request to the API.' +
                '. File: pipedrive-controller.js' +
                '. Function: getDeals');
            callback(null, JSON.parse(body));
        }
    });
}


function getDealFields(callback) {
    request('' + auth_token, function(err, response, body) {
        if (err) {
            logger.writeLog('error', 'Error on request to the API.' +
                '. File: pipedrive-controller.js' +
                '. Function: getDealFields' +
                '. ErrorMessage: ' + err);
            callback(err);
        } else {
            logger.writeLog('info', 'Success on request to the API.' +
                '. File: pipedrive-controller.js' +
                '. Function: getDealFields');

            //iterar por el objeto
            var commoditiesMapping = {};
            var countryMapping = {};
            var customerMapping = {};
            var productMapping = {};
            var financingMapping = {};
            var visibleToMapping = {};
            var brokerMapping = {};
            var dealSourceMapping  = {};

            var data = JSON.parse(body).data;
            for (var i = 0; i < data.length; i++) {
                switch (data[i].key) {

                    case '169845897eee730bec298618fd615816288b9593':
                        //Commodities
                        var optionsArray = data[i].options;
                        for (var j = 0; j < optionsArray.length; j++) {
                            commoditiesMapping[optionsArray[j]['id']] = optionsArray[j]['label'];
                        }
                        GLOBAL.commoditiesMapping = commoditiesMapping;
                        break;

                    case '913efb052e32823b7edc6ee1da5727f2b18e2362':
                        //country
                        var optionsArray = data[i].options;
                        for (var j = 0; j < optionsArray.length; j++) {
                            countryMapping[optionsArray[j]['id']] = optionsArray[j]['label'];
                        }
                        GLOBAL.countryMapping = countryMapping;
                        break;

                    case 'deefbb23bf8be5f1691718c59691fdc0261b0a13':
                        //Customer Segment
                        var optionsArray = data[i].options;
                        for (var j = 0; j < optionsArray.length; j++) {
                            customerMapping[optionsArray[j]['id']] = optionsArray[j]['label'];
                        }
                        GLOBAL.customerMapping = customerMapping;
                        break;

                    case '70105969221dd4bda67325229f9064e7c9da54e1':
                        //Product_Category
                        var optionsArray = data[i].options;
                        for (var j = 0; j < optionsArray.length; j++) {
                            productMapping[optionsArray[j]['id']] = optionsArray[j]['label'];
                        }
                        GLOBAL.productMapping = productMapping;
                        break;

                    case '0d2e99ac9e1be9bb694c7494e3e844ecc7f39334':
                        //Financing_Deal
                        var optionsArray = data[i].options;
                        for (var j = 0; j < optionsArray.length; j++) {
                            financingMapping[optionsArray[j]['id']] = optionsArray[j]['label'];
                        }
                        GLOBAL.financingMapping = financingMapping;
                        break;

                    case '1a0b6cb3e7595fef95a398bcc36d42e1f7f24d83':
                        //Fs_broker
                        var optionsArray = data[i].options;
                        for (var j = 0; j < optionsArray.length; j++) {
                            brokerMapping[optionsArray[j]['id']] = optionsArray[j]['label'];
                        }
                        GLOBAL.brokerMapping = brokerMapping;
                        break;

                    case '74a2fdc3dccca7c82536b3b04c9959746e16071a':
                        //deal_source
                        var optionsArray = data[i].options;
                        for (var j = 0; j < optionsArray.length; j++) {
                            dealSourceMapping[optionsArray[j]['id']] = optionsArray[j]['label'];
                        }
                        console.log('waa: ', dealSourceMapping);
                        GLOBAL.dealSourceMapping = dealSourceMapping;
                        break;

                    case 'visible_to':
                        var optionsArray = data[i].options;
                        for (var j = 0; j < optionsArray.length; j++) {
                            visibleToMapping[optionsArray[j]['id']] = optionsArray[j]['label'];
                        }
                        GLOBAL.visibleToMapping = visibleToMapping;
                        break;

                    default:
                        break;
                }
            }
            callback(null);
        }
    });
}

function getPipelineFields(callback) {
    request('' + auth_token, function(err, response, body) {
        if (err) {
            logger.writeLog('error', 'Error on request to the API.' +
                '. File: pipedrive-controller.js' +
                '. Function: getPipelineFields' +
                '. ErrorMessage: ' + err);
            callback(err);
        } else {
            logger.writeLog('info', 'Success on request to the API.' +
                '. File: pipedrive-controller.js' +
                '. Function: getPipelineFields');

            var pipelineMapping = {};
            var pipelines = JSON.parse(body).data;

            for (var i = 0; i < pipelines.length; i++) {
                pipelineMapping[pipelines[i]['id']] = pipelines[i]['name'];
            }
            GLOBAL.pipelineMapping = pipelineMapping;
            callback(null);
        }
    });
}

function getStageFields(callback) {
    request('' + auth_token, function(err, response, body) {
        if (err) {
            logger.writeLog('error', 'Error on request to the API.' +
                '. File: pipedrive-controller.js' +
                '. Function: getStageFields' +
                '. ErrorMessage: ' + err);
            callback(err);
        } else {
            logger.writeLog('info', 'Success on request to the API.' +
                '. File: pipedrive-controller.js' +
                '. Function: getStageFields');

            var stageMapping = {};
            var stages = JSON.parse(body).data;

            for (var i = 0; i < stages.length; i++) {
                stageMapping[stages[i]['id']] = stages[i]['name'];
            }
            GLOBAL.stageMapping = stageMapping;
            callback(null);
        }
    });
}

module.exports = {
    getDeals: getDeals,
    getDealFields: getDealFields,
    getPipelineFields: getPipelineFields,
    getStageFields: getStageFields

};
