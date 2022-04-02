import { useEffect, useRef } from "react";

function isDocumentPresent() {
  return typeof document !== "undefined";
}

type ResizableProps = {
  parentRef: React.RefObject<HTMLElement>;
};

export function Resizable({ parentRef }: ResizableProps) {
  const resizableElementRef = useRef<HTMLDivElement>(null);
  const currentCursor = useRef<string>("");

  useEffect(() => {
    if (isDocumentPresent()) {
      currentCursor.current = document.body.style.cursor;

      setParentRefWidth(retrieveSavedSize());
    }
  }, []);

  function userSelect() {
    if (isDocumentPresent()) {
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
    document.body.removeEventListener("pointermove", userMove);
    document.body.removeEventListener("mouseup", userRelease);
    document.body.removeEventListener("mouseleave", userRelease);
    document.body.style.cursor = currentCursor.current;
    persistCurrentSize(parentRef.current?.style.width || "");
  }

  function persistCurrentSize(size: string) {
    if (isDocumentPresent()) {
      localStorage.setItem("resizable-width", size.replace("px", ""));
    }
  }

  function retrieveSavedSize(): string {
    if (isDocumentPresent()) {
      return localStorage.getItem("resizable-width") || "";
    }

    return "";
  }

  function setParentRefWidth(width: string | number) {
    if (parentRef.current !== null && parentRef.current !== undefined) {
      if (width !== "") {
        parentRef.current.style.width = `${width}px`;
      }
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
      }}
      ref={resizableElementRef}
      onMouseDown={userSelect}
    />
  );
}
