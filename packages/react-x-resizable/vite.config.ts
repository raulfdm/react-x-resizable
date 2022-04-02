import { defineConfig } from "vite";
import dts from "vite-dts";
import path from "path";

const isExternal = (id: string) => !id.startsWith(".") && !path.isAbsolute(id);

const libConfig = defineConfig({
  plugins: [dts()],
  esbuild: {
    jsxInject: "import React from 'react'",
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "./lib/index.ts"),
      name: "ReactXResizable",
      fileName: (format) => `x-resizable.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: isExternal,
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
    },
  },
});

// https://vitejs.dev/config/
export default libConfig;
