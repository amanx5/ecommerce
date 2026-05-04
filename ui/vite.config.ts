import path from 'path';
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

/**
 * Export the Vite configuration using defineConfig.
 *
 * `defineConfig` is a helper function provided by Vite to:
 * - enable type inference for IDEs (auto-completion and validation)
 * - allow dynamic configuration via a function that receives the current environment context
 *
 * @see https://vite.dev/config/
 */
export default defineConfig(getViteConfig);

/**
 * getViteConfig generates the actual Vite configuration object.
 *
 * @param {ConfigEnv} configEnv - The environment context provided by Vite
 *   - configEnv.mode: 'development' | 'production' | 'test'
 *   - configEnv.command: 'serve' | 'build'
 * @returns {UserConfig} Vite configuration object
 */
function getViteConfig(configEnv: ConfigEnv): UserConfig {
	/**
	 * Load environment variables for the current mode.
	 *
	 * loadEnv returns only variables prefixed with `VITE_` from .env.development/.env.production by default.
	 * To get all variables from .env.development/.env.production and system variables, pass '' as 3rd argument
	 * To access only system environment variables, use process.env
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const env = loadEnv(configEnv.mode, process.cwd());

	return {
		build: {
			outDir: path.resolve('dist'),
		},

		plugins: [react(), tailwindcss()],

		// server is development mode only config, it doesn't have any impact on build
		server: {
			host: true,

			// *** CORS error is handled in Express cors middleware ***
			// and requests are forwarded to backend server through `getEndpointUrl` utility
			// add `proxy` to prevent CORS error and also forward "/api" and "/images" requests to backend server
			// proxy: {
			// 	'/api': {
			// 		target: env.VITE_BACKEND_URL,
			// 		changeOrigin: true,
			// 	},
			// 	'/images': {
			// 		target: env.VITE_BACKEND_URL,
			// 		changeOrigin: true,
			// 	},
			// },
		},

		resolve: {
			alias: {
				'@': path.resolve('./src'),
			},
		},
	};
}

// `changeOrigin` rewrites the Host header of the proxied request to match the target server.
//	 _______________________________________________________________________________________________________________________________
//	|																																|
//	|					GET /api												GET /api (forwarded)								|
// 	|  Browser --------------------------------------> Vite (5173) ----------------------------------------------> Backend (5000)	|
// 	|			(Header: Host: domain:5173)		  (changeOrigin: false)		 (Header: Host: domain:5173)							|
//  |_______________________________________________________________________________________________________________________________|
//	|																																|
//	|					GET /api												GET /api (forwarded)								|
// 	|  Browser --------------------------------------> Vite (5173) ----------------------------------------------> Backend (5000)	|
// 	|			(Header: Host: domain:5173)		  (changeOrigin: true)	 	(Header: Host: domain:5000)							 	|
//  |_______________________________________________________________________________________________________________________________|
//
// 	Hostname 	= domain (localhost/google/etc) or an IP
// 	Origin 		= protocol + hostname + port
// 	Host header = hostname + optional port
