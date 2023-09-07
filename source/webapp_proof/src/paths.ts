export function resolvePath(app: string, segment: string) {
  return `/${app}/${segment}`;
}

export const paths = {
  __: "/",
  generate: "/",
  explorer: "/explorer",
};
