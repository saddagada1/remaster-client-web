import { useRouter } from "next/router";
import Head from "next/head";
import React, { useEffect } from "react";
import { WaveSpinner } from "react-spinners-kit";
import redirectStyles from "./Redirect.module.css";

interface RedirectProps {
  path: string;
  title: string;
}

const Redirect: React.FC<RedirectProps> = ({ path, title }) => {
  const router = useRouter();
  useEffect(() => {
    const redirect = setTimeout(() => {
      router.push(path);
    }, 3000);

    return () => {
      clearTimeout(redirect);
    }
  }, [router, path]);

  return (
    <div className={redirectStyles["redirect-root"]}>
       <Head>
        <title>{title}</title>
      </Head>
      <WaveSpinner size={3} color="#000" loading={true} sizeUnit="vmin" />
      <h1>invalid route. redirecting...</h1>
    </div>
  );
};
export default Redirect;
