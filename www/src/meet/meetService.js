angular.module('Meet', [])

.service('meetService', function($q, webRequest, SERVICE_API_URL, AuthService, Locals, $ionicPopup, $timeout) {

	var perPage = 15;

	var meetList = []

	var meetParams = {}

	var refreshMeetList = function(params) {

		meetParams = params;
		console.log("refreshMeetList meetParams:", meetParams);

		var deferred = $q.defer();
		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_LIST, meetParams).then( function(data) {
			deferred.resolve(data);
			meetList = data;
		}, function(err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	var nextMeetList = function() {
		var deferred = $q.defer();

		if (meetList && meetList.length >= perPage) {
			var lastIndex = meetList.length - 1;
			meetParams.id = parseInt(meetList[lastIndex].id);
		}

		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_LIST, meetParams).then( function(data) {

			meetList = meetList.concat(data);
			console.log("loadmore:", meetParams, meetList)

			deferred.resolve(data);

		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var getMeetList = function() {
		return meetList;
	}

	var getMeetClass = function() {
		var deferred = $q.defer();

		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_GET_CLASS).then( function(datas) {

			deferred.resolve(datas);

		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var getMeetDetail = function(id, uid) {
		var deferred = $q.defer();

		var params = {
			id: id,
			uid: uid
		}

		webRequest.getServiceDataWithJsonp(SERVICE_API_URL.API_MEET_DETAIL, params).then( function(data) {
			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var meetApply = function(params) {
		var deferred = $q.defer();

		webRequest.postServiceData(SERVICE_API_URL.API_MEET_ENROLL, params).then( function(data) {
			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var isMember = function() {
		return AuthService.isMember();
	}

	var isLogin = function() {
		return AuthService.isLogin();
	}

	var getUid = function() {
		if (AuthService.getUserInfo() && 'uid' in AuthService.getUserInfo()) {
			return AuthService.getUserInfo().uid
		} else {
			return null
		}
	}

	var toFavor = function(params) {
		var deferred = $q.defer();

		webRequest.postServiceData(SERVICE_API_URL.API_MEET_FAVOR, params).then( function(data) {
			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	// var sendCode = function(mobile) {
	// 	var deferred = $q.defer();

	// 	registerService.getCode(mobile).then(function(data) {
	// 		deferred.resolve(data);
	// 	}, function(err) {
	// 		deferred.reject(err);
	// 	})

	// 	return deferred.promise;
	// }

	// var checkMobile = function(mobile) {
	// 	return registerService.checkMobile(mobile);
	// }

	var bind = function(mobile, code) {

		var deferred = $q.defer();
		AuthService.bindWxMember(mobile, code).then(function(data) {
			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var bindSuccess = function(userinfo, token) {
		AuthService.removeWxUserInfo();
		AuthService.setUserInfo(userinfo);
		AuthService.setToken(token);
		AuthService.setMember(true);
	}

	var login = function(username, password) {
		var deferred = $q.defer();

		AuthService.login(username, password, "正在登录...").then(function(data) {
			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}

	var getUid = function() {
		return AuthService.getUid();
	}

	var showInvalidMsg = function(str) {
		var popup = $ionicPopup.show({
			title: '<p style="text-align: center">' + str + '</p>'
		})

		$timeout(function() {
			popup.close();
		}, 1000);
	}

	return {
		getMeetList: getMeetList,
		refreshMeetList: refreshMeetList,
		nextMeetList: nextMeetList,
		perPage: perPage,
		getMeetDetail: getMeetDetail,
		getMeetClass: getMeetClass,
		meetApply: meetApply,
		isMember: isMember,
		isLogin: isLogin,
		getUid: getUid,
		toFavor: toFavor,
		bind: bind,
		bindSuccess: bindSuccess,
		login: login,
		getUid: getUid,
		showInvalidMsg: showInvalidMsg
	}
})