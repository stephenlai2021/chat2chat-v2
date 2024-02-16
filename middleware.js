/* next */
import { NextResponse } from "next/server";

/* supabase */
import { createServerClient } from "@supabase/ssr";

/* next-intl */
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'id'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  /* protected route */
  const { data } = await supabase.auth.getSession();
	const url = new URL(request.url);
	if (data.session) {
		if (url.pathname === "/login" || url.pathname === "/register") {
			return NextResponse.redirect(new URL("/", request.url));
		}
		return response;
	} else {
    if (url.pathname === "/") {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		return response;
	}
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/",
    "/(en|id)/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
