'use strict';
gantt.directive('ganttRow', ['GanttEvents', 'GANTT_EVENTS', function(Events, GANTT_EVENTS) {
    return {
        restrict: 'E',
        require: '^ganttBody',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.row.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.row.$element = $element;

            $element.bind('mousedown', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_MOUSEDOWN, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('mouseup', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_MOUSEUP, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('click', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_CLICKED, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('dblclick', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_DBL_CLICKED, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('contextmenu', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_CONTEXTMENU, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });


        }]
    };
}]);
