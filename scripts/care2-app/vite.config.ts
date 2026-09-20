import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ base: "/vytal-care2/app/", plugins: [react()], server: { port: 5184 } });
