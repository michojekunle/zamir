import { registerRoot, Composition } from "remotion";
import { MarketingVideo } from "./MarketingVideo";

// 510 frames = 17 seconds at 30fps
const DURATION = 510;
const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

function RemotionRoot() {
  return (
    <Composition
      id="ZamirMarketingVideo"
      component={MarketingVideo}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{}}
    />
  );
}

registerRoot(RemotionRoot);
