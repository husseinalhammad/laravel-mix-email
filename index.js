const mix = require('laravel-mix');
const File = require('laravel-mix/src/File')
const glob = require('glob');
const juice = require("juice");
const { html: beautifyHTML } = require('js-beautify');
// email-comb is imported with a dynamic import inside register()


class Email {
	register(config = {}) {
		const {
			enabled = mix.inProduction(),
			source = 'dist',
			inlineCss: juiceConfig = { enabled: false },
			optimize: combConfig = { enabled: false },
			beautify: beautifyConfig = { enabled: false }
		} = config;

		if(!enabled || (!juiceConfig.enabled && !combConfig.enabled && !beautifyConfig.enabled)) {
			return;
		}

		// Run tasks after Webpack compiles
		// https://laravel-mix.com/docs/6.0/event-hooks#run-a-function-after-webpack-compiles
		mix.after(async () => {
			const filePaths = glob.sync(source);

			if(combConfig.enabled) {
				const {comb} = await import("email-comb");
				this.comb = comb;
			}

			filePaths.forEach(async (filePath) => {
				let file = new File(filePath);
				let processedHTML = file.read();

				if(juiceConfig.enabled) {
					processedHTML = await this.juice(processedHTML, juiceConfig);
				}

				if(combConfig.enabled) {
					processedHTML = await this.emailComb(processedHTML, combConfig);
				}

				if(beautifyConfig.enabled) {
					processedHTML = await this.beautify(processedHTML, beautifyConfig);
				}

				file.write(processedHTML)
			})
		});

	}


	juice(html, config) {
		return new Promise((resolve, reject) => {
			juice.juiceResources(html, config, (error, processedHTML) => {
				if (error) {
					console.log(error);
					reject(error);
				}

				resolve(processedHTML)
			})
		})
	}


	emailComb(html, config) {
		return new Promise(async (resolve, reject) => {
			resolve(this.comb(html, config).result)
		})
	}


	beautify(html, config) {
		return new Promise(async (resolve, reject) => {
			resolve(beautifyHTML(html, config));
		})
	}
}


mix.extend('email', new Email());