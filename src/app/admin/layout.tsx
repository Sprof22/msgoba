import { redirect } from "next/navigation";
import { getCurrentUser, hasContentRole } from "@/lib/auth";
export default async function AdminLayout({children}:{children:React.ReactNode}){const user=await getCurrentUser();if(!user)redirect("/login?next=/admin");if(!hasContentRole(user))redirect(user.status==="verified"?"/members":"/account/pending");return children}
