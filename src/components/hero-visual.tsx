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

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Photo } from "@/components/photo";

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
  const showVideo = Boolean(video) && !reduced && !failed;

  useEffect(() => {
    if (!showVideo) return;
    const elements = [backdropRef.current, panelRef.current].filter(
      (element): element is HTMLVideoElement => element !== null,
    );
    if (elements.length === 0) return;

    // Setting the property (not just the attribute) is what lets autoplay run.
    elements.forEach((element) => {
      element.muted = true;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        elements.forEach((element) => {
          if (visible) {
            void element.play().catch(() => {});
          } else {
            element.pause();
          }
        });
      },
      { threshold: 0 },
    );
    observer.observe(elements[0]);
    return () => observer.disconnect();
  }, [showVideo]);

  return (
    <>
      <Photo
        src={src}
        alt={alt}
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 h-full w-full"
        imageClassName={showVideo ? "opacity-0" : "opacity-60"}
      />

      {showVideo ? (
        <>
          {/* The same film, softened and dimmed, fills the frame so the sharp
              panel melts into its own colours. */}
          <video
            ref={backdropRef}
            aria-hidden
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={src}
            onError={() => setFailed(true)}
            className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover blur-3xl brightness-[0.42] saturate-[0.8]"
          >
            <source src={video} type="video/mp4" />
          </video>

          {/* The sharp portrait panel. */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden lg:inset-y-[7%] lg:left-auto lg:right-[2.5%] lg:w-[38%] lg:rounded-[2.5rem]">
            <video
              ref={panelRef}
              aria-hidden
              autoPlay
              muted
              loop
              playsInline
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
