"use client";

/*
  The home hero's visual layer.

  Renders the existing photo as a base/fallback, and — when the browser supports
  WebGL and the visitor hasn't asked for reduced motion — overlays a lazily
  loaded 3D chirashi scene. Keeping this in a client component lets the page
  itself stay a static server component.
*/

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { Photo } from "@/components/photo";

const ChirashiScene = dynamic(() => import("./chirashi-scene"), {
  ssr: false,
  loading: () => null,
});

type Mode = "scene" | "photo";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

/*
  The choice never changes once the page is open, so it is exposed through a
  tiny external store: the expensive feature detection runs in `subscribe`
  (after hydration) rather than during render.
*/
let currentMode: Mode = "photo";
let initialised = false;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!initialised) {
    initialised = true;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    currentMode = supportsWebGL() && !reduced ? "scene" : "photo";
    listeners.forEach((notify) => notify());
  }
  return () => {
    listeners.delete(onChange);
  };
}

const getMode = () => currentMode;
const getServerMode = (): Mode => "photo";

export function HeroVisual({ src, alt }: { src: string; alt: string }) {
  const mode = useSyncExternalStore(subscribe, getMode, getServerMode);

  return (
    <>
      <Photo
        src={src}
        alt={alt}
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full"
        imageClassName={mode === "scene" ? "opacity-30" : "opacity-55"}
      />

      {mode === "scene" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[54%] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[52%]"
        >
          <ChirashiScene />
        </div>
      ) : null}
    </>
  );
}
