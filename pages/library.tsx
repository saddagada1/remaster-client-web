import type { NextPage } from "next";
import Head from "next/head";
import libraryStyles from "../styles/Library.module.css";

const Library: NextPage = () => {
  return (
    <div className={libraryStyles["library-page-root"]}>
      <Head>
        <title>library</title>
      </Head>
      library
    </div>
  );
};

export default Library;
