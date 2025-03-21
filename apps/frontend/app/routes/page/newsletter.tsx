import type { Newsletter } from "@fxmk/payload-types";
import { Button } from "~/components/button";
import { OutlineMailIcon } from "~/components/icons";
import { RichText } from "~/components/rich-text/rich-text";
import type { RichTextObject } from "~/components/rich-text/rich-text.model";

export function Newsletter({
  title,
  description,
  buttonText,
  placeholder,
}: Newsletter) {
  return (
    <form
      action="/thank-you"
      className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
    >
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <OutlineMailIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">{title}</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        <RichText
          content={description as unknown as RichTextObject}
          lineBreakHandling="line-break"
        />
      </p>
      <div className="mt-6 flex">
        <input
          type="email"
          placeholder={placeholder ?? ""}
          aria-label={placeholder ?? ""}
          required
          className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(--spacing(2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-hidden sm:text-sm dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10"
        />
        <Button type="submit" className="ml-4 flex-none">
          {buttonText}
        </Button>
      </div>
    </form>
  );
}
