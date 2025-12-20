import { Loader2 } from "lucide-react";

const AdminLoading = () => {
  return (
    <div className="conatiner w-screen h-[80vh] flex justify-center items-center">
      <Loader2 className="size-24 animate-spin" />
    </div>
  );
};
export default AdminLoading;
