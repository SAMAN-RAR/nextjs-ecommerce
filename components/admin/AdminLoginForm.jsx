"use client";

import { AdminLogin, AdminSignup } from "@/app/_actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

const AdminLoginForm = ({ isLogin }) => {
  const [error, action] = useActionState(
    isLogin ? AdminLogin : AdminSignup,
    {}
  );

  return (
    <form
      action={action}
      className="flex flex-col bg-slate-600 text-white gap-8 p-4 rounded-lg w-[60%]"
    >
      <h1 className="text-3xl text-center py-6">
        {isLogin ? "Login to your dashboard" : "Signup to admins"}
      </h1>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">Username</Label>
        <Input type="text" name="username" id="username" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" name="password" id="password" />
      </div>
      <Button type="submit" className="bg-slate-800">
        {isLogin ? "Login" : "Signup"}
      </Button>
      <div>
        {error?.isUsernameRepetitive && (
          <div className="text-black flex gap-2 items-center mb-4">
            <CircleAlert className="stroke-destructive" />
            {`${error.username} is already signed up please login`}
          </div>
        )}
        {isLogin ? (
          <Link href="/admin/auth?auth=signup">New to site? Signup</Link>
        ) : (
          <Link href="/admin/auth?auth=login">Already signed up? login</Link>
        )}
      </div>
    </form>
  );
};

export default AdminLoginForm;
