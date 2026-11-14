"use client";

/*
  The home hero's visual layer.

  Two layers share one film: a blurred, dimmed backdrop that fills the frame,
  and a sharp portrait panel that sits on top. On wide screens the panel is
  feathered into the backdrop so the two melt together (no hard edge); on
  phones the panel fills the screen, which suits a vertical clip.

  - Visitors who prefer reduced motion — or whose browser can't play the video —
    simply see the photo.
  - Playback pauses while the hero is scrolled out of view.
  - Keeping this in a client component lets the page stay a static server
    component.
*/

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/photo";

/*
  React writes `muted` as an attribute only, and some browsers ignore that when
  they decide whether a clip may start on its own — which is how a video ends
  up paused with a play button over it. Setting the *property* the moment the
  element is attached (before the browser weighs autoplay) fixes that. We also
  make sure the native controls, picture-in-picture and remote-play buttons
  never appear.
*/
function primeVideo(element: HTMLVideoElement | null) {
  if (!element) return;
  element.muted = true;
  element.controls = false;
  element.disablePictureInPicture = true;
  element.disableRemotePlayback = true;
}

/*
  "Reduce motion" never changes while the page is open, so it is exposed through
  a tiny external store: the check runs in `subscribe` (after hydration) rather
  than during render, which keeps React happy and avoids a hydration mismatch.
*/
let prefersReduced = false;
let initialised = false;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!initialised) {
    initialised = true;
    prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    listeners.forEach((notify) => notify());
  }
  return () => {
    listeners.delete(onChange);
  };
}

const getReduced = () => prefersReduced;
const getServerReduced = () => false;

export function HeroVisual({
  src,
  alt,
  video,
}: {
  src: string;
  alt: string;
  video?: string;
}) {
  const reduced = useSyncExternalStore(subscribe, getReduced, getServerReduced);
  const backdropRef = useRef<HTMLVideoElement>(null);
  const panelRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  // Set when the browser refuses to start the film on its own. The video is
  // then hidden (so no play button shows) and we retry on the visitor's first
  // tap, click or key press.
  const [blocked, setBlocked] = useState(false);
  const showVideo = Boolean(video) && !reduced && !failed;
  const filmVisible = showVideo && !blocked;

  const attachBackdrop = useCallback((element: HTMLVideoElement | null) => {
    backdropRef.current = element;
    primeVideo(element);
  }, []);
  const attachPanel = useCallback((element: HTMLVideoElement | null) => {
    panelRef.current = element;
    primeVideo(element);
  }, []);

  useEffect(() => {
    if (!showVideo) return;
    const elements = [backdropRef.current, panelRef.current].filter(
      (element): element is HTMLVideoElement => element !== null,
    );
    if (elements.length === 0) return;

    let cancelled = false;
    elements.forEach(primeVideo);

    const start = () => {
      elements.forEach(primeVideo);
      const attempts = elements.map((element) => element.play());
      void Promise.allSettled(attempts).then((results) => {
        if (cancelled) return;
        // If every clip refused to start, fall back to the photo until the
        // visitor interacts — never leave a paused film with a play button.
        setBlocked(!results.some((result) => result.status === "fulfilled"));
      });
    };

    start();

    const onCanPlay = () => {
      elements.forEach((element) => {
        void element.play().catch(() => {});
      });
    };
    elements.forEach((element) => element.addEventListener("canplay", onCanPlay));

    const onFirstGesture = () => start();
    document.addEventListener("pointerdown", onFirstGesture, { once: true });
    document.addEventListener("touchstart", onFirstGesture, { once: true });
    document.addEventListener("keydown", onFirstGesture, { once: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        if (visible) {
          start();
        } else {
          elements.forEach((element) => element.pause());
        }
      },
      { threshold: 0 },
    );
    observer.observe(elements[0]);

    return () => {
      cancelled = true;
      observer.disconnect();
      elements.forEach((element) =>
        element.removeEventListener("canplay", onCanPlay),
      );
      document.removeEventListener("pointerdown", onFirstGesture);
      document.removeEventListener("touchstart", onFirstGesture);
      document.removeEventListener("keydown", onFirstGesture);
    };
  }, [showVideo]);

  return (
    <>
      <Photo
        src={src}
        alt={alt}
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 h-full w-full"
        imageClassName={filmVisible ? "opacity-0" : "opacity-60"}
      />

      {showVideo ? (
        <>
          {/* The same film, softened and dimmed, fills the frame so the sharp
              panel melts into its own colours. */}
          <video
            ref={attachBackdrop}
            aria-hidden
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            preload="metadata"
            poster={src}
            onError={() => setFailed(true)}
            className={cn(
              "absolute inset-0 -z-20 h-full w-full scale-110 object-cover blur-3xl brightness-[0.42] saturate-[0.8] transition-opacity duration-700",
              filmVisible ? "opacity-100" : "opacity-0",
            )}
          >
            <source src={video} type="video/mp4" />
          </video>

          {/* The sharp portrait panel. Its top lines up with the eyebrow
              ("Japanese-owned & operated") and its foot with the last line of
              copy, so the film sits level with the words beside it. */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 -z-10 overflow-hidden transition-opacity duration-700 lg:inset-y-24 lg:left-auto lg:right-[2.5%] lg:w-[38%] lg:rounded-[2.5rem]",
              filmVisible ? "opacity-100" : "opacity-0",
            )}
          >
            <video
              ref={attachPanel}
              aria-hidden
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              preload="metadata"
              poster={src}
              className="hero-panel-mask h-full w-full object-cover"
            >
              <source src={video} type="video/mp4" />
            </video>
          </div>
        </>
      ) : null}
    </>
  );
}
