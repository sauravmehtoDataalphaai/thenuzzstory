import { t as createServerFn } from "../server.js";
import { t as createSsrRpc } from "./createSsrRpc-BdB2e2iw.js";
//#region src/server/catalog.ts
var seedCatalogFromStatic = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("624dda450a197b6671432529c3e7ee9ef75d3f2e48929a960066b27bff2fd0a6"));
var listAdminProducts = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("cf1382c6e4ea5681598d0e61585745ced86660535c555b65c7c67a067256c134"));
var getAdminProduct = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("54396c0d48269654ad585833821ff0af227bc31fc9a278596a11d5f71f73d34c"));
var upsertAdminProduct = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("a1fe58f2b43dd55365d1ebda350cbb10f4297bd7832c118003fb73b48714c693"));
var deleteAdminProduct = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("16fafd27d8025fdeb96230d8420d49215fc1a28228092b1f93f9dc9a0f381876"));
var listAdminCoupons = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("c73e9e0c3a6082206bc829aac2e66b497a15d33b3c41798c87111df1b8a19426"));
var upsertAdminCoupon = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("36f8c275197ebfd12f84219018b0e9bbfd206e29b982f9620818e2a7eece345a"));
var getAdminReports = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("240a888f657a18f4decefc9bcd56aa1dbccfa35f895b06750de2c822ecd3a616"));
var listAuditLog = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("6c1df528347f13f13c912311059de94c2794bb311e7cb6f13c6341b34b64abfd"));
//#endregion
export { listAdminProducts as a, upsertAdminCoupon as c, listAdminCoupons as i, upsertAdminProduct as l, getAdminProduct as n, listAuditLog as o, getAdminReports as r, seedCatalogFromStatic as s, deleteAdminProduct as t };
