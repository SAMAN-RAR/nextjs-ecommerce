"use server";

import z from "zod";
import bcrypt from "bcryptjs";
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/db/db";

const addAdminSchema = z.object({
  username: z.string().min(1),
  password: z
    .string()
    .min(6, "Passord must be atleast 6 charachters")
    .max(100, "Password is to long"),
});

export const AdminSignup = async (prevState, formData) => {
  const result = addAdminSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    const error = z.treeifyError(result.error);
    return error.properties;
  }

  const { data } = result;
  const { username, password } = data;

  const existingUsername = await db.admin.findUnique({ where: { username } });
  let error = { isUsernameRepetitive: false, username };
  if (existingUsername) {
    error.isUsernameRepetitive = true;
    return error;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  await db.admin.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
  await signIn("credentials", {
    username,
    password,
    redirect: true,
    redirectTo: "/admin",
  });
};

export const AdminLogin = async (prevState, formData) => {
  const result = addAdminSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    const error = z.treeifyError(result.error);
    return error.properties;
  }

  const { data } = result;
  const { username, password } = data;

  await signIn("credentials", {
    username,
    password,
    redirect: true,
    redirectTo: "/admin",
  });
};

export const removeAdminAccount = async () => {
  const session = await auth();
  const id = session.user.id;

  await db.admin.delete({ where: { id } });
  redirect("/admin/auth");
};
