import CustomerLoginForm from "@/components/customer/CustomerLoginForm";

import React from "react";
const CustomerLoginPage = async () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center bg-blue-100">
      <h2 className="text-4xl py-12 font-semibold">Welcome Again!</h2>
      <CustomerLoginForm />
    </div>
  );
};
export default CustomerLoginPage;
