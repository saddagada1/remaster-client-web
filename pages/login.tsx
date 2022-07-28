import { Field, Form, Formik, FormikHelpers } from "formik";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef} from "react";
import Typed from "typed.js";
import LoadingButton from "../components/Helpers/LoadingButton";
import { useLoginMutation } from "../generated/graphql";
import loginStyles from "../styles/Login.module.css";
import { toErrorMap } from "../utils/toErrorMap";

interface loginValues {
  email: string;
  password: string;
}
interface loginProps {}

const Login: NextPage<loginProps> = ({}) => {
  const el = useRef(null);
  const typed = useRef<Typed|null>(null);

  useEffect(() => {
    if (el.current) {
      typed.current = new Typed(el.current, {
        strings: ["back.", "back?"],
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

  const validateEmail = (value: string) => {
    let error;
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "invalid email format";
    }
    return error;
  };
  
  //server
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <div className={loginStyles["login-page-root"]}>
      <Head>
        <title>Login</title>
      </Head>
      <div className={loginStyles["login-greeting-container"]}>
        <h1>
          welcome <br /> <span ref={el} />
        </h1>
      </div>
      <div className={loginStyles["login-form-container"]}>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={async (
            values: loginValues,
            { setErrors }: FormikHelpers<loginValues>
          ) => {
            const request = { loginOptions: values };
            const response = await login(request);
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
              typed?.current?.start();
            } else if (response.data?.login.user) {
              router.push("/");
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className={loginStyles["login-form-fc"]}>
              <h3>log in.</h3>
              <div className={loginStyles["login-form-label-fc"]}>
                <label htmlFor="email">email</label>
                {errors.email && touched.email && (
                  <div className={loginStyles["login-form-error"]}>
                    {errors.email}
                  </div>
                )}
              </div>
              <Field
                className={loginStyles["login-form-field"]}
                id="email"
                name="email"
                placeholder="remaster@acme.ca"
                type="email"
                validate={validateEmail}
              />
              <div className={loginStyles["login-form-label-fc"]}>
                <label htmlFor="password">password</label>
                {errors.password && touched.password && (
                  <div className={loginStyles["login-form-error"]}>
                    {errors.password}
                  </div>
                )}
              </div>
              <Field
                className={loginStyles["login-form-field"]}
                placeholder="password"
                id="password"
                name="password"
                type="password"
              />
              <Link href="/forgot-password">
                <a>forgot password?</a>
              </Link>
              <LoadingButton
                content="log in"
                style="block"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
              <Link href="/register">
                <a>not registered? sign up.</a>
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
