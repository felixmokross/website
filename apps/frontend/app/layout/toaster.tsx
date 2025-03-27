import { Transition } from "@headlessui/react";
import { resolveValue, Toaster as ReactHotToaster } from "react-hot-toast";
import { CircleCheckIcon } from "~/components/icons";

export function Toaster() {
  return (
    <ReactHotToaster containerClassName="mt-8">
      {(t) => (
        <Transition
          appear
          show={t.visible}
          as="div"
          className="flex transform items-center gap-1 rounded bg-zinc-900/80 px-3 py-2 text-sm font-medium text-zinc-50 shadow-md dark:bg-zinc-600/80"
          enter="transition-all duration-150"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <CircleCheckIcon className="h-5 w-5 text-green-300" />
          {resolveValue(t.message, t)}
        </Transition>
      )}
    </ReactHotToaster>
  );
}
