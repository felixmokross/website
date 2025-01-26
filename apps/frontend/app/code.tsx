import type { CodeBlock } from "@fxmk/shared";
import Prism from "prismjs";

Prism.manual = true;

export type CodeProps = {
  data: CodeBlock | string;
};

export const Code = ({ data }: CodeProps) => {
  if (typeof data !== "object") return null;

  const language = data.language ?? "plaintext";
  const html = Prism.highlight(data.code, Prism.languages[language], language);
  return (
    <pre>
      <code className={`language-${language}`}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </code>
    </pre>
  );
};
