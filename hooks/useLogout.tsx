import { useSession } from "@/lib/auth-context";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { notify } from "@/utils";

export default function useLogout() {
  const router = useRouter();
  const { setSession } = useSession();

  const handleLogout = async () => {
    await authClient.signOut();

    notify.success("Logout successful!");

    setSession(null);

    router.push("/");
  };

  return { handleLogout };
}
