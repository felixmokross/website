import { type ColumnsBlock } from "@fxmk/shared";
import { Container } from "./components";
import { Archive } from "./archive";
import { Newsletter } from "./newsletter";
import clsx from "clsx";

export function Columns({ leftColumn, rightColumn }: ColumnsBlock) {
  return (
    <Container className="mt-24 md:mt-28">
      <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
        <Column blocks={leftColumn} />
        <Column blocks={rightColumn} className="lg:pl-16 xl:pl-24" />
      </div>
    </Container>
  );
}

function Column({
  blocks,
  className,
}: {
  blocks: ColumnsBlock["leftColumn"];
  className?: string;
}) {
  return blocks?.map((block) => (
    <div className={clsx("space-y-10", className)} key={block.id}>
      {renderBlock(block)}
    </div>
  ));
}

function renderBlock(block: NonNullable<ColumnsBlock["leftColumn"]>[number]) {
  {
    switch (block.blockType) {
      case "archive":
        return <Archive key={block.id} {...block} size="small" />;
      case "newsletter":
        return <Newsletter key={block.id} {...block} />;
      default:
        return null;
    }
  }
}
