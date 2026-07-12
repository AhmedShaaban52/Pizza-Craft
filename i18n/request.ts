import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export type AppLocale = "en" | "ar";

export async function getUserLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  return cookieStore.get("locale")?.value === "ar" ? "ar" : "en";
}

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
