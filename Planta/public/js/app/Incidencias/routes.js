var Routes = ['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/Incidencias', {
                    templateUrl: '/templates/Incidencias/Index.html',
                    controller: 'IncidenciasCtrl'
                }).
                when('/Incidencias/Edit/:IncidenciaID', {
                    templateUrl: '/templates/Incidencias/Edit.html',
                    controller: 'IncidenciasSaveCtrl'
                }).
                when('/Incidencias/Create', {
                    templateUrl: '/templates/Incidencias/Edit.html',
                    controller: 'IncidenciasSaveCtrl'
                }).
                when('/Kits', {
                    templateUrl: '/templates/Kits/Index.html',
                    controller: 'KitsCtrl'
                }).
                when('/Kits/Edit/:id', {
                    templateUrl: '/templates/Kits/Edit.html',
                    controller: 'KitsSaveCtrl'
                }).
                when('/Kits/Create', {
                    templateUrl: '/templates/Kits/Create.html',
                    controller: 'KitsSaveCtrl'
                }).
                otherwise({
                    redirectTo: '/Pruebas'
                });
    }];
app.config(Routes);