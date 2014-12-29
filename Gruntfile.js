
/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
		'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
		' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Compile Less
		less: {
			development: {
				files: {
					"css/simple-elegance.css": "less/main.less"
				}
			}
		},
		// Task configuration.
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: ['css/<%= pkg.name %>.css'],
				dest: 'dist/<%= pkg.name %>.css'
			}
		},
		// Make sure autoprefixer changes make it into final css
		// (min-css will aggressively merge and break cross-browser rules)
		cssmin: {
			options: {
				banner: '<%= pkg.banner %>',
				noAggressiveMerging: true
			},
			minify: {
				src: 'dist/<%= pkg.name %>.css',
				dest: 'dist/<%= pkg.name %>.min.css'
			}
		},
		// Update app versions
		bumpup: {
			files: ['package.json', 'bower.json']
		},
		// Generate Changelog
		changelog: {
			options: {
			}
		},
		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
					'dist/*',
					'!dist/.git*'
					]
				}]
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				unused: true,
				boss: true,
				eqnull: true,
				globals: {}
			},
			gruntfile: {
				src: 'Gruntfile.js'
			}
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-conventional-changelog');
	grunt.loadNpmTasks('grunt-bumpup');

	grunt.registerTask('bump:pre', ['bumpup:prerelease']);
	grunt.registerTask('bump:bug', ['bumpup:patch', 'changelog']);
	grunt.registerTask('bump:minor', ['bumpup:minor', 'changelog']);
	grunt.registerTask('bump:major', ['bumpup:major', 'changelog']);

	// Default task.
	grunt.registerTask('build', ['clean', 'jshint', 'less', 'concat', 'cssmin']);
};
