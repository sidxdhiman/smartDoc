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
      //  rotate: { angle: -45 }
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
      borderColor: borderColor,
      borderWidth: borderWidth,
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
        //     rotate: { angle: Math.random() * 360 }
      });
    }
  };

  switch (documentType) {
    case "ID Card":
      // Background and border
      addBorder(page);
      addHolographicEffect(page);

      // Add watermark
      addWatermark(page, "Official ID");

      // Background texture
      page.drawRectangle({
        x: 50,
        y: 50,
        width: width - 100,
        height: height - 100,
        color: rgb(0.97, 0.97, 0.99),
        opacity: 0.5,
      });

      // Logo or official emblem placeholder
      // page.drawRectangle({
      //     x: width - 200,
      //     y: height - 150,
      //     width: 100,
      //     height: 100,
      //     color: rgb(0.9, 0.9, 0.9)
      // });

      // Official header
      page.drawText(userData.issuingAuthority, {
        x: width / 2 - 150,
        y: height - 80,
        size: 18,
        font: boldFont,
        color: rgb(0, 0, 0.6),
      });

      page.drawText("OFFICIAL IDENTITY DOCUMENT", {
        x: width / 2 - 130,
        y: height - 110,
        size: 14,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.5),
      });

      // Add user photo if provided
      if (userData.photo) {
        const embeddedImage = await pdfDoc.embedJpg(userData.photo);
        page.drawImage(embeddedImage, {
          x: width - 250,
          y: height - 350,
          width: 150,
          height: 200,
          opacity: 1,
        });
      }

      // Detailed user information with subtle design
      page.drawText(`Name: ${userData.name}`, {
        x: 100,
        y: height - 250,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0.4),
      });

      page.drawText(`Date of Birth: ${userData.dob}`, {
        x: 100,
        y: height - 280,
        size: 12,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      page.drawText(`Roll No: ${userData.rollno}`, {
        x: 100,
        y: height - 310,
        size: 12,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      page.drawText(`Phone No: ${userData.phone}`, {
        x: 100,
        y: height - 340,
        size: 12,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      // page.drawText(`Aadhaar Number: ${userData.aadhaar}`, {
      //     x: 100, y: height - 310,
      //     size: 12, font: font,
      //     color: rgb(0.2, 0.2, 0.2)
      // });

      page.drawText(`Date of Issue: ${new Date().toLocaleDateString()}`, {
        x: 100,
        y: height - 370,
        size: 12,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      page.drawText(`Issued By: ${userData.issuingAuthority}`, {
        x: 100,
        y: height - 400,
        size: 12,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.6),
      });
      break;

    case "Experience Certificate":
      // Background and border
      addBorder(page, 20, rgb(0.1, 0.3, 0.5));
      addHolographicEffect(page);

      // Add watermark
      addWatermark(page, "EXPERIENCE CERTIFICATE");

      // Background texture
      page.drawRectangle({
        x: 50,
        y: 50,
        width: width - 100,
        height: height - 100,
        color: rgb(0.98, 0.98, 1),
        opacity: 0.3,
      });

      // Official header
      page.drawText("EXPERIENCE CERTIFICATE", {
        x: width / 2 - 180,
        y: height - 100,
        size: 24,
        font: boldFont,
        color: rgb(0, 0, 0.6),
      });

      // Decorative lines
      page.drawLine({
        start: { x: 100, y: height - 130 },
        end: { x: width - 100, y: height - 130 },
        thickness: 2,
        color: rgb(0.2, 0.4, 0.6),
      });

      page.drawText(`This is to certify that`, {
        x: 100,
        y: height - 200,
        size: 16,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      page.drawText(`${userData.name}`, {
        x: 100,
        y: height - 230,
        size: 20,
        font: boldFont,
        color: rgb(0, 0, 0.6),
      });

      page.drawText(
        `has worked with ${userData.companyName} from ${userData.startDate} to ${userData.endDate}`,
        {
          x: 100,
          y: height - 260,
          size: 16,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
        }
      );

      page.drawText(`Designation: ${userData.designation}`, {
        x: 100,
        y: height - 290,
        size: 16,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      page.drawText(
        `During this period, the employee demonstrated exceptional skills and professionalism.`,
        {
          x: 100,
          y: height - 330,
          size: 14,
          font: font,
          color: rgb(0.3, 0.3, 0.3),
        }
      );

      page.drawText(`Issued By: ${userData.issuingAuthority}`, {
        x: 100,
        y: height - 400,
        size: 14,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.6),
      });

      // Signature placeholder
      page.drawRectangle({
        x: width - 250,
        y: 100,
        width: 150,
        height: 80,
        color: rgb(0.9, 0.9, 0.9),
      });
      page.drawText("Authorized Signature", {
        x: width - 240,
        y: 80,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });

    case "Birth Certificate":
      // Background and border
      addBorder(page, 20, rgb(0.3, 0.6, 0.4));
      addHolographicEffect(page);

      // Add watermark
      addWatermark(page, "BIRTH CERTIFICATE");

      // Background texture
      page.drawRectangle({
        x: 50,
        y: 50,
        width: width - 100,
        height: height - 100,
        color: rgb(0.96, 1, 0.96),
        opacity: 0.3,
      });

      // Official header
      page.drawText("BIRTH CERTIFICATE", {
        x: width / 2 - 150,
        y: height - 100,
        size: 24,
        font: boldFont,
        color: rgb(0, 0.4, 0),
      });

      // Decorative lines
      page.drawLine({
        start: { x: 100, y: height - 130 },
        end: { x: width - 100, y: height - 130 },
        thickness: 2,
        color: rgb(0.2, 0.5, 0.3),
      });

      // Certificate Details
      page.drawText("This is to certify that", {
        x: 100,
        y: height - 200,
        size: 16,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Child's Name
      page.drawText(`Name of Child: ${userData.name}`, {
        x: 100,
        y: height - 230,
        size: 20,
        font: boldFont,
        color: rgb(0, 0.4, 0),
      });

      // Date of Birth
      page.drawText(
        `Date of Birth: ${new Date(userData.dob).toLocaleDateString()}`,
        {
          x: 100,
          y: height - 260,
          size: 16,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
        }
      );

      // Place of Birth
      page.drawText(`Place of Birth: ${userData.placeOfBirth}`, {
        x: 100,
        y: height - 290,
        size: 16,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Parents' Names
      page.drawText(`Father's Name: ${userData.fatherName}`, {
        x: 100,
        y: height - 320,
        size: 16,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      page.drawText(`Mother's Name: ${userData.motherName}`, {
        x: 100,
        y: height - 350,
        size: 16,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Registration Details
      page.drawText(`Registration Number: ${userData.registrationNumber}`, {
        x: 100,
        y: height - 400,
        size: 14,
        font: boldFont,
        color: rgb(0.2, 0.5, 0.3),
      });

      page.drawText(`Issued By: ${userData.issuingAuthority}`, {
        x: 100,
        y: height - 430,
        size: 14,
        font: boldFont,
        color: rgb(0.2, 0.5, 0.3),
      });

      // Date of Issue
      page.drawText(`Date of Issue: ${new Date().toLocaleDateString()}`, {
        x: 100,
        y: height - 460,
        size: 12,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });

      break;

    default:
      throw new Error("Unsupported document type");
  }

  return await pdfDoc.save();
}
