"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import ButtonPrimary from "../ButtonPrimary";
import { EASE, playTracks, staggerIn, type Bezier, type Kf, type Tracks } from "@/lib/figmaMotion";
import { PARTICLES } from "./heroParticles";
import { fitWidth } from "@/lib/fitWidth";
import s from "./Hero.module.css";

/* ------------------------------------------------------------------ *
 * All motion below is read from Figma (Home frame, 12s looping timeline,
 * node.manualKeyframeTracks / animationStyles). Easing = curve used to arrive at the keyframe.
 * ------------------------------------------------------------------ */
const TL = 12; // Home timeline length (s)
const OUT: Bezier = [0, 0, 0.58, 1]; // EASE_OUT
const IO: Bezier = [0.42, 0, 0.58, 1]; // EASE_IN_AND_OUT
const E: Bezier = [0.5, 0, 0.5, 1]; // custom cubic used on first keys
const B1: Bezier = [0.16, 1, 0.3, 1]; // ripple expand
const B2: Bezier = [0.22, 1, 0.36, 1]; // entrance settle
const P: Bezier = [0.65, 0, 0.35, 1]; // scroll thumb

const K = (t: number, v: number | { x: number; y: number }, e?: Bezier): Kf => ({ t, v, e });
const S = (n: number) => ({ x: n, y: n });

/** `vals` = samples of one period at `step` seconds, repeated across the 12s timeline. */
const rep = (vals: number[], step: number): Kf[] => {
  const out: Kf[] = [];
  for (let i = 0; i <= TL / step; i++) out.push(K(+(i * step).toFixed(3), vals[i % vals.length]));
  return out;
};

/** "t=v t=v …" -> keyframes */
const parse = (str: string, scale = false): Kf[] =>
  str.trim().split(/\s+/).map((p) => {
    const [t, v] = p.split("=");
    return K(+t, scale ? S(+v) : +v);
  });

/* ---------- Noise chips (691:49042) ---------- */
type Chip = {
  x: number; y: number; w: number; h: number; m: string; bg: string; icon: string;
  title?: string; sub?: string; badge?: { t: string; left: number; start: number };
  ty: number[]; rt: number[];
};

const chips: Chip[] = [
  { x: 790, y: 91.43, w: 148.222, h: 58.57, m: "0.99999,-0.003854,0.003854,0.99999,0,0", bg: "#149eca", icon: "react", title: "React", sub: "UI components",
    ty: [0, 3.03, 5.25, 6.06, 5.25, 3.03, 0, -3.03, -5.25, -6.06, -5.25, -3.03], rt: [1.35, 1.6, 1.42, 0.86, 0.07, -0.73, -1.35, -1.6, -1.42, -0.86, -0.07, 0.73] },
  { x: 1010, y: 137.84, w: 60.124, h: 60.124, m: "0.9993,-0.03732,0.03732,0.9993,0,0", bg: "#8b5cf6", icon: "sparkles",
    ty: [6.5, 8.79, 8.72, 6.32, 2.22, -2.47, -6.5, -8.79, -8.72, -6.32, -2.22, 2.47], rt: [1.56, 1.17, 0.46, -0.36, -1.09, -1.53, -1.56, -1.17, -0.46, 0.36, 1.09, 1.53] },
  { x: 1130, y: 259.24, w: 60.695, h: 60.695, m: "0.99887,-0.0476,0.0476,0.99887,0,0", bg: "#3c873a", icon: "node",
    ty: [7.5, 6.39, 3.56, -0.22, -3.94, -6.61, -7.5, -6.39, -3.56, 0.22, 3.94, 6.61], rt: [0.82, 0.03, -0.78, -1.37, -1.6, -1.4, -0.82, -0.03, 0.78, 1.37, 1.6, 1.4] },
  { x: 878.96, y: 372, w: 208.008, h: 61.707, m: "0.99984,0.017955,-0.017955,0.99984,0,0", bg: "#7c3aed", icon: "bot", title: "AI Agent", sub: "Automating workflows",
    ty: [6.59, 2.11, -2.94, -7.2, -9.53, -9.31, -6.59, -2.11, 2.94, 7.2, 9.53, 9.31], rt: [-0.41, -1.13, -1.54, -1.55, -1.13, -0.42, 0.41, 1.13, 1.54, 1.55, 1.13, 0.42] },
  { x: 1150, y: 556.2, w: 132.627, h: 61.774, m: "0.99958,-0.029,0.029,0.99958,0,0", bg: "#262626", icon: "nextjs", title: "Next.js", sub: "Web app",
    ty: [-0.53, -4.99, -8.12, -9.07, -7.59, -4.07, 0.53, 4.99, 8.12, 9.07, 7.59, 4.07], rt: [-1.39, -1.6, -1.38, -0.78, 0.02, 0.81, 1.39, 1.6, 1.38, 0.78, -0.02, -0.81] },
  { x: 960, y: 598.75, w: 59.238, h: 59.238, m: "0.99977,-0.021577,0.021577,0.99977,0,0", bg: "#2496ed", icon: "docker",
    ty: [-4.81, -6.25, -6.01, -4.16, -1.19, 2.09, 4.81, 6.25, 6.01, 4.16, 1.19, -2.09], rt: [-1.53, -1.1, -0.37, 0.45, 1.16, 1.56, 1.53, 1.1, 0.37, -0.45, -1.16, -1.56] },
  { x: 800, y: 746.11, w: 212.508, h: 59.887, m: "0.99996,-0.00891,0.00891,0.99996,0,0", bg: "#ff2d20", icon: "laravel", title: "Laravel API",
    ty: [-9.65, -7.94, -4.09, 0.85, 5.56, 8.78, 9.65, 7.94, 4.09, -0.85, -5.56, -8.78], rt: [-0.74, 0.07, 0.85, 1.42, 1.6, 1.35, 0.74, -0.07, -0.85, -1.42, -1.6, -1.35] },
  { x: 1120, y: 729.25, w: 58.741, h: 58.741, m: "0.99992,-0.012861,0.012861,0.99992,0,0", bg: "#336791", icon: "postgres",
    ty: [-4.13, -1.04, 2.33, 5.07, 6.46, 6.11, 4.13, 1.04, -2.33, -5.07, -6.46, -6.11], rt: [0.5, 1.19, 1.57, 1.52, 1.07, 0.33, -0.5, -1.19, -1.57, -1.52, -1.07, -0.33] },
  { x: 860, y: 219.43, w: 159.222, h: 58.612, m: "0.99999,-0.003854,0.003854,0.99999,0,0", bg: "#3776ab", icon: "python", title: "Python", sub: "ML pipeline",
    ty: [5.22, 2.19, -1.43, -4.66, -6.65, -6.85, -5.22, -2.19, 1.43, 4.66, 6.65, 6.85], rt: [-0.24, -0.95, -1.4, -1.48, -1.16, -0.54, 0.24, 0.95, 1.4, 1.48, 1.16, 0.54] },
  { x: 1000, y: 469.43, w: 167.222, h: 58.643, m: "0.99999,-0.003854,0.003854,0.99999,0,0", bg: "#3178c6", icon: "typescript", title: "TypeScript", sub: "Type-safe code",
    ty: [-5.73, -6.97, -6.35, -4.02, -0.62, 2.95, 5.73, 6.97, 6.35, 4.02, 0.62, -2.95], rt: [-1.39, -0.92, -0.2, 0.57, 1.19, 1.49, 1.39, 0.92, 0.2, -0.57, -1.19, -1.49] },
];

const chipTracks = (c: Chip): Tracks => ({ TRANSLATION_Y: rep(c.ty, 0.5), ROTATION: rep(c.rt, 0.5) });

/** Badge pop: 1 -> 1.35 (EASE_OUT, 0.18s) -> 1 (EASE_IN_AND_OUT, 0.32s), repeating every 2s from `start`. */
const badgeTracks = (start: number): Tracks => {
  const kfs: Kf[] = [];
  for (let t = start; t < TL; t += 2) {
    kfs.push(K(t, S(1)), K(+(t + 0.18).toFixed(3), S(1.35), OUT), K(+(t + 0.5).toFixed(3), S(1), IO));
  }
  return { SCALE_XY: kfs.filter((k) => k.t <= TL) };
};

/* ---------- Dust Cloud (691:48812): Dust 2 / Dust 3 drift, 6s period ---------- */
const dust2: Tracks = {
  TRANSLATION_X: rep([6.745, 6.093, 1.872, -3.445, -6.745, -6.093, -1.872, 3.445], 0.75),
  TRANSLATION_Y: rep([1.337, -2.461, -4.818, -4.352, -1.337, 2.461, 4.818, 4.352], 0.75),
};
const dust3: Tracks = {
  TRANSLATION_X: rep([3.609, -1.69, -5.998, -6.793, -3.609, 1.69, 5.998, 6.793], 0.75),
  TRANSLATION_Y: rep([-4.284, -4.852, -2.578, 1.207, 4.284, 4.852, 2.578, -1.207], 0.75),
};

/* ---------- Core (691:49037) ---------- */
const glowTracks: Tracks = { SCALE_XY: [K(0, S(1), E), K(3, S(1.1), IO), K(6, S(1), IO), K(9, S(1.1), IO), K(12, S(1), IO)] };
const ripple1: Tracks = {
  OPACITY: [K(0, 0.9), K(2, 0, OUT), K(5.998, 0), K(6, 0.9), K(8, 0, OUT)],
  SCALE_XY: [K(0, S(0.3)), K(2, S(3.4), B1), K(5.998, S(3.4)), K(6, S(0.3)), K(8, S(3.4), B1)],
};
const ripple2: Tracks = {
  OPACITY: [K(0, 0, E), K(1.998, 0), K(2, 0.9), K(4, 0, OUT), K(6, 0, E), K(7.998, 0), K(8, 0.9), K(10, 0, OUT)],
  SCALE_XY: [K(0, S(0.3), E), K(1.998, S(0.3)), K(2, S(0.3)), K(4, S(3.4), B1), K(6, S(0.3), E), K(7.998, S(0.3)), K(8, S(0.3)), K(10, S(3.4), B1)],
};
const ripple3: Tracks = {
  OPACITY: [K(0, 0, E), K(3.998, 0), K(4, 0.9), K(6, 0, OUT), K(9.998, 0), K(10, 0.9), K(12, 0, OUT)],
  SCALE_XY: [K(0, S(0.3), E), K(3.998, S(0.3)), K(4, S(0.3)), K(6, S(3.4), B1), K(9.998, S(0.3)), K(10, S(0.3)), K(12, S(3.4), B1)],
};
const coreLight: Tracks = {
  SCALE_XY: (() => {
    const kfs: Kf[] = [];
    for (let t = 0; t < TL; t += 2) kfs.push(K(t, S(1), IO), K(+(t + 0.35).toFixed(2), S(1.45), OUT));
    kfs.push(K(12, S(1), IO));
    return kfs;
  })(),
};

/* ---------- Absorbed noise (691:49021): 6s cycle, jumps back on the HOLD keyframe ---------- */
type Abs = { x: number; y: number; bg: string; icon: string; tracks: Tracks };
const abs = (op: string, tx: string, ty: string, rot: string, sc: string): Tracks => ({
  OPACITY: parse(op), TRANSLATION_X: parse(tx), TRANSLATION_Y: parse(ty), ROTATION: parse(rot), SCALE_XY: parse(sc, true),
});
const absorbed: Abs[] = [
  { x: 842, y: 282, bg: "#f05032", icon: "git", tracks: abs(
    "0=0 0.333=0.556 0.667=1 5=1 5.333=0.741 5.667=0.37 6=0",
    "0=0 0.333=5.012 0.667=15.253 1=29.332 1.333=46.752 1.667=67.238 2=90.598 2.333=116.681 2.667=145.343 3=176.433 3.333=209.779 3.667=245.184 4=282.413 4.333=321.189 4.667=361.19 5=402.037 5.333=443.296 5.667=484.471 6=0",
    "0=0 0.333=0.04 0.667=0.359 1=1.289 1.333=3.163 1.667=6.285 2=10.909 2.333=17.225 2.667=25.336 3=35.251 3.333=46.864 3.667=59.945 4=74.124 4.333=88.882 4.667=103.533 5=117.217 5.333=128.889 5.667=137.302 6=0",
    "0=0 0.333=-0.123 0.667=-0.494 1=-1.111 1.333=-1.975 1.667=-3.086 2=-4.444 2.333=-6.049 2.667=-7.901 3=-10 3.333=-12.346 3.667=-14.938 4=-17.778 4.333=-20.864 4.667=-24.198 5=-27.778 5.333=-31.605 5.667=-35.679 6=0",
    "0=1 0.333=0.986 0.667=0.963 1=0.935 1.333=0.903 1.667=0.867 2=0.828 2.333=0.787 2.667=0.743 3=0.697 3.333=0.649 3.667=0.599 4=0.547 4.333=0.493 4.667=0.437 5=0.38 5.333=0.322 5.667=0.262 6=1") },
  { x: 912, y: 502, bg: "#8b5cf6", icon: "brain", tracks: abs(
    "0=1 3.667=1 4=0.889 4.333=0.519 4.667=0.148 4.798=0.001 4.8=0 5=0.333 5.333=0.889 5.667=1 6=1",
    "0=38.248 0.333=56.222 0.667=76.428 1=98.595 1.333=122.508 1.667=147.998 2=174.938 2.333=203.235 2.667=232.833 3=263.711 3.333=295.886 3.667=329.408 4=364.368 4.333=400.895 4.667=439.161 4.798=454.928 4.8=0 5=2.207 5.333=10.565 5.667=22.862 6=38.248",
    "0=-1.064 0.333=-2.272 0.667=-4.137 1=-6.76 1.333=-10.208 1.667=-14.501 2=-19.613 2.333=-25.46 2.667=-31.897 3=-38.71 3.333=-45.61 3.667=-52.23 4=-58.117 4.333=-62.728 4.667=-65.422 4.798=-65.799 4.8=0 5=-0.004 5.333=-0.082 5.667=-0.384 6=-1.064",
    "0=-1.6 0.333=-2.612 0.667=-3.872 1=-5.378 1.333=-7.131 1.667=-9.131 2=-11.378 2.333=-13.872 2.667=-16.612 3=-19.6 3.333=-22.835 3.667=-26.316 4=-30.044 4.333=-34.02 4.667=-38.242 4.798=-39.992 4.8=0 5=-0.044 5.333=-0.316 5.667=-0.835 6=-1.6",
    "0=0.916 0.333=0.882 0.667=0.844 1=0.804 1.333=0.761 1.667=0.716 2=0.668 2.333=0.619 2.667=0.568 3=0.514 3.333=0.46 3.667=0.403 4=0.345 4.333=0.286 4.667=0.225 4.798=0.2 4.8=1 5=0.993 5.333=0.973 5.667=0.947 6=0.916") },
  { x: 982, y: 202, bg: "#47a248", icon: "mongo", tracks: abs(
    "0=1 2.667=1 3=0.667 3.333=0.296 3.598=0.001 3.6=0 3.667=0.111 4=0.667 4.333=1 6=1",
    "0=103.277 0.333=123.871 0.667=145.062 1=166.813 1.333=189.188 1.667=212.359 2=236.613 2.333=262.36 2.667=290.137 3=320.617 3.333=354.619 3.598=384.928 3.6=0 3.667=0.381 4=6.642 4.333=17.291 4.667=30.959 5=46.882 5.333=64.508 5.667=83.413 6=103.277",
    "0=28.676 0.333=41.671 0.667=57.413 1=75.705 1.333=96.152 1.667=118.142 2=140.829 2.333=163.112 2.667=183.616 3=200.677 3.333=212.32 3.598=216.198 3.6=0 3.667=0 4=0.108 4.333=0.744 4.667=2.42 5=5.641 5.333=10.859 5.667=18.45 6=28.676",
    "0=-6.4 0.333=-8.301 0.667=-10.449 1=-12.844 1.333=-15.486 1.667=-18.375 2=-21.511 2.333=-24.894 2.667=-28.523 3=-32.4 3.333=-36.523 3.598=-39.992 3.6=0 3.667=-0.005 4=-0.178 4.333=-0.598 4.667=-1.264 5=-2.178 5.333=-3.338 5.667=-4.746 6=-6.4",
    "0=0.778 0.333=0.734 0.667=0.687 1=0.639 1.333=0.588 1.667=0.536 2=0.482 2.333=0.426 2.667=0.369 3=0.31 3.333=0.249 3.598=0.2 3.6=1 3.667=0.999 4=0.982 4.333=0.958 4.667=0.929 5=0.896 5.333=0.859 5.667=0.82 6=0.778") },
  { x: 862, y: 622, bg: "#06b6d4", icon: "tailwind", tracks: abs(
    "0=1 1.333=1 1.667=0.815 2=0.444 2.333=0.074 2.398=0.001 2.4=0 2.667=0.444 3=1 6=1",
    "0=229.692 0.333=264.569 0.667=300.958 1=338.643 1.333=377.38 1.667=416.894 2=456.879 2.333=496.994 2.398=504.928 2.4=0 2.667=3.502 3=12.838 3.333=26.087 3.667=42.625 4=62.102 4.333=84.278 4.667=108.965 5=136.004 5.333=165.241 5.667=196.525 6=229.692",
    "0=-72.488 0.333=-90.216 0.667=-108.825 1=-127.489 1.333=-145.167 1.667=-160.579 2=-172.2 2.333=-178.239 2.398=-178.598 2.4=0 2.667=-0.025 3=-0.325 3.333=-1.315 3.667=-3.417 4=-7.027 4.333=-12.482 4.667=-20.039 5=-29.853 5.333=-41.961 5.667=-56.259 6=-72.488",
    "0=-14.4 0.333=-17.19 0.667=-20.227 1=-23.511 1.333=-27.042 1.667=-30.82 2=-34.844 2.333=-39.116 2.398=-39.992 2.4=0 2.667=-0.079 3=-0.4 3.333=-0.968 3.667=-1.783 4=-2.844 4.333=-4.153 4.667=-5.709 5=-7.511 5.333=-9.56 5.667=-11.857 6=-14.4",
    "0=0.609 0.333=0.557 0.667=0.504 1=0.449 1.333=0.392 1.667=0.333 2=0.274 2.333=0.212 2.398=0.2 2.4=1 2.667=0.99 3=0.968 3.333=0.941 3.667=0.909 4=0.874 4.333=0.836 4.667=0.795 5=0.752 5.333=0.706 5.667=0.658 6=0.609") },
  { x: 1022, y: 362, bg: "#42b883", icon: "vue", tracks: abs(
    "0=1 0.333=0.963 0.667=0.593 1=0.222 1.198=0.001 1.2=0 1.333=0.222 1.667=0.778 2=1 6=1",
    "0=236.386 0.333=260.986 0.667=289.193 1=322.247 1.198=344.928 1.2=0 1.333=1.152 1.667=8.448 2=19.627 2.333=33.431 2.667=49.056 3=65.899 3.333=83.491 3.667=101.485 4=119.655 4.333=137.898 4.667=156.242 5=174.859 5.333=194.071 5.667=214.361 6=236.386",
    "0=50.949 0.333=57.023 0.667=61.937 1=65.07 1.198=65.799 1.2=0 1.333=0.001 1.667=0.054 2=0.298 2.333=0.89 2.667=1.982 3=3.706 3.333=6.171 3.667=9.45 4=13.575 4.333=18.528 4.667=24.238 5=30.572 5.333=37.33 5.667=44.239 6=50.949",
    "0=-25.6 0.333=-29.279 0.667=-33.205 1=-37.378 1.198=-39.992 1.2=0 1.333=-0.02 1.667=-0.242 2=-0.711 2.333=-1.427 2.667=-2.39 3=-3.6 3.333=-5.057 3.667=-6.76 4=-8.711 4.333=-10.909 4.667=-13.353 5=-16.044 5.333=-18.983 5.667=-22.168 6=-25.6",
    "0=0.415 0.333=0.357 0.667=0.298 1=0.237 1.198=0.2 1.2=1 1.333=0.996 1.667=0.978 2=0.952 2.333=0.922 2.667=0.889 3=0.852 3.333=0.812 3.667=0.77 4=0.725 4.333=0.678 4.667=0.629 5=0.578 5.333=0.525 5.667=0.471 6=0.415") },
];

/* ---------- Hero content entrance (once) + scroll thumb (loop) ---------- */
const ENTER_TL = 2.2;
const enter = (t0: number, t1: number, dy: number): Tracks => ({
  OPACITY: [K(t0, 0, E), K(t1, 1, B2)],
  TRANSLATION_Y: [K(t0, dy, E), K(t1, 0, B2)],
});
const eyebrowEnter = enter(0.15, 0.85, 16);
const copyEnter = enter(0.95, 1.75, 20);
const ctaEnter = enter(1.15, 1.95, 20);
const scrollEnter: Tracks = { OPACITY: [K(1.6, 0, E), K(2.2, 1, OUT)] };
const liveDot: Tracks = { OPACITY: [K(0, 1, E), ...Array.from({ length: 12 }, (_, i) => K(i + 1, i % 2 === 0 ? 0.25 : 1, IO))] };
const thumb: Tracks = {
  TRANSLATION_Y: [
    K(0, 0, E), K(1.2, 64, P), K(1.498, 64), K(1.5, 0), K(2.7, 64, P), K(2.998, 64), K(3, 0), K(4.2, 64, P), K(4.498, 64), K(4.5, 0),
    K(5.7, 64, P), K(6, 0, E), K(7.2, 64, P), K(7.498, 64), K(7.5, 0), K(8.7, 64, P), K(8.998, 64), K(9, 0), K(10.2, 64, P), K(10.498, 64),
    K(10.5, 0), K(11.7, 64, P),
  ],
};

/* ---------- Flow particle runtime (rule verified against Figma samples) ---------- */
const WHITE = [245, 245, 242];
const ORANGE = [254, 107, 30];
const lerpTable = (tbl: number[], u: number) => {
  const f = u * 16;
  const i = Math.min(15, Math.floor(f));
  return tbl[i] + (tbl[i + 1] - tbl[i]) * (f - i);
};
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const POINTS = Array.from(new Set([...Array.from({ length: 17 }, (_, j) => j / 16), 0.12, 0.4, 0.75, 0.94])).sort((a, b) => a - b);

function particleKeyframes(tx: number[], ty: number[]): Keyframe[] {
  return POINTS.map((u) => {
    const m = clamp01((u - 0.4) / 0.35);
    const c = WHITE.map((w, i) => Math.round(w + (ORANGE[i] - w) * m));
    return {
      offset: u,
      translate: `${lerpTable(tx, u).toFixed(1)}px ${lerpTable(ty, u).toFixed(1)}px`,
      opacity: clamp01(u / 0.12) * clamp01((1 - u) / 0.06),
      backgroundColor: `rgb(${c[0]},${c[1]},${c[2]})`,
      easing: "linear",
    };
  });
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // Fit the 1440x900 hero canvas to the viewport: scale by width (as before) and, on short windows,
    // crop the canvas height to the window (visual layers stay vertically centred) so the whole hero
    // fits on one screen without squeezing or widening the composition.
    const fit = () => {
      const k = Math.min(1, document.documentElement.clientWidth / 1440);
      const H = Math.min(900, Math.max(620, window.innerHeight / k));
      const w = document.documentElement.clientWidth;
      const c = k < 1 ? 0 : Math.max(0, (w - 1440) / 2);
      el.style.width = k < 1 ? "1440px" : `${Math.max(1440, w)}px`;
      el.style.setProperty("--ox", `${c}px`);
      el.style.maxWidth = "none";
      el.style.height = `${H}px`;
      el.style.setProperty("--oy", `${-(900 - H) * 0.1}px`);
      (el.style as CSSStyleDeclaration & { zoom: string }).zoom = k < 1 ? String(k) : "";
    };
    fit();
    window.addEventListener("resize", fit);
    const unfit = () => window.removeEventListener("resize", fit);
    const anims: (Animation | null)[] = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = <T extends Element>(sel: string) => Array.from(el.querySelectorAll<T>(sel));
    const play = (n: Element | null | undefined, t: Tracks, o: Parameters<typeof playTracks>[2]) => {
      if (n) anims.push(playTracks(n, t, o));
    };

    // looping 12s-timeline layers
    play(el.querySelector("[data-m=glow]"), glowTracks, { timeline: TL, loop: true });
    play(el.querySelector("[data-m=dust2]"), dust2, { timeline: TL, loop: true });
    play(el.querySelector("[data-m=dust3]"), dust3, { timeline: TL, loop: true });
    play(el.querySelector("[data-m=r1]"), ripple1, { timeline: TL, loop: true });
    play(el.querySelector("[data-m=r2]"), ripple2, { timeline: TL, loop: true });
    play(el.querySelector("[data-m=r3]"), ripple3, { timeline: TL, loop: true });
    play(el.querySelector("[data-m=coreLight]"), coreLight, { timeline: TL, loop: true });
    play(el.querySelector("[data-m=dot]"), liveDot, { timeline: TL, loop: true });
    play(el.querySelector("[data-m=thumb]"), thumb, { timeline: TL, loop: true });
    q("[data-chip]").forEach((n, i) => play(n, chipTracks(chips[i]), { timeline: TL, loop: true }));
    q("[data-badge]").forEach((n) => {
      const c = chips[Number((n as HTMLElement).dataset.badge)];
      if (c.badge) play(n, badgeTracks(c.badge.start), { timeline: TL, loop: true });
    });
    q("[data-abs]").forEach((n, i) => play(n, absorbed[i].tracks, { timeline: 6, loop: true }));

    // 200 flow particles — 6s cycle, phase from Figma (u0)
    if (!reduce) {
      q("[data-p]").forEach((n, i) => {
        const p = PARTICLES[i];
        anims.push(
          (n as HTMLElement).animate(particleKeyframes(p.tx, p.ty), {
            duration: 6000, delay: -p.u0 * 6000, iterations: Infinity, fill: "both", easing: "linear",
          }),
        );
      });
    }

    // entrance (plays once) — held back until the intro splash has lifted (see IntroSplash)
    const entrance = () => {
      play(el.querySelector("[data-m=eyebrow]"), eyebrowEnter, { timeline: ENTER_TL });
      play(el.querySelector("[data-m=copy]"), copyEnter, { timeline: ENTER_TL });
      play(el.querySelector("[data-m=ctas]"), ctaEnter, { timeline: ENTER_TL });
      play(el.querySelector("[data-m=scroll]"), scrollEnter, { timeline: ENTER_TL });
      // H1: TextStagger — LINE grouping, LEFT_RIGHT, EASE_OUT, 0.9s, distance 32 (bottom), blur 20, overlap 55%
      anims.push(...staggerIn(q("[data-line]"), { duration: 0.9, distance: 32, direction: "bottom", blur: 20, overlap: 55, ease: EASE.out }));
    };
    const waiting = document.documentElement.hasAttribute("data-intro");
    if (waiting) window.addEventListener("intro:lift", entrance, { once: true });
    else entrance();

    return () => {
      window.removeEventListener("intro:lift", entrance);
      unfit();
      anims.forEach((a) => a?.cancel());
    };
  }, []);

  return (
    <section ref={root} className={`${s.hero} frame`} id="top">
      {/* Core Glow */}
      <div className={s.glow} data-m="glow" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/home/hero/core-glow.svg" alt="" />
      </div>

      {/* Dust Cloud (frame at left:60) */}
      <div className={s.layer} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-m="dust2" className={s.dust} style={{ left: 703, top: 59.3, width: 688, height: 812.1, opacity: 0.6 }} src="/assets/home/hero/dust2.svg" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-m="dust3" className={s.dust} style={{ left: 709.4, top: 61.2, width: 679.7, height: 806.9, opacity: 0.95 }} src="/assets/home/hero/dust3.svg" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.dust} style={{ left: 1145.4, top: 77.9, width: 245.1, height: 789.2, opacity: 0.85 }} src="/assets/home/hero/dust-orange.svg" alt="" />
      </div>

      {/* Funnel Streams (left:60, full frame) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.funnel} src="/assets/home/hero/funnel-streams.svg" alt="" aria-hidden />

      {/* Flow Particles (200) */}
      <div className={s.particles} aria-hidden>
        {PARTICLES.map((p, i) => (
          <i key={i} data-p className={s.p} style={{ left: p.x, top: p.y, width: p.size, height: p.size }} />
        ))}
      </div>

      {/* Absorbed Noise */}
      <div className={s.particles} aria-hidden>
        {absorbed.map((a, i) => (
          <div key={i} data-abs className={s.absorbed} style={{ left: a.x, top: a.y, background: a.bg }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/assets/home/chip-${a.icon}.svg`} alt="" />
          </div>
        ))}
      </div>

      {/* Core: ripples + light */}
      <div className={s.particles} aria-hidden>
        <i data-m="r1" className={s.ripple} />
        <i data-m="r2" className={s.ripple} />
        <i data-m="r3" className={s.ripple} />
        <i data-m="coreLight" className={s.coreLight} />
      </div>

      {/* Noise Chips */}
      <div className={s.chips} aria-hidden>
        {chips.map((c, i) => (
          <div key={i} className={s.chipPos} style={{ left: c.x, top: c.y, width: c.w, height: c.h }}>
            <div style={{ transform: `matrix(${c.m})` }}>
              <div data-chip className={s.chip} style={{ paddingRight: c.title ? 16 : 10 }}>
                <div className={s.icon} style={{ background: c.bg }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/assets/home/chip-${c.icon}.svg`} alt="" />
                </div>
                {c.title && (
                  <div className={s.chipText} style={{ padding: 0 }}>
                    <b>{c.title}</b>
                    {c.sub && <span>{c.sub}</span>}
                  </div>
                )}
                {c.badge && (
                  <div data-badge={i} className={s.badge} style={{ left: c.badge.left }}>
                    {c.badge.t}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={s.content}>
        <h1 className={s.h1}>
          <span data-line className={s.line}>We turn the way</span>
          <span data-line className={s.line}>you work into</span>
          <span data-line className={s.line}>
            <span className={s.grad}>software</span> that works.
          </span>
        </h1>
        <p data-m="copy" className={s.copy}>
          Your full-cycle software partner. We map how your business really runs, then design, build and keep improving
          the product around it.
        </p>
        <div className={s.spacer} />
        <div data-m="ctas" className={s.ctas}>
          <ButtonPrimary />
          <Link href="/portfolio" className={s.secondary}>
            See our work
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div data-m="scroll" className={s.scroll} aria-hidden>
        <i data-m="thumb" className={s.thumb} />
      </div>
    </section>
  );
}
