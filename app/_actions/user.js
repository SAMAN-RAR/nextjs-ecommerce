"use server";

import z from "zod";
import { auth, signIn as signInUser, signOut } from "@/customerAuth";
import { redirect } from "next/navigation";
import db from "@/db/db";

const userSchema = z.object({
  email: z.email().min(1, "The username is too short"),
});
export const userSignin = async (prevState, formData) => {
  const result = userSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    const error = z.treeifyError(result.error);
    return error.properties;
  }

  const { data } = result;
  const { email } = data;

  await signInUser("credentials", {
    email,
    redirect: true,
    redirectTo: "/profile",
  });
};

export const removeUserAccount = async () => {
  const session = await auth();
  const id = session.user.id;

  await db.user.delete({ where: { id } });
  redirect("/auth");
};
