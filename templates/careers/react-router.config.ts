import type { Config } from "@react-router/dev/config";

import rolesJson from "./src/data/roles.json";

export default {
  appDirectory: "src",
  // Static output: no runtime server. The build prerenders the board and
  // every role page below into plain HTML inside build/client, so each
  // route direct-loads from any static host.
  ssr: false,
  prerender: [
    "/",
    ...rolesJson.roles.map((role) => `/roles/${role.slug}`),
  ],
} satisfies Config;
