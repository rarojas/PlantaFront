var Routes = ['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/NuevaPrueba', {
                    templateUrl: '/templates/Ensamble/Nueva.html',
                    controller: 'EnsambleController'
                }).
                when('/Pruebas', {
                    templateUrl: '/templates/Ensamble/Pruebas.html',
                    controller: 'PruebasCtrl'
                }).
                when('/Pruebas/:PruebaID', {
                    templateUrl: '/templates/Ensamble/Prueba.html',
                    controller: 'PruebaCtrl'
                }).
                when('/PruebaSinCarga/:EnsambleID', {
                    templateUrl: '/templates/PruebaSinCarga.html',
                    controller: 'PruebaSinCargaController'
                }).
                when('/PruebaSinCargaView/:EnsambleID/:PruebaID', {
                    templateUrl: '/templates/PruebaSinCargaView.html',
                    controller: 'PruebaSinCargaCtrl'
                }).
                when('/PruebaConCargaView/:EnsambleID/:PruebaID', {
                    templateUrl: '/templates/PruebaConCargaView.html',
                    controller: 'PruebaSinCargaCtrl'
                }).
                when('/PruebaConCarga/:EnsambleID', {
                    templateUrl: '/templates/PruebaConCarga.html',
                    controller: 'PruebaConCargaController'
                }).
                when('/PruebaConCargaSubita/:EnsambleID', {
                    templateUrl: '/templates/PruebaConCargaSubita.html',
                    controller: 'PruebaConCargaSubitaCtrl'
                }).
                when('/PruebaConCargaSubitaView/:EnsambleID/:PruebaID', {
                    templateUrl: '/templates/PruebaSinCargaView.html',
                    controller: 'PruebaSinCargaCtrl'
                }).
                when('/Motores', {
                    templateUrl: '/templates/Motores/Index.html',
                    controller: 'MotoresCtrl'
                }).
                when('/Motores/Edit', {
                    templateUrl: '/templates/Motores/Edit.html',
                    controller: 'MotoresSaveCtrl'
                }).
                when('/Motores/Create', {
                    templateUrl: '/templates/Motores/Create.html',
                    controller: 'MotoresSaveCtrl'
                }).
                when('/PruebaControl/:EnsambleID', {
                    templateUrl: '/templates/PruebaControl.html',
                    controller: 'PruebaControlCtrl'
                }).
                when('/PruebaControlView/:EnsambleID/:PruebaID', {
                    templateUrl: '/templates/PruebaControlView.html',
                    controller: 'PruebaControlViewCtrl'
                }).
                when('/Usuarios', {
                    templateUrl: '/templates/Usuarios/Index.html',
                    controller: 'UsuariosCtrl'
                }).
                when('/Usuarios/Edit/:id', {
                    templateUrl: '/templates/Usuarios/Edit.html',
                    controller: 'UsuariosSaveCtrl'
                }).
                when('/Usuarios/Create', {
                    templateUrl: '/templates/Usuarios/Create.html',
                    controller: 'UsuariosSaveCtrl'
                }).
                when('/Carriles', {
                    templateUrl: '/templates/Carriles/Index.html',
                    controller: 'CarrilesCtrl'
                }).
                when('/Carriles/Edit/:id', {
                    templateUrl: '/templates/Carriles/Edit.html',
                    controller: 'CarrilesSaveCtrl'
                }).
                when('/Carriles/Create', {
                    templateUrl: '/templates/Carriles/Create.html',
                    controller: 'CarrilesSaveCtrl'
                }).
                when('/Ubicaciones', {
                    templateUrl: '/templates/Ubicaciones/Index.html',
                    controller: 'UbicacionesCtrl'
                }).
                when('/Ubicaciones/Edit/:id', {
                    templateUrl: '/templates/Ubicaciones/Edit.html',
                    controller: 'UbicacionesSaveCtrl'
                }).
                when('/Ubicaciones/Create', {
                    templateUrl: '/templates/Ubicaciones/Create.html',
                    controller: 'UbicacionesSaveCtrl'
                }).
                when('/Clientes', {
                    templateUrl: '/templates/Clientes/Index.html',
                    controller: 'ClientesCtrl'
                }).
                when('/Clientes/Edit/:id', {
                    templateUrl: 'templates/Clientes/Edit.html',
                    controller: 'ClientesSaveCtrl'
                }).
                when('/Clientes/Create', {
                    templateUrl: '/templates/Clientes/Create.html',
                    controller: 'ClientesSaveCtrl'
                }).
                when('/NuevoArranque', {
                    templateUrl: '/templates/EnsambleArranque/Nueva.html',
                    controller: 'NuevoArranqueCtrl'
                }).
                when('/PruebasArranque', {
                    templateUrl: '/templates/EnsambleArranque/Pruebas.html',
                    controller: 'PruebasArranqueCtrl'
                }).
                when('/PruebasArranque/:PruebaID', {
                    templateUrl: '/templates/EnsambleArranque/Prueba.html',
                    controller: 'EnsambleArranqueCtrl'
                }).
                when('/PruebaArranque/:EnsambleID', {
                    templateUrl: '/templates/Pruebas/Arranque.html',
                    controller: 'PruebaArranqueCtrl'
                }).
                when('/PruebaInstalacion/:EnsambleID', {
                    templateUrl: '/templates/Pruebas/Instalacion.html',
                    controller: 'PruebaInstalacionCtrl'
                }).
                when('/PruebaInstalacionView/:EnsambleID/:PruebaID', {
                    templateUrl: '/templates/Pruebas/InstalacionView.html',
                    controller: 'PruebaInstalacionViewCtrl'
                }).
                when('/PruebaVacio/:EnsambleID', {
                    templateUrl: '/templates/Pruebas/Vacio.html',
                    controller: 'PruebaVacioCtrl'
                }).
                when('/ProgramacionPruebasEnsamble', {
                    templateUrl: '/templates/Ensamble/Programacion.html',
                    controller: 'MainCtrl'
                })
                .
                when('/ProgramacionPruebasArranque', {
                    templateUrl: '/templates/EnsambleArranque/Programacion.html',
                    controller: 'ProgramacionPruebasArranqueCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
    }];
app.config(Routes);

