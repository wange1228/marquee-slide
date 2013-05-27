module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json'),
        readMe = '# ' + pkg.name                                                                            + '\n' +
                 '## ' + pkg.description                                                                    + '\n' +
                 '<pre>'                                                                                    + '\n' +
                 '/***'                                                                                     + '\n' +
                 ' @params auto: true                     # 是否自动滚动'                                   + '\n' +
                 '         interval: 3000                 # 间隔时间（毫秒）'                               + '\n' +
                 '         direction: "forward"           # 向前 -  forward / 向后 - backward'              + '\n' +
                 '         speed: 500                     # 移动速度（毫秒）'                               + '\n' +
                 '         showNum: 1                     # 显示个数'                                       + '\n' +
                 '         stepLen: 1                     # 每次滚动步长'                                   + '\n' +
                 '         type: "horizontal"             # 水平滚动 - horizontal / 垂直滚动 - vertical'    + '\n' +
                 '         prevElement: null              # 上一组按钮元素'                                 + '\n' +
                 '         prevBefore: function() {}      # 上一组移动前回调'                               + '\n' +
                 '         prevAfter: function() {}       # 上一组移动后回调'                               + '\n' +
                 '         nextElement: null              # 下一组按钮元素'                                 + '\n' +
                 '         nextBefore: function() {}      # 下一组移动前回调'                               + '\n' +
                 '         nextAfter: function() {}       # 下一组移动后回调'                               + '\n' +
                 '         pauseElement: null             # 暂停按钮元素'                                   + '\n' +
                 '         pauseBefore: function() {}     # 暂停前回调'                                     + '\n' +
                 '         pauseAfter: function() {}      # 暂停后回调'                                     + '\n' +
                 '         resumeElement: null            # 继续按钮元素'                                   + '\n' +
                 '         resumeBefore: function() {}    # 继续前回调'                                     + '\n' +
                 '         resumeAfter: function() {}     # 继续后回调'                                     + '\n' +
                 ' @url ' + pkg.homepage                                                                    + '\n' +
                 ' @version ' + pkg.version                                                                 + '\n' +
                 ' @author ' + pkg.author.name                                                              + '\n' +
                 ' @blog ' + pkg.author.url                                                                 + '\n' +
                 '***/</pre>'                                                                               + '\n' +
                 '## DEMO 预览'                                                                             + '\n' +
                 pkg.homepage                                                                               + '\n';
    grunt.initConfig({
        pkg: pkg,
        coffee: {
            compileBare: {
                options: {
                    bare: true
                },
                files: {
                    'src/marquee.source.js': 'src/marquee.source.coffee'
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
                    'dest/marquee.js': 'src/marquee.source.js'
                }
            }
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
    grunt.registerTask('default', ['coffee', 'uglify', 'watch']);
    grunt.file.write('README.md', readMe);
};