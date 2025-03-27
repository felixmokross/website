import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  useRef,
  type RefObject,
} from "react";
import toast from "react-hot-toast";
import { LinkIcon } from "~/components/icons";

export function PostH2(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >,
) {
  return <PostHeading as="h2" {...props} />;
}

export function PostH3(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >,
) {
  return <PostHeading as="h3" {...props} />;
}

export function PostH4(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >,
) {
  return <PostHeading as="h4" {...props} />;
}

export function PostH5(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >,
) {
  return <PostHeading as="h5" {...props} />;
}

export function PostH6(
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >,
) {
  return <PostHeading as="h6" {...props} />;
}

function PostHeading({
  as: HeadingElement,
  children,
  id,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> & {
  as: "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  return (
    <HeadingElement
      {...props}
      ref={ref}
      id={id}
      className="group flex items-center"
    >
      {children}
      {id && <AnchorLink targetId={id} targetRef={ref} />}
    </HeadingElement>
  );
}

function AnchorLink({
  targetRef,
  targetId,
}: {
  targetId: string;
  targetRef: RefObject<Element | null>;
}) {
  return (
    <a
      onClick={async (e) => {
        if (!targetRef.current) return;

        e.preventDefault();

        targetRef.current.scrollIntoView({ behavior: "smooth" });
        history.replaceState({}, "", `#${targetId}`);

        await navigator.clipboard.writeText(location.href);
        toast.success("Link copied to clipboard");
      }}
      className="invisible ml-1.5 inline-block text-zinc-500 group-hover:visible hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
      href={`#${targetId}`}
      title="Copy link to this section"
    >
      <LinkIcon className="h-6 w-6" />
    </a>
  );
}
