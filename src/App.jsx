import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./layout/navbar";
import Footer from "./layout/footer";

import Word from "./layout/word";
import Home from "./layout/home";
import Test from "./layout/test";
import Attractions from "./layout/attractions";
import Cafepage from "./layout/cafepage";
import ViewPointPage from "./layout/viewpoint";
import Staypage from "./layout/staypage";
import CafeDetail from "./layout/cafes";
import StayDetail from "./layout/stays";
import ContactUsPage from "./layout/contact";

import HomeAdmin from "./layout/admin/home_admin";
import NavbarAdmin from "./layout/admin/navbar_admin";
import FooterAdmin from "./layout/admin/footer_admin";
import AttractionAdmin from "./layout/admin/attractions_admin";
import ViewPointPageAdmin from "./layout/admin/viewpoint_admin";
import CafeDetailAdmin from "./layout/admin/cafes_admin";
import CafepageAdmin from "./layout/admin/cafepage_admin";
import StayDetailAdmin from "./layout/admin/stays_admin";
import StaypageAdmin from "./layout/admin/staypage_admin";



const Layout = ({ children }) => {
  const location = useLocation();

  // ซ่อน Navbar และ Footer เฉพาะหน้า /
  const hideLayout = location.pathname === "/";
  const isAdminPage = location.pathname.endsWith("admin");;

  return (
    <>
      {/* แสดง Navbar และ Footer เฉพาะถ้าไม่ใช่หน้าแรก */}
      {!hideLayout && (isAdminPage ? <NavbarAdmin /> : <Navbar />)}
      <main className="min-h-screen">{children}</main>
      {!hideLayout && (isAdminPage ? <FooterAdmin /> : <Footer />)}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Word />} />
          <Route path="/test" element={<Test />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/viewpoint/:locationId" element={<ViewPointPage />} />
          <Route path="/cafepage" element={<Cafepage />} />
          <Route path="/staypage" element={<Staypage />} />
          <Route path="/cafes" element={<CafeDetail />} />
          <Route path="/stays" element={<StayDetail />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/homeadmin" element={<HomeAdmin />} />
          <Route path="/attractionadmin" element={<AttractionAdmin/>} />
          <Route path="/cafepageadmin" element={<CafepageAdmin />} />
          <Route path="/staypageadmin" element={<StaypageAdmin />} />
          <Route path="/viewpointadmin" element={<ViewPointPageAdmin />} />
          <Route path="/cafeadmin" element={<CafeDetailAdmin />} />
          <Route path="/stayadmin" element={<StayDetailAdmin />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
