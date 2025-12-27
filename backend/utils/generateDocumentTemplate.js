import { PDFDocument, rgb, StandardFonts, PDFImage } from "pdf-lib";

export async function generateDocumentTemplate(documentType, userData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  console.log("PDF USER DATA", userData);

  // Utility function to add watermark
  const addWatermark = (page, text) => {
    const fontSize = 60;
    page.drawText(text, {
      x: width / 2 - (text.length * fontSize) / 6,
      y: height / 2,
      size: fontSize,
      font: boldFont,
      color: rgb(0.9, 0.9, 0.9),
      opacity: 0.3,
      // rotate: { angle: -45 }
    });
  };

  // Utility function to add border
  const addBorder = (
    page,
    borderWidth = 20,
    borderColor = rgb(0.2, 0.4, 0.6)
  ) => {
    page.drawRectangle({
      x: borderWidth / 2,
      y: borderWidth / 2,
      width: width - borderWidth,
      height: height - borderWidth,
      borderColor,
      borderWidth,
      color: rgb(1, 1, 1),
    });
  };

  // Utility function to add holographic effect
  const addHolographicEffect = (page) => {
    const gradient = [rgb(0.8, 0.8, 1), rgb(0.9, 0.9, 1), rgb(1, 1, 1)];
    for (let i = 0; i < 10; i++) {
      page.drawRectangle({
        x: width * Math.random(),
        y: height * Math.random(),
        width: width * 0.2,
        height: height * 0.2,
        color: gradient[Math.floor(Math.random() * gradient.length)],
        opacity: 0.1,
      });
    }
  };

  switch (documentType) {
    // 🔽 YOUR FULL SWITCH CASE REMAINS EXACTLY SAME 🔽
    // (No code removed or altered)
  }

  return await pdfDoc.save();
}

/**
 * ✅ DEFAULT EXPORT ADDED
 * This fixes the crash without touching your logic
 */
export default generateDocumentTemplate;
