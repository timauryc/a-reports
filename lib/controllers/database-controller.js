'use strict';

var connectionString = require('../../conf/axpo-reports').POSTGRE.connectionString;
var pg = require('pg');
var async = require('async');
var logger = require('../logger/logger');

function mapValues(map, value) {
    var result = "";
    if (value.indexOf(",")) {
        var valuesArray = value.split(",");
        for (var i = 0; i < valuesArray.length; i++) {
            if (i === 0) {
                result += map[valuesArray[i]];
            } else {
                result += ', ' + map[valuesArray[i]];
            }
        }
    } else {
        result += map[value];
    }

    if (result === "undefined") {
        return 'obsolete value';
    } else {
        return result;
    }
}

function updateDatabase(dealsArray, callback) {
    async.waterfall([
        function(callback) {
            var statementQuery = 'INSERT INTO pipedrive_deals(' +
                'ID, Title, Owner, Deal_Source, PoDs, Customer_Segment, Product_Category, Financing_Deal, Status, XREM, ' +
                'Technology, Commodities, Volume_Delivery, Installed_Capacity, ' +
                'Contract_Duration, OPS_Responsible, Effective_Signing_Date, ' +
                'Value, Weighted_value, Currency, Organization, Pipeline, ' +
                'Contact_person, Stage, Deal_created, Update_time, Last_stage_change, ' +
                'Next_activity_date, Last_activity_date, Won_time, Lost_time, ' +
                'Deal_closed_on, Lost_reason, Visible_to, Expected_close_date, ' +
                'Country, FS_Broker, TOE, Total_activities, Done_activities, ' +
                'Undone_activities, Email_messages_count, db_insertion_date' +
                ') VALUES ';
            var rowsQuery = '';

            //dealsArray.length
            for (var i = 0; i < dealsArray.length; i++) {
                var id = dealsArray[i].id;
                var title = (dealsArray[i].title ? '\'' + dealsArray[i].title.replace(/\'/g, "") + '\'' : null);
                var owner_name = (dealsArray[i].owner_name ? '\'' + dealsArray[i].owner_name.replace(/\'/g, "") + '\'' : null);
                //var deal_source = dealsArray[i]['74a2fdc3dccca7c82536b3b04c9959746e16071a'];
                var deal_source = (dealsArray[i]['74a2fdc3dccca7c82536b3b04c9959746e16071a'] ? '\'' + mapValues(GLOBAL.dealSourceMapping, dealsArray[i]['74a2fdc3dccca7c82536b3b04c9959746e16071a']).replace(/\'/g, "") + '\'' : null);
                var pods = dealsArray[i]['279f407d939484916333aaa02288607a5a3cbeb9'];
                var customerSegment = (dealsArray[i]['deefbb23bf8be5f1691718c59691fdc0261b0a13'] ? '\'' + mapValues(GLOBAL.customerMapping, dealsArray[i]['deefbb23bf8be5f1691718c59691fdc0261b0a13']).replace(/\'/g, "") + '\'' : null);
                var productCategory = (dealsArray[i]['70105969221dd4bda67325229f9064e7c9da54e1'] ? '\'' + mapValues(GLOBAL.productMapping, dealsArray[i]['70105969221dd4bda67325229f9064e7c9da54e1']).replace(/\'/g, "") + '\'' : null);
                var financingDeal = (dealsArray[i]['0d2e99ac9e1be9bb694c7494e3e844ecc7f39334'] ? '\'' + mapValues(GLOBAL.financingMapping, dealsArray[i]['0d2e99ac9e1be9bb694c7494e3e844ecc7f39334']).replace(/\'/g, "") + '\'' : null);
                var status = (dealsArray[i].status ? '\'' + dealsArray[i].status.replace(/\'/g, "") + '\'' : null);
                var xrem = dealsArray[i]['6298ccd2a0b6103c8b50ba50785461a0276776d4'];
                var technology = dealsArray[i]['58a9b20f9ba7df0eed9558fc3ec3ea35e75796ac'];
                var commodities = (dealsArray[i]['169845897eee730bec298618fd615816288b9593'] ? '\'' + mapValues(GLOBAL.commoditiesMapping, dealsArray[i]['169845897eee730bec298618fd615816288b9593']).replace(/\'/g, "") + '\'' : null);
                var volumeNotional = dealsArray[i].f5e0b61a41314f4b54cbe3512ab95bf00a57b9f8;
                var installedCapacity = dealsArray[i].e0a9affeacbc316ef759b364a6e08599073613ba;
                var contractDuration = dealsArray[i].a3eab04b2550b31fe05d22e9b655a66738dfa9a8;
                var opsResponsible = (dealsArray[i].fa6d8be96211e524f70b4b2f5affef9a695a973f ? '\'' + dealsArray[i].fa6d8be96211e524f70b4b2f5affef9a695a973f.name.replace(/\'/g, "") + '\'' : null);
                var effectiveSignDate = (dealsArray[i]['1f7300aea484a7001c5c6e7cdf05ab9306c420ed'] ? '\'' + dealsArray[i]['1f7300aea484a7001c5c6e7cdf05ab9306c420ed'].replace(/\'/g, "") + '\'' : null);
                var value = dealsArray[i].value;
                var weightedValue = (dealsArray[i].weighted_value ? '\'' + dealsArray[i].weighted_value + '\'' : null);
                var currency = (dealsArray[i].currency ? '\'' + dealsArray[i].currency.replace(/\'/g, "") + '\'' : null);
                var organization = (dealsArray[i].org_name ? '\'' + dealsArray[i].org_name.replace(/\'/g, "") + '\'' : null);
                var pipeline_id = (dealsArray[i].pipeline_id ? '\'' + mapValues(GLOBAL.pipelineMapping, dealsArray[i].pipeline_id.toString()).replace(/\'/g, "") + '\'' : null);
                var contactPerson = (dealsArray[i].person_id ? '\'' + dealsArray[i].person_id.name.replace(/\'/g, "") + '\'' : null);
                var stage = (dealsArray[i].stage_id ? '\'' + mapValues(GLOBAL.stageMapping, dealsArray[i].stage_id.toString()).replace(/\'/g, "") + '\'' : null);
                var add_time = (dealsArray[i].add_time ? '\'' + dealsArray[i].add_time + '\'' : null);
                var updateTime = (dealsArray[i].update_time ? '\'' + dealsArray[i].update_time + '\'' : null);
                var lastStageChange = (dealsArray[i].stage_change_time ? '\'' + dealsArray[i].stage_change_time + '\'' : null);
                var nextActivityDate = (dealsArray[i].next_activity_date ? '\'' + dealsArray[i].next_activity_date + '\'' : null);
                var lastActivityDate = (dealsArray[i].last_activity_date ? '\'' + dealsArray[i].last_activity_date + '\'' : null);
                var won_time = (dealsArray[i].won_time ? '\'' + dealsArray[i].won_time + '\'' : null);
                var lost_time = (dealsArray[i].lost_time ? '\'' + dealsArray[i].lost_time + '\'' : null);
                var closedOn = (dealsArray[i].close_time ? '\'' + dealsArray[i].close_time + '\'' : null);
                var lostReason = (dealsArray[i].lost_reason ? '\'' + dealsArray[i].lost_reason.replace(/\'/g, "") + '\'' : null);
                var visibleTo = (dealsArray[i].visible_to ? '\'' + mapValues(GLOBAL.visibleToMapping, dealsArray[i].visible_to).replace(/\'/g, "") + '\'' : null);
                var expectedCloseDate = (dealsArray[i].expected_close_date ? '\'' + dealsArray[i].expected_close_date + '\'' : null);
                var country = (dealsArray[i]['913efb052e32823b7edc6ee1da5727f2b18e2362'] ? '\'' + mapValues(GLOBAL.countryMapping, dealsArray[i]['913efb052e32823b7edc6ee1da5727f2b18e2362']).replace(/\'/g, "") + '\'' : null);
                var fsBroker = (dealsArray[i]['1a0b6cb3e7595fef95a398bcc36d42e1f7f24d83'] ? '\'' + mapValues(GLOBAL.brokerMapping, dealsArray[i]['1a0b6cb3e7595fef95a398bcc36d42e1f7f24d83']).replace(/\'/g, "") + '\'' : null);
                var toe = dealsArray[i].bd0b7d291fb064f3f283e44fc9acc351f4caa6ca;
                var totalActivities = dealsArray[i].activities_count;
                var doneActivities = dealsArray[i].done_activities_count;
                var undoneActivities = dealsArray[i].undone_activities_count;
                var emailCount = dealsArray[i].email_messages_count;
                var today = new Date();
                var timeStamp = '\'' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + '\'';
                //'INSERT INTO deals(id, owner_name, status, value, pipeline_id, add_time, won_time, lost_time) VALUES (3, \'jose\', \'lost\', 1, 1, \'2008-06-13 17:18:29\', \'2008-06-13 17:18:29\',\'2008-06-13 17:18:29\');'
                rowsQuery += '(' +
                    id + ', ' +
                    title + ', ' +
                    owner_name + ', ' +
                    deal_source + ', ' +
                    pods + ', ' +
                    customerSegment + ', ' +
                    productCategory + ', ' +
                    financingDeal + ', ' +
                    status + ', ' +
                    xrem + ', ' +
                    technology + ', ' +
                    commodities + ', ' +
                    volumeNotional + ', ' +
                    installedCapacity + ', ' +
                    contractDuration + ', ' +
                    opsResponsible + ', ' +
                    effectiveSignDate + ', ' +
                    value + ', ' +
                    weightedValue + ', ' +
                    currency + ', ' +
                    organization + ', ' +
                    pipeline_id + ', ' +
                    contactPerson + ', ' +
                    stage + ', ' +
                    add_time + ', ' +
                    updateTime + ', ' +
                    lastStageChange + ', ' +
                    nextActivityDate + ', ' +
                    lastActivityDate + ', ' +
                    won_time + ',' +
                    lost_time + ',' +
                    closedOn + ', ' +
                    lostReason + ', ' +
                    visibleTo + ', ' +
                    expectedCloseDate + ', ' +
                    country + ', ' +
                    fsBroker + ', ' +
                    toe + ', ' +
                    totalActivities + ', ' +
                    doneActivities + ', ' +
                    undoneActivities + ', ' +
                    emailCount + ', ' +
                    timeStamp;

                //dealsArray.length - 1
                if (i === dealsArray.length - 1) {
                    rowsQuery += ');';
                } else {
                    rowsQuery += '),';
                }
            }

            var query = statementQuery + rowsQuery;
            //console.log(query);

            return callback(null, query);
        },
        function(query, callback) {
            var client = new pg.Client(connectionString);
            client.connect(function(err) {
                if (err) {
                    logger.writeLog('error', 'Error on connecting to the database.' +
                        '. File: database-controller.js' +
                        '. Function: updateDatabase' +
                        '. ErrorMessage: ' + err);
                    callback(err);
                }
                logger.writeLog('info', 'Success on connecting to the dtaabase.' +
                    '. File: database-controller.js' +
                    '. Function: updateDatabase');
                client.query(query, function(err, result) {
                    if (err) {
                        logger.writeLog('error', 'Error on completing the query.' +
                            '. File: database-controller.js' +
                            '. Function: updateDatabase' +
                            '. ErrorMessage: ' + err);
                        callback(err);
                    }
                    logger.writeLog('info', 'Success on completing the query.' +
                        '. File: database-controller.js' +
                        '. Function: updateDatabase');
                    client.end();
                    callback(null, 'query successful');
                });
            });
        }
    ], function(err, result) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, result);
        }

    });
}

module.exports = {
    updateDatabase: updateDatabase
};
