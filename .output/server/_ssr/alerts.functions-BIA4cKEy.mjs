import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as normalizePlatformAlertSettings } from "./alert-settings-DkcV0gwP.mjs";
import { t as createSsrRpc } from "./createSsrRpc-gkzqXpg7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts.functions-BIA4cKEy.js
var getPlatformAlertSettings = createServerFn({ method: "GET" }).handler(createSsrRpc("22ae3b9e5754388528b657ba84e1e9dc2cec119268df5feaafe30165f143a8eb"));
var savePlatformAlertSettings = createServerFn({ method: "POST" }).validator((input) => normalizePlatformAlertSettings(input)).handler(createSsrRpc("711d311206c0b4feab913614832bc5b56e260ab6be58e5fd87e3adbf2a8774b5"));
var recordLoginAlert = createServerFn({ method: "POST" }).validator((input) => input ?? {}).handler(createSsrRpc("ec8f00622aba4e2d6da0837e30e536a5680c05494e4f5f4575763ac098c1fc0f"));
var notifyProfileUpdated = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("b6e719158f8dc96d46038448f209af576259d0027336f17bf979ea68fcb84b28"));
var notifyTicketCreated = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("2fa947d19101a9cc44d464dfc3952b6719da6bf81ec60112dd31001c086cd8e3"));
var notifyOrderCreated = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("22d2e9601d6995ced4ca2240f3c637650fd43d1cfa2fef43f7e412ba64ccb262"));
var updateOrderStatusWithAlert = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("df8a47669bc6bf4d72d33dd5178eda59173cb191d0510cfdf0bb3ea14681aa99"));
var notifyAuditEvent = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("03666a4836d754ea2a3104592f039a1d33808b66701cc1b71e577ec0a81569b6"));
//#endregion
export { notifyTicketCreated as a, updateOrderStatusWithAlert as c, notifyProfileUpdated as i, notifyAuditEvent as n, recordLoginAlert as o, notifyOrderCreated as r, savePlatformAlertSettings as s, getPlatformAlertSettings as t };
