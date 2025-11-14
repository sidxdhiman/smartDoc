import pkg from "@pdftron/pdfnet-node";
const { PDFNet } = pkg;
import { promises as fs } from "fs";

export const convertPdfToImage = async (pdfBuffer) => {
  try {
    // Write the buffer to a temporary PDF file
    const tempPdfPath = "./temp1.pdf";
    await fs.writeFile(tempPdfPath, pdfBuffer);

    // Main conversion function
    const main = async () => {
      // Initialize PDFNet
      const doc = await PDFNet.PDFDoc.createFromFilePath(tempPdfPath);

      // Create a PDFDraw object for rendering
      const draw = await PDFNet.PDFDraw.create();

      // Set rendering options (optional)
      await draw.setDPI(300); // High-quality rendering

      // Get the first page
      const page = await doc.getPage(1);

      // Output image path
      const outputImagePath = "./converted_page.png";

      // Export the page as a PNG
      await draw.export(page, outputImagePath, "PNG");

      return outputImagePath;
    };

    // Run the conversion with your license key
    const outputPath = await PDFNet.runWithCleanup(
      main,
      process.env.PDFTRON_LICENSE_KEY // Store your license in environment variables
    );

    // Read the converted image
    const imageBuffer = await fs.readFile(outputPath);

    // Clean up temporary files
    await fs.unlink(tempPdfPath);
    await fs.unlink(outputPath);

    return imageBuffer;
  } catch (error) {
    console.error("PDFNet conversion error:", error);
    throw new Error(`PDF to Image conversion failed: ${error.message}`);
  } finally {
    // Shutdown PDFNet
    await PDFNet.shutdown();
  }
};