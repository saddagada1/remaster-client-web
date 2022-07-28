import { Formik, Form, Field } from "formik";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import Typed from "typed.js";
import LoadingButton from "../../components/Helpers/LoadingButton";
import { useForgotPasswordMutation } from "../../generated/graphql";
import FPStyles from "../../styles/ForgotPassword.module.css";

interface emailValues {
  email: string;
}

const ForgotPassword: NextPage = () => {
  const el = useRef(null);
  const typed = useRef<Typed | null>(null);
  const [, forgotPassword] = useForgotPasswordMutation();
  const [formTouched, setFormTouched] = useState(false);

  useEffect(() => {
    if (el.current) {
      typed.current = new Typed(el.current, {
        strings: ["made."],
        typeSpeed: 150,
      });
    }

    return () => {
      typed?.current?.destroy();
    };
  }, []);

  const validateEmail = (value: string) => {
    let error;
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "invalid email format";
    }
    return error;
  };

  return (
    <div className={FPStyles["fp-page-root"]}>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <div className={FPStyles["fp-greeting-container"]}>
        <h1>
          mistakes <br /> <span ref={el} />
        </h1>
      </div>
      <div className={FPStyles["fp-form-container"]}>
        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={async (values: emailValues) => {
            const request = { email: values.email };
            await forgotPassword(request);
            setFormTouched(true);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className={FPStyles["fp-form-fc"]}>
              <h3>forgot password.</h3>
              <div className={FPStyles["fp-status-fc"]}>
                {isSubmitting ? (
                  <>
                    <h3>sending...</h3>
                  </>
                ) : !formTouched ? (
                  <></>
                ) : (
                  <div className={FPStyles["fp-status-success"]}>
                    <h3>
                      success. a reset link has been sent to
                      the provided address. if you do not receive an
                      email, please check the address and try again.
                    </h3>
                  </div>
                )}
              </div>
              <div className={FPStyles["fp-form-label-fc"]}>
                <label htmlFor="email">email</label>
                {errors.email && touched.email && (
                  <div className={FPStyles["fp-form-error"]}>
                    {errors.email}
                  </div>
                )}
              </div>
              <Field
                className={FPStyles["fp-form-field"]}
                id="email"
                name="email"
                placeholder="remaster@acme.ca"
                type="email"
                validate={validateEmail}
              />
              <LoadingButton
                content="send email"
                style="block"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
              <Link href="/login">
                <a>memories recovered? log in.</a>
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
