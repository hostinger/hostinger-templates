import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  // Static output: no runtime server. The build prerenders the routes below
  // into plain HTML inside build/client, servable by any static host.
  ssr: false,
  prerender: ["/"],
} satisfies Config;
