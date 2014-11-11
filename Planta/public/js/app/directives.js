var ControlPlantaCtrl = function ($scope, PlantaService) {
    $scope.CarrilId = {};
};
app.directive('controlplanta', function () {
    return {
        templateUrl: '/templates/directives/ControlPlanta.html'
    };
});
app.directive('incidenciasctrl', function () {
    return {
        templateUrl: '/templates/directives/Incidencias.html'
    };
});
app.directive('tableCtrl', function () {
    return {
        replace: true,
        restrict: 'EA',
        templateUrl: '/templates/directives/table.html'
    };
});
app.directive('datosprueba', function () {
    return {
        replace: true,
        restrict: 'EA',
        templateUrl: '/templates/directives/DatosPrueba.html'
    };
});
app.directive('tableCtrlCarga', function () {
    return {
        replace: true,
        restrict: 'EA',
        templateUrl: '/templates/directives/tablecarga.html'
    };
});
app.directive('tableCtrlSubita', function () {
    return {
        replace: true,
        restrict: 'EA',
        templateUrl: '/templates/directives/tablesubita.html'
    };
});
app.filter('minutos', function () {
    return function (input) {
        input = input || 0;
        var seg = input % 60;
        var min = Math.floor(input / 60);
        var out = min.toString() + ":" + (seg < 10 ? "0" : "") + seg.toString();
        return out;
    };
});
app.directive('check', function () {
    return {
        replace: true,
        restrict: 'EA',
        scope: {
            value: "=value"
        },
        //templateUrl: '/templates/directives/tablesubita.html'
        template: '<div><span class="glyphicon glyphicon-ok success" ng-show="value === true"></span><span class="glyphicon glyphicon-remove bg-danger" ng-show="value === false"></span></div>'
    };
});
app.directive('estatusPrueba', function () {
    return {
        replace: true,
        restrict: 'EA',
        scope: {
            value: "=value"
        },
        controller: ["$scope", function ($scope) {
                $scope.msg = "Desconocido";
                switch ($scope.value) {
                    case "Creada":
                        $scope.msg = "Creada";
                        break;
                    case "Ejecutando":
                        $scope.msg = "En curso";
                        break;
                    case "Finalizada":
                        $scope.msg = "Finalizada";
                        break;
                    case "RechazadaEjecutor":
                        $scope.msg = "Rechazada Ejecutor";
                        break;
                    case "AutorizadoEjecutor":
                        $scope.msg = "Autorizada Ejecutor";
                        break;
                    case "RechazadaSupervisor":
                        $scope.msg = "Rechazada Supervisor";
                        break;
                    case "AutorizadaSupervisor":
                        $scope.msg = "Autorizada Supervisor";
                        break;
                }
            }],
        template: '<div><label >{{msg}}</label></div>'
    };
});
app.directive('listPruebas', function () {
    return {
        replace: true,
        restrict: 'EA',
        scope: {
            prueba: "=prueba",
            url: "@url",
            urlview: "@urlview",
            tipo: "@tipo"
        },
        templateUrl: '/templates/directives/listPruebas.html'
    };
});
app.directive('listPruebasArranque', function () {
    return {
        replace: true,
        restrict: 'EA',
        scope: {
            prueba: "=prueba",
            url: "@url",
            urlview: "@urlview",
            tipo: "@tipo"
        },
        templateUrl: '/templates/directives/listPruebasArranque.html'
    };
});
app.directive('circle', function () {
    return {
        replace: true,
        restrict: 'EA',
        scope: {
            color: "=color"
        },
        template: "<div class='full-circle' ng-style='{\"background-color\": color}'><div>"
    };
});

app.factory("EstatusPlanta", ["$rootScope", "PlantaServices",
    function ($rootScope, PlantaServices) {
        var planta = {};
        planta.ensamble = null;
        planta.on = null;
        planta.lastRead = {};
        planta.Paro = function () {
            PlantaServices.Plantas.Off({id: $scope.ensamble.id}, {id: $scope.ensamble.id}, function () {
                noty({text: "Apagado de planta exitoso¡¡¡", type: "success"});
            }, function () {
                noty({text: "Error al apagar la planta la planta¡¡¡", type: "error"});
            });
        };
        planta.Arranque = function () {
            PlantaServices.Plantas.On({id: $scope.ensamble.id}, {id: $scope.ensamble.id}, function () {
                noty({text: "Encendido de planta exitoso¡¡¡", type: "success"});
            }, function () {
                noty({text: "Error al encender la planta¡¡¡", type: "error"});
            });
        };


        return planta;
    }]);


app.directive('autocomplete', ["$timeout", function ($timeout) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div><form><input class="form-control" ng-model="term" ng-change="query()" type="text" autocomplete="off" /></form><div ng-transclude></div></div>',
            scope: {
                search: "&",
                select: "&",
                items: "=",
                term: "="
            },
            controller: ["$scope", function ($scope) {
                    $scope.items = [];
                    $scope.hide = false;

                    this.activate = function (item) {
                        $scope.active = item;
                    };

                    this.activateNextItem = function () {
                        var index = $scope.items.indexOf($scope.active);
                        this.activate($scope.items[(index + 1) % $scope.items.length]);
                    };

                    this.activatePreviousItem = function () {
                        var index = $scope.items.indexOf($scope.active);
                        this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
                    };

                    this.isActive = function (item) {
                        return $scope.active === item;
                    };

                    this.selectActive = function () {
                        this.select($scope.active);
                    };

                    this.select = function (item) {
                        $scope.hide = true;
                        $scope.focused = true;
                        $scope.select({item: item});
                    };

                    $scope.isVisible = function () {
                        return !$scope.hide && ($scope.focused || $scope.mousedOver);
                    };
                    var filterTextTimeout;
                    $scope.query = function () {
                        if (($scope.term.length | 0) > 2) {
                            if (filterTextTimeout)
                                $timeout.cancel(filterTextTimeout);
                            filterTextTimeout = $timeout(function () {
                                $scope.hide = false;
                                $scope.search({term: $scope.term});
                            }, 250);

                        }
                    };
                }],
            link: function (scope, element, attrs, controller) {

                var $input = element.find('form > input');
                var $list = element.find('> div');

                $input.bind('focus', function () {
                    scope.$apply(function () {
                        scope.focused = true;
                    });
                });

                $input.bind('blur', function () {
                    scope.$apply(function () {
                        scope.focused = false;
                    });
                });

                $list.bind('mouseover', function () {
                    scope.$apply(function () {
                        scope.mousedOver = true;
                    });
                });

                $list.bind('mouseleave', function () {
                    scope.$apply(function () {
                        scope.mousedOver = false;
                    });
                });

                $input.bind('keyup', function (e) {
                    if (e.keyCode === 9 || e.keyCode === 13) {
                        scope.$apply(function () {
                            controller.selectActive();
                        });
                    }

                    if (e.keyCode === 27) {
                        scope.$apply(function () {
                            scope.hide = true;
                        });
                    }
                });

                $input.bind('keydown', function (e) {
                    if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
                        e.preventDefault();
                    }
                    ;

                    if (e.keyCode === 40) {
                        e.preventDefault();
                        scope.$apply(function () {
                            controller.activateNextItem();
                        });
                    }

                    if (e.keyCode === 38) {
                        e.preventDefault();
                        scope.$apply(function () {
                            controller.activatePreviousItem();
                        });
                    }
                });

                scope.$watch('items', function (items) {
                    controller.activate(items.length ? items[0] : null);
                });

                scope.$watch('focused', function (focused) {
                    if (focused) {
                        $timeout(function () {
                            $input.focus();
                        }, 0, false);
                    }
                });

                scope.$watch('isVisible()', function (visible) {
                    if (visible) {
                        var pos = $input.position();
                        var height = $input[0].offsetHeight;

                        $list.css({
                            top: pos.top + height,
                            left: pos.left,
                            position: 'absolute',
                            display: 'block'
                        });
                    } else {
                        $list.css('display', 'none');
                    }
                });
            }
        };
    }]);

app.directive('itemautocomplete', function () {
    return {
        require: '^autocomplete',
        link: function (scope, element, attrs, controller) {
            var item = scope.$eval(attrs.itemautocomplete);
            scope.$watch(function () {
                return controller.isActive(item);
            }, function (active) {
                if (active) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });

            element.bind('mouseenter', function (e) {
                scope.$apply(function () {
                    controller.activate(item);
                });
            });

            element.bind('click', function (e) {
                scope.$apply(function () {
                    controller.select(item);
                });
            });
        }
    };
});


