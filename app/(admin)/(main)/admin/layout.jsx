// import { auth } from "@/auth";
import { Nav, NavLink } from '@/components/Nav';
import SignOutBtn from '@/components/SiginouBtn';

const AdminLayout = async ({ children }) => {
  // const session = await auth();
  return (
    <>
      <Nav>
        <h2>Asia Shop</h2>
        <div className='p-3'>
          <NavLink href='/admin'>Dashboard</NavLink>
          <NavLink href='/admin/products'>Products</NavLink>
          <NavLink href='/admin/customers'>Customers</NavLink>
          <NavLink href='/admin/sales'>Sales</NavLink>
        </div>
        <div className='flex'>
          <SignOutBtn>Signout</SignOutBtn>
        </div>
      </Nav>

      <div className='container my-2 mx-auto p-4'>
        {/* <h3 className="text-3xl p-4">{`Welcome ${session.user.username}`}</h3> */}
        {children}
      </div>
    </>
  );
};
export default AdminLayout;
