import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
export default async function MembersLayout({children}:{children:React.ReactNode}){const user=await getCurrentUser();if(!user)redirect("/login?next=/members");if(!user.emailVerified)redirect("/verify-email");if(user.status!=="verified")redirect("/account/pending");return children}
