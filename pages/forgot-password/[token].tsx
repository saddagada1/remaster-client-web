import { Formik, FormikHelpers, Form, Field } from "formik";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Typed from "typed.js";
import LoadingButton from "../../components/Helpers/LoadingButton";
import { useChangeForgotPasswordMutation } from "../../generated/graphql";
import FPRecoveryStyles from "../../styles/ForgotPassword.module.css";
import { toErrorMap } from "../../utils/toErrorMap";

interface FPRecoveryProps {
  token: string;
}

interface recoverPasswordValues {
  newPassword: string;
  confirmPassword: string;
}

const ForgotPasswordRecovery: NextPage<FPRecoveryProps> = ({ token }) => {
  const [, changeForgotPassword] = useChangeForgotPasswordMutation();
  const fpFormRef = useRef(null);
  const el = useRef(null);
  const typed = useRef<Typed|null>(null);
  const router = useRouter();

  useEffect(() => {
    if (el.current) {
      typed.current = new Typed(el.current, {
        strings: ["solved.", "solved?"],
        typeSpeed: 150,
        backSpeed: 150,
        smartBackspace: true,
        onStringTyped: () => {
          typed?.current?.stop();
        },
      });
    }

    return () => {
      typed?.current?.destroy();
    };
  }, []);

  const validatePassword = (value: string) => {
    let error;
    if (value.length < 8) {
      error = "min 8 chars required";
    }
    return error;
  };

  const validateConfirmPassword = (value: string) => {
    let error;
    if (
      fpFormRef.current &&
      fpFormRef.current["values"]["newPassword"] !== value
    ) {
      error = "entries do not match";
    }
    return error;
  };

  return (
    <div className={FPRecoveryStyles["fp-page-root"]}>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <div className={FPRecoveryStyles["fp-greeting-container"]}>
        <h1>
          problem <br /> <span ref={el} />
        </h1>
      </div>
      <div className={FPRecoveryStyles["fp-form-container"]}>
        <Formik
          innerRef={fpFormRef}
          initialValues={{
            newPassword: "",
            confirmPassword: "",
          }}
          onSubmit={async (
            values: recoverPasswordValues,
            { setErrors }: FormikHelpers<recoverPasswordValues>
          ) => {
              const request = {
                changeFpOptions: {
                  token: token,
                  newPassword: values.newPassword,
                },
              };
              const response = await changeForgotPassword(request);
              if (response.data?.changeForgotPassword.errors) {
                setErrors(toErrorMap(response.data.changeForgotPassword.errors));
                typed?.current?.start();
              } else if (response.data?.changeForgotPassword.user) {
                router.push("/");
              }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className={FPRecoveryStyles["fp-form-fc"]}>
              <h3>user recovery.</h3>
              <div className={FPRecoveryStyles["fp-form-label-fc"]}>
                <label htmlFor="new password">new password</label>
                {errors.newPassword && touched.newPassword && (
                  <div className={FPRecoveryStyles["fp-form-error"]}>
                    {errors.newPassword}
                  </div>
                )}
              </div>
              <Field
                className={FPRecoveryStyles["fp-form-field"]}
                placeholder="new password"
                id="newPassword"
                name="newPassword"
                type="password"
                validate={validatePassword}
              />
              <div className={FPRecoveryStyles["fp-form-label-fc"]}>
                <label htmlFor="confirm new password">
                  confirm password
                </label>
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className={FPRecoveryStyles["fp-form-error"]}>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              <Field
                className={FPRecoveryStyles["fp-form-field"]}
                placeholder="confirm password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                validate={validateConfirmPassword}
              />
              <LoadingButton
                content="update"
                style="block"
                disabled={isSubmitting}
                loading={isSubmitting}
              />
              <Link href="/forgot-password">
                <a>token expired? get a new one.</a>
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

ForgotPasswordRecovery.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ForgotPasswordRecovery;
