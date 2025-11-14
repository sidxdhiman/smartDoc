import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

/**
 * Upload a file to IPFS
 * @param {Buffer} fileBuffer - The file to upload
 * @param {Object} metadata - Metadata for the file
 * @returns {Promise<Object>} Pinata response
 */
export const uploadToIPFS = async (fileBuffer, metadata) => {
  const file = new File([fileBuffer], "document.pdf", {
    type: "application/pdf",
  });

  const response = await pinata.upload.file(file, { metadata });
  return { hash: response.IpfsHash, gatewayUrl: response.IpfsGateway };
};
