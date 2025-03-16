import type { CodeBlock } from "@fxmk/payload-types";
import Prism from "prismjs";

Prism.manual = true;

export type CodeProps = CodeBlock;

export const Code = ({ language, code }: CodeProps) => {
  const languageOrPlaintext = language ?? "plaintext";
  const html = Prism.highlight(
    code,
    Prism.languages[
      languageOrPlaintext.startsWith("diff-") ? "diff" : languageOrPlaintext
    ],
    languageOrPlaintext,
  );
  return (
    <pre>
      <code className={`language-${language}`}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </code>
    </pre>
  );
};
