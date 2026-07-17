import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dkj6ADdV.mjs";
import { t as createSsrRpc } from "./createSsrRpc-gkzqXpg7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-users.functions-BqAIPDmH.js
var inviteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("c9f6ae4d8ad0cd6c9ce6374befb5f970e5263bbdca7f82b7d94e3836da5e771c"));
var deleteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("6825df580faeca88f7d9ef3e1218c16ef32fd7ee1ff3bd0b96717bcccd44ccfb"));
var adminSetPassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("0d0c07a65c0857a08946e2697199515335f20099bc56aa4650be6a1beb0700ce"));
//#endregion
export { deleteUser as n, inviteUser as r, adminSetPassword as t };
