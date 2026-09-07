import { defineConfig } from "react-doctor/api";

export default defineConfig({
  ignore: {
    files: [".next/**"],
    rules: ["react-doctor/public-env-secret-name"],
    overrides: [
      {
        files: ["src/components/layout/PolicyPageLayout.tsx"],
        rules: ["react-doctor/dangerous-html-sink"],
      },
      {
        files: ["src/app/api/webhooks/register/route.ts"],
        rules: ["react-doctor/webhook-signature-risk"],
      },
    ],
  },
});
