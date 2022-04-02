import { useEffect, useRef } from "react";

import { isDocumentDefined } from "./utils";

const PERSIST_KEY = "react-x-resizable-persist";

type ResizableProps = {
  parentRef: React.RefObject<HTMLElement>;
  onResizeEnd?: (width: number) => void;
  persist?: boolean;
  className?: string;
  style?: React.CSSProperties;
  persistId?: string;
};

export function Resizable({
  parentRef,
  persist = false,
  onResizeEnd,
  className,
  style,
  persistId = PERSIST_KEY,
}: ResizableProps): JSX.Element {
  const resizableElementRef = useRef<HTMLDivElement>(null);
  const currentCursor = useRef<string>("");
  const currentWidth = useRef<number>(0);

  useEffect(() => {
    if (isDocumentDefined() && parentRef.current) {
      currentCursor.current = document.body.style.cursor;
      currentWidth.current = parentRef.current.clientWidth;

      if (persist) {
        retrievePersistedWidth();
        setParentRefWidth();
      }
    }
  }, []);

  function userSelect() {
    if (isDocumentDefined()) {
      document.body.addEventListener("pointermove", userMove);
      document.body.addEventListener("mouseup", userRelease);
      document.body.addEventListener("mouseleave", userRelease);
      document.body.style.cursor = "col-resize";
    }
  }

  function userMove(event: PointerEvent) {
    currentWidth.current = event.clientX;

    setParentRefWidth();
  }

  function userRelease() {
    if (parentRef.current) {
      const { clientWidth } = parentRef.current;

      document.body.removeEventListener("pointermove", userMove);
      document.body.removeEventListener("mouseup", userRelease);
      document.body.removeEventListener("mouseleave", userRelease);
      document.body.style.cursor = currentCursor.current;
      currentWidth.current = clientWidth;

      if (persist) {
        persistCurrentSize();
      }

      if (onResizeEnd) {
        onResizeEnd(clientWidth);
      }
    }
  }

  function persistCurrentSize() {
    if (isDocumentDefined()) {
      localStorage.setItem(persistId, currentWidth.current.toString());
    }
  }

  function retrievePersistedWidth() {
    if (isDocumentDefined()) {
      const savedWidth = localStorage.getItem(persistId);

      if (savedWidth !== null) {
        currentWidth.current = parseFloat(savedWidth);
      }
    }
  }

  function setParentRefWidth() {
    if (parentRef.current !== null && parentRef.current !== undefined) {
      parentRef.current.style.width = `${currentWidth.current}px`;
    }
  }

  return (
    <div
      style={{
        cursor: "col-resize",
        width: 2,
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        ...style,
      }}
      className={className}
      ref={resizableElementRef}
      onMouseDown={userSelect}
    />
  );
}
