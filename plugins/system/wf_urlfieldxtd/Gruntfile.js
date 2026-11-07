/* eslint-disable no-unused-vars */
/*eslint-env node */

module.exports = function (grunt) {
    var pkg = grunt.file.readJSON("package.json");

    var filter = function (path) {
        const exclusionPatterns = [
            'build', 'js/src', 'lib', 'less', 'Gruntfile.js', 'package.json', 'package-lock.json', 'README', 'rollup.config.js',
            '.gitignore', '.gitattributes',
            /\/(less|src|lib)\b/, /\.less$/, /\.(js|css)\.map$/
        ];

        return !exclusionPatterns.some(pattern => {
            if (typeof pattern === 'string') {
                return path.includes(pattern);
            } else if (pattern instanceof RegExp) {
                return pattern.test(path);
            }
            return false;
        });
    };

    grunt.initConfig({
        pkg: pkg,

        root: '../../..',

        tmp: 'build',

        dest: '<%= tmp %>/<%= pkg.version_clean %>/',

        /* Remove existing final build */
        shell: {
            clean: {
                command: 'rm -rf <%= dest %>'
            }
        },

        clean: {
            start: ['<%= tmp %>/<%= pkg.version_clean %>']
        },

        copy: {
            main: {
                files: [
                    /* Plugin */
                    {
                        src: '**',
                        dest: '<%= tmp %>/<%= pkg.version_clean %>/plugins/system/<%= pkg.name %>/',
                        filter: function (filepath) {
                            return filter(filepath);
                        }
                    },

                    /* Manifest */
                    {
                        expand: true,
                        cwd: '<%= root %>/plugins/system/<%= pkg.name %>/',
                        src: '<%= pkg.name %>.xml',
                        dest: '<%= tmp %>/<%= pkg.version_clean %>/'
                    },

                    /* Script File */
                    {
                        expand: true,
                        cwd: '<%= root %>/plugins/system/<%= pkg.name %>/',
                        src: 'script.php',
                        dest: '<%= tmp %>/<%= pkg.version_clean %>/'
                    }
                ]
            }
        },

        replace: {
            production: {
                options: {
                    patterns: [{
                        json: {
                            'name@@': pkg.name,
                            'version@@': function () {
                                var version = pkg.version;
                                return version;
                            },
                            'email@@': pkg.email,
                            'licence@@': pkg.licence,
                            'copyright@@': pkg.copyright,
                            'date@@': grunt.template.today('dd-mm-yyyy')
                        }
                    }]
                },
                files: [
                    { expand: true, cwd: '<%= tmp %>/<%= pkg.version_clean %>/', src: ['**/**.xml'], dest: '<%= tmp %>/<%= pkg.version_clean %>/' }
                ]
            }
        },

        uglify: {
            options: {
                mangle: false,
                banner: '/* <%= pkg.name %> - <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd") %> | https://www.joomlacontenteditor.net | <%= pkg.copyright %> | <%= pkg.licence %> */\n'
            },

            other: {
                files: [{
                    expand: true,
                    cwd: '<%= tmp %>/<%= pkg.version_clean %>/',
                    src: ['**/*.js'],
                    dest: '<%= tmp %>/<%= pkg.version_clean %>/'
                }]
            }
        },

        less: {},

        cssmin: {
            options: {
                banner: '/* <%= pkg.name %> - <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd") %> | https://www.joomlacontenteditor.net | <%= pkg.copyright %> | <%= pkg.licence %> */\n'
            },

            production: {
                options: {
                    banner: '/* <%= pkg.name %> - <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd") %> | https://www.joomlacontenteditor.net | <%= pkg.copyright %> | <%= pkg.licence %> */\n',

                    processImport: false,
                    mediaMerging: false
                },

                files: [{
                    expand: true,
                    cwd: '<%= tmp %>/<%= pkg.version_clean %>/',
                    src: ['**/**.css'],
                    dest: '<%= tmp %>/<%= pkg.version_clean %>/'
                }]
            }
        },

        compress: {
            options: {
                mode: 'zip'
            },

            package: {
                options: {
                    archive: '<%= tmp %>/<%= pkg.version_clean %>.zip'
                },

                files: [{
                    expand: true,
                    cwd: '<%= tmp %>/<%= pkg.version_clean %>',
                    src: ['**/**']
                }]
            }
        },

        watch: {}
    });

    //grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-replace');

    grunt.registerTask("setup", function () {
        if (pkg.development) {
            pkg.version += "" + pkg.development;
        }

        pkg.version_clean = 'plg_system_' + pkg.name.replace(/-/g, '_') + '_' + pkg.version.replace(/[^\w-]+/g, '');
    });

    grunt.registerTask("default", ["setup", "shell:clean", "clean:start", "copy:main", "replace", "uglify", "cssmin", "compress"]);
};