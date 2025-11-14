import { Client } from "@gradio/client";
import { promises as fs } from "fs";

export const processDocumentWithOvis = async (imageBuffer, prompt = "Extract personal details from document") => {
  try {
    const client = await Client.connect("AIDC-AI/Ovis1.6-Llama3.2-3B");

    // Create temp directory if it doesn't exist
    await fs.mkdir("./temp", { recursive: true });

    // Create a temporary file path
    const tempImagePath = "./temp/document.png";

    // Write the image buffer to a temporary file
    await fs.writeFile(tempImagePath, imageBuffer);

    // Create a File object from the buffer
    const imageFile = new File([imageBuffer], "image.png", {
      type: "image/png",
    });

    const result = await client.predict("/ovis_chat", {
      chatbot: [[prompt, null]],
      image_input: imageFile,
    });

    // Cleanup temp file
    await fs.unlink(tempImagePath);

    if (!result?.data?.[0]?.[0]?.[1]) throw new Error("Invalid API response");

    const jsonStr = result.data[0][0][1];
    return JSON.parse(jsonStr.match(/\{[\s\S]*\}/)?.[0] || "{}");
  } catch (error) {
    console.error("Ovis processing error:", error);
    throw new Error(`Document processing failed: ${error.message}`);
  }
};
