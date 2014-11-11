var app = angular.module("PlantaAPP", ['nvd3ChartDirectives', 'n3-line-chart', "ngResource", "ngRoute",
    'angular-loading-bar',
            , 'gantt', // angular-gantt.
    
    'mgcrea.ngStrap', "angularMoment"
            , "ngCookies"
]);
var BaseTableController = function ($scope, $filter) {
    $scope.current = 0;
    $scope.total = 0;
    $scope.rowsPage = 10;
    $scope.totalRows = 0;
    $scope.pages = [];
    $scope.next = function () {
        if ($scope.current !== 0)
            $scope.current--;
    };
    $scope.previous = function () {
        if (($scope.total - 1) !== 0)
            $scope.current++;
    };
    $scope.setPage = function (page) {
        $scope.current = page;
    };
    $scope.$watch("search", function () {
        $scope.current = 0;
        $scope.filtered = $filter("filter")($scope.items, $scope.search);
        $scope.total = Math.ceil($scope.filtered.length / $scope.rowsPage);
        $scope.pages = [];
        for (var page = 0; page > $scope.total; page++)
            $scope.pages.push(page);
    }, true);
    $scope.result = function () {
        return $scope.filtered.slice($scope.current * $scope.rowsPage, ($scope.current + 1) * $scope.rowsPage);
    };
    $scope.Init = function () {
        $scope.total = Math.ceil($scope.items.length / $scope.rowsPage);
        $scope.totalRows = $scope.items.length;
        $scope.filtered = $scope.items;
        for (var page = 0; page > $scope.total; page++)
            $scope.pages.push(page);
    };
};
app.controller("PruebasCtrl", ["$scope", "PlantaServices", "$filter",
    function ($scope, PlantaServices, $filter) {
        BaseTableController.call(this, $scope, $filter);
        $scope.items = PlantaServices.Ensambles.query($scope.Init);
    }]);
app.controller("PruebaCtrl", ["$scope", "PlantaServices", "$routeParams", "$filter",
    function ($scope, PlantaServices, $routeParams, $filter) {
        if (!$routeParams.PruebaID) {
        }
        else
            $scope.prueba = PlantaServices.Ensambles.get({id: $routeParams.PruebaID});
        $scope.canClose = function () {
            if (!$scope.prueba)
                return false;
            var total = $filter("filter")($scope.prueba.pruebas, {estatus: "AutorizadaSupervisor"});
            return  total.length === 4;
        };
        $scope.Aprobar = function () {
            PlantaServices.Ensambles.Aprobar({id: $scope.prueba.id}, function () {
                noty({text: "Aprobación de las pruebas con exito¡¡¡", type: "success"});
            }, function () {
                noty({text: "Ocurrio  un error¡¡", type: "error"});
            });
        };
        $scope.Rechazar = function () {
            PlantaServices.Ensambles.Rechazar({id: $scope.prueba.id}, function () {
                noty({text: "Rechazo de las pruebas con exito¡¡¡", type: "success"});
            }, function () {
                noty({text: "Ocurrio  un error¡¡", type: "error"});
            });
        };
    }]);
var BaseController = function ($scope, $http, $interval, $routeParams, PlantaServices, $timeout, $location) {
    $scope.OptionsControl = {
        Locked: true
    };
    $scope.log = [];
    $scope.Iteracion = [];
    $scope.$on("$locationChangeStart", function (event, newUrl) {
        if ($scope.Poller.$$intervalId) {
            noty({
                text: "Desea cancelar la prueba?", modal: true,
                closeWith: [], buttons: [
                    {addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $scope.Stop();
                            $location.path(newUrl);
                        }
                    },
                    {addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                            $noty.close();
                        }
                    }
                ]
            });
            event.preventDefault();
        }
    });
    $scope.GetColor = function (max, min, read) {
        var esperado = d3.mean([min, max]);
        var result = Math.abs(esperado - read);
        result /= (esperado - min);
        result > 1 ? 1 : result;
        var color = d3.scale.linear().domain([0, 0.5, 1]).range(["green", "yellow", "red"]);
        return color(result);
    };
    $scope.Init = function () {
        $scope.incidencias = PlantaServices.Incidencias.query();
        $scope.ensamble = PlantaServices.Ensambles.get({id: $routeParams.EnsambleID}, function () {
            $scope.valores = PlantaServices.Pruebas.Valores({id: $scope.ensamble.planta.noSerie}, function () {
                $scope.PruebaCarga = [{}, {}, {}, {}];
                var i = 0;
                for (i = 0; i < 4; i++) {
                    angular.copy($scope.valores, $scope.PruebaCarga[i]);
                    var max = ($scope.valores.Max.I1 * 0.25 * (i + 1));
                    var min = ($scope.valores.Min.I1 * 0.25 * (i + 1));
                    $scope.PruebaCarga[i].Max.I2 = max;
                    $scope.PruebaCarga[i].Max.I1 = max;
                    $scope.PruebaCarga[i].Max.I3 = max;
                    $scope.PruebaCarga[i].Min.I2 = min;
                    $scope.PruebaCarga[i].Min.I1 = min;
                    $scope.PruebaCarga[i].Min.I3 = min;
                }
                $scope.PruebaCargaIndex = function () {
                    return $scope.Iteraciones.current < 2 ? $scope.Iteraciones.current : 3;
                };
            });
        });
    };
    $scope.Init();
    $scope.Enable = function () {
        $scope.OptionsControl.Locked = false;
    };
    $scope.Disable = function () {
        $scope.OptionsControl.Locked = true;
    };
    $scope.Added = [];
    $scope.now = [];
    $scope.Poller = {};
    $scope.RefreshTime = 1;
    $scope.RefreshTimes = [1, 5, 30, 60];
    $scope.Estatus = {
        Waiting: {text: "En espera", value: 0, color: 'green'},
        Running: {text: "Corriendo...", value: 1, color: 'blue'},
        Error: {text: "Error", value: 2, color: 'red'}
    };
    $scope.Save = function () {
        $scope.prueba.ensamble = $scope.ensamble;
        $scope.prueba.$update();
    };
    $scope.Estado = $scope.Estatus.Waiting;
    $scope.AccumulateTime = 0;
    $scope.intervalTime = 1;
    $scope.lastMinute = [];
    $scope.Accumulate = [];
    $scope.options = {
        series: [
            {
                y: "L1N",
                label: "L1-N",
                color: "#ff0000",
                type: "line",
                thickness: "1px"
            }, {
                y: "L2N",
                label: "L2-N",
                color: "#64c900",
                type: "line",
                thickness: "1px"
            }, {
                y: "L3N",
                label: "L3-N",
                color: "#428bca",
                type: "line",
                thickness: "1px"},
            {
                y: "I1",
                label: "I1",
                axis: "y2",
                color: "#4C2D73",
                type: "line",
                thickness: "1px"
            }, {
                y: "I2",
                label: "I2",
                axis: "y2",
                color: "#FF7C00", type: "line",
                thickness: "1px"
            }, {
                y: "I3",
                label: "I3", axis: "y2",
                color: "#FFFF00",
                type: "line", thickness: "1px"
            }],
        axes: {x: {type: "linear", key: "x"}, y: {type: "linear"}, y2: {type: "linear"}},
        lineMode: "bundle",
        tension: 0.7,
        tooltip: {mode: "scrubber"},
        drawLegend: true,
        drawDots: true,
        columnsHGap: 5
    };
    $scope.optionsTemp = {};
    angular.copy($scope.options, $scope.optionsTemp);
    $scope.optionsTemp.series = [
        {
            y: "Temp",
            label: "Temp",
            color: "#ff0000",
            type: "line", thickness: "1px"
        }, {
            y: "HZ",
            label: "HZ",
            axis: "y2",
            color: "#64c900",
            type: "line",
            thickness: "1px"
        }
    ];
    $scope.CanAprove = true;
    $scope.StopButton = function () {
        $scope.CanAprove = false;
        $scope.Stop();
    };
    $scope.Stop = function () {
        $scope.ParoPlanta();
        $scope.Estado = $scope.Estatus.Waiting;
        $interval.cancel($scope.Poller);
        $interval.cancel($scope.timer);
        $scope.Poller = {};
        $scope.timer = {};
        if ($scope.prueba) {
            $scope.prueba.dtFin = new Date();
            $scope.prueba.estatus = "Finalizada";
            $scope.prueba.ensamble = {id: $scope.ensamble.id},
            $scope.prueba.$update();
        }
    };
    $scope.ParoPlanta = function () {
        PlantaServices.Plantas.Off({id: $scope.ensamble.id}, {id: $scope.ensamble.id}, function () {
            noty({text: "Apagado de planta exitoso¡¡¡", type: "success"});
        }, function () {
            noty({text: "Error al apagar la planta la planta¡¡¡", type: "error"});
        });
    };
    $scope.AutoPlanta = function () {
        PlantaServices.Plantas.Auto({id: $scope.ensamble.id}, {id: $scope.ensamble.id}, function () {
            noty({text: "Modo Automatico de planta exitoso¡¡¡", type: "success"});
        }, function () {
            noty({text: "Error al colocar en  Automatico la planta¡¡¡", type: "error"});
        });
    };
    $scope.ArranquePlanta = function () {
        noty({text: "¿Esta seguro de encender la planta de Emergencia?", modal: true,
            closeWith: [], buttons: [
                {addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                        PlantaServices.Plantas.On({id: $scope.ensamble.id}, {id: $scope.ensamble.id}, function () {
                            noty({text: "Encendido de planta exitoso¡¡¡", type: "success"});
                        }, function () {
                            noty({text: "Error al encender la planta¡¡¡", type: "error"});
                        });
                    }
                },
                {
                    addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                        $noty.close();
                    }
                }
            ]
        });
    };
    $scope.Autoriza = function () {
        PlantaServices.Pruebas.AutorizaE({id: $scope.prueba.id}, {},
                function () {
                    $scope.prueba.estatus = 4;
                    noty({
                        text: "Aprobación con exito¡¡¡¡¡¡", type: "success"
                    });
                    $location.path("/Pruebas/" + $scope.ensamble.id);
                }, function () {
            noty({
                text: "Ocurrio un error al realizar la operacion¡¡¡", type: "error"
            });
        });
    };
    $scope.Rechaza = function () {
        PlantaServices.Pruebas.RechazaE({id: $scope.prueba.id}, {},
                function () {
                    $scope.prueba.estatus = 3;
                    noty({
                        text: "Rechazo con exito¡¡¡¡¡¡", type: "success"
                    });
                    $location.path("/Pruebas/" + $scope.ensamble.id);
                }, function () {
            noty({
                text: "Ocurrio un error al realizar la operacion¡¡¡", type: "error"
            });
        });
    };
    $scope.AutorizaS = function () {
        PlantaServices.Pruebas.AutorizaS({id: $scope.prueba.id}, {},
                function () {
                    $scope.prueba.estatus = 6;
                    noty({
                        text: "Aprobación con exito¡¡¡¡¡¡", type: "success"
                    });
                    $location.path("/Pruebas/" + $scope.ensamble.id);
                }, function () {
            noty({
                text: "Ocurrio un error al realizar la operacion¡¡¡", type: "error"
            });
        });
    };
    $scope.RechazaS = function () {
        PlantaServices.Pruebas.RechazaS({id: $scope.prueba.id}, {},
                function () {
                    $scope.prueba.estatus = 5;
                    noty({
                        text: "Rechazo con exito¡¡¡¡¡¡", type: "success"
                    });
                    $location.path("/Pruebas/" + $scope.ensamble.id);
                }, function () {
            noty({
                text: "Ocurrio un error al realizar la operacion¡¡¡", type: "error"
            });
        });
    };
    $scope.NowToLastMinute = function () {

        if ($scope.valores.Max.L1N < $scope.now.L1N || $scope.valores.Min.L1N > $scope.now.L1N) {
            $scope.log.push($scope.now.L1N);
        }

        if ($scope.valores.Max.L1N < $scope.now.L2N || $scope.valores.Min.L1N > $scope.now.L2N) {
            $scope.log.push($scope.now.L2N);
        }
        if ($scope.valores.Max.L1N < $scope.now.L3N || $scope.valores.Min.L1N > $scope.now.L3N) {
            $scope.log.push($scope.now.L3N);
        }
//        if ($scope.valores.Max.I1 > $scope.now.I1 && $scope.valores.Min.I1 > $scope.now.I1) {
//            $scope.log.push($scope.now.I1);
//        }
//        if ($scope.valores.Max.I1 > $scope.now.I && $scope.valores.Min.I1 > $scope.now.I2) {
//            $scope.log.push($scope.now.I2);
//        }
//        if ($scope.valores.Max.I1 > $scope.now.I3 && $scope.valores.Min.I1 > $scope.now.I3) {
//            $scope.log.push($scope.now.I3);
//        }

        if ($scope.valores.Max.HZ < $scope.now.HZ || $scope.valores.Min.HZ > $scope.now.HZ) {
            $scope.log.push($scope.now.HZ);
        }

        if ($scope.valores.Max.Temp < $scope.now.Temp) {
            $scope.log.push($scope.now.Temp);
        }

        return {
            x: $scope.AccumulateTime,
            L1N: $scope.now.L1N,
            L2N: $scope.now.L2N,
            L3N: $scope.now.L3N,
            I1: $scope.now.I1,
            I2: $scope.now.I2,
            I3: $scope.now.I3, HZ: $scope.now.HZ,
            Temp: $scope.now.Temp,
            RPM: $scope.now.RPM,
            MaxV: $scope.valores.Max.L1N,
            MinV: $scope.valores.Min.L1N
                    //bateria: $scope.now.bateria
        };
    };
    $scope.Start = function () {
        noty({
            text: "¿Confirma el comienzo de la prueba", modal: true, closeWith: [],
            buttons: [
                {addClass: 'btn btn-primary', text: 'Ok',
                    onClick: function ($noty) {
                        $noty.close();
                        $scope.notyInit = noty({text: 'Comenzando prueba en  ...', type: 'success', modal: true});
                        $scope.notyInit.count = 5;
                        $scope.intervalNoty = $interval(function () {
                            $scope.notyInit.setText("Comenzando prueba en ... " + $scope.notyInit.count);
                            $scope.notyInit.count--;
                        }, 1000);
                        $timeout(function () {
                            $scope.notyInit.close();
                            $interval.cancel($scope.intervalNoty);
                            $scope.Process();
                        }, 5000);
                    }
                },
                {addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                        $noty.close();
                        noty({text: 'Cancelado', type: 'error'});
                    }
                }]
        });
    };
};
app.controller("PruebaSinCargaCtrl", [
    "$scope", "$http", "$interval", "$routeParams", "PlantaServices", "$location",
    function ($scope, $http, $interval, $routeParams, PlantaServices, $location) {
        BaseController.call(this, $scope, $http, $interval, $routeParams, PlantaServices, $location);
        $scope.prueba = PlantaServices.Pruebas.get({id: $routeParams.PruebaID});
        $scope.options = {
            series: [
                {
                    y: "L1N",
                    label: "L1-N",
                    color: "#ff0000",
                    type: "line",
                    thickness: "1px"
                }, {
                    y: "L2N",
                    label: "L2-N",
                    color: "#64c900",
                    type: "line",
                    thickness: "1px"
                }, {
                    y: "L3N",
                    label: "L3-N",
                    color: "#428bca",
                    type: "line",
                    thickness: "1px"
                }
            ],
            axes: {x: {type: "linear", key: "x"}, y: {type: "linear"}},
            lineMode: "bundle",
            tension: 0.7,
            tooltip: {mode: "scrubber"},
            drawLegend: true
        };
        $scope.optionsCorriente = {
            series: [
                {
                    y: "I1",
                    label: "I1",
                    color: "#ff0000",
                    type: "line",
                    thickness: "1px"
                }, {
                    y: "I2",
                    label: "I2",
                    color: "#64c900",
                    type: "line",
                    thickness: "1px"
                }, {
                    y: "I3",
                    label: "I3",
                    color: "#428bca",
                    type: "line",
                    thickness: "1px"
                }
            ],
            axes: {x: {type: "linear", key: "x"}, y: {type: "linear"}},
            lineMode: "bundle",
            tension: 0.7,
            tooltip: {mode: "scrubber"},
            drawLegend: true
        };
        $scope.optionsPresion = {
            series: [
                {
                    y: "Presion",
                    label: "Presion PSI",
                    color: "#ff0000",
                    type: "line",
                    thickness: "1px"
                }, {
                    y: "RPM",
                    label: "RPM",
                    color: "#64c900",
                    type: "line",
                    thickness: "1px"
                }, {
                    y: "Temp",
                    label: "Temp",
                    color: "#428bca",
                    type: "line",
                    thickness: "1px"
                }
            ],
            axes: {x: {type: "linear", key: "x"}, y: {type: "linear"}},
            lineMode: "bundle",
            tension: 0.7,
            tooltip: {mode: "scrubber"},
            drawLegend: true
        };
        $scope.optionsTemp = {
            series: [
                {
                    y: "Temp",
                    label: "Temp °C",
                    color: "#ff0000",
                    type: "line",
                    thickness: "1px"
                }, {
                    y: "HZ",
                    label: "HZ",
                    color: "#64c900",
                    type: "line",
                    thickness: "1px"
                }, {
                    y: "bateria",
                    label: "C .Alt Volts",
                    color: "#428bca",
                    type: "line",
                    thickness: "1px"
                }
            ],
            axes: {x: {type: "linear", key: "x"}, y: {type: "linear"}},
            lineMode: "bundle",
            tension: 0.7,
            tooltip: {mode: "scrubber"},
            drawLegend: true
        };
        $scope.data = PlantaServices.Pruebas.Lecturas({id: $routeParams.PruebaID}, function () {
            $scope.max = Math.floor($scope.data.length / 60);
            $scope.min = 0;
        });
        $scope.minute = 1;
        $scope.$watch("minute", function () {
            var index = $scope.minute * 60;
            var i = 0;
            $scope.lastMinute = [];
            if ($scope.data.length >= index + 60)
                for (i = 0; i < 60; i++) {
                    $scope.lastMinute.push($scope.data[i + index]);
                }
        });
    }]);
app.controller("PruebaSinCargaController", [
    "$scope", "$http", "$interval", "$routeParams", "PlantaServices", "$timeout", "$location",
    function ($scope, $http, $interval, $routeParams, PlantaServices, $timeout, $location) {
        BaseController.call(this, $scope, $http, $interval, $routeParams, PlantaServices, $timeout, $location);
        $scope.Iteraciones = {current: 0,
            Iteracciones: [{No: 1, Time: 10 * 60, current: 0}]};
        $timeout(function () {
            $scope.valores.Max.I1 = $scope.valores.Max.I2 = $scope.valores.Max.I3 = 0;
            $scope.valores.Min.I1 = $scope.valores.Min.I2 = $scope.valores.Min.I3 = 0;
        }, 1000);
        $scope.Process = function () {
            $scope.Estado = $scope.Estatus.Running;
            $scope.data = [];
            $scope.Iteraciones.current = 0;
            $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current = 0;
            $scope.prueba = new PlantaServices.Pruebas({
                ensamble: {id: $scope.ensamble.id},
                tipo: 0,
                estatus: "Ejecutando",
                dtInicio: new Date(), dtFin: new Date(),
                comentario: null,
                incidencias: null
            });
            $scope.prueba.$save(function () {
                noty({text: "Comenzando Prueba de carga "});
                $scope.timer = $interval(function () {
                    $scope.prueba.dtFin = new Date();
                    if ($scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current >= $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].Time) {
                        $scope.Iteraciones.current++;
                        var current = $scope.now;
                        current.index = $scope.Iteraciones.current;
                        $scope.Accumulate.push(current);
                        if ($scope.Iteraciones.Iteracciones.length === $scope.Iteraciones.current) {
                            noty({text: "Terminando prueba¡¡¡", type: 'success'});
                            return $scope.Stop();
                        }
                        else {
                            $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current = 0;
                            noty({text: "Comenzando Iteracion " + $scope.Iteraciones.current + "¡¡¡", type: 'success'});
                        }
                    }
                    if ($scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].alert)
                        if ($scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].alert.time
                                === $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current) {
                            noty({text: $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].alert.msg,
                                type: "error"});
                        }
                    $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current++;
                    $scope.AccumulateTime++;
                }, 1000);
                $scope.Poller = $interval(function () {
                    PlantaServices.Pruebas.GetValues({id: $scope.prueba.id, seg: $scope.AccumulateTime, ite: $scope.Iteraciones.current, equipo: $scope.ensamble.carriles.equipo}
                    , function (response) {
                        $scope.now = response;
                        $scope.now.time = $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current;
                        $scope.lastMinute.push($scope.NowToLastMinute());
                        if ($scope.lastMinute.length > (30 / $scope.RefreshTime)) {
                            $scope.lastMinute.shift();
                        }
                        $scope.data.push({x: $scope.AccumulateTime, L1N: $scope.now.L1N, L2N: $scope.now.L2N, L3N: $scope.now.L3N});
                    }, function () {

                    });
                }, $scope.RefreshTime * 1000);
            }, function () {
                $scope.Estado = $scope.Estatus.Waiting;
            });
        };
    }]);
app.controller("PruebaConCargaController", [
    "$scope", "$http", "$interval", "$routeParams", "PlantaServices", "$timeout", "$location",
    function ($scope, $http, $interval, $routeParams, PlantaServices, $timeout, $location) {
        BaseController.call(this, $scope, $http, $interval, $routeParams, PlantaServices, $timeout, $location);
        $scope.Accumulate = [];
        $scope.Iteraciones = {current: 0,
            Iteracciones: [
                {No: 1, Time: 1 * 60, current: 0, alert: {msg: 'Aumentar la carga a 50%¡¡¡', time: 30}},
                {No: 2, Time: 1 * 60, current: 0, alert: {msg: 'Aumentar la carga a 75%¡¡¡', time: 30}},
                {No: 3, Time: 1 * 60, current: 0, alert: {msg: 'Aumentar la carga a 100%¡¡¡', time: 30}},
                {No: 4, Time: 1 * 60, current: 0},
                {No: 5, Time: 10 * 60, current: 0},
                {No: 6, Time: 10 * 60, current: 0},
                {No: 7, Time: 10 * 60, current: 0},
                {No: 8, Time: 10 * 60, current: 0},
                {No: 9, Time: 10 * 60, current: 0}
            ]};
        $scope.Process = function () {
            $scope.Estado = $scope.Estatus.Running;
            $scope.data = [];
            $scope.Iteraciones.current = 0;
            $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current = 0;
            $scope.prueba = new PlantaServices.Pruebas({
                ensamble: {id: $scope.ensamble.id},
                tipo: 1,
                estatus: "Ejecutando",
                dtInicio: new Date(), dtFin: new Date()
            });
            $scope.prueba.$save(function () {
                noty({text: "Comenzando Prueba de carga "});
                $scope.timer = $interval(function () {
                    if ($scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current >= $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].Time) {
                        $scope.Iteraciones.current++;
                        var current = $scope.now;
                        current.index = $scope.Iteraciones.current;
                        $scope.Accumulate.push(current);
                        if ($scope.Iteraciones.Iteracciones.length === $scope.Iteraciones.current) {
                            noty({text: "Terminando prueba¡¡¡", type: 'success'});
                            return $scope.Stop();
                        }
                        else {
                            $scope.Iteracion.push(new PlantaServices.Iteraciones({id: $scope.now.id}));
                            $scope.Iteracion[$scope.Iteraciones.current - 1 ].$save();
                            $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current = 0;
                            noty({text: "Comenzando Iteracion " + $scope.Iteraciones.current + "¡¡¡", type: 'success'});
                        }
                    }
                    if ($scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].alert)
                        if ($scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].alert.time
                                === $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current) {
                            noty({text: $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].alert.msg,
                                type: "error"});
                        }
                    $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current++;
                    $scope.AccumulateTime++;
                }, 1000);
                $scope.Poller = $interval(function () {
                    PlantaServices.Pruebas.GetValues({id: $scope.prueba.id, seg: $scope.AccumulateTime, ite: $scope.Iteraciones.current, equipo: $scope.ensamble.carriles.equipo}
                    , function (response) {
                        $scope.now = response;
                        $scope.now.time = $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current;
                        $scope.lastMinute.push($scope.NowToLastMinute());
                        if ($scope.lastMinute.length > (30 / $scope.RefreshTime)) {
                            $scope.lastMinute.shift();
                        }
                        $scope.data.push({x: $scope.AccumulateTime, L1N: $scope.now.L1N, L2N: $scope.now.L2N, L3N: $scope.now.L3N});
                    }, function () {

                    });
                }, $scope.RefreshTime * 1000);
            }, function () {
                $scope.Estado = $scope.Estatus.Waiting;
            });
        };
    }]);
app.controller("PruebaConCargaSubitaCtrl", [
    "$scope", "$http", "$interval", "$routeParams", "PlantaServices", "$timeout", "$location",
    function ($scope, $http, $interval, $routeParams, PlantaServices, $timeout, $location) {
        BaseController.call(this, $scope, $http, $interval, $routeParams, PlantaServices, $timeout, $location);
        $scope.Iteraciones = {current: 0,
            Iteracciones: [
                {No: 1, Time: 1 * 60, current: 0},
                {No: 2, Time: 1 * 60, current: 0},
                {No: 3, Time: 1 * 60, current: 0}
            ]};
        $scope.data = {voltaje: [], hz: []};
        $scope.Process = function () {
            $scope.Estado = $scope.Estatus.Running;
            $scope.data = {voltaje: [], hz: []};
            $scope.Iteraciones.current = 0;
            $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current = 0;
            $scope.prueba = new PlantaServices.Pruebas({
                ensamble: {id: $scope.ensamble.id},
                tipo: 2,
                estatus: "Ejecutando",
                dtInicio: new Date(),
                dtFin: new Date()
            });
            $scope.prueba.$save(function () {
                noty({text: "Comenzando Prueba de Carga Subita"});
                $scope.timer = $interval(function () {
                    if ($scope.now.L1N >= $scope.valores.Min.L1L2 && $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].active) {
                        var current = $scope.now;
                        current.index = $scope.Iteraciones.current;
                        $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current;
                        current.voltaje = {max: 0, min: 0};
                        current.hz = {max: 0, min: 0};
                        current.voltaje.max = _.max($scope.data.voltaje);
                        current.voltaje.min = _.min($scope.data.voltaje);
                        current.hz.max = _.max($scope.data.hz);
                        current.hz.min = _.min($scope.data.hz);
                        $scope.Accumulate.push(current);
                        $scope.Iteraciones.current++;
                        if ($scope.Iteraciones.Iteracciones.length === $scope.Iteraciones.current) {
                            noty({text: "Terminando prueba¡¡¡", type: 'success'});
                            return $scope.Stop();
                        }
                        else {
                            $scope.data = {voltaje: [], hz: []};
                            $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current = 0;
                            noty({text: "Comenzando Iteracion " + $scope.Iteraciones.current + "¡¡¡", type: 'success'});
                        }
                    }
                    if (!$scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].active)
                        if ($scope.now.L1N > $scope.valores.Min.L1L2)
                            $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].active = true;
                    if ($scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].active) {
                        $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current++;
                        $scope.data.voltaje.push($scope.now.L1N);
                        $scope.data.hz.push($scope.now.HZ);
                    }
                    $scope.AccumulateTime++;
                }, 1000);
                $scope.Poller = $interval(function () {
                    PlantaServices.Pruebas.GetValues({id: $scope.prueba.id, seg: $scope.AccumulateTime, ite: $scope.Iteraciones.current, equipo: $scope.ensamble.carriles.equipo}
                    , function (response) {
                        $scope.now = response;
                        $scope.now.time = $scope.Iteraciones.Iteracciones[$scope.Iteraciones.current].current;
                        $scope.lastMinute.push($scope.NowToLastMinute());
                        if ($scope.lastMinute.length > (30 / $scope.RefreshTime)) {
                            $scope.lastMinute.shift();
                        }

                    }, function () {
                    });
                }, 1000);
            }, function () {
                $scope.Estado = $scope.Estatus.Waiting;
            }
            );
        }
        ;
    }]);
app.controller("PruebaControlCtrl", [
    "$scope", "$http", "$interval", "$routeParams", "PlantaServices", "$timeout", "$location",
    function ($scope, $http, $interval, $routeParams, PlantaServices, $timeout, $location) {
        BaseController.call(this, $scope, $http, $interval, $routeParams, PlantaServices, $timeout, $location);
        $scope.prueba = new PlantaServices.Pruebascontrol({
            tipo: 3,
            estatus: "Creada",
            dtInicio: new Date(),
            dtFin: new Date()
        });
        $scope.GuardarPrueba = function () {
            $scope.prueba.ensamble = {id: $scope.ensamble.id};
            $scope.prueba.estatus = "Finalizada";
            if ($scope.prueba.id)
                $scope.prueba.$update(function () {
                }, function () {
                });
            else
                $scope.prueba.$save(function () {
                }, function () {
                });
        };
    }]);
app.controller("PruebaControlViewCtrl", [
    "$scope", "$http", "$interval", "$routeParams", "PlantaServices", "$timeout", "$location",
    function ($scope, $http, $interval, $routeParams, PlantaServices, $timeout, $location) {
        BaseController.call(this, $scope, $http, $interval, $routeParams, PlantaServices, $timeout, $location);
        $scope.prueba = PlantaServices.Pruebascontrol.get({id: $routeParams.PruebaID});
    }]);
app.controller("EnsambleController", ["$scope", "PlantaServices", "$filter", "$location",
    function ($scope, PlantaServices, $filter, $location) {
        $scope.motores = PlantaServices.Motores.query();
        $scope.tipoServicio = [{id: 0, text: "Emergencia"}, {id: 1, text: "Continuo"}];
        $scope.tipoControl = [{id: 0, text: "Intellite"}, {id: 1, text: "IntelliCompac"}];
        $scope.combustible = [{id: 0, text: "Diesel"}, {id: 1, text: "Gasolina"}];
        $scope.carriles = PlantaServices.Carriles.query();
        $scope.searchOP = function (term) {
            $scope.OPS = PlantaServices.Produccion.GetByOP({noOP: term});
        };
        $scope.selectOp = function (op) {
            $scope.planta.op = op;
            $scope.planta.noOp = op.op;
        };
        $scope.SelectedMotor = function () {
            if (!$scope.planta.motores)
                return;
            var motor = $filter("filter")($scope.motores, function (item) {
                return item.modelo === $scope.planta.motores.modelo;
            });
            if (motor.length !== 0)
                return motor[0];
        };
        $scope.planta = {};
        $scope.submit = function () {
            var planta = new PlantaServices.Plantas($scope.planta);
            planta.$save(
                    function () {
                        var prueba = new PlantaServices.Ensambles({
                            folio: "14PR000001",
                            dtCreacion: new Date(),
                            planta: planta,
                            dtProgramada: $scope.ensamble.dtProgramada,
                            cariles: $scope.ensamble.cariles,
                            altitud: $scope.ensamble.altitud,
                            patin: $scope.ensamble.patin,
                            guardas: $scope.ensamble.guardas,
                            rediador: $scope.ensamble.rediador,
                            estatus: "Programada"
                        });
                        prueba.$save(function () {
                            noty({text: "Planta registrada con el folio : " + prueba.folio + "¡¡¡", type: "success", modal: true});
                            prueba.$QR({id: prueba.id}, function () {
                                $location.path("/Pruebas/" + prueba.id);
                            }, function () {
                                $location.path("/Pruebas/" + prueba.id);
                                noty({text: "Ocurrió un error al generar el QR", type: "error"});
                            });
                        }, function () {
                            planta.$delete(function () {
                            }, function () {
                                alert("Ocurrio un error");
                            });
                            alert("Ocurrio un error");
                        });
                    },
                    function () {
                        alert("Ocurrio un error");
                    }
            );
        }
        ;
    }]);
app.controller("NuevoArranqueCtrl",
        ["$scope", "PlantaServices", "$filter", "$location",
            function ($scope, PlantaServices, $filter, $location) {
                $scope.motores = PlantaServices.Plantas.query();
                $scope.ubicaciones = PlantaServices.Ubicaciones.query();
                $scope.kits = PlantaServices.Kits.query();
                $scope.clientes = PlantaServices.Clientes.query();
                $scope.searchPlanta = function (term) {
                    $scope.plantas = PlantaServices.Plantas.ByOP({noOP: term});
                };
                $scope.prueba = new PlantaServices.EnsambleArranque({
                    folio: "14PR000001", dtCreacion: new Date()
                });
                $scope.selectPlanta = function (planta) {
                    $scope.prueba.planta = planta;
                };
                $scope.submit = function () {
                    $scope.prueba.$save(function () {
                        noty({text: "Prueba de arranque registrada con el folio : " + prueba.folio + "¡¡¡", type: "success", modal: true});
                        $location.path("/Pruebas/" + prueba.id);
                    }, function () {
                        noty({text: "Ocurrio un error", type: "error"});
                    });
                };
            }]);
app.controller("PruebasArranqueCtrl", ["$scope", "PlantaServices", "$filter",
    function ($scope, PlantaServices, $filter) {
        BaseTableController.call(this, $scope, $filter);
        $scope.items = PlantaServices.EnsambleArranque.query($scope.Init);
    }]);
app.controller("EnsambleArranqueCtrl", ["$scope", "PlantaServices", "$routeParams", "$filter",
    function ($scope, PlantaServices, $routeParams, $filter) {
        if (!$routeParams.PruebaID) {
        }
        else
            $scope.prueba = PlantaServices.EnsambleArranque.get({id: $routeParams.PruebaID});
        $scope.canClose = function () {
            if (!$scope.prueba.pruebaarranques)
                return false;
            var total = $filter("filter")($scope.prueba.pruebaarranques, {estatus: "AutorizadaSupervisor"});
            return  total.length === 4;
        };
        $scope.Aprobar = function () {
            PlantaServices.EnsambleArranque.Aprobar(function () {
            }, function () {
            });
        };
        $scope.Rechazar = function () {
            PlantaServices.EnsambleArranque.Rechazar(function () {
            }, function () {
            });
        };
    }]);
app.controller("PruebaArranqueCtrl", ["$routeParams", "$scope", "PlantaServices", "$timeout",
    function ($routeParams, $scope, PlantaServices, $timeout) {
        $scope.ensamble = PlantaServices.EnsambleArranque.get({id: $routeParams.EnsambleID}, function () {
            $scope.prueba = new PlantaServices.Arranques({
                dtInicio: new Date(),
                dtFin: new Date(),
                tipo: 1,
                estatus: "Creada",
                ensamblearranque: {id: $scope.ensamble.id}
            });
        });
        $scope.GuardarPrueba = function () {
            $scope.prueba.estatus = "Finalizada";
            $scope.prueba.$save(function () {
            }, function () {
            });
        };
    }]);
app.controller("PruebaInstalacionCtrl", ["$routeParams", "$scope", "PlantaServices", "$timeout",
    function ($routeParams, $scope, PlantaServices, $timeout) {
        $scope.ensamble = PlantaServices.EnsambleArranque.get({id: $routeParams.EnsambleID}, function () {
            $scope.prueba = new PlantaServices.Instalaciones({
                dtInicio: new Date(),
                dtFin: new Date(),
                tipo: 0,
                estatus: 0,
                ensamblearranque: {id: $scope.ensamble.id}
            });
        });
        $scope.GuardarPrueba = function () {
            $scope.prueba.estatus = 2;
            $scope.prueba.$save(function () {
                $scope.prueba.estatus = 2;
            }, function () {
            });
        };
    }]);
app.controller("PruebaVacioCtrl", ["$routeParams", "$scope", "PlantaServices", "$timeout",
    function ($routeParams, $scope, PlantaServices, $timeout) {
        $scope.ensamble = PlantaServices.EnsambleArranque.get({id: $routeParams.EnsambleID}, function () {
            $scope.prueba = new PlantaServices.Vacios({
                dtInicio: new Date(),
                dtFin: new Date(),
                tipo: 2,
                estatus: "Creada",
                ensamblearranque: {id: $scope.ensamble.id}
            });
        });
        $scope.GuardarPrueba = function () {
            $scope.prueba.estatus = "Finalizada";
            $scope.prueba.$save(function () {
            }, function () {
            });
        };
    }]);
app.controller("PruebaArranqueViewCtrl",
        ["$routeParams", "$scope", "PlantaServices", "$timeout",
            function ($routeParams, $scope, PlantaServices, $timeout) {
                $scope.ensamble = PlantaServices.EnsambleArranque.get({id: $routeParams.EnsambleID}, function () {
                });
                $scope.prueba = new PlantaServices.Arranques.get({id: $routeParams.PruebaID});
                $scope.GuardarPrueba = function () {
                    $scope.prueba.$save(function () {
                    }, function () {
                    });
                };
            }]);
app.controller("PruebaVacioViewCtrl", ["$routeParams", "$scope", "PlantaServices", "$timeout",
    function ($routeParams, $scope, PlantaServices, $timeout) {
        $scope.ensamble = PlantaServices.EnsambleArranque.get({id: $routeParams.EnsambleID}, function () {
        });
        $scope.prueba = new PlantaServices.Vacios.get({id: $routeParams.PruebaID});
        $scope.GuardarPrueba = function () {

            $scope.prueba.$save(function () {
            }, function () {
            });
        };
    }]);
app.controller("PruebaInstalacionViewCtrl", ["$routeParams", "$scope", "PlantaServices", "$timeout",
    function ($routeParams, $scope, PlantaServices, $timeout) {
        $scope.ensamble = PlantaServices.EnsambleArranque.get({id: $routeParams.EnsambleID}, function () {
        });
        $scope.prueba = new PlantaServices.Instalaciones.get({id: $routeParams.PruebaID});
        $scope.GuardarPrueba = function () {
            $scope.prueba.$save(function () {
            }, function () {
            });
        };
    }]);
app.run(["$rootScope", "PlantaServices", "amMoment", "$cookieStore", "$location",
    function ($rootScope, PlantaServices, amMoment, $cookieStore, $location) {
        amMoment.changeLocale('es');
        //$rootScope.user = PlantaServices.Usuarios.current();
        $rootScope.hasRole = function (role) {
            if ($rootScope.user === undefined) {
                return false;
            }

            if ($rootScope.user.roles[role] === undefined) {
                return false;
            }

            return $rootScope.user.roles[role];
        };
        $rootScope.logout = function () {
            delete $rootScope.user;
            delete $rootScope.authToken;
            $cookieStore.remove('authToken');
            $location.path("/login");
        };
        /* Try getting valid user from cookie or go to login page */
        var originalPath = $location.path();
        $location.path("/login");
        var authToken = $cookieStore.get('authToken');
        if (authToken !== undefined) {
            $rootScope.authToken = authToken;
            PlantaServices.Usuarios.current(function (user) {
                $rootScope.user = user;
                if("/login" === originalPath)
                    $location.path("/Pruebas");
                else
                    $location.path(originalPath);
            });
        }

        $rootScope.$on('$routeChangeStart', function (event, next) {
//            if ($rootScope.authToken === undefined) {
//                event.preventDefault();
//                $location.path("/login");
//            }
        });
        $rootScope.initialized = true;
    }]);
app.controller('MainCtrl', ['$scope', '$timeout', '$log', 'Uuid', 'Sample', 'ganttMouseOffset', 'moment', "PlantaServices",
    function ($scope, $timeout, $log, Uuid, Sample, mouseOffset, moment, PlantaServices) {
        $scope.options = {
            mode: 'custom',
            scale: 'day',
            maxHeight: false,
            width: false,
            autoExpand: 'none',
            taskOutOfRange: 'truncate',
            fromDate: undefined,
            toDate: undefined,
            showLabelsColumn: true,
            currentDate: 'line',
            currentDateValue: new Date(),
            draw: false,
            readOnly: false,
            filterTask: undefined,
            filterRow: undefined,
            dateFrames: {
                'weekend': {
                    evaluator: function (date) {
                        return date.isoWeekday() === 6 || date.isoWeekday() === 7;
                    },
                    targets: ['weekend']
                }
            },
            timeFramesNonWorkingMode: 'visible',
            columnMagnet: '5 minutes',
            api: function (api) {
                $scope.api = api;
                api.core.on.ready($scope, function () {
                    $scope.loadData([{"id": "d868e42b-37e2-4d2c-b5a9-3f6d023ff94f", "name": "Carril 3", "tasks": [{"id": "0fd04452-4a5f-4ac6-9434-370eb52e4311", "from": "2014-11-04", "to": 1415167200000, "name": "Planta OP017019", "color": "green"}]}, {"id": "e687a093-7369-4ff1-9a56-f21c2b68a8d9", "name": "Carril 5", "tasks": []}]);
                    $scope.api.data.clear();
                    $scope.addSamples();
                    api.directives.on.destroy($scope, function (directiveName, directiveScope, element) {
                        if (directiveName === 'ganttRow') {
                            element.off('mousedown', directiveScope.drawHandler);
                            delete directiveScope.drawHandler;
                        }
                    });
                });
            }
        };
        $scope.$watch('options.scale', function (newValue) {
            if (newValue === 'quarter') {
                $scope.options.headersFormats = {'quarter': '[Q]Q YYYY'};
                $scope.options.headers = ['quarter'];
            } else {
                $scope.options.headersFormats = undefined;
                $scope.options.headers = undefined;
            }
        });
        $scope.addSamples = function () {
            $scope.api.timespans.load(Sample.getSampleTimespans().timespan1);
            Sample.getSample().success(function (response) {
                $scope.loadData(response);
            });
        };
        $scope.loadData = function (data) {
            $scope.api.data.load(data);
        };
    }]);
app.controller('ProgramacionPruebasArranqueCtrl', ['$scope', '$timeout', '$log', 'Uuid', 'Sample', 'ganttMouseOffset', 'moment', "PlantaServices",
    function ($scope, $timeout, $log, Uuid, Sample, mouseOffset, moment, PlantaServices) {
        $scope.options = {
            mode: 'custom',
            scale: 'day',
            maxHeight: false,
            width: false,
            autoExpand: 'none',
            taskOutOfRange: 'truncate',
            fromDate: undefined,
            toDate: undefined,
            showLabelsColumn: true,
            currentDate: 'line',
            currentDateValue: new Date(),
            draw: false,
            readOnly: false,
            filterTask: undefined,
            filterRow: undefined,
            dateFrames: {
                'weekend': {
                    evaluator: function (date) {
                        return date.isoWeekday() === 6 || date.isoWeekday() === 7;
                    },
                    targets: ['weekend']
                }
            },
            timeFramesNonWorkingMode: 'visible',
            columnMagnet: '5 minutes',
            api: function (api) {
                $scope.api = api;
                api.core.on.ready($scope, function () {
                    $scope.loadData([{"id": "d868e42b-37e2-4d2c-b5a9-3f6d023ff94f", "name": "Carril 3", "tasks": [{"id": "0fd04452-4a5f-4ac6-9434-370eb52e4311", "from": "2014-11-04", "to": 1415167200000, "name": "Planta OP017019", "color": "green"}]}, {"id": "e687a093-7369-4ff1-9a56-f21c2b68a8d9", "name": "Carril 5", "tasks": []}]);
                    $scope.api.data.clear();
                    $scope.addSamples();
                    api.directives.on.destroy($scope, function (directiveName, directiveScope, element) {
                        if (directiveName === 'ganttRow') {
                            element.off('mousedown', directiveScope.drawHandler);
                            delete directiveScope.drawHandler;
                        }
                    });
                });
            }
        };
        $scope.$watch('options.scale', function (newValue) {
            if (newValue === 'quarter') {
                $scope.options.headersFormats = {'quarter': '[Q]Q YYYY'};
                $scope.options.headers = ['quarter'];
            } else {
                $scope.options.headersFormats = undefined;
                $scope.options.headers = undefined;
            }
        });
        $scope.addSamples = function () {
            $scope.api.timespans.load(Sample.getSampleTimespans().timespan1);
            PlantaServices.Planeacion.Arranques(function (data) {
                $scope.loadData(data);
            });
        };
        $scope.loadData = function (data) {
            $scope.api.data.load(data);
        };
    }]);
function LoginController($scope, $rootScope, $location, $cookieStore, PlantaServices) {
    $scope.rememberMe = false;
    $scope.login = function () {
        PlantaServices.UserService.authenticate($.param({username: $scope.username, password: $scope.password}),
                function (authenticationResult) {
                    var authToken = authenticationResult.token;
                    $rootScope.authToken = authToken;
                    if ($scope.rememberMe) {
                        $cookieStore.put('authToken', authToken);
                    }
                    PlantaServices.Usuarios.current(function (user) {
                        $rootScope.user = user;
                        $location.path("/");
                    });
                });
    };
}
;

