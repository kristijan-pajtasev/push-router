module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

	grunt.initConfig({
		watch: {
			es6: {
		      files: ['dev/es6/*.js', 'dev/es6/**/*.js'],
		      tasks: ['exec:es6'],
		   	},
			webpack: {
		      files: ['dev/js/*.js', 'dev/js/**/*.js'],
		      tasks: ['exec:webpack'],
		   }

		},
		exec: {
			es6: {
				cmd: function() {
					return 'babel dev/es6/ -d dev/js/ --blacklist strict';
				}
			},
			webpack: {
				cmd: function() {
					return 'webpack dev/js/main.js example/public/js/bundle.js \n ' +
					 'webpack dev/js/main.js example/public/js/bundle.min.js --optimize-minimize \n ' +
					 'webpack dev/js/main.js dist/spa-router.js \n ' +
					 'webpack dev/js/main.js dist/spa-router.min.js --optimize-minimize \n ';
				} 
			}
		}
	});

	grunt.registerTask('default', ['exec:es6', 'exec:webpack', 'watch']);

};