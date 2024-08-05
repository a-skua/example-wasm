import { viteStaticCopy } from "vite-plugin-static-copy";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "app/asbuild/release.wasm",
          dest: "",
        }
      ],
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
    esbuild: {
    supported: {
      'top-level-await': true //browsers can handle top-level-await features
    },
    },
});
