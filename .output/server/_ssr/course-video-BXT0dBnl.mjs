//#region node_modules/.nitro/vite/services/ssr/assets/course-video-BXT0dBnl.js
var YT_HOSTS = [
	"youtube.com",
	"www.youtube.com",
	"m.youtube.com",
	"music.youtube.com",
	"youtu.be",
	"www.youtube-nocookie.com",
	"youtube-nocookie.com"
];
var VIMEO_HOSTS = [
	"vimeo.com",
	"www.vimeo.com",
	"player.vimeo.com"
];
var DRIVE_HOSTS = ["drive.google.com", "docs.google.com"];
var PLACEHOLDER_VALUES = /* @__PURE__ */ new Set([
	"",
	"#",
	"-",
	"na",
	"n/a",
	"none",
	"null",
	"undefined"
]);
function isPlaceholderVideoValue(value) {
	return PLACEHOLDER_VALUES.has(String(value ?? "").trim().toLowerCase());
}
function parseVideoUrl(raw) {
	const url = raw.trim();
	if (isPlaceholderVideoValue(url)) return null;
	if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return {
		source: "youtube",
		videoId: url,
		url: `https://www.youtube.com/watch?v=${url}`
	};
	let u;
	try {
		u = new URL(url);
	} catch {
		return null;
	}
	const host = u.hostname.toLowerCase();
	if (YT_HOSTS.includes(host)) {
		let id = "";
		if (host === "youtu.be") id = u.pathname.slice(1);
		else if (u.pathname.startsWith("/embed/")) id = u.pathname.slice(7);
		else if (u.pathname.startsWith("/shorts/")) id = u.pathname.slice(8);
		else if (u.pathname.startsWith("/live/")) id = u.pathname.slice(6);
		else id = u.searchParams.get("v") ?? "";
		id = id.split("/")[0].split("?")[0];
		if (!id) return null;
		return {
			source: "youtube",
			videoId: id,
			url
		};
	}
	if (VIMEO_HOSTS.includes(host)) {
		const parts = u.pathname.split("/").filter(Boolean);
		const id = parts[parts.length - 1] ?? "";
		if (!/^\d+$/.test(id)) return null;
		return {
			source: "vimeo",
			videoId: id,
			url
		};
	}
	if (DRIVE_HOSTS.includes(host)) {
		let id = u.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? u.searchParams.get("id") ?? "";
		id = id.split("?")[0];
		if (!id) return null;
		return {
			source: "drive",
			videoId: id,
			url
		};
	}
	if (/\.(mp4|webm|m4v|mov)(\?|$)/i.test(u.pathname)) return {
		source: "mp4",
		videoId: url,
		url
	};
	return {
		source: "other",
		videoId: url,
		url
	};
}
function resolvePlayableVideo(input) {
	const fromUrl = input.video_url && !isPlaceholderVideoValue(input.video_url) ? parseVideoUrl(input.video_url) : null;
	if (fromUrl) return fromUrl;
	const rawId = String(input.video_id ?? "").trim();
	if (isPlaceholderVideoValue(rawId)) return null;
	const source = input.video_source ?? "other";
	if (source === "youtube" && /^[a-zA-Z0-9_-]{11}$/.test(rawId)) return {
		source: "youtube",
		videoId: rawId,
		url: `https://www.youtube.com/watch?v=${rawId}`
	};
	if (source === "vimeo" && /^\d+$/.test(rawId)) return {
		source: "vimeo",
		videoId: rawId,
		url: `https://vimeo.com/${rawId}`
	};
	if (source === "drive") return {
		source: "drive",
		videoId: rawId,
		url: `https://drive.google.com/file/d/${rawId}/preview`
	};
	if (source === "mp4" || source === "other") return {
		source,
		videoId: rawId,
		url: rawId
	};
	return null;
}
function formatDuration(totalSeconds) {
	if (!totalSeconds || totalSeconds <= 0) return "—";
	const h = Math.floor(totalSeconds / 3600);
	const m = Math.floor(totalSeconds % 3600 / 60);
	const s = Math.floor(totalSeconds % 60);
	if (h) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	return `${m}:${String(s).padStart(2, "0")}`;
}
//#endregion
export { resolvePlayableVideo as i, isPlaceholderVideoValue as n, parseVideoUrl as r, formatDuration as t };
