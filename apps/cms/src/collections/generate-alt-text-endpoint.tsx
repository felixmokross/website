import { Endpoint } from "payload";
import { generateAltText } from "@/common/openai";

export const generateAltTextEndpoint: Endpoint = {
  path: "/:id/update-alt-text",
  method: "post",
  handler: async (req) => {
    if (!req.user) {
      return new Response(null, { status: 401, statusText: "Unauthorized" });
    }

    if (!req.routeParams) throw new Error("No route params");
    if (!req.json) throw new Error("No JSON body");

    const { id } = req.routeParams;

    const media = await req.payload.findByID({
      collection: "media",
      id: id as string,
      req,
      depth: 0,
    });

    if (!media.mimeType?.includes("image/")) {
      throw new Error("Only images are supported");
    }

    const publicImageUrl = `${process.env.IMAGEKIT_BASE_URL}/${media.filename!}`;

    console.log(`Generating alt text for ${publicImageUrl}`);
    const altText = await generateAltText(publicImageUrl);

    console.log(`Updating media ${id} with alt text`);
    await req.payload.update({
      collection: "media",
      id: id as string,
      data: {
        alt: altText,
      },
      req,
    });

    return new Response(null, { status: 204 });
  },
};
