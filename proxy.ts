import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** Publieke hostname van het verzoek (Cloudflare zet vaak de echte site in x-forwarded-host). */
function getRequestHostname(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-host");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim().toLowerCase() ?? "";
    return first.split(":")[0] || "";
  }
  const host = request.headers.get("host")?.toLowerCase() ?? "";
  return host.split(":")[0] || "";
}

const LEGACY_WWW_COM = "www.savedsouls-foundation.com";

export default async function proxy(request: NextRequest) {
  const hostname = getRequestHostname(request);
  if (hostname === LEGACY_WWW_COM) {
    const url = request.nextUrl.clone();
    url.hostname = "www.savedsouls-foundation.org";
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  const pathname = request.nextUrl.pathname;

  const localeMatch = pathname.match(/^\/(nl|en|de|es|th|ru|fr)(\/|$)/);
  const locale = localeMatch?.[1] ?? "nl";

  const portalMatch = pathname.match(/^\/(nl|en|de|es|th|ru|fr)\/portal(\/|$)/);
  const adminDashboardMatch = pathname.match(/^\/(nl|en|de|es|th|ru|fr)\/admin\/dashboard/);
  const isProtected = portalMatch || adminDashboardMatch;

  // Nieuwe admin-routes (dashboard, vrijwilligers, adoptanten, documenten): eigen login
  const adminSubRouteMatch = pathname.match(/^\/(nl|en|de|es|th|ru|fr)\/admin\/(dashboard|vrijwilligers|adoptanten|documenten)(\/|$)/);
  const isAdminSubRoute = Boolean(adminSubRouteMatch);

  if (isAdminSubRoute && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const loginUrl = new URL(request.url);
      loginUrl.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isProtected && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const loginUrl = new URL(request.url);
      loginUrl.pathname = `/${locale}/dashboard/login`;
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Strip alle vooraan staande locale-segmenten (voorkomt dubbele-locale hreflang zoals /de/es/...)
  const localeSegment = /^\/(nl|en|de|es|th|ru|fr)(\/|$)/;
  let pathWithoutLocale = pathname;
  while (localeSegment.test(pathWithoutLocale)) {
    pathWithoutLocale = pathWithoutLocale.replace(localeSegment, "$2") || "/";
  }
  if (!pathWithoutLocale || pathWithoutLocale === "") pathWithoutLocale = "/";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-path-without-locale", pathWithoutLocale);
  const modifiedRequest = new NextRequest(request.url, { headers: requestHeaders });
  return intlMiddleware(modifiedRequest);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
