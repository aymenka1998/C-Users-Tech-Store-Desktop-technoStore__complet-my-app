export const dynamic = 'force-dynamic';
import { AccountDashboard } from "@/components/account/account-dashboard"
import { getUserFromToken } from "@/lib/auth"
import { redirect } from "next/navigation"
export const metadata = {
  title: " حسابي | TechStore",
  description: "اكتشف أفضل العروض والخصومات على المنتجات التقنية",
};
export default async function AccountPage() {
  const user = await getUserFromToken()
  if (!user) redirect("/login")
  return <AccountDashboard user={user} />
}