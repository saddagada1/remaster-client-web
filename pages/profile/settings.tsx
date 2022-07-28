import {
  faSquareCheck,
  faSquareXmark,
  faFloppyDisk,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Form, Formik, FormikHelpers } from "formik";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import RequireAuth from "../../components/Auth/RequireAuth";
import LoadingButton from "../../components/Helpers/LoadingButton";
import {
  useChangeEmailMutation,
  useChangePasswordMutation,
  useChangeUsernameMutation,
  useLogoutMutation,
  useMeQuery,
  useSendVerifyEmailMutation,
} from "../../generated/graphql";
import profileSettingsStyles from "../../styles/Profile.module.css";
import { toErrorMap } from "../../utils/toErrorMap";

interface emailValues {
  newEmail: string;
}

interface usernameValues {
  newUsername: string;
}

interface passwordValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const Settings: NextPage = () => {
  const [{ data }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [, changeEmail] = useChangeEmailMutation();
  const [, changeUsername] = useChangeUsernameMutation();
  const [, changePassword] = useChangePasswordMutation();
  const [{ fetching: emailFetching }, sendVerifyEmail] =
    useSendVerifyEmailMutation();
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);
  const settingsFormRef = useRef(null);
  const router = useRouter();

  const validateEmail = (value: string) => {
    let error;
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "invalid email format";
    }
    return error;
  };

  const validateUsername = (value: string) => {
    let error;
    if (value.length < 5) {
      error = "min 5 chars required";
    }
    return error;
  };

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
      settingsFormRef.current &&
      settingsFormRef.current["values"]["newPassword"] !== value
    ) {
      error = "entries do not match";
    }
    return error;
  };

  return (
    <RequireAuth>
      <div className={profileSettingsStyles["profile-settings-page-root"]}>
        <Head>
          <title>Profile</title>
        </Head>
        <div className={profileSettingsStyles["profile-settings-greeting-fc"]}>
          <h1>settings</h1>
        </div>
        <div className={profileSettingsStyles["profile-settings-options-fc"]}>
          <div
            className={profileSettingsStyles["profile-settings-category-fc"]}
          >
            <h5>general</h5>
            <hr />
            <Formik
              initialValues={{
                newEmail: "",
              }}
              onSubmit={async (
                values: emailValues,
                { setErrors }: FormikHelpers<emailValues>
              ) => {
                setTouched(true);
                setSubmitting(true);
                const request = {
                  newEmail: values.newEmail,
                };
                const response = await changeEmail(request);
                if (response.data?.changeEmail.errors) {
                  setErrors(toErrorMap(response.data.changeEmail.errors));
                  setSubmitting(false);
                  setSubmitStatus(false);
                } else if (response.data?.changeEmail.user) {
                  console.log(response.data?.changeEmail.user);
                  setSubmitting(false);
                  setSubmitStatus(true);
                  values.newEmail = "";
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form
                  className={profileSettingsStyles["profile-settings-form-fc"]}
                >
                  <div
                    className={
                      profileSettingsStyles["profile-settings-form-label-fc"]
                    }
                  >
                    <label htmlFor="email">email</label>
                    {errors.newEmail && touched.newEmail && (
                      <div
                        className={
                          profileSettingsStyles["profile-settings-form-error"]
                        }
                      >
                        {errors.newEmail}
                      </div>
                    )}
                  </div>

                  <div
                    className={
                      profileSettingsStyles["profile-settings-form-input-fc"]
                    }
                  >
                    <Field
                      className={
                        profileSettingsStyles["profile-settings-form-field"]
                      }
                      id="newEmail"
                      name="newEmail"
                      placeholder={data?.me?.email}
                      type="email"
                      validate={validateEmail}
                    />
                    <LoadingButton
                      content="update"
                      style="inline"
                      loading={isSubmitting}
                      disabled={submitting}
                    />
                  </div>
                </Form>
              )}
            </Formik>

            <Formik
              initialValues={{
                newUsername: "",
              }}
              onSubmit={async (
                values: usernameValues,
                { setErrors }: FormikHelpers<usernameValues>
              ) => {
                setTouched(true);
                setSubmitting(true);
                const request = {
                  newUsername: values.newUsername,
                };
                const response = await changeUsername(request);
                if (response.data?.changeUsername.errors) {
                  setErrors(toErrorMap(response.data.changeUsername.errors));
                  setSubmitting(false);
                  setSubmitStatus(false);
                } else if (response.data?.changeUsername.user) {
                  setSubmitting(false);
                  setSubmitStatus(true);
                  values.newUsername = "";
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form
                  className={profileSettingsStyles["profile-settings-form-fc"]}
                >
                  <div
                    className={
                      profileSettingsStyles["profile-settings-form-label-fc"]
                    }
                  >
                    <label htmlFor="username">username</label>
                    {errors.newUsername && touched.newUsername && (
                      <div
                        className={
                          profileSettingsStyles["profile-settings-form-error"]
                        }
                      >
                        {errors.newUsername}
                      </div>
                    )}
                  </div>

                  <div
                    className={
                      profileSettingsStyles["profile-settings-form-input-fc"]
                    }
                  >
                    <Field
                      className={
                        profileSettingsStyles["profile-settings-form-field"]
                      }
                      id="newUsername"
                      name="newUsername"
                      placeholder={data?.me?.username}
                      type="username"
                      validate={validateUsername}
                    />
                    <LoadingButton
                      content="update"
                      style="inline"
                      loading={isSubmitting}
                      disabled={submitting}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div
            className={profileSettingsStyles["profile-settings-category-fc"]}
          >
            <h5>security</h5>
            <hr />
            <Formik
              innerRef={settingsFormRef}
              initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              }}
              onSubmit={async (
                values: passwordValues,
                { setErrors }: FormikHelpers<passwordValues>
              ) => {
                setTouched(true);
                setSubmitting(true);
                const request = {
                  changePasswordOptions: {
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                  },
                };
                const response = await changePassword(request);
                if (response.data?.changePassword.errors) {
                  setErrors(toErrorMap(response.data.changePassword.errors));
                  setSubmitting(false);
                  setSubmitStatus(false);
                } else if (response.data?.changePassword.user) {
                  setSubmitting(false);
                  setSubmitStatus(true);
                  values.newPassword = "";
                  values.confirmNewPassword = "";
                  values.oldPassword = "";
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form
                  className={profileSettingsStyles["profile-settings-form-fc"]}
                >
                  <div
                    className={
                      profileSettingsStyles["profile-settings-form-label-fc"]
                    }
                  >
                    <label htmlFor="new password">new password</label>
                    {errors.newPassword && touched.newPassword && (
                      <div
                        className={
                          profileSettingsStyles["profile-settings-form-error"]
                        }
                      >
                        {errors.newPassword}
                      </div>
                    )}
                  </div>

                  <div
                    className={
                      profileSettingsStyles["profile-settings-form-input-fc"]
                    }
                  >
                    <Field
                      className={
                        profileSettingsStyles["profile-settings-form-field"]
                      }
                      placeholder="new password"
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      validate={validatePassword}
                    />
                  </div>
                  <div
                    className={
                      profileSettingsStyles["profile-settings-form-label-fc"]
                    }
                  >
                    <label htmlFor="confirm new password">
                      confirm new password
                    </label>
                    {errors.confirmNewPassword &&
                      touched.confirmNewPassword && (
                        <div
                          className={
                            profileSettingsStyles["profile-settings-form-error"]
                          }
                        >
                          {errors.confirmNewPassword}
                        </div>
                      )}
                  </div>

                  <div
                    className={
                      profileSettingsStyles["profile-settings-form-input-fc"]
                    }
                  >
                    <Field
                      className={
                        profileSettingsStyles["profile-settings-form-field"]
                      }
                      placeholder="confirm new password"
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type="password"
                      validate={validateConfirmPassword}
                    />
                  </div>
                  <div
                    className={
                      profileSettingsStyles["profile-settings-form-label-fc"]
                    }
                  >
                    <label htmlFor="old password">old password</label>
                    {errors.oldPassword && touched.oldPassword && (
                      <div
                        className={
                          profileSettingsStyles["profile-settings-form-error"]
                        }
                      >
                        {errors.oldPassword}
                      </div>
                    )}
                  </div>

                  <div
                    className={
                      profileSettingsStyles["profile-settings-form-input-fc"]
                    }
                  >
                    <Field
                      className={
                        profileSettingsStyles["profile-settings-form-field"]
                      }
                      placeholder="old password"
                      id="oldPassword"
                      name="oldPassword"
                      type="password"
                    />
                    <LoadingButton
                      content="update"
                      style="inline"
                      loading={isSubmitting}
                      disabled={submitting}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className={profileSettingsStyles["profile-settings-footer-fc"]}>
          <div className={profileSettingsStyles["profile-settings-alerts-fc"]}>
            {data?.me?.verified ? (
              <div
                className={
                  profileSettingsStyles["profile-settings-verification-fc"]
                }
              >
                <FontAwesomeIcon icon={faSquareCheck} />
                <h3>verified</h3>
              </div>
            ) : (
              <div
                className={
                  profileSettingsStyles["profile-settings-verification-fc"]
                }
              >
                <FontAwesomeIcon icon={faTriangleExclamation} />
                <h3>
                  please verify your email address.{" "}
                  <button
                    disabled={emailFetching}
                    onClick={async () => {
                      setTouched(true);
                      setSubmitting(true);
                      const response = await sendVerifyEmail();
                      if (!response.data?.sendVerifyEmail) {
                        setSubmitting(false);
                        setSubmitStatus(false);
                      } else {
                        setSubmitting(false);
                        setSubmitStatus(true);
                      }
                    }}
                  >
                    resend email.
                  </button>
                </h3>
              </div>
            )}
            <div
              className={profileSettingsStyles["profile-settings-status-fc"]}
            >
              {submitting ? (
                <>
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  <h3>saving...</h3>
                </>
              ) : !touched ? (
                <>
                  <FontAwesomeIcon icon={faSquareCheck} />
                  <h3>no changes to be applied</h3>
                </>
              ) : submitStatus ? (
                <div
                  className={
                    profileSettingsStyles["profile-settings-status-success"]
                  }
                >
                  <FontAwesomeIcon icon={faSquareCheck} />
                  <h3>successfully applied changes</h3>
                </div>
              ) : (
                <div
                  className={
                    profileSettingsStyles["profile-settings-status-error"]
                  }
                >
                  <FontAwesomeIcon icon={faSquareXmark} />
                  <h3>something went wrong</h3>
                </div>
              )}
            </div>
          </div>
          <button
            className={profileSettingsStyles["profile-settings-logout"]}
            onClick={() => {
              logout();
              router.push("/");
            }}
            disabled={logoutFetching}
          >
            logout
          </button>
        </div>
      </div>
    </RequireAuth>
  );
};

export default Settings;
