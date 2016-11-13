module.exports = function(grunt) { 
	"use strict";
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.initConfig({ 
		pkg: grunt.file.readJSON('package.json'),
		less: {
			options: {
				paths: ['app/less']
			},
			dev: {
				files: {
					'app/build/styles.css': 'app/less/styles.less'
				}
			}
		},
		concat: {
			options: {
				separator: ';',
			},
			dev: {
				src:['app/js/**/*.js'],
				dest: 'app/build/app.js'
			}
		},
		watch: {
			less: {
				files: 'app/less/*.less',
				tasks: ['less:dev']
			},
			concat: {
				files: ['app/js/**/*.js'],
				tasks: ['concat:dev']
			}
		}

	})
}