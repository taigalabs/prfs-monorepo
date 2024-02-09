import { NextRequest, NextResponse } from "next/server";
import { envs } from "./envs";

const hosts = (() => {
  const consoleHost = envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT.replace(
    new RegExp("^https?://"),
    "",
  );

  const ret = {
    console: consoleHost,
    temp: "temp.localhost:3000",
  };
  console.log("[middleware] hosts: %o", ret);
  return ret;
})();

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers.get("host")!;
  // .replace(
  //   `.${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}`,
  //   `.${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}`,
  // );

  // // special case for Vercel preview deployment URLs
  // if (
  //   hostname.includes("---") &&
  //   hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  // ) {
  //   hostname = `${hostname.split("---")[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  // }
  //

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // rewrites for app pages
  if (hostname === hosts.console) {
    // console.log(22, new URL(`/console${path === "/" ? "" : path}`, req.url));
    return NextResponse.rewrite(new URL(`/console${path === "/" ? "" : path}`, req.url));
  }

  if (hostname === hosts.temp) {
    // console.log(22, new URL(`/console${path === "/" ? "" : path}`, req.url));
    return NextResponse.rewrite(new URL(`/${path === "/" ? "" : path}`, req.url));
  }

  // // special case for `vercel.pub` domain
  // if (hostname === "vercel.pub") {
  //   return NextResponse.redirect("https://vercel.com/blog/platforms-starter-kit");
  // }

  // // rewrite root application to `/home` folder
  // if (hostname === "localhost:3000" || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
  //   return NextResponse.rewrite(new URL(`/home${path === "/" ? "" : path}`, req.url));
  // }
  //
  // console.log(123, hostname, path, new URL(`/${hostname}${path}`));

  // rewrite everything else to `/[domain]/[slug] dynamic route
  return NextResponse.rewrite(new URL(`/proof${path === "/" ? "" : path}`, req.url));
}
