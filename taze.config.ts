import { defineConfig } from "taze";

export default defineConfig({
  recursive: true,
  write: false,
  peer: true,
  maturityPeriod: 1,
  exclude: ["drizzle-orm"],
});
