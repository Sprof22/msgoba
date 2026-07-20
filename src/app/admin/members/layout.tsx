import { redirect } from "next/navigation";
import { getCurrentUser, hasAdminRole } from "@/lib/auth";
export default async function MemberAdminLayout({children}:{children:React.ReactNode}){const user=await getCurrentUser();if(!hasAdminRole(user))redirect("/admin/announcements");return children}
