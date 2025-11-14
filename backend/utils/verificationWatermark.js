import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch'; // Make sure to install node-fetch

export async function verifyWatermark(pdfBuffer, imageUrl = 'https://i.ibb.co/9Ts0csK/smartdoc.png') {
  try {
    // Load the existing PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Fetch the image from URL
    let imageResponse;
    try {
      imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      throw new Error('Could not download watermark image');
    }

    // Get image bytes
    let imageBytes;
    try {
      imageBytes = await imageResponse.arrayBuffer();
    } catch (error) {
      console.error('Error reading image bytes:', error);
      throw new Error('Could not read watermark image');
    }

    // Embed the image
    let embeddedImage;
    try {
      // Try embedding as PNG first
      embeddedImage = await pdfDoc.embedPng(imageBytes);
    } catch {
      try {
        // If PNG fails, try JPEG
        embeddedImage = await pdfDoc.embedJpg(imageBytes);
      } catch (error) {
        console.error('Error embedding image:', error);
        throw new Error('Could not embed watermark image');
      }
    }

    // Get the first page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Calculate image dimensions and position
    const maxWidth = width * 0.2; // 20% of page width
    const aspectRatio = embeddedImage.width / embeddedImage.height;
    const imageWidth = maxWidth;
    const imageHeight = imageWidth / aspectRatio;

    // Position in bottom right corner with some padding
    const xPosition = width - imageWidth - 40; // 20 points from right edge
    const yPosition = 40; // 20 points from bottom edge

    // Draw the image with consistent opacity
    firstPage.drawImage(embeddedImage, {
      x: xPosition,
      y: yPosition,
      width: imageWidth,
      height: imageHeight,
      opacity: 0.5, // Consistent opacity
    });

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;

  } catch (error) {
    console.error('Error in verifyWatermark:', error);
    
    // If watermarking fails, return original buffer
    return pdfBuffer;
  }
}