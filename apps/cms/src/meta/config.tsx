import { GlobalConfig } from "payload";

export const Meta: GlobalConfig = {
  slug: "meta",
  fields: [
    {
      name: "siteName",
      label: "Site Name",
      type: "text",
    },
    {
      name: "locale",
      label: "Locale Code (e.g. 'en')",
      type: "text",
    },
    {
      name: "favicon",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "faviconSvg",
      label: "Favicon (SVG)",
      type: "upload",
      relationTo: "media",
      filterOptions: {
        mimeType: {
          equals: "image/svg+xml",
        },
      },
    },
    {
      name: "faviconIco",
      label: "Favicon (ICO)",
      type: "upload",
      relationTo: "media",
      filterOptions: {
        mimeType: {
          equals: "image/vnd.microsoft.icon",
        },
      },
    },
    {
      name: "themeColor",
      label: "Theme Color",
      type: "text",
      admin: {
        description: "CSS color for the theme color",
      },
    },
    {
      name: "themeColorDark",
      label: "Theme Color (dark mode)",
      type: "text",
      admin: {
        description: "CSS color for the dark mode theme color",
      },
    },
    {
      name: "backgroundColor",
      label: "Background Color",
      type: "text",
      admin: {
        description: "CSS color for the background color",
      },
    },
  ],
};
