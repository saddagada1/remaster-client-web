import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { WaveSpinner } from "react-spinners-kit";
import { useVerifyEmailMutation } from "../../generated/graphql";
import ECValidateStyles from "../../styles/EmailConfirmation.module.css";

interface emailConfirmProps {
  token: string;
}

const EmailConfirmationValidate: NextPage<emailConfirmProps> = ({ token }) => {
  const [, verifyEmail] = useVerifyEmailMutation();
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const confirmToken = async () => {
      setFetching(true);
      const response = await verifyEmail({ token: token });
      if (response.data?.verifyEmail.errors) {
        setStatus(false);
        setFetching(false);
        if (response.data.verifyEmail.errors[0].field == "token") {
          setStatusMessage(
            "your confirmation link has expired. please request a new link from your profile settings page. redirecting now..."
          );
          setTimeout(() => {
            router.push("/profile/settings");
          }, 8000);
        } 
      } else if (response.data?.verifyEmail.user) {
        setStatus(true);
        setFetching(false);
        setStatusMessage(
          "thank you. successfully confirmed your email address. redirecting home..."
        );
        setTimeout(() => {
          router.push("/");
        }, 8000);
      }
    };
    confirmToken();
  }, [token, verifyEmail, router]);

  return (
    <div className={ECValidateStyles["ec-page-root"]}>
      <Head>
        <title>Email Confirmation</title>
      </Head>
      {fetching ? (
        <h1>confirming...</h1>
      ) : (
        <>
          <WaveSpinner size={3} color="#000" loading={true} sizeUnit="vmin"/>
          <div
            className={
              ECValidateStyles[status ? "ec-status-success" : "ec-status-error"]
            }
          >
            <h1>{statusMessage}</h1>
          </div>
        </>
      )}
    </div>
  );
};

EmailConfirmationValidate.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default EmailConfirmationValidate;
