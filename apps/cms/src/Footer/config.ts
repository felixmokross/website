import type { GlobalConfig } from "payload";

import { link } from "@/fields/link";
import { refreshCacheForGlobals } from "@/hooks/refresh-cache-hook";

export const Footer: GlobalConfig = {
  slug: "footer",
  fields: [
    {
      name: "navItems",
      type: "array",
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: "@/Footer/RowLabel#RowLabel",
        },
      },
    },
    {
      name: "copyrightText",
      type: "text",
    },
  ],
  hooks: {
    afterChange: [({ req }) => refreshCacheForGlobals(["footer"], req)],
  },
};
