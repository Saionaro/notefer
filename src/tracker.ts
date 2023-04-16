import { debounce } from "./debounce";

const MOBILE_BREAKPOINT = 600;
const UPDATE_SHIFT_FREQUENCY = 500;
const DEFAULT_SIFT = "320px";
const MOBILE_SHIFT = "100vw";

export const DIMENSIONS = {
  shift: DEFAULT_SIFT,
};

const recognizeWidth = debounce(() => {
  const width = document.documentElement.clientWidth;
  DIMENSIONS.shift = width > MOBILE_BREAKPOINT ? DEFAULT_SIFT : MOBILE_SHIFT;
}, UPDATE_SHIFT_FREQUENCY);

window.addEventListener("resize", ()=>recognizeWidth(), {
  passive: true,
});

recognizeWidth();
