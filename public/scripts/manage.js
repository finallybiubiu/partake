var fs = require('fs');
var $ = require('jquery');
var angular = require('angular');

window.PT.agreements = ['Apache Licence' , 'BSD', 'GPL', 'LGPL', 'MIT', 'MPL', 'CDDL', 'EPL'];
window.PT.languages = ['Swift', 'Java', 'C/C++', 'Objective-C', 'PHP', 'Perl', 'Python', 'Ruby', 'C', '.NET', 'ASP', 'Google Go', 'D语言', 'Groovy', 'Scala', 'JavaScript', 'HTML/CSS', 'ActionScript', 'VBScript', 'Delphi/Pascal', 'Basic', 'ErLang', 'COBOL', 'Fortran', 'Lua', 'SHELL', 'Smalltalk', '汇编', 'Sliverlight', 'Lisp'];
window.PT.systems = ['跨平台', 'Windows', 'Linux', 'BSD', 'UNIX', 'OS X', 'Symbian', 'J2ME', '嵌入式', 'Android', 'iPhone/iPad/iPod', 'Windows Phone/Mobile', 'Meego', 'Moblin', 'Firefox OS'];

require('./components/filters/default');
require('./components/filters/escape');
require('./components/services/notification');
require('./components/services/error-tip');
require('./components/directives/image-src');

angular.module('ui.bootstrap', ['ui.bootstrap.modal', 'ui.bootstrap.tooltip', 'ui.bootstrap.popover', 'ui.bootstrap.tpls', 'ui.bootstrap.pagination']);

angular.module('manageApp.controller', []);
angular.module('manageApp.directive', ['ui.image-src']);
angular.module('manageApp.filter', ['filter.default', 'filter.escape']);
angular.module('manageApp.service', ['ui.notification', 'ui.bootstrap', 'ui.select2', 'ui.error-tip']);

require('./manage/controllers/project');
require('./manage/controllers/user');
require('./manage/services/default');
require('./manage/services/project');
require('./manage/services/user');

angular.module('manageApp', [
  'ngSanitize',
  'ngAnimate',
  'ngCookies',
  'ui.router',
  'ct.ui.router.extras',
  'sun.scrollable',
  'angular-loading-bar',
  'manageApp.controller',
  'manageApp.directive',
  'manageApp.filter',
  'manageApp.service'
]).config(function ($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $locationProvider.html5Mode(true);
  cfpLoadingBarProvider.includeSpinner = false;

  $stateProvider.state('project', {
    abstract: true,
    url: '/manage/projects'
  });

  $stateProvider.state('project.list', {
    url: '/:page',
    views: {
      'content@': {
        template: fs.readFileSync(__dirname + '/../templates/manage/project-list.html', 'utf8'),
        controller: 'ProjectListCtrl'
      }
    }
  });

  $stateProvider.state('project.verify', {
    url: '/:page/verify',
    views: {
      'content@': {
        template: fs.readFileSync(__dirname + '/../templates/manage/project-list.html', 'utf8'),
        controller: 'ProjectVerifyCtrl'
      }
    }
  });

  $stateProvider.state('project.noverify', {
    url: '/:page/noverify',
    views: {
      'content@': {
        template: fs.readFileSync(__dirname + '/../templates/manage/project-list.html', 'utf8'),
        controller: 'ProjectNoVerifyCtrl'
      }
    }
  });

  $stateProvider.state('user', {
    abstract: true,
    url: '/manage/users'
  });

  $stateProvider.state('user.list', {
    url: '',
    views: {
      'content@': {
        template: fs.readFileSync(__dirname + '/../templates/manage/user-list.html', 'utf8'),
        controller: 'UserListCtrl'
      }
    }
  });

  $urlRouterProvider.when('/manage', '/manage/projects/1').otherwise('/manage');
}).run(function ($http, $cookies, $rootScope, $window, $state, Notification, Default) {
  $http.defaults.headers.common['x-csrf-token'] = $cookies._csrf;
  $rootScope.$state = $state;

  $rootScope.logout = function () {
    Default.logout().then(function () {
      $window.location.href = '/';
    }, function (err) {
      Notification.show('退出登录失败', 'danger');
    });
  };
});

$(document).ready(function () {
  angular.bootstrap(document, ['manageApp']);
});
