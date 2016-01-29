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
      templateUrl: 'ngResponseButton.html',
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
                if (cl.indexOf('btn-') >= 0 || cl.indexOf('button-') >= 0) {
                  list.push(cl);
                  iElement.removeClass(cl);
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
