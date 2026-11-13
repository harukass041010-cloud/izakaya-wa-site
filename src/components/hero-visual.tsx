"use client";

/*
  The home hero's visual layer: a muted, looping background video with the
  restaurant photo as its poster and fallback.

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const showVideo = Boolean(video) && !reduced && !failed;

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    // Setting the property (not just the attribute) is what lets autoplay run.
    element.muted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void element.play().catch(() => {});
        } else {
          element.pause();
        }
      },
      { threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [showVideo]);

  return (
    <>
      <Photo
        src={src}
        alt={alt}
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full"
        imageClassName="opacity-55"
      />

      {showVideo ? (
        <video
          ref={videoRef}
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={src}
          onError={() => setFailed(true)}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : null}
    </>
  );
}
