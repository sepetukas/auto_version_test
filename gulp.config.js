module.exports = function () {
	var svg = {
		sourceFolder: 'src/scss/assets/icons/',
		spriteFolder: 'src/assets/styles/images/',
		scssMapFolder: 'src/scss/base/',
		pngFallback: false
	};
	var config = {

        root:"./",
            /**
             * NPM files
             */
            packages: [
                './package.json'
            ],
			path: {
				HTML: '/index.html',
				ALL: ['src/app/main.js'],
				MINIFIED_OUT: 'build.min.js',
				DEST_SRC: 'scripts',
				DEST_BUILD: 'scripts',
				DEST: 'dist'
			},
			svg: {
				sourceFolder: svg.sourceFolder,
				spriteFolder: svg.spriteFolder,
				scssMapFolder: svg.scssMapFolder,
				pngFallback: svg.pngFallback
			},
			scss: {
				src: [
					'./src/scss/**/*.scss',
                    './src/app/**/*.scss',
					'!./src/scss/**/*_scsslint_tmp*.scss', //ignores temporary scss-lint files
                    '!./src/app/**/*_scsslint_tmp*.scss' //ignores temporary scss-lint files
				],
				cssFolder: 'src/assets/styles/'
			}
			,
			optimize: {
				css: {},
				js: {},
				images: {
					src: 'src/assets/images/originals/**/*.{png,gif,jpg,svg}',
					dest: 'src/assets/images/',
					options: {                       // Target options
						optimizationLevel: 7,
						svgoPlugins: [{removeViewBox: false}],
						progessive: true,
						interlaced: true
					}
				}
			},
			svgConfig: {
				shape: {
					spacing: {
                        padding: 4
					}
				},
                variables: {
                    version: Math.round(+new Date()/1000)
                },
				mode: {
					css: {
						bust: false,
						dest: './',
						// layout: 'vertical', 'horizontal', 'diagonal'
						sprite: svg.spriteFolder + 'sprite.svg',
						render: {
							scss: {
								dest: svg.scssMapFolder + '_svg-sprite-map.scss',
								template: svg.scssMapFolder + '_svg-sprite-template.scss'
							}
						}
					}
				}
			}
			,
		}
		;

	return config;
};



