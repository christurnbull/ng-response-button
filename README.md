# ng-response-button

Use a button to call a promise and show a repsonse in the button once resolved

DEMO: http://embed.plnkr.co/tkIaMwnhYmINgzoHz9D8/

## Installation

Install via bower:

```bower install ng-response-button```

Add script to your index.html (if not using Grunt/wiredep/etc)

```<script src='bower_components/ng-response-buttons/ngResponseButton.js'></script>```

Add module to your application module dependencies

```angular.module('ngApp', ['ngResponseButton'])...```

## Usage


Simple


```
<button class="btn ng-response-button" ng-response-button="doPromise()">Press me</button>
```

All options
```
<button class="button button-dark ng-response-button" ng-response-button="doPromise()"
  revert=3000
  success-class="btn-info"
  fail-class="btn-warning"
  success-icon="glyphicon glyphicon-thumbs-up"
  fail-icon="fa fa-frown-o"
  spinner-class="glyphicon glyphicon-minus"
  ion-spinner="dots" 
  spinner-class="spinner-energized"
  >
  Ionic Button
</button>
```

## Dependencies
[UAParser.js](http://faisalman.github.io/ua-parser-js)


## Support

Please [open an issue](https://github.com/christurnbull/ng-response-button/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/christurnbull/ng-response-button/compare/).

## License

The code is available under the [MIT license](LICENSE.txt).
