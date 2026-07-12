import { cookies } from "next/headers";

import MarketingHome from "@/components/marketing/marketing-home";
import { checkSession } from "@/utils/session";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const sessionToken = cookies().get("sessionToken")?.value;
  const isAuthenticated = sessionToken
    ? await checkSession(sessionToken).catch(() => false)
    : false;

  return <MarketingHome isAuthenticated={isAuthenticated} />;
}
