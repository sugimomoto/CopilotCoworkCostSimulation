import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages はリポジトリ名のサブパス配下で公開されるため base を指定する
// 例: https://sugimomoto.github.io/CopilotCoworkCostSimulation/
export default defineConfig({
  plugins: [react()],
  base: "/CopilotCoworkCostSimulation/",
});
