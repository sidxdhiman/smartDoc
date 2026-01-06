import React, { useEffect, useRef } from "react";

const WatermarkedImage = ({ src, watermarkText }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      ctx.font = "48px Arial";
      ctx.fillStyle = "rgba(200, 0, 0, 0.25)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.rotate(-Math.PI / 6);

      const step = 300;
      for (let x = -canvas.width; x < canvas.width * 2; x += step) {
        for (let y = -canvas.height; y < canvas.height * 2; y += step) {
          ctx.fillText(watermarkText, x, y);
        }
      }

      ctx.rotate(Math.PI / 6);
    };
  }, [src, watermarkText]);

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full rounded-lg shadow-md border"
    />
  );
};

export default WatermarkedImage; // ✅ THIS LINE MUST EXIST
