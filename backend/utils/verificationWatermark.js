import fs from "fs";
import { PDFDocument, rgb, degrees } from "pdf-lib";

export default async function addWatermark(inputPdfPath, watermarkText) {
  const pdfBytes = fs.readFileSync(inputPdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const { width, height } = page.getSize();

    page.drawText(watermarkText, {
      x: width / 4,
      y: height / 2,
      size: 50,
      rotate: degrees(45),
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.3,
    });
  });

  const bytes = await pdfDoc.save();
  const outputPath = inputPdfPath.replace(".pdf", "_watermarked.pdf");

  fs.writeFileSync(outputPath, bytes);
  return outputPath;
}
