import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { isServer } from "../../utils/isServer";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import layoutStyles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isWindow, setIsWindow] = useState(false);
  const [viewHeight, setViewHeight] = useState(0);
  const [viewWidth, setViewWidth] = useState(0);

  const setViewport = () => {
    setViewHeight(window.innerHeight);
    setViewWidth(window.innerWidth);
  };

  useEffect(() => {
    if (!isServer()) {
      setIsWindow(true);
    }

    if (isWindow) {
      if (window.matchMedia("(orientation: portrait)").matches || window.innerWidth < 1000) {
        setViewport();
      }
    }
  }, [isWindow]);

  return (
    <div
      className={layoutStyles["layout-root"]}
      style={{ height: viewHeight ? viewHeight : "100vh", width: viewWidth ? viewWidth : "100vw" }}
    >
      <Head>
        <meta content={`width=${viewWidth ? viewWidth : "device-width"}, height=${viewHeight ? viewHeight : "device-height"} initial-scale=1, shrink-to-fit=no`} name="viewport"/>
      </Head>
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
