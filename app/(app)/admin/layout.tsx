import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  // Check if user is admin
  const role = session.user.role;
  if (role !== "admin") {
    redirect("/app");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>
  );
}
