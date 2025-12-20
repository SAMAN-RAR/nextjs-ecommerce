"use client";

import { userSignin } from "@/app/_actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";

const CustomerLoginForm = () => {
  const [error, action] = useActionState(userSignin, {});

  return (
    <form
      action={action}
      className="flex flex-col bg-slate-600 text-white gap-8 p-12 py-6 rounded-lg"
    >
      <h1 className="text-3xl text-center pt-4">Please enter your email</h1>
      <div className="flex flex-col gap-1.5">
        <Input type="email" name="email" required />
      </div>
      <Button type="submit" className="bg-slate-800 cursor-pointer">
        Submit
      </Button>
    </form>
  );
};

export default CustomerLoginForm;
