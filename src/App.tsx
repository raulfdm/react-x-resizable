import { useRef } from "react";
import "./App.css";
import { Resizable } from "./Resizable";

function App() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Vite + React!</p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
      </header>
      <div className="sidePanel" ref={sidebarRef}>
        <Resizable parentRef={sidebarRef} />
      </div>
    </div>
  );
}

export default App;
