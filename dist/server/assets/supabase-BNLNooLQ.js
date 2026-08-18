import { n as TSS_SERVER_FUNCTION } from "../server.js";
import { createClient } from "@supabase/supabase-js";
//#region node_modules/@tanstack/start-server-core/dist/esm/createServerRpc.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/server/supabase.ts
function env(name) {
	const fromProcess = typeof process !== "undefined" ? process.env[name] : void 0;
	const fromMeta = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "sb_publishable_ctUdGpQ6Eijw1d0tbcHjnQ_5l970XSZ",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_ctUdGpQ6Eijw1d0tbcHjnQ_5l970XSZ",
		"VITE_SUPABASE_URL": "https://ittmbsqsgndgmwmtavim.supabase.co"
	}[name];
	return fromProcess || fromMeta;
}
/** Server-only Supabase client (service role). Never import into browser components. */
function createServiceSupabase() {
	const url = env("SUPABASE_URL") || env("VITE_SUPABASE_URL");
	const secret = env("SUPABASE_SECRET_KEY");
	if (!url || !secret) throw new Error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY for admin server client");
	return createClient(url, secret, { auth: {
		persistSession: false,
		autoRefreshToken: false
	} });
}
//#endregion
export { createServerRpc as n, createServiceSupabase as t };
