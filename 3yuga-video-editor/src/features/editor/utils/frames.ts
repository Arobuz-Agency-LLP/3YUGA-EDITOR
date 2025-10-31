export const calculateFrames = (
  display: { from: number; to: number },
  fps: number
) => {
  const from = (display.from / 1000) * fps;
  let durationInFrames = (display.to / 1000) * fps - (display.from / 1000) * fps;
  if (durationInFrames <= 0) {
    durationInFrames = 1; // Ensure a minimum duration of 1 frame
  }
  return { from, durationInFrames };
};
