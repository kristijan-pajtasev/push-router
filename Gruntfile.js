module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

	grunt.initConfig({
		watch: {
			es6: {
		      // We watch and compile sass files as normal but don't live reload here 
		      files: ['dev/es6/*.js', 'dev/es6/**/*.js'],
		      tasks: ['exec:es6'],
		   	},
			webpack: {
		      // We watch and compile sass files as normal but don't live reload here 
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
					return 'webpack dev/js/main.js public/js/bundle.js \n webpack dev/js/main.js public/js/bundle.min.js --optimize-minimize ';
					// return 'webpack dev/js/main.js public/js/bundle.js --optimize-minimize ';
				} 
			}
		}
	});



	// Default task(s).
	grunt.registerTask('default', ['exec:es6', 'exec:webpack', 'watch']);

};