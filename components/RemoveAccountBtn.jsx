import { removeUserAccount } from "@/app/_actions/user";
import { Button } from "./ui/button";
import { removeAdminAccount } from "@/app/_actions/admin";

const RemoveAccountBtn = ({ children, className, user }) => {
  return (
    <form
      action={async () => {
        "use server";
        user ? await removeUserAccount() : await removeAdminAccount();
      }}
    >
      <Button className={"cursor-pointer " + className} type="submit">
        {children}
      </Button>
    </form>
  );
};
export default RemoveAccountBtn;
