import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Header from "./nav/Header";
import SideNavbar from "./nav/SideNavbar";
import useAuth from "../hooks/useAuth";

const Layout = () => {
  const { auth } = useAuth();

  return (
    <main className="App">
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} hideProgressBar={true} limit={1} autoClose={3000}/>
      <Header/>
      <div className='main-container'>
        {auth?.user ? <SideNavbar /> : <></>}
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
