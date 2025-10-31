// from iTransition interface, omit fromId, toId
export const TRANSITIONS = [
  {
    id: "1",
    kind: "none",
    duration: 0,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/transition-none.png",
    type: "transition"
  },
  {
    id: "2",
    kind: "fade",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/fade.webp",
    type: "transition"
  },
  {
    id: "3",
    kind: "slide",
    name: "slide up",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/slide-up.webp",
    type: "transition",
    direction: "from-bottom"
  },
  {
    id: "4",
    kind: "slide",
    name: "slide down",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/slide-down.webp",
    type: "transition",
    direction: "from-top"
  },
  {
    id: "5",
    kind: "slide",
    name: "slide left",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/slide-left.webp",
    type: "transition",
    direction: "from-right"
  },
  {
    id: "6",
    kind: "slide",
    name: "slide right",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/slide-right.webp",
    type: "transition",
    direction: "from-left"
  },
  {
    id: "7",
    kind: "wipe",
    name: "wipe up",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/wipe-up.webp",
    type: "transition",
    direction: "from-bottom"
  },
  {
    id: "8",
    kind: "wipe",
    name: "wipe down",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/wipe-down.webp",
    type: "transition",
    direction: "from-top"
  },
  {
    id: "9",
    kind: "wipe",
    name: "wipe left",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/wipe-left.webp",
    type: "transition",
    direction: "from-right"
  },
  {
    id: "10",
    kind: "wipe",
    name: "wipe right",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/wipe-right.webp",
    type: "transition",
    direction: "from-left"
  },
  {
    id: "11",
    kind: "flip",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/flip.webp",
    type: "transition"
  },
  {
    id: "12",
    kind: "clockWipe",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/clock-wipe.webp",
    type: "transition"
  },
  {
    id: "13",
    kind: "star",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/star.webp",
    type: "transition"
  },
  {
    id: "14",
    kind: "circle",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/circle.webp",
    type: "transition"
  },
  {
    id: "15",
    kind: "rectangle",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/rectangle.webp",
    type: "transition"
  },
  {
    id: "16",
    kind: "slidingDoors",
    name: "sliding doors",
    duration: 0.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/sliding-doors.webp",
    type: "transition"
  },
  // New cool transitions from user
  {
    id: "17",
    kind: "fade",
    name: "crossfade",
    category: "free",
    duration: 1.2,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/crossfade.webp",
    type: "transition"
  },
  {
    id: "18",
    kind: "slide",
    name: "slide left",
    category: "free",
    duration: 0.8,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/slide-left.webp",
    type: "transition",
    direction: "from-right"
  },
  {
    id: "19",
    kind: "slide",
    name: "slide right",
    category: "free",
    duration: 0.8,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/slide-right.webp",
    type: "transition",
    direction: "from-left"
  },
  {
    id: "20",
    kind: "slide",
    name: "zoom in",
    category: "free",
    duration: 0.9,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/zoom-in.webp",
    type: "transition",
    direction: "from-bottom"
  },
  {
    id: "21",
    kind: "slide",
    name: "zoom out",
    category: "free",
    duration: 0.9,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/zoom-out.webp",
    type: "transition",
    direction: "from-top"
  },
  // Premium transitions
  {
    id: "22",
    kind: "wipe",
    name: "circular wipe",
    category: "premium",
    duration: 1.0,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/circular-wipe.webp",
    type: "transition",
    direction: "from-bottom"
  },
  {
    id: "23",
    kind: "circle",
    name: "glitch effect",
    category: "premium",
    duration: 0.6,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/glitch.webp",
    type: "transition"
  },
  {
    id: "24",
    kind: "rectangle",
    name: "blur transition",
    category: "premium",
    duration: 0.8,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/blur-transition.webp",
    type: "transition"
  },
  {
    id: "25",
    kind: "flip",
    name: "3d rotate",
    category: "premium",
    duration: 1.2,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/3d-rotate.webp",
    type: "transition"
  },
  {
    id: "26",
    kind: "flip",
    name: "cube flip",
    category: "premium",
    duration: 1.0,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/cube-flip.webp",
    type: "transition"
  },
  {
    id: "27",
    kind: "wipe",
    name: "zoom blur",
    category: "premium",
    duration: 0.9,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/zoom-blur.webp",
    type: "transition",
    direction: "from-bottom"
  },
  {
    id: "28",
    kind: "wipe",
    name: "diagonal wipe",
    category: "premium",
    duration: 0.8,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/diagonal-wipe.webp",
    type: "transition",
    direction: "from-right"
  },
  {
    id: "29",
    kind: "circle",
    name: "pixelate",
    category: "premium",
    duration: 1.0,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/pixelate.webp",
    type: "transition"
  },
  {
    id: "30",
    kind: "star",
    name: "wave effect",
    category: "premium",
    duration: 1.2,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/wave.webp",
    type: "transition"
  },
  {
    id: "31",
    kind: "wipe",
    name: "split horizontal",
    category: "premium",
    duration: 0.9,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/split-horizontal.webp",
    type: "transition",
    direction: "from-left"
  },
  {
    id: "32",
    kind: "circle",
    name: "kaleidoscope",
    category: "premium",
    duration: 1.5,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/kaleidoscope.webp",
    type: "transition"
  },
  {
    id: "33",
    kind: "flip",
    name: "page curl",
    category: "premium",
    duration: 1.2,
    preview: "https://ik.imagekit.io/wombo/transitions-v2/page-curl.webp",
    type: "transition"
  }
];
