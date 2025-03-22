import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigation } from "react-router";

export function LoadingBar() {
  const navigation = useNavigation();
  const isDelayedNavigating = useDelayedTrigger(
    navigation.state !== "idle",
    100,
  );
  return (
    <AnimatePresence>
      {isDelayedNavigating && (
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

function useDelayedTrigger(isTriggered: boolean, delayInMs: number) {
  const [isDelayedTriggered, setIsDelayedTriggered] = useState(isTriggered);
  useEffect(() => {
    let timeout: number | undefined;

    if (isTriggered) {
      timeout = window.setTimeout(() => setIsDelayedTriggered(true), delayInMs);
    } else {
      setIsDelayedTriggered(false);
    }

    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, [isTriggered, delayInMs]);

  return isDelayedTriggered;
}
