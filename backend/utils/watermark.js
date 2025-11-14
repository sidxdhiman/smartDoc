import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

export const createWatermarkedFile = async (
  pdfBuffer,
  watermarkText,
  remarks,
  issuingAuthority
) => {
  try {
    if (!isPDF(pdfBuffer)) {
      throw new Error("Input is not a valid PDF file");
    }

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    pages.forEach((page) => {
      const { width, height } = page.getSize();

      // Official stamp-like watermark
      const stampWatermark = (text, fontSize, yPosition, fontToUse, color) => {
        page.drawText(text, {
          x: width / 2 - (text.length * fontSize / 8),
          y: yPosition,
          size: fontSize,
          font: fontToUse,
          color: color,
          opacity: 0.3,
          rotate: degrees(345) // Slight angle for more natural look
        });
      };

      // Watermark layers
   //   stampWatermark(`${issuingAuthority} CERTIFIED DOCUMENT`, 40, height / 2 + 50, boldFont, rgb(0.6, 0, 0));
      stampWatermark('OFFICIAL COPY', 30, height / 2, helveticaFont, rgb(0.6, 0, 0));

      // Detailed certification information
      const detailedText = [
     //   `Verification Code: ${verificationCode}`,
        `Issuer: ${issuingAuthority}`,
        `Date of Certification: ${new Date().toLocaleDateString()}`,
        remarks ? `Remarks: ${remarks}` : ""
      ];

      detailedText.forEach((line, index) => {
        if (line) {
          page.drawText(line, {
            x: 50,
            y: 100 - (index * 15),
            size: 10,
            font: helveticaFont,
            color: rgb(0.4, 0.4, 0.4),
            opacity: 0.7
          });
        }
      });

      // Additional security elements
      const addSecurityPattern = (color, opacity) => {
        for (let i = 0; i < 20; i++) {
          page.drawLine({
            start: { 
              x: Math.random() * width, 
              y: Math.random() * height 
            },
            end: { 
              x: Math.random() * width, 
              y: Math.random() * height 
            },
            thickness: Math.random(),
            color: color,
            opacity: opacity
          });
        }
      };

      addSecurityPattern(rgb(0.7, 0, 0), 0.05);
    });

    const watermarkedPdfBytes = await pdfDoc.save();
    return Buffer.from(watermarkedPdfBytes);
  } catch (error) {
    console.error("Error creating watermarked PDF:", error);
    throw error;
  }
};

// Generate a cryptographically stronger verification code
function generateVerificationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(crypto.getRandomValues(new Uint32Array(8)))
    .map((x) => chars[x % chars.length])
    .join('');
}

// Improved PDF detection with more robust checking
function isPDF(buffer) {
  // Check for PDF header and ensure minimum length
  return buffer && 
         buffer.length > 4 && 
         buffer.slice(0, 4).toString() === "%PDF" &&
         buffer.slice(buffer.length - 5).toString().includes("%%EOF");
}

// Optional: Export verification code generator if needed separately
export { generateVerificationCode };