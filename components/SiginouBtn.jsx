import { signOut } from "@/auth.js";
import { signOut as userSignOut } from "@/customerAuth";
import { Button } from "./ui/button";

export default function SignOutBtn({ className, user }) {
  return (
    <form
      action={async () => {
        "use server";
        user
          ? await userSignOut("credentials", {})
          : await signOut("credentials", {});
      }}
    >
      <Button className={"cursor-pointer " + className} type="submit">
        Sign Out
      </Button>
    </form>
  );
}
