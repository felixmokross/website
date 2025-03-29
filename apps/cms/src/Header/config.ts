import type { GlobalConfig } from "payload";

import { link } from "@/fields/link";
import { refreshCacheForGlobals } from "@/hooks/refresh-cache-hook";

export const Header: GlobalConfig = {
  slug: "header",
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
          RowLabel: "@/Header/RowLabel#RowLabel",
        },
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      required: true,
    },
  ],
  hooks: {
    afterChange: [({ req }) => refreshCacheForGlobals(["header"], req)],
  },
};
