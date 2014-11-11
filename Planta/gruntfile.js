module.exports = function(grunt) {


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
          banner: '/*! \n * <%= pkg.title || pkg.name %> v<%= pkg.version %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n',

        wiredep: {
              task: {
                src: [
                    'public/**/*.html', // .html support...
                    'views/**/*.jade', // .jade support...
                    'views/**/*.handlebars'                 
                ]
            }
        },
        
        concat: {
            options: {
               banner: '<%= banner %>'
            },
            dist: {
              src:  ['bower_components/angular*/angular**.min.js'],
              dest: 'public/javascript/selmec/angular.js',
            },
          },
    });

    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('build', ['wiredep','concat:dist']);
};