/**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env jasmine */

'use strict';

var angular = require('angular');

describe('count', function() {
    beforeEach(function() {
        var ngModule = angular.module('mockModule', []);
        require('./../src/streamApiServiceProvider')(ngModule);
    });

    beforeEach(angular.mock.module('mockModule'));
    
    var streamApiService,
        $httpBackend;
    beforeEach(angular.mock.inject(function(_streamApiService_, _$httpBackend_) {
        streamApiService = _streamApiService_;
        $httpBackend = _$httpBackend_;
    }));
    
    var streamApi;
    beforeEach(function() {
        streamApi = streamApiService.getInstance({host: 'https://foo'});
    });
    
    it('should throw an exception when objCode doesn\'t orvided', function() {
        expect(function() {streamApi.count();})
        .toThrow(new Error('You must provide \'objCode\''));
    });

    it('should make call to correct url', function() {
        var requestedUrl = 'https://foo/attask/api-internal/task/count?name=some+task+name&name_Mod=cicontains';
        $httpBackend.whenGET(requestedUrl)
        .respond(200);
        var query = {};
        query['name'] = 'some task name';
        query['name' + streamApi.Constants.MOD] = streamApi.Constants.Operators.CICONTAINS;
        streamApi.count('task', query);

        $httpBackend.flush();
    });


    it('should fail when response not correct', function(done) {
        var response = {aaa:3};
        var errorHander = jasmine.createSpy('errorHandler');
        $httpBackend.whenGET()
        .respond(200, response);
        streamApi.count('task', {})
        .catch(errorHander)
        .finally(function() {
            expect(errorHander).toHaveBeenCalled();
            done();
        });
        
        $httpBackend.flush();
    });
    
    it('should extract correct count from returend data', function(done) {
        var data = { count: 5 };
        $httpBackend.expectGET()
        .respond(200, data);
        streamApi.count('task', {})
        .then(function(count) {
            expect(count).toBe(data.count);
            done();
        });

        $httpBackend.flush();
    });
});
