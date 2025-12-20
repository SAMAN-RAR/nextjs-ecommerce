export { auth as middleware } from "@/customerAuth";

export const config = {
  matcher: ["/profile/:path*"],
};
