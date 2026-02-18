import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = pathname.replace(/^\/(nl|en|de|th|ru)(\/|$)/, "$2") || "/";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-path-without-locale", pathWithoutLocale);
  const modifiedRequest = new NextRequest(request.url, { headers: requestHeaders });
  return intlMiddleware(modifiedRequest);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
