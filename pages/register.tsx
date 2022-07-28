import { Field, Form, Formik, FormikHelpers } from "formik";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef } from "react";
import registerStyles from "../styles/Register.module.css";
import Typed from "typed.js";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import LoadingButton from "../components/Helpers/LoadingButton";

interface registerValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface registerProps {
}

const Register: NextPage<registerProps> = ({}) => {
  const registerFormRef = useRef(null);
  const el = useRef(null);
  const typed = useRef<Typed | null>(null);

  useEffect(() => {
    if (el.current) {
      typed.current = new Typed(el.current, {
        strings: ["aboard.", "aboard?"],
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

  const validateUsername = (value: string) => {
    let error;
    if (!value) {
      error = "required";
    } else if (value.length < 5) {
      error = "min 5 chars required";
    }
    return error;
  };

  const validateEmail = (value: string) => {
    let error;
    if (!value) {
      error = "required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "invalid email format";
    }
    return error;
  };

  const validatePassword = (value: string) => {
    let error;
    if (!value) {
      error = "required";
    } else if (value.length < 8) {
      error = "min 8 chars required";
    }
    return error;
  };

  const validateConfirmPassword = (value: string) => {
    let error;
    if (!value) {
      error = "required";
    } else if (
      registerFormRef.current &&
      registerFormRef.current["values"]["password"] !== value
    ) {
      error = "entries do not match";
    }
    return error;
  };

  // server
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <div className={registerStyles["register-page-root"]}>
      <Head>
        <title>Register</title>
      </Head>
      <div className={registerStyles["register-greeting-container"]}>
        <h1>
          welcome <br /> <span ref={el} />
        </h1>
      </div>
      <div className={registerStyles["register-form-container"]}>
        <Formik
          innerRef={registerFormRef}
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={async (
            values: registerValues,
            { setErrors }: FormikHelpers<registerValues>
          ) => {
            const request = {
              registerOptions: {
                username: values.username,
                email: values.email,
                password: values.password,
              },
            };
            const response = await register(request);
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
              typed?.current?.start();
            } else if (response.data?.register.user) {
              router.push("/");
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className={registerStyles["register-form-fc"]}>
              <h3>sign up.</h3>
              <div className={registerStyles["register-form-label-fc"]}>
                <label htmlFor="username">username</label>
                {errors.username && touched.username && (
                  <div className={registerStyles["register-form-error"]}>
                    {errors.username}
                  </div>
                )}
              </div>
              <Field
                className={registerStyles["register-form-field"]}
                placeholder="e.g. xs3-_-crafty"
                id="username"
                name="username"
                validate={validateUsername}
              />
              <div className={registerStyles["register-form-label-fc"]}>
                <label htmlFor="email">email</label>
                {errors.email && touched.email && (
                  <div className={registerStyles["register-form-error"]}>
                    {errors.email}
                  </div>
                )}
              </div>
              <Field
                className={registerStyles["register-form-field"]}
                id="email"
                name="email"
                placeholder="remaster@acme.ca"
                type="email"
                validate={validateEmail}
              />
              <div className={registerStyles["register-form-label-fc"]}>
                <label htmlFor="password">password</label>
                {errors.password && touched.password && (
                  <div className={registerStyles["register-form-error"]}>
                    {errors.password}
                  </div>
                )}
              </div>
              <Field
                className={registerStyles["register-form-field"]}
                placeholder="password"
                id="password"
                name="password"
                type="password"
                validate={validatePassword}
              />
              <div className={registerStyles["register-form-label-fc"]}>
                <label htmlFor="confirm password">confirm password</label>
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className={registerStyles["register-form-error"]}>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              <Field
                className={registerStyles["register-form-field"]}
                placeholder="confirm password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                validate={validateConfirmPassword}
              />
              <LoadingButton
                content="sign up"
                style="block"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
              <Link href="/login">
                <a>already registered? log in.</a>
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
