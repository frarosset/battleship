import * as lottie from "lottie-web";

export function setAnimation(
  parentContainer,
  data,
  loop = true,
  autoplay = true
) {
  const clonedData = JSON.parse(JSON.stringify(data)); // if there are repeaters
  return lottie.loadAnimation({
    container: parentContainer,
    renderer: "svg",
    loop: loop,
    autoplay: autoplay,
    animationData: clonedData,
    useFrameInterpolation: false,
    rendererSettings: {
      viewBoxOnly: true,
    },
    renderConfig: {
      devicePixelRatio: 1, // Lower values improve performance but may reduce animation quality
    },
  });
}

let isFrozen = false;
export function freezeAllAnimations(unfreeze = false) {
  if (unfreeze) {
    lottie.unfreeze();
    isFrozen = false;
  } else {
    lottie.freeze();
    isFrozen = true;
  }
}

export function forcePlayAnimation(animation, direction = 1, rewind = false) {
  animation.setDirection(direction);

  if (isFrozen) {
    const goToFrame =
      direction == 1 ? animation.totalFrames - 1 : animation.firstFrame;
    animation.goToAndStop(goToFrame, true);
  } else if (rewind) {
    const fromToFrames = [animation.firstFrame, animation.totalFrames - 1];
    if (direction == -1) {
      fromToFrames.reverse();
    }
    animation.playSegments(fromToFrames, true);
  } else {
    animation.play();
  }
}
