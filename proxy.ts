import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const localeMatch = pathname.match(/^\/(nl|en|de|es|th|ru)(\/|$)/);
  const locale = localeMatch?.[1] ?? "nl";

  const portalMatch = pathname.match(/^\/(nl|en|de|es|th|ru)\/portal(\/|$)/);
  const adminDashboardMatch = pathname.match(/^\/(nl|en|de|es|th|ru)\/admin\/dashboard/);
  const isProtected = portalMatch || adminDashboardMatch;

  // Nieuwe admin-routes (dashboard, vrijwilligers, adoptanten, documenten): eigen login
  const adminSubRouteMatch = pathname.match(/^\/(nl|en|de|es|th|ru)\/admin\/(dashboard|vrijwilligers|adoptanten|documenten)(\/|$)/);
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

  const pathWithoutLocale = pathname.replace(/^\/(nl|en|de|es|th|ru)(\/|$)/, "$2") || "/";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-path-without-locale", pathWithoutLocale);
  const modifiedRequest = new NextRequest(request.url, { headers: requestHeaders });
  return intlMiddleware(modifiedRequest);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
