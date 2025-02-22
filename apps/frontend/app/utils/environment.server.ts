export function getEnvironment() {
  return {
    payloadCmsBaseUrl: process.env.PAYLOAD_CMS_BASE_URL as string,
    imagekitBaseUrl: process.env.IMAGEKIT_BASE_URL as string,
  };
}
