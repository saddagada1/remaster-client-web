import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import layoutStyles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [viewHeight, setViewHeight] = useState(0);
  const [viewWidth, setViewWidth] = useState(0);

  useEffect(() => {
    const setViewport = () => {
      setViewHeight(window.innerHeight);
      setViewWidth(window.innerWidth);
    };

    setViewport();

    window.addEventListener("resize", setViewport);

    return () => {
      window.removeEventListener("resize", setViewport);
    };
  }, []);

  return (
    <div
      className={layoutStyles["layout-root"]}
      style={{ height: viewHeight, width: viewWidth }}
    >
      <div className={layoutStyles["layout-background"]} />
      {!router.pathname.includes("editor/[id]") ? (
        <>
          <div className={layoutStyles["layout-sidebar-fc"]}>
            <Sidebar />
          </div>
          <div className={layoutStyles["layout-content-fc"]}>
            <div className={layoutStyles["layout-header-fc"]}>
              <Header />
            </div>
            <main className={layoutStyles["layout-main-fc"]}>{children}</main>
            <div className={layoutStyles["layout-footer-fc"]}>
              <Footer />
            </div>
          </div>
        </>
      ) : (
        <main className={layoutStyles["layout-main-fc"]}>{children}</main>
      )}
    </div>
  );
};

export default Layout;
