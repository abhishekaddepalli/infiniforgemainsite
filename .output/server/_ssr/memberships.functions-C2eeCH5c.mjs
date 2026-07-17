import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dkj6ADdV.mjs";
import { t as createSsrRpc } from "./createSsrRpc-gkzqXpg7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/memberships.functions-C2eeCH5c.js
var listTiers = createServerFn({ method: "GET" }).handler(createSsrRpc("87e49e25c527797fbf254f04ba0d838328e2d50cb33a0c5752f74b5cbfec4071"));
var getMyBenefits = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("484d169125ac0ff2543226f180b637f802f9023bc8de60d4bf087b57d5ae63c0"));
var getMyMembership = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("5c2a17230be7c118bb8fede60d479ac7336d773c8a4cae26f19ba1cff8aa90d2"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("8353c865a53c163342ef1d97e884973cc3d8de469857dd92d4d365c59d39b5e8"));
var setResourceAccess = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("685ed3c7ffd5620a21fde7f39c02a5816bcaacba05078467a901d3f2ff8c5011"));
var getResourceAccess = createServerFn({ method: "GET" }).inputValidator((d) => d).handler(createSsrRpc("ab1ba954ebff361cd17e41387ab546efba091c4cb6207c5fc8e539fca1f0ab6b"));
var upsertTier = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("4725246a2da31bb40037710f22b8573a49a68f72959eb478421c99a07ab7635b"));
var deleteTier = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("ec9e3f25aa3eeade546bdf63ba73a4cbba6610f09e3b65d0adb8eee23bf21d38"));
var listUserMemberships = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("e2ce16cfdd3ddc9c7f3229e395359e25ebd820426c68ecba64186cd270df15f1"));
var listMembershipAssignableUsers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0733e626ebed968ab60de66877c498f6ad4ac5bcb9951a1ce3845222c4049d02"));
var assignMembership = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("955158c06bcb9fbe7a9d010a0c35506fc00dac3f6cd88763c51932a629d4dcd5"));
var revokeMembership = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("a0ea4c1e5eb42719bda44e7060480ce171baf91ec4945ff66e870470a4424f25"));
var purchaseMembership = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("250b1eacf9f579b0e5528008185c0c516b9d23b61b0cdf9810c96a783a416b76"));
var createMembershipRazorpayOrder = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("062b3466561c27d254d07b68a9bbcbd235feb15f5b1a4818ca5376be561f406e"));
var verifyMembershipPayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("12888c00ab1478858ae86528d915c3e6e57b286c00e90436717a6fb4ab3ee85a"));
var listAccessibleResources = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("94a7efcfdea2aa37325cf72a6a6734167976558646b28a8e7d2e5fea3c8bc070"));
var listTierAccessSelections = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("87be43479f55387e66938288f92f10fa290772d1fbe914a989697c71f9c926a5"));
var saveTierAccessSelections = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("dd0d021f8fea8bb2fc57dd425483e00a91df8c60eca2c7bbba7d71cfc74c35c9"));
//#endregion
export { verifyMembershipPayment as _, getMyMembership as a, listMembershipAssignableUsers as c, listUserMemberships as d, purchaseMembership as f, upsertTier as g, setResourceAccess as h, getMyBenefits as i, listTierAccessSelections as l, saveTierAccessSelections as m, createMembershipRazorpayOrder as n, getResourceAccess as o, revokeMembership as p, deleteTier as r, listAccessibleResources as s, assignMembership as t, listTiers as u };
