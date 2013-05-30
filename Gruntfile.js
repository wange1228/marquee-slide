module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        basename: 'marquee',
        coffee: {
            compileBare: {
                options: {
                    bare: true
                },
                files: {
                    'src/<%= basename %>.source.js': 'src/<%= basename %>.source.coffee'
                }
            }
        },
        
        uglify: {
            options: {
                banner: '/***'                                     + '\n' +
                        '   @name <%= pkg.name %>'                 + '\n' +
                        '   @description <%= pkg.description %>'   + '\n' +
                        '   @url <%= pkg.homepage %>'              + '\n' +
                        '   @version <%= pkg.version %>'           + '\n' +
                        '   @author <%= pkg.author.name %>'        + '\n' +
                        '   @blog <%= pkg.author.url %>'           + '\n' +
                        '***/'                                     + '\n'
            },
            my_target: {
                files: {
                    'dest/<%= basename %>.js': 'src/<%= basename %>.source.js'
                }
            }
        },
        
        qunit: {
            all: ['test/*.html']
        },
        
        watch: {
            script: {
                files: ['src/*.js'],
                tasks: ['uglify']
            },
            coffee: {
                files: ['src/*.coffee'],
                tasks: ['coffee']
            }
        }
    });
    
    
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.registerTask('default', ['coffee', 'uglify', 'watch', 'qunit']);
};