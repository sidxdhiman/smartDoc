import React, { useEffect, useState } from "react";

const WatermarkedImage = ({ src, watermarkText, watermarkLogo }) => {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Enable cross-origin for IPFS/external images
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      // 1. Set Canvas to match original image size
      canvas.width = img.width;
      canvas.height = img.height;

      // 2. Draw Original Image
      ctx.drawImage(img, 0, 0);

      // --- LOGO WATERMARK LOGIC ---
      if (watermarkLogo) {
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.src = watermarkLogo;

        logo.onload = () => {
          // Calculate Logo Size (e.g., 15% of main image width)
          const logoWidth = canvas.width * 0.15;
          // Keep aspect ratio
          const aspectRatio = logo.width / logo.height;
          const logoHeight = logoWidth / aspectRatio;

          // Padding from the edge
          const padding = 20;

          // Calculate Position: Bottom-Right
          const x = canvas.width - logoWidth - padding;
          const y = canvas.height - logoHeight - padding;

          // Opacity for watermark
          ctx.globalAlpha = 0.8;

          // Draw the logo
          ctx.drawImage(logo, x, y, logoWidth, logoHeight);

          // Reset opacity for text (if any)
          ctx.globalAlpha = 1.0;

          // If text exists, draw it AFTER logo is done
          if (watermarkText) drawText(ctx, canvas.width, canvas.height);

          setImgSrc(canvas.toDataURL());
        };
      } else {
        // No logo, just check for text
        if (watermarkText) drawText(ctx, canvas.width, canvas.height);
        setImgSrc(canvas.toDataURL());
      }
    };
  }, [src, watermarkText, watermarkLogo]);

  const drawText = (ctx, width, height) => {
    // Styling the text
    const fontSize = width * 0.05; // Font size based on image width
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // Semi-transparent white
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Rotate and draw text in the center
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((-45 * Math.PI) / 180);
    ctx.fillText(watermarkText, 0, 0);
    ctx.restore();
  };

  if (!imgSrc)
    return (
      <div className="animate-pulse bg-gray-200 w-full h-64 rounded-md"></div>
    );

  return (
    <img
      src={imgSrc}
      alt="Watermarked Doc"
      className="w-full h-auto rounded-md shadow-sm"
    />
  );
};

export default WatermarkedImage;
