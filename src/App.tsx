import React from "react";

import "./App.css";
import { drawFlower } from "./flower";

function View({ draw }: { draw: (ctx: CanvasRenderingContext2D) => void }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null as any);
  React.useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")!;
    draw(ctx);
  }, []);
  return <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef} />;
}

function App() {
  return <View draw={drawFlower} />;
}

export default App;
