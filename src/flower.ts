function randomChoose<T>(items: Iterable<T>): T {
  const xs = [...items];
  return xs[Math.floor(xs.length * Math.random())];
}

function sample(
  canvas: HTMLCanvasElement
): (x: number, y: number) => [number, number, number] {
  const ctx = canvas.getContext("2d")!;
  const pix = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return (x, y) => {
    const ix = Math.max(0, Math.min(canvas.width - 1, Math.floor(x)));
    const iy = Math.max(0, Math.min(canvas.height - 1, Math.floor(y)));
    return [
      pix.data[4 * (ix + iy * canvas.width)],
      pix.data[4 * (ix + iy * canvas.width) + 1],
      pix.data[4 * (ix + iy * canvas.width) + 2],
    ];
  };
}

function subcanvas(
  draw: (ctx: CanvasRenderingContext2D) => void
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.getElementById("root")?.appendChild(canvas);
  draw(canvas.getContext("2d")!);
  return canvas;
}

export function drawFlower(ctx: CanvasRenderingContext2D) {
  const leafShades = ["#466d1d", "#588f44"];
  const flowerPairs = [
    { outer: "#ffdd01", inner: "#ffed81", size: 0.5 },
    { inner: "#b22", outer: "#800", size: 0.45 },
  ];
  const flowerColors = ["#fcc201", "#ffdd01", "#d82", "#800", "#c50"];

  ctx.fillStyle = "#fffef2";
  ctx.fillRect(0, 0, window.innerWidth, 400);
  function puff(x: number, y: number, color: string, size: number) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI * 2);
    ctx.beginPath();

    const n = 40;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2;
      const bump = Math.abs(ang - Math.PI);
      const r = (Math.random() * 3 + 12 + bump ** 2.5 * 1) * size;
      ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function flowerPot(centerx: number, centery: number) {
    ctx.save();
    ctx.fillStyle = "#D1A193";
    ctx.translate(centerx, centery);
    ctx.beginPath();

    ctx.moveTo(-600, 400);
    ctx.lineTo(600, 400);
    ctx.lineTo(600, 480);
    ctx.lineTo(500, 480);
    ctx.lineTo(300, 600);
    ctx.lineTo(-300, 600);
    ctx.lineTo(-500, 480);
    ctx.lineTo(-600, 480);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  const placementCanvas = subcanvas((ctx) => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * 200;
      let r = (2 + (y - 200) ** 2) ** 0.5;
      if (x > 0.8 * window.innerWidth || x < 0.2 * window.innerHeight) {
        r += 20;
      }
      const v = Math.max(
        0,
        Math.min(15, Math.floor(16 / (r / 40 + 1) ** 2))
      ).toString(16);

      ctx.fillStyle = `#${v}${v}${v}`;
      ctx.fillRect(x - 10, y - 10, 20, 20);
    }

    for (let i = 0; i < 100; i++) {
      let leftOrRight = Math.random();
      if (leftOrRight < 0.5) {
        leftOrRight /= 5;
      } else {
        leftOrRight /= 5;
        leftOrRight += 0.8;
      }
      const x = leftOrRight * window.innerWidth;
      const y = Math.random() * 200;

      ctx.fillStyle = `#FFF`;
      ctx.fillRect(x - 10, y - 10 + 200, 20, 20);
    }

    for (let i = 0; i < 100; i++) {
      let leftOrRight = Math.random();
      if (leftOrRight < 0.5) {
        leftOrRight /= 3;
      } else {
        leftOrRight /= 5;
        leftOrRight += 0.7;
      }
      const x = leftOrRight * window.innerWidth;
      const y = Math.random() * 200;

      ctx.fillStyle = `#777`;
      ctx.fillRect(x - 10, y - 10 + 160, 20, 20);
    }
  });
  const placementSample = sample(placementCanvas);

  function randomPoint(multiple = 1): [number, number] {
    while (true) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * 500;
      const [v] = placementSample(x, y);
      if (Math.random() * multiple * 5550 < v) {
        return [x, y];
      }
    }
  }

  flowerPot(750, -200);
  for (let i = 0; i < 7000; i++) {
    const [x, y] = randomPoint(1);
    puff(x, y, randomChoose(leafShades), 0.5);
  }

  for (let i = 0; i < 260; i++) {
    const [x, y] = randomPoint(0.15);
    puff(x, y, randomChoose(flowerColors), 0.35);
  }
  for (let i = 0; i < 400; i++) {
    const flower = randomChoose(flowerPairs);
    const [x, y] = randomPoint(0.25);
    puff(x, y, flower.outer, flower.size);
    puff(x, y, flower.inner, flower.size);
  }
}
