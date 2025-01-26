import type { GlobalConfig } from "payload";

import { link } from "@/fields/link";
import { refreshCacheForGlobals } from "@/hooks/refresh-cache-hook";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
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
    afterChange: [({ req }) => refreshCacheForGlobals(["header"], req)],
  },
};
