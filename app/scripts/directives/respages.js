'use strict';

/*
 */

angular.module('resumeApp')
  .directive('resPages', function () {
    return {
      restrict: 'EA',
      template: '<div ng-transclude=""></div>',
      transclude: true,
      scope: {},
      controller: function($scope, $element, $document) {
        var pages = [];
        var activePageIndex;

        $scope.hide = function(i) {
          pages[i].element.hide();
        };

        $scope.show = function(i) {
          pages[i].element.show()
          $element.css('backgroundImage', 'url(' + pages[i].background + ')');
        };

        $scope.previous = function() {
          $scope.hide(activePageIndex);
          activePageIndex = activePageIndex - 1;
          if (activePageIndex < 0)
              activePageIndex = pages.length - 1; // wrap
          $scope.show(activePageIndex);
        };

        $scope.next = function() {
          $scope.hide(activePageIndex);
          activePageIndex = activePageIndex + 1;
          if (activePageIndex >= pages.length)
              activePageIndex = 0; // wrap
          $scope.show(activePageIndex);
        };

        $document.bind('keydown', function(event) {

          var unmodified = !event.shiftKey &&
                           !event.altKey &&
                           !event.metaKey &&
                           !event.ctrlKey;
          // todo, emacs: C-n C-p
          // home, end
          // mouse/swipe
          if (event.which === 78 || // n for 'next'
              event.which === 74 || // j for vi-lovers
              event.which === 39 || // right arrow
              event.which === 40)   // down arrow
          {
            $scope.next();
            event.preventDefault();
          }
          if (event.which === 80 || // p for 'previous'
              event.which === 75 || // k for vi-lovers
              event.which === 37 || // left arrow
              event.which === 38)   // up arrow
          {
            $scope.previous();
            event.preventDefault();
          }
          if (event.which === 9) // tab
          {
              if (event.shiftKey) {
                  $scope.previous();
              } else {
                  $scope.next();
              }
              event.preventDefault();
          }
          if (event.which === 13) // enter
          {
              if (event.shiftKey) {
                  $scope.previous();
              } else {
                  $scope.next();
              }
              event.preventDefault();
          }
        });

        this.addPage = function(elt, bkgd) {
          // preload
          var img = new Image();
          img.src = bkgd;

          pages.push({ 'element': elt, 'background': bkgd });
          $scope.show(0);
          activePageIndex = 0;
        }
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });

angular.module('resumeApp')
  .directive('resPage', function () {
    return {
      require: '^resPages',
      restrict: 'EA',
      template: '<div ng-transclude=""></div>',
      transclude: true,
      link: function postLink(scope, element, attrs, pagesCtrl) {
        element.hide();
        var bkgd = attrs.resPageBackground;
        pagesCtrl.addPage(element, bkgd);
      }
    };
  });
