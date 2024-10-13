"use client";

import { useLayoutEffect, type RefObject } from "react";

function useAutoScroll(ref: RefObject<HTMLElement>, dependencies: unknown[]) {
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ref, ...dependencies]);
}

export default useAutoScroll;
