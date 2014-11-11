var services = ["PlantaServices",
    ["$resource", function ($resource) {
            var urlApiBase = "/api/";
            var api = {};
            api.Plantas = $resource(urlApiBase + "Planta/:noSerie", {}, {
                On: {method: 'get', url: urlApiBase + "Planta/On/:id"},
                Off: {method: 'get', url: urlApiBase + "Planta/Off/:id"},
                Auto: {method: 'get', url: urlApiBase + "Planta/Auto/:id"},
                ByOP: {method: 'GET', url: urlApiBase + "Planta/ByOp", isArray: true}
            });
            api.Carriles = $resource(urlApiBase + "Carriles/:id", {}, {
                update: {method: 'PUT'}
            });
            api.Kits = $resource(urlApiBase + "Kits/:id", {}, {
                update: {method: 'PUT'}
            });
            api.Motores = $resource(urlApiBase + "Motores/:modelo", {}, {
                update: {method: 'PUT'},
                get: {method: 'GET', url: urlApiBase + "Motores/Get"}
            });
            api.Ensambles = $resource(urlApiBase + "Ensambles/:id", {}, {
                Aprobar: {url: urlApiBase + "/Ensambles/Aprobar/:id", method: "get"},
                Rechazar: {url: urlApiBase + "/Ensambles/Rechazar/:id", method: "get"},
                QR: {url: urlApiBase + "/Ensambles/QR/:id", method: "get"}
            });
            api.Roles = $resource(urlApiBase + "Roles/:id", {}, {});
            api.Iteraciones = $resource(urlApiBase + "Iteraciones/:id", {}, {});
            api.EnsambleArranque = $resource(
                    urlApiBase + "EnsambleArranque/:id", {}, {
                save: {method: "post", url: urlApiBase + "EnsambleArranque/Create"}
            });
            api.Pruebasarranque = $resource(urlApiBase + "Pruebasarranque/:id", {}, {});
            api.Instalaciones = $resource(urlApiBase + "Instalaciones/:id", {}, {});
            api.Pruebascontrol = $resource(urlApiBase + "Pruebacontrol/:id", {}, {});
            api.Pruebas = $resource(urlApiBase + "Pruebas/:id", {}, {
                GetValues: {url: urlApiBase + 'Planta/GetValues/:id/:seg/:ite/:equipo'},
                Valores: {url: urlApiBase + "Planta/Valores/:id"},
                update: {method: 'PUT'},
                Lecturas: {url: urlApiBase + "Pruebas/Lecturas/:id", isArray: true},
                AutorizaE: {method: 'POST', url: urlApiBase + "Pruebas/AutorizarE/:id"},
                RechazaE: {method: 'POST', url: urlApiBase + "Pruebas/RechazarE/:id"},
                AutorizaS: {method: 'POST', url: urlApiBase + "Pruebas/AutorizarS/:id"},
                RechazaS: {method: 'POST', url: urlApiBase + "Pruebas/RechazarS/:id"},
                Control: {method: 'POST', url: urlApiBase + "Pruebacontrol"},
                Aprueba: {method: 'POST', url: urlApiBase + "Pruebas/Aprobar/:id"},
                Rechazar: {method: 'POST', url: urlApiBase + "Pruebas/Rechazar/:id"}
            });
            api.Incidencias = $resource(urlApiBase + "Incidencias/:id", {}, {
                update: {method: 'PUT'}
            });
            api.Usuarios = $resource(urlApiBase + "Usuarios/:id", {}, {
                update: {method: 'PUT'},
                current: {method: 'get', url: urlApiBase + "Usuarios/getDataUser"}
            });
            api.Clientes = $resource(urlApiBase + "Clientes/:id", {}, {
                update: {method: 'PUT'}
            });
            api.Ubicaciones = $resource(urlApiBase + "Ubicaciones/:id", {}, {
                update: {method: 'PUT'}
            });
            api.Produccion = $resource(urlApiBase + "Produccion/:id", {}, {
                GetByOP: {method: "GET", url: urlApiBase + "Produccion/ByOp", isArray: true}
            });
            api.Planeacion = $resource(urlApiBase + "GanttEnsamble/:id", {}, {
                Arranques: {url: urlApiBase + "GanttEnsamble/Arranques", method: "get", isArray: true}
            });
            return api;
        }]];
app.factory(services[0], services[1]);
app.service('Sample', function Sample($http) {
    return {
        getSample: function () {
            return $http.get("/api/GanttEnsamble");
        },
        getSampleData: function () {
            return {
                'data1': [
                    // Order is optional. If not specified it will be assigned automatically
                    {'id': '2f85dbeb-0845-404e-934e-218bf39750c0', 'name': 'Carril 1', 'order': 0, 'height': '3em', classes: 'gantt-row-milestone', 'color': '#45607D', 'tasks': [
                            // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
                            {'id': 'f55549b5-e449-4b0c-9f4b-8b33381f7d76', 'name': 'Planta  OP01091', 'color': '#93C47D', 'from': '2013-10-07T09:00:00', 'to': '2013-10-07T10:00:00', 'data': 'Can contain any custom data or object'},
                            {'id': '5e997eb3-4311-46b1-a1b4-7e8663ea8b0b', 'name': 'Planta  OP01091', 'color': '#93C47D', 'from': new Date(2013, 9, 18, 18, 0, 0), 'to': new Date(2013, 9, 18, 18, 0, 0), 'est': new Date(2013, 9, 16, 7, 0, 0), 'lct': new Date(2013, 9, 19, 0, 0, 0)},
                            {'id': 'b6a1c25c-85ae-4991-8502-b2b5127bc47c', 'name': 'Planta  OP01091', 'color': '#93C47D', 'from': new Date(2013, 10, 15, 18, 0, 0), 'to': new Date(2013, 10, 15, 18, 0, 0)}
                        ], 'data': 'Can contain any custom data or object'},
                    {'id': 'b8d10927-cf50-48bd-a056-3554decab824', 'name': 'Carril 2', 'order': 1, 'tasks': [
                            {'id': '301d781f-1ef0-4c35-8398-478b641c0658', 'name': 'Planta  OP0103213', 'color': '#9FC5F8', 'from': new Date(2013, 9, 25, 15, 0, 0), 'to': new Date(2013, 9, 25, 18, 30, 0)},
                            {'id': '0fbf344a-cb43-4b20-8003-a789ba803ad8', 'name': 'Planta  OP01DA31', 'color': '#9FC5F8', 'from': new Date(2013, 10, 1, 15, 0, 0), 'to': new Date(2013, 10, 1, 18, 0, 0)}
                        ]},
                    {'id': 'c65c2672-445d-4297-a7f2-30de241b3145', 'name': 'Carril 3', 'order': 2, 'tasks': [
                            {'id': '4e197e4d-02a4-490e-b920-4881c3ba8eb7', 'name': 'Planta  OP0DADA', 'color': '#9FC5F8', 'from': new Date(2013, 9, 7, 9, 0, 0), 'to': new Date(2013, 9, 7, 17, 0, 0),
                                'progress': {'percent': 100, 'color': '#3C8CF8'}},
                            {'id': '451046c0-9b17-4eaf-aee0-4e17fcfce6ae', 'name': 'Planta  OP0DFSFDS', 'color': '#9FC5F8', 'from': new Date(2013, 9, 8, 9, 0, 0), 'to': new Date(2013, 9, 8, 17, 0, 0),
                                'progress': {'percent': 100, 'color': '#3C8CF8'}},
                            {'id': 'fcc568c5-53b0-4046-8f19-265ebab34c0b', 'name': 'Planta  ODSA091', 'color': '#9FC5F8', 'from': new Date(2013, 9, 9, 8, 30, 0), 'to': new Date(2013, 9, 9, 12, 0, 0),
                                'progress': {'percent': 100, 'color': '#3C8CF8'}}
                        ]},
                    {'id': 'dd2e7a97-1622-4521-a807-f29960218785', 'name': 'Carril 4', 'order': 3, 'tasks': [
                        ]},
                    {'id': 'eede0c9a-6777-4b55-9359-1eada309404e', 'name': 'Carril 5', 'order': 4, 'tasks': [
                        ]}
                ]};
        },
        getSampleTimespans: function () {
            return {
                'timespan1': [
                    {
                        id: '1',
                        from: new Date(2014, 11, 1, 8, 0, 0),
                        to: new Date(2014, 11, 12, 15, 0, 0),
                        name: 'Sprint 1 Timespan'
                                //priority: undefined,
                                //classes: [], //Set custom classes names to apply to the timespan.
                                //data: undefined
                    }
                ]
            };
        }
    };
});
app.service('Uuid', function Uuid() {
    return {
        s4: function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
        },
        randomUuid: function () {
            return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                    this.s4() + '-' + this.s4() + this.s4() + this.s4();
        }
    };
});



