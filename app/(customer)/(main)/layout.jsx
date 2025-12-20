import { auth } from "@/auth";
import { Nav, NavLink } from "@/components/Nav";
import { CircleUserRound, ShoppingCart } from "lucide-react";
import Link from "next/link";

const AdminLayout = async ({ children }) => {
  const session = await auth();
  return (
    <>
      <Nav>
        <Link href="/">
          <h2>Asia Shop</h2>
        </Link>
        <div className="p-3">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/products">Products</NavLink>
          {session && (
            <>
              <NavLink href="/profile/orders">My Orders</NavLink>
              <NavLink href="/profile/cart">Shopping Cart</NavLink>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/profile/cart">
            <ShoppingCart />
          </Link>
          <Link href="/profile" className="">
            <CircleUserRound />
          </Link>
        </div>
      </Nav>

      <div>{children}</div>
    </>
  );
};
export default AdminLayout;
