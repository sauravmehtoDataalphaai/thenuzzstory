import { u as supabase } from "./catalog-db-CghLbik8.js";
//#region src/lib/admin/session.ts
async function getAccessToken() {
	const { data } = await supabase.auth.getSession();
	return data.session?.access_token ?? null;
}
//#endregion
export { getAccessToken as t };
