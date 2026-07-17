import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-gkzqXpg7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments.functions-C2aKgYFM.js
var createCheckout = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(createSsrRpc("69ad7f0f5f10059b119e512f5ffd71af45c019280d02b4bd5c57f998c631e2a9"));
var verifyPayment = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(createSsrRpc("3082e488c4a8779ced42ff7d7eb0cb04aaf3c1cba345399c512c9e4e1bae4239"));
var confirmDemoPayment = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(createSsrRpc("42b45334dc5748cd6d77c02771f440e3f398c0475985f2ff6ffd359c04e2a0e1"));
var createWalletTopup = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(createSsrRpc("9fd3b9de945f6995873b79bc4d3ef1c4aaadf74767f4cbd2a983d3b09663be27"));
var verifyWalletTopup = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(createSsrRpc("1561f9fc062bfa789ae8e48ffb0159f33e07a7f772231ccc7c4b25b23ef10531"));
//#endregion
export { verifyWalletTopup as a, verifyPayment as i, createCheckout as n, createWalletTopup as r, confirmDemoPayment as t };
