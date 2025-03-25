import { AnimatePresence, motion } from "motion/react";
import { useNavigation } from "react-router";
import { useDebouncedValue } from "~/utils/debounce";

const ANIMATION_DEBOUNCE_IN_MS = 100;

export function LoadingBar() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";
  const isDebouncedNavigating = useDebouncedValue(
    isNavigating,
    ANIMATION_DEBOUNCE_IN_MS,
  );

  return (
    <AnimatePresence>
      {isNavigating && isDebouncedNavigating && (
        <motion.div
          className="fixed top-0 right-0 left-0 z-50 h-[3px] animate-pulse rounded-r-full bg-teal-500 dark:bg-teal-400"
          initial={{ width: "0%" }}
          animate={{ width: "80%" }}
          exit={{
            width: "100%",
            transition: { duration: 0.4, opacity: 0, ease: "easeIn" },
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      )}
    </AnimatePresence>
  );
}
