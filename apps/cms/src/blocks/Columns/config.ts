import { Block } from "payload";
import { Archive } from "../ArchiveBlock/config";
import { Newsletter } from "../newsletter/config";
import { Work } from "../work/config";

const blocks: Block[] = [Archive, Newsletter, Work];

export const Columns: Block = {
  slug: "columns",
  interfaceName: "ColumnsBlock",
  fields: [
    {
      name: "leftColumn",
      type: "blocks",
      blocks,
    },
    {
      name: "rightColumn",
      type: "blocks",
      blocks,
    },
  ],
};
