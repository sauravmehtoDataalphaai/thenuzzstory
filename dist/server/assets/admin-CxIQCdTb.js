import { t as createServerFn } from "../server.js";
import { t as createSsrRpc } from "./createSsrRpc-BdB2e2iw.js";
//#region src/server/admin.ts
var getAdminSession = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("bbf374cdb00ffe214fa6c1d2c99b82c3b459419dce186882878d5b5e576a7c19"));
var getAdminDashboardStats = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("c9974c8cde5128f97f2b90ec882f623d717ff42f8132d49bbcfa68db28099139"));
var listAdminOrders = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("089fa91e0e7a7dd926830e349264959ba7c5b017ea539ea94f695a223e71eef8"));
var getAdminOrder = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("3f9d2ffddb0de4cccd25e204162c63e22b672fada823802c680f2c18522141e9"));
var updateAdminOrderStatus = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("2f3b336c5f991757ff2dc438e7f1883582f8e61e7a62f2ef75cfeac94062a8fc"));
var listAdminUsers = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("b5f136c19f5b8e57693f41835cbd0596d76899e444c52e8e2256d99f166d664e"));
var getAdminUser = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("1a766845e9bfd4fa2dfdd9217e905c7dfdd549cc17926d6ed4295172a6cf492b"));
var updateAdminCustomer = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("3a8072040cbde7e8a726fd1b40b2ccc5321ee3c9e7fec9a36204b44794c7300f"));
var deleteAdminCustomer = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("61fbbeeb6fb5eb2ef03de68295ce48cae8a43dd890fcced009644a4dac0e4262"));
var listAdminStaff = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("9050f0835b69df240c331fc57faeeb87cfa1bd7c2fe15d9a7d121ad0437fba1f"));
var updateAdminStaff = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("70e20e2c8a20cc43fa05736f919f61aa41a21a7510ce37a8092d90a727948fab"));
var promoteUserByEmail = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("4bc67c0134bbf69aa883243bcb598f7a0a2583cae6df7ea51fe4b499b96e3ff9"));
var getPermissionsMatrix = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("90e5bcedbfdb9e3bb208687e55db715e77514d3a301a8085eb755f5b21df5293"));
var savePermissionsMatrix = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("96fbd681b9639947a0f004911b6a3d8c6765d98e2d9a2962d9cbad03a1b88d09"));
//#endregion
export { getAdminUser as a, listAdminStaff as c, savePermissionsMatrix as d, updateAdminCustomer as f, getAdminSession as i, listAdminUsers as l, updateAdminStaff as m, getAdminDashboardStats as n, getPermissionsMatrix as o, updateAdminOrderStatus as p, getAdminOrder as r, listAdminOrders as s, deleteAdminCustomer as t, promoteUserByEmail as u };
