import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dkj6ADdV.mjs";
import { t as createSsrRpc } from "./createSsrRpc-gkzqXpg7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses.functions-Cs43ayVV.js
var listPublishedCourses = createServerFn({ method: "GET" }).handler(createSsrRpc("34b69cba9d724649e782f42b9ed4ecb603e98ca9dde80d3fd002f1c4bf57d5e2"));
var getCourseBySlug = createServerFn({ method: "GET" }).inputValidator((d) => d).handler(createSsrRpc("6d307843915e1de7cab61ff6aced7e88ee60114e7e061d0a60d8864ee671eee3"));
var getMyEnrollment = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("c430c85c674f9c5b1199f8c20d364401d7a7a6ae99cc6fa70aa87a320a804cf1"));
var enrollInCourse = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("99a5421bb11460190dcebc0ed1f4c88c7a1cd2e7976c366765bc52998ad22aa4"));
var getLearnData = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("cadf9097875b9b8bc955a534ddb68be60477461047810555c9a1caa1cf131ab3"));
var saveLessonProgress = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("4ac868f3a596cb5edb93213fdbc0209e0cf71c33116e98e16db335bc869c6649"));
var submitQuizAttempt = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("51b63688bd18d36eeeff8bbd626990292b08f3c27fe08434a49cde5f688aec66"));
var issueCertificate = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("807133c67e4b968799e8dec4951353caeb16e9f4bda401b0fa580ac659c317a3"));
var verifyCertificate = createServerFn({ method: "GET" }).inputValidator((d) => d).handler(createSsrRpc("b31cc007701f1b7e6a067d6811ff4879901e2d81bb23284b9d3c7802bcadb664"));
var listMyCourses = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("f14e4212548c274bc7666938e585c4b3ffd9b8a52d2b53ebb7e80e5447484aa8"));
var adminListCourses = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("b18ba41786239877bbd0f40f382d0bcd8a2eb0abb02799ddfa0158944f032469"));
var adminGetCourse = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("c21ec9d6b16661c7cba60983533a0fe058a49e3868e84a9a305b22de90b49e7d"));
var adminSaveCourse = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("22f3db6b22b959b9d676b936cee80e5aa756f94042f39a4e438ac73fe3e74b52"));
var adminDeleteCourse = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("78903168e8ece0f11fc64285073537b9f68fe55d03716b99a37d7a5bd92e9165"));
var adminSaveLesson = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("cbcc5ddeb79840117f557ae15060f6e20fa6f002d10b852902dbcc5404fb84b6"));
var adminDeleteLesson = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("8fc2cd3ed302ad1a1343c3670882a1c5da75d732fb94436f00d2bf5ef304a937"));
var adminReorderLessons = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("c8ee956b392ceec6dc3cd5abc2caffbb4ed76d57d664b71b6add8243f63d21b2"));
var adminSaveQuiz = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("fb8f6af472d3182f675b867bdfd376dcfc2560a18d318a7e17dbe2c7721280fd"));
var adminDeleteQuiz = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("71401d9ef3fd428916fa8665de4c2a0219450344a8bd1f89b837a1976a42adbe"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("1c80ee43dfb749a7ac47b3101652cb3abafad17d84d298bb89a8aef9ae215d1f"));
//#endregion
export { saveLessonProgress as _, adminListCourses as a, adminSaveLesson as c, getCourseBySlug as d, getLearnData as f, listPublishedCourses as g, listMyCourses as h, adminGetCourse as i, adminSaveQuiz as l, issueCertificate as m, adminDeleteLesson as n, adminReorderLessons as o, getMyEnrollment as p, adminDeleteQuiz as r, adminSaveCourse as s, adminDeleteCourse as t, enrollInCourse as u, submitQuizAttempt as v, verifyCertificate as y };
