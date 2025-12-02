"use client";

import { memo, useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId?: string;
  videoSrc?: string;
  title: string;
  category: string;
}

const getHlsUrl = (uid: string) =>
  `https://videodelivery.net/${uid}/manifest/video.m3u8`;
const getMp4Url = (uid: string) =>
  `https://videodelivery.net/${uid}/downloads/default.mp4`;

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const VideoPlayerModal = memo(
  ({
    isOpen,
    onClose,
    streamId,
    videoSrc,
    title,
    category,
  }: VideoPlayerModalProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const progressRef = useRef<HTMLDivElement | null>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [buffered, setBuffered] = useState(0);

    // Pause all background videos when modal opens
    useEffect(() => {
      if (isOpen) {
        const allVideos = document.querySelectorAll("video");
        allVideos.forEach((video) => {
          if (video !== videoRef.current) {
            video.pause();
          }
        });
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    // Initialize video source
    useEffect(() => {
      if (!isOpen) return;

      const video = videoRef.current;
      if (!video) return;

      setIsLoading(true);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);

      // Cleanup previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (streamId) {
        const hlsUrl = getHlsUrl(streamId);
        const mp4Url = getMp4Url(streamId);

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = hlsUrl;
        } else if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
          });
          hls.loadSource(hlsUrl);
          hls.attachMedia(video);
          hlsRef.current = hls;
        } else {
          video.src = mp4Url;
        }
      } else if (videoSrc) {
        video.src = videoSrc;
      }

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    }, [isOpen, streamId, videoSrc]);

    // Video event handlers
    useEffect(() => {
      const video = videoRef.current;
      if (!video || !isOpen) return;

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        if (video.buffered.length > 0) {
          setBuffered(video.buffered.end(video.buffered.length - 1));
        }
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        setIsLoading(false);
        // Auto-play when loaded
        video.play().catch(() => {});
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleWaiting = () => setIsLoading(true);
      const handleCanPlay = () => setIsLoading(false);

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("waiting", handleWaiting);
      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("waiting", handleWaiting);
        video.removeEventListener("canplay", handleCanPlay);
      };
    }, [isOpen]);

    // Keyboard shortcuts
    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        const video = videoRef.current;
        if (!video) return;

        switch (e.key) {
          case " ":
          case "k":
            e.preventDefault();
            togglePlay();
            break;
          case "Escape":
            onClose();
            break;
          case "f":
            toggleFullscreen();
            break;
          case "m":
            toggleMute();
            break;
          case "ArrowLeft":
            e.preventDefault();
            video.currentTime = Math.max(0, video.currentTime - 10);
            break;
          case "ArrowRight":
            e.preventDefault();
            video.currentTime = Math.min(duration, video.currentTime + 10);
            break;
          case "ArrowUp":
            e.preventDefault();
            setVolume((v) => Math.min(1, v + 0.1));
            break;
          case "ArrowDown":
            e.preventDefault();
            setVolume((v) => Math.max(0, v - 0.1));
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, duration, onClose]);

    // Update video volume
    useEffect(() => {
      const video = videoRef.current;
      if (video) {
        video.volume = volume;
        video.muted = isMuted;
      }
    }, [volume, isMuted]);

    // Auto-hide controls
    const resetControlsTimeout = useCallback(() => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    }, [isPlaying]);

    useEffect(() => {
      if (isOpen) {
        resetControlsTimeout();
      }
      return () => {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    }, [isOpen, resetControlsTimeout]);

    // Fullscreen change detection
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () =>
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const togglePlay = () => {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const toggleMute = () => {
      setIsMuted((m) => !m);
    };

    const toggleFullscreen = async () => {
      const container = document.getElementById("video-modal-container");
      if (!container) return;

      if (!document.fullscreenElement) {
        await container.requestFullscreen().catch(() => {});
      } else {
        await document.exitFullscreen().catch(() => {});
      }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current;
      const progress = progressRef.current;
      if (!video || !progress) return;

      const rect = progress.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * duration;
    };

    const skip = (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={onClose}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

            {/* Modal Container */}
            <motion.div
              id="video-modal-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              onMouseMove={resetControlsTimeout}
              className={cn(
                "relative w-full max-w-6xl mx-4 aspect-video rounded-2xl overflow-hidden",
                "bg-black border border-white/10 shadow-2xl shadow-black/50",
                isFullscreen && "max-w-none mx-0 rounded-none h-screen"
              )}
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full object-contain bg-black"
                playsInline
                onClick={togglePlay}
              />

              {/* BE Logo Watermark */}
              <div className="absolute top-6 left-6 pointer-events-none z-10">
                <div className="flex items-center gap-2 opacity-60">
                  <div className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center">
                    <span className="text-black font-bold text-sm">BE</span>
                  </div>
                  <span className="text-white/80 text-sm font-medium tracking-wide">
                    CREATIVES CO.
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: showControls ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200 group"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
              </motion.button>

              {/* Loading Spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}

              {/* Center Play Button (when paused) */}
              <AnimatePresence>
                {!isPlaying && !isLoading && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300">
                      <Play className="w-10 h-10 text-white ml-1" fill="white" />
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Video Info & Controls Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showControls ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-6 px-6 z-10"
              >
                {/* Title & Category */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white/80 mb-2">
                    {category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {title}
                  </h2>
                </div>

                {/* Progress Bar */}
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group mb-4"
                >
                  {/* Buffered */}
                  <div
                    className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
                    style={{ width: `${bufferedPercent}%` }}
                  />
                  {/* Progress */}
                  <div
                    className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                  />
                  {/* Scrubber */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ left: `calc(${progressPercent}% - 8px)` }}
                  />
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Skip Back */}
                    <button
                      onClick={() => skip(-10)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      title="Rewind 10s"
                    >
                      <SkipBack className="w-5 h-5 text-white" />
                    </button>

                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-0.5" />
                      )}
                    </button>

                    {/* Skip Forward */}
                    <button
                      onClick={() => skip(10)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      title="Forward 10s"
                    >
                      <SkipForward className="w-5 h-5 text-white" />
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-2 group/volume">
                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-white" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          setVolume(parseFloat(e.target.value));
                          setIsMuted(false);
                        }}
                        className="w-0 group-hover/volume:w-20 transition-all duration-200 accent-white cursor-pointer"
                      />
                    </div>

                    {/* Time */}
                    <span className="text-sm text-white/80 font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-2">
                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? (
                        <Minimize className="w-5 h-5 text-white" />
                      ) : (
                        <Maximize className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

VideoPlayerModal.displayName = "VideoPlayerModal";

export default VideoPlayerModal;

