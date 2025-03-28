// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";

import sharp from "sharp"; // sharp-import
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Users } from "./collections/Users";
import { Footer } from "./Footer/config";
import { Header } from "./Header/config";
import { plugins } from "./plugins";
import { defaultLexical } from "@/fields/defaultLexical";
import { Config } from "./payload-types";
import { SocialLinks } from "./collections/SocialLinks";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

declare module "payload" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface GeneratedTypes extends Config {}
}

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    components: {
      beforeNavLinks: ["@/common/version-info#VersionInfo"],
    },
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  collections: [Pages, Posts, Media, Categories, Users, SocialLinks],
  globals: [Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET!,
  serverURL: process.env.SERVER_URL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
    declare: false,
  },

  async onInit(payload) {
    if (process.env.ENABLE_E2E_USER === "true") {
      const users = await payload.find({
        collection: "users",
        where: { email: { equals: "e2e@fxmk.dev" } },
        pagination: false,
      });

      if (users.totalDocs === 0) {
        await payload.create({
          collection: "users",
          data: {
            email: "e2e@fxmk.dev",
            password: "password",
            enableAPIKey: true,
            apiKey: "apikey",
          },
        });
      }
    }
  },
});
