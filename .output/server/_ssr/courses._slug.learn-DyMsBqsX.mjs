import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Cn as Clipboard, Dn as CirclePlay, Dt as ListChecks, Et as LoaderCircle, Jn as Award, On as CircleCheck, Zn as ArrowLeft, bt as Maximize, c as Volume2, ct as Pause, fn as Download, it as Play, s as VolumeX, tn as FileText, wn as Circle } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { t as downloadBlob } from "./download-DhKjMGgD.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Progress } from "./progress-Crx1Tb8I.mjs";
import { i as resolvePlayableVideo, t as formatDuration } from "./course-video-BXT0dBnl.mjs";
import { _ as saveLessonProgress, f as getLearnData, m as issueCertificate, v as submitQuizAttempt } from "./courses.functions-Cs43ayVV.mjs";
import { t as Route } from "./courses._slug.learn-BHi1lCcN.mjs";
import { t as Slider } from "./slider-lX4rQHvT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses._slug.learn-DyMsBqsX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
var youtubeApiPromise = null;
function loadYouTubeApi() {
	if (typeof window === "undefined") return Promise.resolve();
	if (window.YT?.Player) return Promise.resolve();
	if (!youtubeApiPromise) youtubeApiPromise = new Promise((resolve) => {
		const previousReady = window.onYouTubeIframeAPIReady;
		window.onYouTubeIframeAPIReady = () => {
			previousReady?.();
			resolve();
		};
		if (!document.querySelector("script[src=\"https://www.youtube.com/iframe_api\"]")) {
			const script = document.createElement("script");
			script.src = "https://www.youtube.com/iframe_api";
			script.async = true;
			document.head.appendChild(script);
		}
	});
	return youtubeApiPromise;
}
function BrandedVideoPlayer({ source, videoId, videoUrl, startSeconds = 0, endSeconds, title, youtubePrivacyMode = false, blockYouTubeLinks = true, accentColor = "#2563eb", onProgress, onComplete }) {
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [current, setCurrent] = (0, import_react.useState)(startSeconds);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(source === "mp4" || source === "youtube");
	const [showControls, setShowControls] = (0, import_react.useState)(true);
	const wrapRef = (0, import_react.useRef)(null);
	const videoRef = (0, import_react.useRef)(null);
	const youtubeRef = (0, import_react.useRef)(null);
	const youtubePlayerRef = (0, import_react.useRef)(null);
	const completedRef = (0, import_react.useRef)(false);
	const hideControlsTimer = (0, import_react.useRef)(null);
	const progressTimer = (0, import_react.useRef)(null);
	const onProgressRef = (0, import_react.useRef)(onProgress);
	const onCompleteRef = (0, import_react.useRef)(onComplete);
	const effectiveEnd = endSeconds && endSeconds > startSeconds ? endSeconds : null;
	const customControls = source === "mp4" || source === "youtube";
	const safeAccent = /^#[0-9A-Fa-f]{6}$/.test(accentColor) ? accentColor : "#2563eb";
	(0, import_react.useEffect)(() => {
		onProgressRef.current = onProgress;
		onCompleteRef.current = onComplete;
	}, [onProgress, onComplete]);
	const stopProgressTimer = () => {
		if (progressTimer.current) {
			window.clearInterval(progressTimer.current);
			progressTimer.current = null;
		}
	};
	(0, import_react.useEffect)(() => {
		if (source !== "mp4" || !videoRef.current) return;
		const v = videoRef.current;
		const onLoaded = () => {
			setDuration(v.duration);
			setLoading(false);
			if (startSeconds) v.currentTime = startSeconds;
		};
		const onPlay = () => setPlaying(true);
		const onPause = () => setPlaying(false);
		const onEnded = () => {
			setPlaying(false);
			if (!completedRef.current) {
				completedRef.current = true;
				onCompleteRef.current?.();
			}
		};
		const onTime = () => {
			setCurrent(v.currentTime);
			if (effectiveEnd && v.currentTime >= effectiveEnd) {
				v.pause();
				if (!completedRef.current) {
					completedRef.current = true;
					onCompleteRef.current?.();
				}
			}
			onProgressRef.current?.(v.currentTime, v.duration || 0);
		};
		v.addEventListener("loadedmetadata", onLoaded);
		v.addEventListener("play", onPlay);
		v.addEventListener("pause", onPause);
		v.addEventListener("ended", onEnded);
		v.addEventListener("timeupdate", onTime);
		return () => {
			v.removeEventListener("loadedmetadata", onLoaded);
			v.removeEventListener("play", onPlay);
			v.removeEventListener("pause", onPause);
			v.removeEventListener("ended", onEnded);
			v.removeEventListener("timeupdate", onTime);
		};
	}, [
		source,
		startSeconds,
		effectiveEnd
	]);
	(0, import_react.useEffect)(() => {
		if (source !== "youtube" || !youtubeRef.current) return;
		let cancelled = false;
		completedRef.current = false;
		setLoading(true);
		setPlaying(false);
		setCurrent(startSeconds);
		setDuration(0);
		const startProgressTimer = () => {
			stopProgressTimer();
			progressTimer.current = window.setInterval(() => {
				const player = youtubePlayerRef.current;
				if (!player) return;
				const cur = player.getCurrentTime() || 0;
				const dur = player.getDuration() || 0;
				setCurrent(cur);
				if (dur > 0) setDuration(dur);
				if (effectiveEnd && cur >= effectiveEnd) {
					player.pauseVideo();
					if (!completedRef.current) {
						completedRef.current = true;
						onCompleteRef.current?.();
					}
				}
				onProgressRef.current?.(cur, dur);
			}, 1e3);
		};
		loadYouTubeApi().then(() => {
			if (cancelled || !youtubeRef.current || !window.YT?.Player) return;
			youtubeRef.current.innerHTML = "";
			const player = new window.YT.Player(youtubeRef.current, {
				videoId,
				host: youtubePrivacyMode ? "https://www.youtube-nocookie.com" : "https://www.youtube.com",
				playerVars: {
					start: Math.max(0, Math.floor(startSeconds)),
					...effectiveEnd ? { end: Math.floor(effectiveEnd) } : {},
					autoplay: 0,
					controls: 0,
					disablekb: 1,
					enablejsapi: 1,
					fs: 0,
					iv_load_policy: 3,
					modestbranding: 1,
					playsinline: 1,
					rel: 0,
					origin: window.location.origin,
					widget_referrer: window.location.origin
				},
				events: {
					onReady: () => {
						youtubePlayerRef.current = player;
						setDuration(player.getDuration() || 0);
						setLoading(false);
					},
					onStateChange: (event) => {
						if (event.data === 1) {
							setPlaying(true);
							startProgressTimer();
							scheduleHide();
						} else if (event.data === 2) {
							setPlaying(false);
							stopProgressTimer();
						} else if (event.data === 0) {
							setPlaying(false);
							stopProgressTimer();
							if (!completedRef.current) {
								completedRef.current = true;
								onCompleteRef.current?.();
							}
						}
					}
				}
			});
		});
		return () => {
			cancelled = true;
			stopProgressTimer();
			youtubePlayerRef.current?.destroy();
			youtubePlayerRef.current = null;
		};
	}, [
		source,
		videoId,
		startSeconds,
		effectiveEnd,
		youtubePrivacyMode
	]);
	const togglePlay = () => {
		if (source === "mp4" && videoRef.current) if (playing) videoRef.current.pause();
		else videoRef.current.play().catch(() => {});
		if (source === "youtube" && youtubePlayerRef.current) if (playing) youtubePlayerRef.current.pauseVideo();
		else youtubePlayerRef.current.playVideo();
	};
	const toggleMute = () => {
		if (source === "mp4" && videoRef.current) videoRef.current.muted = !muted;
		if (source === "youtube" && youtubePlayerRef.current) if (muted) youtubePlayerRef.current.unMute();
		else youtubePlayerRef.current.mute();
		setMuted((m) => !m);
	};
	const seek = (value) => {
		if (source === "mp4" && videoRef.current) videoRef.current.currentTime = value;
		if (source === "youtube" && youtubePlayerRef.current) youtubePlayerRef.current.seekTo(value, true);
		setCurrent(value);
	};
	const goFullscreen = () => {
		if (!wrapRef.current) return;
		if (document.fullscreenElement) document.exitFullscreen();
		else wrapRef.current.requestFullscreen?.();
	};
	const scheduleHide = () => {
		setShowControls(true);
		if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current);
		hideControlsTimer.current = window.setTimeout(() => {
			if (playing) setShowControls(false);
		}, 2500);
	};
	const min = startSeconds;
	const max = effectiveEnd ?? duration ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none",
		onMouseMove: customControls ? scheduleHide : void 0,
		onMouseLeave: () => customControls && playing && setShowControls(false),
		onContextMenu: (e) => e.preventDefault(),
		children: [
			source === "youtube" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("absolute inset-0 w-full h-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full", blockYouTubeLinks && "pointer-events-none"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: youtubeRef,
					title: title ?? "Lesson",
					className: "h-full w-full"
				})
			}), blockYouTubeLinks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-[5] pointer-events-auto",
				onClick: (e) => {
					e.preventDefault();
					togglePlay();
				}
			})] }),
			source === "vimeo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				title: title ?? "Lesson",
				src: `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&badge=0&autopause=0#t=${startSeconds}s`,
				className: "absolute inset-0 w-full h-full",
				allow: "autoplay; fullscreen; picture-in-picture",
				allowFullScreen: true
			}),
			source === "drive" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				title: title ?? "Lesson",
				src: `https://drive.google.com/file/d/${videoId}/preview`,
				className: "absolute inset-0 w-full h-full",
				allow: "autoplay",
				allowFullScreen: true
			}),
			source === "mp4" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				src: videoUrl ?? videoId,
				className: "absolute inset-0 w-full h-full",
				playsInline: true,
				preload: "metadata",
				controls: false
			}),
			source === "other" && videoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				title: title ?? "Lesson",
				src: videoUrl,
				className: "absolute inset-0 w-full h-full",
				allow: "autoplay; fullscreen",
				allowFullScreen: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-3 right-3 z-20 pointer-events-none flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }), " Infiniforge Learn"]
			}),
			loading && customControls && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-black/70 z-10 pointer-events-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-white" })
			}),
			customControls && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: togglePlay,
				className: cn("absolute inset-0 z-10 flex items-center justify-center transition-opacity", playing && !showControls ? "opacity-0 pointer-events-none" : "opacity-100"),
				children: !playing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-20 w-20 rounded-full shadow-2xl flex items-center justify-center",
					style: { backgroundColor: safeAccent },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-9 w-9 text-white fill-white ml-1" })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pt-8 pb-3 transition-opacity", showControls ? "opacity-100" : "opacity-0 pointer-events-none"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					value: [current],
					min,
					max: max || min + 1,
					step: 1,
					onValueChange: ([v]) => seek(v),
					className: "mb-2"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-white text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: togglePlay,
							className: "text-white hover:bg-white/20 h-8 w-8",
							children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: toggleMute,
							className: "text-white hover:bg-white/20 h-8 w-8",
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tabular-nums",
							children: [
								formatDuration(current - min),
								" / ",
								formatDuration(max - min)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ml-auto" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: goFullscreen,
							className: "text-white hover:bg-white/20 h-8 w-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, { className: "h-4 w-4" })
						})
					]
				})]
			})] })
		]
	});
}
var SAFFRON = "#FF9933";
var WHITE = "#FFFFFF";
var GREEN = "#138808";
var NAVY = "#000080";
var INK = "#0B1F3A";
var GOLD = "#C9A227";
function drawAshokaChakra(doc, cx, cy, r) {
	doc.setDrawColor(NAVY);
	doc.setLineWidth(.8);
	doc.circle(cx, cy, r, "S");
	doc.circle(cx, cy, r * .15, "S");
	doc.setLineWidth(.4);
	for (let i = 0; i < 24; i++) {
		const a = i * Math.PI / 12;
		doc.line(cx + Math.cos(a) * r * .18, cy + Math.sin(a) * r * .18, cx + Math.cos(a) * r, cy + Math.sin(a) * r);
	}
}
function downloadCertificatePdf(input) {
	const doc = new import_jspdf_node_min.jsPDF({
		orientation: "landscape",
		unit: "mm",
		format: "a4"
	});
	const W = doc.internal.pageSize.getWidth();
	const H = doc.internal.pageSize.getHeight();
	doc.setFillColor(255, 253, 247);
	doc.rect(0, 0, W, H, "F");
	const bandH = 8;
	doc.setFillColor(SAFFRON);
	doc.rect(0, 0, W, bandH, "F");
	doc.setFillColor(WHITE);
	doc.rect(0, bandH, W, bandH, "F");
	doc.setFillColor(GREEN);
	doc.rect(0, bandH * 2, W, bandH, "F");
	drawAshokaChakra(doc, W / 2, 12, bandH * .42);
	const by = H - bandH * 3;
	doc.setFillColor(SAFFRON);
	doc.rect(0, by, W, bandH, "F");
	doc.setFillColor(WHITE);
	doc.rect(0, by + bandH, W, bandH, "F");
	doc.setFillColor(GREEN);
	doc.rect(0, by + bandH * 2, W, bandH, "F");
	drawAshokaChakra(doc, W / 2, by + bandH + bandH / 2, bandH * .42);
	const m = 18;
	const top = 30;
	const bot = by - 6;
	doc.setDrawColor(GOLD);
	doc.setLineWidth(1.4);
	doc.rect(m, top, W - m * 2, bot - top, "S");
	doc.setDrawColor(NAVY);
	doc.setLineWidth(.3);
	doc.rect(20, 32, W - m * 2 - 4, bot - top - 4, "S");
	const corner = (x, y, flipX, flipY) => {
		doc.setDrawColor(SAFFRON);
		doc.setLineWidth(.8);
		doc.line(x, y, x + 18 * flipX, y);
		doc.line(x, y, x, y + 18 * flipY);
		doc.setDrawColor(GREEN);
		doc.line(x + 3 * flipX, y + 3 * flipY, x + 15 * flipX, y + 3 * flipY);
		doc.line(x + 3 * flipX, y + 3 * flipY, x + 3 * flipX, y + 15 * flipY);
	};
	corner(22, 34, 1, 1);
	corner(W - m - 4, 34, -1, 1);
	corner(22, bot - 4, 1, -1);
	corner(W - m - 4, bot - 4, -1, -1);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(SAFFRON);
	doc.setFontSize(11);
	doc.text((input.issuer ?? "INFINIFORGE").toUpperCase() + "  •  CERTIFICATE OF EXCELLENCE", W / 2, 50, { align: "center" });
	doc.setTextColor(NAVY);
	doc.setFont("times", "bold");
	doc.setFontSize(44);
	doc.text("Certificate of Completion", W / 2, 70, { align: "center" });
	doc.setDrawColor(GOLD);
	doc.setLineWidth(.6);
	doc.line(W / 2 - 40, 76, W / 2 + 40, 76);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(13);
	doc.setTextColor(INK);
	doc.text("This certificate is proudly presented to", W / 2, 88, { align: "center" });
	doc.setFont("times", "bolditalic");
	doc.setFontSize(38);
	doc.setTextColor(GREEN);
	doc.text(input.recipientName || "Learner", W / 2, 106, { align: "center" });
	const nameWidth = Math.min(doc.getTextWidth(input.recipientName || "Learner") + 20, W - 80);
	doc.setDrawColor(SAFFRON);
	doc.setLineWidth(.5);
	doc.line((W - nameWidth) / 2, 110, (W + nameWidth) / 2, 110);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(13);
	doc.setTextColor(INK);
	doc.text("for successfully completing the course", W / 2, 122, { align: "center" });
	doc.setFont("times", "bold");
	doc.setFontSize(22);
	doc.setTextColor(NAVY);
	const courseLines = doc.splitTextToSize(input.courseTitle || "Course", W - 80);
	doc.text(courseLines, W / 2, 134, { align: "center" });
	const footerY = bot - 22;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(10);
	doc.setTextColor(SAFFRON);
	doc.text("CERTIFICATE NO.", 32, footerY - 4);
	doc.setFont("courier", "bold");
	doc.setFontSize(12);
	doc.setTextColor(INK);
	doc.text(input.certificateNumber, 32, footerY + 2);
	const dateStr = new Date(input.issuedAt).toLocaleDateString(void 0, {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	doc.setFont("helvetica", "bold");
	doc.setFontSize(10);
	doc.setTextColor(GREEN);
	doc.text("DATE OF ISSUE", W - m - 14, footerY - 4, { align: "right" });
	doc.setFont("times", "bold");
	doc.setFontSize(12);
	doc.setTextColor(INK);
	doc.text(dateStr, W - m - 14, footerY + 2, { align: "right" });
	if (input.signatureImage) try {
		const fmt = input.signatureImage.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
		doc.addImage(input.signatureImage, fmt, W / 2 - 25, footerY - 16, 50, 16);
	} catch {}
	doc.setDrawColor(INK);
	doc.setLineWidth(.4);
	doc.line(W / 2 - 30, footerY, W / 2 + 30, footerY);
	doc.setFont("times", "bold");
	doc.setFontSize(11);
	doc.setTextColor(INK);
	doc.text(input.signatoryName || "Authorised Signatory", W / 2, footerY + 5, { align: "center" });
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.setTextColor(120, 120, 120);
	doc.text(input.signatoryTitle || (input.issuer ?? "Infiniforge"), W / 2, footerY + 10, { align: "center" });
	downloadBlob(doc.output("blob"), `${input.certificateNumber}.pdf`);
}
function LearnPage() {
	const { slug } = Route.useParams();
	const { user, loading, profile } = useAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const getFn = useServerFn(getLearnData);
	const saveProgressFn = useServerFn(saveLessonProgress);
	const submitQuizFn = useServerFn(submitQuizAttempt);
	const certFn = useServerFn(issueCertificate);
	const [currentIdx, setCurrentIdx] = (0, import_react.useState)(0);
	const lastSaveRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		user,
		loading,
		navigate
	]);
	const { data, isLoading, error } = useQuery({
		queryKey: [
			"course-learn",
			slug,
			user?.id
		],
		queryFn: () => getFn({ data: { courseSlug: slug } }),
		enabled: !!user,
		retry: false
	});
	const saveProgress = useMutation({
		mutationFn: saveProgressFn,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["course-learn", slug] })
	});
	const submitQuiz = useMutation({
		mutationFn: submitQuizFn,
		onSuccess: (r) => {
			toast[r.passed ? "success" : "error"](`Score: ${r.percent}% — ${r.passed ? "Passed!" : "Try again"}`);
			qc.invalidateQueries({ queryKey: ["course-learn", slug] });
		}
	});
	const claimCert = useMutation({
		mutationFn: certFn,
		onSuccess: (c) => {
			toast.success(`Certificate ${c.certificate_number} issued!`);
			qc.invalidateQueries({ queryKey: ["course-learn", slug] });
		},
		onError: (e) => toast.error(e.message)
	});
	const lessons = (0, import_react.useMemo)(() => data?.lessons ?? [], [data]);
	const progress = (0, import_react.useMemo)(() => data?.progress ?? [], [data]);
	const quizzes = (0, import_react.useMemo)(() => data?.quizzes ?? [], [data]);
	const attempts = (0, import_react.useMemo)(() => data?.attempts ?? [], [data]);
	const enrollment = data?.enrollment;
	const certificate = data?.certificate;
	const courseSettings = data?.course;
	const allQuizzesPassed = Boolean(data?.allQuizzesPassed);
	const firstPlayableIdx = (0, import_react.useMemo)(() => lessons.findIndex((lesson) => resolvePlayableVideo(lesson)), [lessons]);
	const currentLesson = lessons[currentIdx];
	const currentQuizzes = quizzes.filter((q) => q.lesson_id === currentLesson?.id);
	const endQuiz = quizzes.find((q) => !q.lesson_id);
	(0, import_react.useEffect)(() => {
		if (lessons.length === 0) return;
		if (currentIdx >= lessons.length) {
			setCurrentIdx(Math.max(firstPlayableIdx, 0));
			return;
		}
		if (currentLesson && !resolvePlayableVideo(currentLesson) && firstPlayableIdx >= 0) setCurrentIdx(firstPlayableIdx);
	}, [
		currentIdx,
		currentLesson,
		firstPlayableIdx,
		lessons.length
	]);
	if (loading || user && isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center text-muted-foreground",
		children: "Loading course…"
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex items-center justify-center flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "You need to enroll first."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/courses/$slug",
				params: { slug },
				children: "Back to course"
			})
		})]
	});
	if (!currentLesson || !enrollment) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center text-muted-foreground",
		children: "No lessons available yet."
	});
	const isCompleted = (lid) => progress.some((p) => p.lesson_id === lid && p.completed_at);
	const isQuizPassed = (quizId) => attempts.some((attempt) => attempt.quiz_id === quizId && attempt.passed);
	const bestQuizScore = (quizId) => attempts.filter((attempt) => attempt.quiz_id === quizId).reduce((best, attempt) => Math.max(best, attempt.score_percent), 0);
	const percent = enrollment.progress_percent ?? 0;
	const watchPct = Number(data?.watchPercent ?? 0);
	const quizAvg = Number(data?.quizAvg ?? 0);
	const minWatch = Number(data?.minWatch ?? 95);
	const minQuiz = Number(data?.minQuiz ?? 85);
	const meetsWatch = watchPct >= minWatch;
	const meetsQuiz = quizzes.length === 0 || quizAvg >= minQuiz;
	const canClaimCertificate = meetsWatch && meetsQuiz && allQuizzesPassed;
	const certificateName = `${(profile?.full_name || user?.email || "Learner").trim()}`;
	const handleProgress = (cur) => {
		const now = Date.now();
		if (now - lastSaveRef.current > 1e4) {
			lastSaveRef.current = now;
			saveProgress.mutate({ data: {
				enrollmentId: enrollment.id,
				lessonId: currentLesson.id,
				watchSeconds: cur,
				completed: false
			} });
		}
	};
	const handleComplete = () => {
		saveProgress.mutate({ data: {
			enrollmentId: enrollment.id,
			lessonId: currentLesson.id,
			watchSeconds: currentLesson.end_seconds ?? currentLesson.duration_seconds ?? 0,
			completed: true
		} });
		toast.success("Lesson complete!");
	};
	const handleDownloadCertificate = (cert) => {
		downloadCertificatePdf({
			certificateNumber: cert.certificate_number,
			issuedAt: cert.issued_at,
			recipientName: certificateName,
			courseTitle: courseSettings?.title ?? "Course",
			issuer: "Infiniforge",
			signatureImage: courseSettings?.signature_image ?? null,
			signatoryName: courseSettings?.signatory_name ?? null,
			signatoryTitle: courseSettings?.signatory_title ?? null
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-secondary/30 flex flex-col lg:flex-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "lg:w-80 lg:min-h-screen bg-card border-r border-border flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 border-b border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/courses/$slug",
						params: { slug },
						className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to overview"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold mt-2 line-clamp-2",
						children: data?.course.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [percent, "%"] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: percent,
							className: "h-2"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto p-2",
				children: [
					lessons.map((l, i) => {
						const done = isCompleted(l.id);
						const active = i === currentIdx;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setCurrentIdx(i),
							className: cn("w-full text-left p-3 rounded-lg mb-1 flex items-start gap-3 transition-colors", active ? "bg-primary/10 text-primary" : "hover:bg-secondary"),
							children: [done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-500 shrink-0 mt-0.5" }) : active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-5 w-5 text-primary shrink-0 mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-5 w-5 text-muted-foreground shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] uppercase tracking-wider text-muted-foreground",
									children: ["Lesson ", i + 1]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium line-clamp-2",
									children: l.title
								})]
							})]
						}, l.id);
					}),
					endQuiz && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => document.getElementById("final-quiz")?.scrollIntoView({
							behavior: "smooth",
							block: "start"
						}),
						className: "w-full text-left p-3 rounded-lg mt-4 flex items-start gap-3 bg-primary/5 border border-primary/20 hover:bg-primary/10",
						children: [isQuizPassed(endQuiz.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-500 shrink-0 mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-5 w-5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-primary",
								children: "Final quiz"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium line-clamp-2",
								children: endQuiz.title
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => canClaimCertificate && !certificate && claimCert.mutate({ data: { enrollmentId: enrollment.id } }),
						disabled: !canClaimCertificate || claimCert.isPending,
						className: "w-full text-left p-3 rounded-lg mt-2 flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-5 w-5 text-emerald-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-emerald-700",
								children: "Certificate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: certificate ? "Certificate issued" : canClaimCertificate ? "Claim certificate" : `${watchPct}% watched · ${quizzes.length ? `${quizAvg}% quiz avg` : "no quiz"}`
							}),
							!certificate && !canClaimCertificate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground mt-0.5",
								children: [
									"Need ≥ ",
									minWatch,
									"% watch",
									quizzes.length ? ` & ≥ ${minQuiz}% quiz avg` : ""
								]
							})
						] })]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full",
			children: [
				(() => {
					const playableVideo = resolvePlayableVideo(currentLesson);
					if (!playableVideo) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full aspect-video rounded-xl bg-secondary flex flex-col items-center justify-center text-center p-6 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-10 w-10 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: "Video unavailable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground max-w-md",
								children: "This lesson has no valid video URL. Please contact support or ask the admin to update this lesson."
							})
						]
					});
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandedVideoPlayer, {
						source: playableVideo.source,
						videoId: playableVideo.videoId,
						videoUrl: playableVideo.url,
						startSeconds: currentLesson.start_seconds ?? 0,
						endSeconds: currentLesson.end_seconds,
						title: currentLesson.title,
						youtubePrivacyMode: courseSettings?.youtube_privacy_mode ?? false,
						blockYouTubeLinks: courseSettings?.block_youtube_links ?? true,
						accentColor: courseSettings?.player_accent_color ?? "#2563eb",
						onProgress: handleProgress,
						onComplete: handleComplete
					}, currentLesson.id);
				})(),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-start justify-between flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs uppercase tracking-wider text-muted-foreground",
							children: [
								"Lesson ",
								currentIdx + 1,
								" of ",
								lessons.length
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold mt-1",
							children: currentLesson.title
						}),
						currentLesson.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground mt-2",
							children: currentLesson.description
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							disabled: currentIdx === 0,
							onClick: () => setCurrentIdx((i) => Math.max(0, i - 1)),
							children: "Previous"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "bg-gradient-brand text-white",
							disabled: saveProgress.isPending,
							onClick: () => {
								handleComplete();
								setCurrentIdx((i) => Math.min(lessons.length - 1, i + 1));
							},
							children: currentIdx >= lessons.length - 1 ? "Mark done" : "Mark done · Next"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "notes",
					className: "mt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "notes",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 mr-1.5" }), " Notes"]
						}), currentQuizzes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "quiz",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-4 w-4 mr-1.5" }), " Quiz"]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "notes",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-2xl border border-border bg-card p-5 whitespace-pre-wrap text-sm",
								children: currentLesson.notes || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "No notes for this lesson."
								})
							})
						}),
						currentQuizzes.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "quiz",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizRunner, {
								quiz: q,
								enrollmentId: enrollment.id,
								onSubmit: (answers) => submitQuiz.mutate({ data: {
									quizId: q.id,
									enrollmentId: enrollment.id,
									answers
								} })
							})
						}, q.id))
					]
				}),
				endQuiz && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "final-quiz",
					className: "mt-6 scroll-mt-6 rounded-2xl border border-primary/20 bg-card p-4 sm:p-5 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 flex-wrap mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs uppercase tracking-wider text-primary font-semibold flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-4 w-4" }), " Final assessment"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold mt-1",
								children: endQuiz.title
							}),
							endQuiz.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: endQuiz.description
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: isQuizPassed(endQuiz.id) ? "default" : "secondary",
							children: isQuizPassed(endQuiz.id) ? "Passed" : `Best ${bestQuizScore(endQuiz.id)}%`
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizRunner, {
						quiz: endQuiz,
						enrollmentId: enrollment.id,
						onSubmit: (answers) => submitQuiz.mutate({ data: {
							quizId: endQuiz.id,
							enrollmentId: enrollment.id,
							answers
						} })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-amber-500" }), " Certificate"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold mt-1",
								children: certificate ? "Certificate issued" : canClaimCertificate ? "Ready to claim" : "Complete course requirements"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: certificate ? `Certificate no. ${certificate.certificate_number}` : `Watch time ${watchPct}% / ${minWatch}%${quizzes.length ? ` · Quiz avg ${quizAvg}% / ${minQuiz}%` : ""}`
							}),
							!certificate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: meetsWatch ? "default" : "secondary",
									className: meetsWatch ? "bg-emerald-500 text-white" : "",
									children: [
										meetsWatch ? "✓" : "○",
										" Watch ≥ ",
										minWatch,
										"%"
									]
								}), quizzes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: meetsQuiz ? "default" : "secondary",
									className: meetsQuiz ? "bg-emerald-500 text-white" : "",
									children: [
										meetsQuiz ? "✓" : "○",
										" Quiz avg ≥ ",
										minQuiz,
										"%"
									]
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 flex-wrap",
							children: certificate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => {
										navigator.clipboard?.writeText(certificate.certificate_number);
										toast.success("Certificate number copied");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clipboard, { className: "h-4 w-4 mr-1.5" }), " Copy ID"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "bg-gradient-brand text-white",
									onClick: () => handleDownloadCertificate(certificate),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-1.5" }), " Download"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/certificates/verify",
										children: "Verify"
									})
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "bg-gradient-brand text-white",
								disabled: !canClaimCertificate || claimCert.isPending,
								onClick: () => claimCert.mutate({ data: { enrollmentId: enrollment.id } }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 mr-1.5" }), " Claim certificate"]
							})
						})]
					})
				}),
				profile?.full_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground mt-8 text-center",
					children: ["Learning as ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: profile.full_name
					})]
				})
			]
		})]
	});
}
function QuizRunner({ quiz, onSubmit }) {
	const [answers, setAnswers] = (0, import_react.useState)(Array(quiz.questions.length).fill(-1));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-semibold",
				children: quiz.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Pass with ≥ ",
					quiz.pass_percent,
					"%"
				]
			})] }),
			quiz.questions.sort((a, b) => a.position - b.position).map((q, qi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-medium text-sm",
					children: [
						qi + 1,
						". ",
						q.question
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1.5",
					children: q.options.map((opt, oi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: cn("flex items-center gap-2 p-2.5 rounded-md border cursor-pointer text-sm transition-colors", answers[qi] === oi ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							name: `q${qi}`,
							checked: answers[qi] === oi,
							onChange: () => {
								const next = [...answers];
								next[qi] = oi;
								setAnswers(next);
							}
						}), opt]
					}, oi))
				})]
			}, q.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "bg-gradient-brand text-white",
				onClick: () => onSubmit(answers),
				disabled: answers.some((a) => a < 0),
				children: "Submit quiz"
			})
		]
	});
}
//#endregion
export { LearnPage as component };
