import { Formik, FormikHelpers, Form, Field } from "formik";
import type { NextPage } from "next";
import Head from "next/head";
import router from "next/router";
import RequireAuth from "../../components/Auth/RequireAuth";
import LoadingButton from "../../components/Helpers/LoadingButton";
import editorNewStyles from "../../styles/Editor.module.css";

interface editorNewProps {}

interface createRemasterValues {
  name: string;
  playbackURL: string;
  trackId: string;
}

const EditorNew: NextPage<editorNewProps> = ({}) => {
  return (
    <RequireAuth>
      <div className={editorNewStyles["editor-new-page-root"]}>
        <Head>
          <title>Editor</title>
        </Head>
        <Formik
          initialValues={{
            name: "",
            playbackURL: "",
            trackId: ""
          }}
          onSubmit={async (
            values: createRemasterValues,
            { setErrors }: FormikHelpers<createRemasterValues>
          ) => {}}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className={editorNewStyles["editor-new-form-fc"]}>
              <Field
                className={editorNewStyles["editor-new-form-field-main"]}
                id="name"
                name="name"
                placeholder="untitled remaster"
              />
              <div className={editorNewStyles["editor-new-form-label-fc"]}>
                <label htmlFor="playbackURL">url</label>
                <Field
                  className={editorNewStyles["editor-new-form-field"]}
                  placeholder="a url from Youtube, Vimeo, Google Drive ..."
                  id="playbackURL"
                  name="playbackURL"
                />
              </div>
              <div className={editorNewStyles["editor-new-form-label-fc"]}>
                <label htmlFor="trackId">track</label>
                <Field
                  className={editorNewStyles["editor-new-form-field"]}
                  placeholder="select a track or choose custom"
                  id="trackId"
                  name="trackId"
                />
              </div>
              
              <div className={editorNewStyles["editor-new-form-errors"]}>
              {errors.name && touched.name && (
                <div className={editorNewStyles["editor-new-form-error"]}>
                  {errors.name}
                </div>
              )}
              {errors.playbackURL && touched.playbackURL && (
                <div className={editorNewStyles["editor-new-form-error"]}>
                  {errors.playbackURL} 
                </div>
              )}
              </div>
              <div onClick={() => router.push('/editor/' + router.query.track)} className={editorNewStyles["editor-new-form-button"]}>
                <LoadingButton
                  content="create"
                  style="block"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </RequireAuth>
  );
};
export default EditorNew;
