import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/board.tsx"),
  route("roles/:slug", "routes/role.tsx"),
] satisfies RouteConfig;
