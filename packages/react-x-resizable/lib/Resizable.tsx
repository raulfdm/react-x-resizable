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

  useEffect(() => {
    if (isDocumentDefined()) {
      currentCursor.current = document.body.style.cursor;

      setParentRefWidth(retrieveSavedSize());
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
    setParentRefWidth(event.clientX);
  }

  function userRelease() {
    if (resizableElementRef.current) {
      const { clientWidth } = resizableElementRef.current;

      document.body.removeEventListener("pointermove", userMove);
      document.body.removeEventListener("mouseup", userRelease);
      document.body.removeEventListener("mouseleave", userRelease);
      document.body.style.cursor = currentCursor.current;

      if (persist) {
        persistCurrentSize(clientWidth);
      }

      if (onResizeEnd) {
        onResizeEnd(clientWidth);
      }
    }
  }

  function persistCurrentSize(width: number) {
    if (isDocumentDefined()) {
      localStorage.setItem(persistId, width.toString());
    }
  }

  function retrieveSavedSize(): number | null {
    let width = null;

    if (isDocumentDefined()) {
      const savedWidth = localStorage.getItem(persistId);

      if (savedWidth !== null) {
        width = parseFloat(savedWidth);
      }
    }

    return width;
  }

  function setParentRefWidth(width: number | null) {
    if (
      parentRef.current !== null &&
      parentRef.current !== undefined &&
      width !== null
    ) {
      parentRef.current.style.width = `${width}px`;
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
