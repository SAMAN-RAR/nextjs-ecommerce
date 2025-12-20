import { auth } from "@/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import SignOutBtn from "@/components/SiginouBtn";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import React from "react";
const AdminLoginPage = async ({ searchParams }) => {
  const params = await searchParams;
  const isLogin = params.auth === "login";

  const session = await auth();

  if (session) {
    return (
      <div className="flex justify-center py-14 px-6">
        <div className="flex flex-col items-stretch bg-slate-600 text-white gap-12 p-12 rounded-lg">
          <h3 className="text-2xl text-center">You are already logged in as</h3>
          <h2 className="text-3xl text-black font-bold">
            {session.user.username}
          </h2>
          <Button asChild variant="outline" className="bg-transparent py-6">
            <Link href="/admin">Go to Dashboard</Link>
          </Button>
          <SignOutBtn className="w-full bg-slate-800 py-7 text-lg hover:bg-gray-200 hover:text-black" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <AdminLoginForm isLogin={isLogin} />{" "}
    </div>
  );
};
export default AdminLoginPage;
