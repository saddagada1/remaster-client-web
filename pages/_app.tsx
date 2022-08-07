import { withUrqlClient } from "next-urql";
import type { AppProps } from "next/app";
import Layout from "../components/Layout/Layout";
import EditorProvider from "../contexts/Editor";
import "../styles/globals.css";
import { createUrqlClient } from "../utils/createUrqlClient";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <EditorProvider>
        <Component {...pageProps} />
      </EditorProvider>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient)(MyApp);
