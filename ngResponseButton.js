'use strict';

/**
 * @ngdoc function
 * @name ngApp.directive:ngResponseButton
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Use a button to call a promise and show a repsonse in the
 *  button once resolved. Works with Bootstrap and Ionic. Supports custom
 *  classes, timing and form submit/validation
 */
angular.module('ngResponseButton', [])
  .directive('ngResponseButton', ['$compile', '$timeout', function($compile, $timeout) {
    return {
      template: [
        '<span>{{innerHTML}}</span>',
        '<div class="ng-response-button-ion-spinner-container ng-response-button-busy" ng-if="state==\'busy\' && ionic">',
        '<div class="ng-response-button-ion-spinner">',
        '<ion-spinner icon="{{ionSpinnerI}}" ng-class="spinnerClass"></ion-spinner>',
        '</div>',
        '</div>',
        '<span class="ng-response-button-busy" ng-if="state==\'busy\' && !ionic">&nbsp;&nbsp;<i class="{{spinnerClassI}}"></i></span>',
        '<span class="ng-response-button-success" ng-if="state==\'success\'">&nbsp;&nbsp;<i class="{{successIconClass}}"></i></span>',
        '<span class="ng-response-button-fail" ng-if="state==\'fail\'">&nbsp;&nbsp;<i class="{{failIconClass}}"></i></span>'
      ].join(''),
      transclude: true,
      restrict: 'A',
      templateNamespace: 'html',
      scope: {
        ngResponseButton: '&',
        revert: '@',
        successClass: '@',
        failClass: '@',
        successIcon: '@',
        failIcon: '@',
        ionSpinner: '@',
        spinnerClass: '@',
        submit: '='
      },
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          pre: function preLink(scope, iElement, iAttrs, controller) {},
          post: function postLink(scope, iElement, iAttrs, controller) {


            function removeClasses() {
              // find, store and remove all btn- & button- classes
              var cl, list = [];
              for (var i = 0; i < iElement[0].classList.length; i++) {
                cl = iElement[0].classList[i];
                switch (cl) {
                  case 'btn-default':
                  case 'btn-primary':
                  case 'btn-success':
                  case 'btn-info':
                  case 'btn-warning':
                  case 'btn-danger':
                  case 'btn-link':
                  case 'button-light':
                  case 'button-stable':
                  case 'button-positive':
                  case 'button-calm':
                  case 'button-balanced':
                  case 'button-energized':
                  case 'button-assertive':
                  case 'button-royal':
                  case 'button-dark':
                    list.push(cl);
                    iElement.removeClass(cl);
                    break;
                }
              }
              return list;
            }

            scope.ionic = false;
            scope.state = 'idle';

            var defaults;
            if (iElement.hasClass('btn')) {
              defaults = {
                successClass: 'btn-success',
                failClass: 'btn-danger',
                successIcon: 'glyphicon glyphicon-ok',
                failIcon: 'glyphicon glyphicon-remove',
                spinnerClass: 'glyphicon glyphicon-refresh'
              };
              scope.spinnerClassI = (scope.spinnerClass || defaults.spinnerClass) + ' ng-response-button-spin';

            } else {
              defaults = {
                successClass: 'button-balanced',
                failClass: 'button-assertive',
                successIcon: 'icon ion-checkmark',
                failIcon: 'icon ion-close',
                spinnerClass: '',
                ionSpinner: ''
              };
              scope.ionic = true;
              scope.spinnerClassI = scope.spinnerClass || defaults.spinnerClass;
              scope.ionSpinnerI = scope.ionSpinner || defaults.ionSpinner;
            }

            var revert = scope.revert || 4000;
            var successClass = scope.successClass || defaults.successClass;
            var failClass = scope.failClass || defaults.failClass;
            var successTO, failTO;

            iElement.bind('click', function(e) {

              var promise = scope.ngResponseButton();
              if (!promise || scope.state === 'busy') {
                scope.$apply();
                return;
              }

              scope.successIconClass = scope.successIcon ? scope.successIcon : defaults.successIcon;
              scope.failIconClass = scope.failIcon || defaults.failIcon;
              scope.state = 'busy';
              scope.$apply();

              promise = promise.$promise ? promise.$promise : promise; // handle ngResource

              if (scope.submit) {
                var formEl = iElement[0].form;
                iElement.attr('type', 'submit'); // change button to type "submit"
                angular.element(formEl).triggerHandler('submit'); // trigger submit event
                scope.submit.$submitted = true; // update submitted
              }

              promise
                .then(function() {
                  scope.state = 'success';

                  // remove btn- & button- classes
                  var originalClasses = removeClasses(originalClasses);

                  // add success class
                  iElement.addClass(successClass);
                  iElement[0].blur();

                  successTO = $timeout(function() {
                    scope.state = 'idle';
                    // remove success class
                    iElement.removeClass(successClass);
                    // add original btn- & button- classes
                    iElement.addClass(originalClasses.join(' '));
                  }, revert);

                })
                .catch(function() {
                  scope.state = 'fail';

                  // remove btn- & button- classes
                  var originalClasses = removeClasses(originalClasses);

                  // add fail class
                  iElement.addClass(failClass);
                  iElement[0].blur();

                  failTO = $timeout(function() {
                    scope.state = 'idle';
                    // remove fail class
                    iElement.removeClass(failClass);
                    // add original btn- & button- classes 
                    iElement.addClass(originalClasses.join(' '));
                  }, revert);
                });
            });

            transclude(scope, function(clone) {
              scope.innerHTML = clone[0].innerHTML;
              $compile(iElement.contents())(scope);
            });

            scope.$on('$destroy', function(event) {
              $timeout.cancel(successTO);
              $timeout.cancel(failTO);
            });

          }
        };
      }
    };
  }]);
