import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/course-video";

type Source = "youtube" | "vimeo" | "drive" | "mp4" | "other";

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement, options: Record<string, unknown>) => YouTubePlayer;
      PlayerState?: { ENDED: number; PLAYING: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        resolve();
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }
  return youtubeApiPromise;
}

export type BrandedPlayerProps = {
  source: Source;
  videoId: string;
  videoUrl?: string | null;
  startSeconds?: number;
  endSeconds?: number | null;
  title?: string;
  youtubePrivacyMode?: boolean;
  blockYouTubeLinks?: boolean;
  accentColor?: string;
  onProgress?: (currentSeconds: number, duration: number) => void;
  onComplete?: () => void;
};

export function BrandedVideoPlayer({
  source, videoId, videoUrl, startSeconds = 0, endSeconds, title,
  youtubePrivacyMode = false, blockYouTubeLinks = true, accentColor = "#2563eb",
  onProgress, onComplete,
}: BrandedPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(startSeconds);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(source === "mp4" || source === "youtube");
  const [showControls, setShowControls] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const completedRef = useRef(false);
  const hideControlsTimer = useRef<number | null>(null);
  const progressTimer = useRef<number | null>(null);
  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);

  const effectiveEnd = endSeconds && endSeconds > startSeconds ? endSeconds : null;
  const customControls = source === "mp4" || source === "youtube";
  const safeAccent = /^#[0-9A-Fa-f]{6}$/.test(accentColor) ? accentColor : "#2563eb";

  useEffect(() => {
    onProgressRef.current = onProgress;
    onCompleteRef.current = onComplete;
  }, [onProgress, onComplete]);

  const stopProgressTimer = () => {
    if (progressTimer.current) {
      window.clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  };

  // --- MP4/HTML5 setup ---
  useEffect(() => {
    if (source !== "mp4" || !videoRef.current) return;
    const v = videoRef.current;
    const onLoaded = () => { setDuration(v.duration); setLoading(false); if (startSeconds) v.currentTime = startSeconds; };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => { setPlaying(false); if (!completedRef.current) { completedRef.current = true; onCompleteRef.current?.(); } };
    const onTime = () => {
      setCurrent(v.currentTime);
      if (effectiveEnd && v.currentTime >= effectiveEnd) {
        v.pause();
        if (!completedRef.current) { completedRef.current = true; onCompleteRef.current?.(); }
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
  }, [source, startSeconds, effectiveEnd]);

  // --- YouTube API setup ---
  useEffect(() => {
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
      }, 1000);
    };

    loadYouTubeApi().then(() => {
      if (cancelled || !youtubeRef.current || !window.YT?.Player) return;
      youtubeRef.current.innerHTML = "";
      const player = new window.YT.Player(youtubeRef.current, {
        videoId,
        host: youtubePrivacyMode ? "https://www.youtube-nocookie.com" : "https://www.youtube.com",
        playerVars: {
          start: Math.max(0, Math.floor(startSeconds)),
          ...(effectiveEnd ? { end: Math.floor(effectiveEnd) } : {}),
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
          widget_referrer: window.location.origin,
        },
        events: {
          onReady: () => {
            youtubePlayerRef.current = player;
            const dur = player.getDuration() || 0;
            setDuration(dur);
            setLoading(false);
          },
          onStateChange: (event: { data: number }) => {
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
          },
        },
      });
    });

    return () => {
      cancelled = true;
      stopProgressTimer();
      youtubePlayerRef.current?.destroy();
      youtubePlayerRef.current = null;
    };
  }, [source, videoId, startSeconds, effectiveEnd, youtubePrivacyMode]);

  const togglePlay = () => {
    if (source === "mp4" && videoRef.current) {
      if (playing) videoRef.current.pause(); else videoRef.current.play().catch(() => {});
    }
    if (source === "youtube" && youtubePlayerRef.current) {
      if (playing) youtubePlayerRef.current.pauseVideo(); else youtubePlayerRef.current.playVideo();
    }
  };
  const toggleMute = () => {
    if (source === "mp4" && videoRef.current) videoRef.current.muted = !muted;
    if (source === "youtube" && youtubePlayerRef.current) {
      if (muted) youtubePlayerRef.current.unMute(); else youtubePlayerRef.current.mute();
    }
    setMuted((m) => !m);
  };
  const seek = (value: number) => {
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
    hideControlsTimer.current = window.setTimeout(() => { if (playing) setShowControls(false); }, 2500);
  };

  const min = startSeconds;
  const max = effectiveEnd ?? duration ?? 0;

  return (
    <div
      ref={wrapRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none"
      onMouseMove={customControls ? scheduleHide : undefined}
      onMouseLeave={() => customControls && playing && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Media layer */}
      {source === "youtube" && (
        <>
          <div className={cn("absolute inset-0 w-full h-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full", blockYouTubeLinks && "pointer-events-none")}>
            <div ref={youtubeRef} title={title ?? "Lesson"} className="h-full w-full" />
          </div>
          {blockYouTubeLinks && <div className="absolute inset-0 z-[5] pointer-events-auto" onClick={(e) => { e.preventDefault(); togglePlay(); }} />}
        </>
      )}
      {source === "vimeo" && (
        <iframe
          title={title ?? "Lesson"}
          src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&badge=0&autopause=0#t=${startSeconds}s`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )}
      {source === "drive" && (
        <iframe
          title={title ?? "Lesson"}
          src={`https://drive.google.com/file/d/${videoId}/preview`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay"
          allowFullScreen
        />
      )}
      {source === "mp4" && (
        <video ref={videoRef} src={videoUrl ?? videoId} className="absolute inset-0 w-full h-full" playsInline preload="metadata" controls={false} />
      )}
      {source === "other" && videoUrl && (
        <iframe title={title ?? "Lesson"} src={videoUrl} className="absolute inset-0 w-full h-full" allow="autoplay; fullscreen" allowFullScreen />
      )}

      {/* Brand watermark */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/90">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Infiniforge Learn
      </div>

      {/* Loading (MP4 only) */}
      {loading && customControls && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10 pointer-events-none">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      {/* Custom controls for owned MP4 files and YouTube API embeds */}
      {customControls && (
        <>
          <button
            type="button"
            onClick={togglePlay}
            className={cn(
              "absolute inset-0 z-10 flex items-center justify-center transition-opacity",
              playing && !showControls ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            {!playing && (
              <span className="h-20 w-20 rounded-full shadow-2xl flex items-center justify-center" style={{ backgroundColor: safeAccent }}>
                <Play className="h-9 w-9 text-white fill-white ml-1" />
              </span>
            )}
          </button>

          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pt-8 pb-3 transition-opacity",
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <Slider
              value={[current]}
              min={min}
              max={max || min + 1}
              step={1}
              onValueChange={([v]) => seek(v)}
              className="mb-2"
            />
            <div className="flex items-center gap-3 text-white text-xs">
              <Button size="icon" variant="ghost" onClick={togglePlay} className="text-white hover:bg-white/20 h-8 w-8">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="ghost" onClick={toggleMute} className="text-white hover:bg-white/20 h-8 w-8">
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="tabular-nums">
                {formatDuration(current - min)} / {formatDuration(max - min)}
              </div>
              <div className="ml-auto" />
              <Button size="icon" variant="ghost" onClick={goFullscreen} className="text-white hover:bg-white/20 h-8 w-8">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
