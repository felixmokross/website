import type { Media, Work } from "@fxmk/shared";
import { OutlineBriefcaseIcon } from "~/components/icons";
import { MediaImage } from "~/components/media-image";

export function Work({ title, items }: Work) {
  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <OutlineBriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">{title}</span>
      </h2>
      {items && (
        <ol className="mt-6 space-y-4">
          {items.map((item) => (
            <Role
              key={item.id}
              role={{
                company: item.company,
                title: item.position,
                logo: item.logo,
                start: item.start ?? undefined,
                end: item.end ?? undefined,
              }}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

interface Role {
  company: string;
  title: string;
  logo: Media | string;
  start?: string;
  end?: string;
}

function Role({ role }: { role: Role }) {
  return (
    <li className="flex gap-4">
      <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <MediaImage media={role.logo} className="h-7 w-7" />
      </div>
      <dl className="flex flex-auto flex-wrap gap-x-2">
        <dt className="sr-only">Company</dt>
        <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {role.company}
        </dd>
        <dt className="sr-only">Role</dt>
        <dd className="text-xs text-zinc-500 dark:text-zinc-400">
          {role.title}
        </dd>
        <dt className="sr-only">Date</dt>
        <dd className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
          {role.start} — {role.end}
        </dd>
      </dl>
    </li>
  );
}
