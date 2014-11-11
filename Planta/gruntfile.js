module.exports = function(grunt) {

    grunt.initConfig({
        wiredep: {
            target: {
                src: [
                    '/public/**/*.html', // .html support...
                    '/views/*.jade', // .jade support...
                    '/views/*.handlebars',
                    '/styles/main.scss', // .scss & .sass support...
                    '/config.yml' // and .yml & .yaml support out of the box!
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-wiredep');
};