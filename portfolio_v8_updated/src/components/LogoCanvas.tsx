import React, { useEffect, useRef } from 'react';
import { LOGO_B64 } from '../images';

export function LogoCanvas({ size }: { size: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, size, size);
      const tmp = document.createElement('canvas');
      tmp.width = img.width;
      tmp.height = img.height;
      const tc = tmp.getContext('2d')!;
      tc.drawImage(img, 0, 0);
      const d = tc.getImageData(0, 0, img.width, img.height);
      for (let i = 0; i < d.data.length; i += 4) {
        const r = d.data[i], g = d.data[i + 1], b = d.data[i + 2];
        // Chrome keying logic
        if (g > 80 && g > r * 1.15 && g > b * 1.15) d.data[i + 3] = 0;
      }
      tc.putImageData(d, 0, 0);
      ctx.drawImage(tmp, 0, 0, size, size);
    };
    img.src = LOGO_B64;
  }, [size]);

  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      className="max-w-full max-h-full object-contain"
    />
  );
}
