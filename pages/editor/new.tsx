import { Formik, FormikHelpers, Form, Field } from "formik";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RequireAuth from "../../components/Auth/RequireAuth";
import LoadingButton from "../../components/Helpers/LoadingButton";
import { useSpotifySearchQuery } from "../../generated/graphql";
import editorNewStyles from "../../styles/Editor.module.css";
import { keyColourReference } from "../reference";

interface editorNewProps {}

interface createRemasterValues {
  name: string;
  playbackURL: string;
}

const EditorNew: NextPage<editorNewProps> = ({}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [executeQuery, setExecuteQuery] = useState(true);
  const [{data: SpotifyData}] =  useSpotifySearchQuery({variables: {query: query}, pause: executeQuery});
  const [trackID, setTrackID] = useState(router.query.track ? router.query.track : "");
  const [key, setKey] = useState("C");
  const [tuning, setTuning] = useState(["", "", "", "", "", ""]);

  const handleTuningChange = (value: string, targetIndex: number) => {
    const alphabet =
      "A B C D E F G a b c d e f g A# C# D# F# G# a# c# d# f# g# Ab Bb Db Eb Gb ab bb db eb gb";

    if (alphabet.includes(value)) {
      const newTuning = tuning.map((note, index) => {
        if (targetIndex === index) {
          if (value.length > 1 && value.slice(-1) === "b") {
            return value.charAt(0).toUpperCase() + value.slice(1);
          }
          return value.toUpperCase();
        }

        return note;
      });

      setTuning(newTuning);
    }
  };

  const validateName = (value: string) => {
    let error;
    if (!value) {
      error = "required";
    }
    return error;
  };

  const validateURL = (value: string) => {
    let error;
    if (!value) {
      error = "required";
    } else if (!value.toLowerCase().includes("youtube" || "soundcloud" || "vimeo")) {
      error = "invalid url"
    }
    return error;
  };

  useEffect(() => {
    
  }, [])
  
  return (
    <div className={editorNewStyles["editor-new-page-root"]}>
      <Head>
        <title>Editor</title>
      </Head>
      <div className={editorNewStyles["editor-new-greeting-fc"]}>
        <h1>create.</h1>
      </div>
      <Formik
        initialValues={{
          name: "",
          playbackURL: "",
        }}
        onSubmit={async (
          values: createRemasterValues,
          { setErrors }: FormikHelpers<createRemasterValues>
        ) => {}}
      >
        {({ errors, touched, isSubmitting }) => (
          <>
            <Form className={editorNewStyles["editor-new-form-fc"]}>
              <div className={editorNewStyles["editor-new-form-section"]}>
                <div className={editorNewStyles["editor-new-form-label-fc"]}>
                  <label htmlFor="name">name</label>
                  {errors.name && touched.name && (
                    <div className={editorNewStyles["editor-new-form-error"]}>
                      {errors.name}
                    </div>
                  )}
                </div>
                <Field
                  className={editorNewStyles["editor-new-form-field"]}
                  id="name"
                  name="name"
                  placeholder="name"
                  validate={validateName}
                />
                <div className={editorNewStyles["editor-new-form-label-fc"]}>
                  <label htmlFor="trackId">track</label>
                </div>
                <input
                  className={editorNewStyles["editor-new-form-field"]}
                  placeholder="select a track or choose custom"
                  value={query}
                  onChange={(e) => setQuery(e.currentTarget.value)}
                />
                <div className={editorNewStyles["editor-new-form-label-fc"]}>
                  <label htmlFor="playbackURL">url</label>
                  {errors.playbackURL && touched.playbackURL && (
                    <div className={editorNewStyles["editor-new-form-error"]}>
                      {errors.playbackURL}
                    </div>
                  )}
                </div>
                <Field
                  className={editorNewStyles["editor-new-form-field"]}
                  placeholder="a url from Youtube, Soundcloud or Vimeo"
                  id="playbackURL"
                  name="playbackURL"
                  validate={validateURL}
                />
              </div>
              <div className={editorNewStyles["editor-new-form-section"]}>
                <div className={editorNewStyles["editor-new-form-label-fc"]}>
                  <label htmlFor="key">key</label>
                </div>
                <select
                  className={editorNewStyles["editor-new-form-select"]}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                >
                  {Object.keys(keyColourReference).map(
                    (key: string, index: number) => (
                      <option key={index} value={key}>
                        {key}
                      </option>
                    )
                  )}
                </select>
                <div className={editorNewStyles["editor-new-form-label-fc"]}>
                  <label htmlFor="tuning">tuning</label>
                </div>
                <div className={editorNewStyles["editor-new-tuning-inputs-fc"]}>
                  {Array(6)
                    .fill(null)
                    .map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={2}
                        value={tuning[index]}
                        className={editorNewStyles["editor-new-tuning-input"]}
                        onChange={(e) =>
                          handleTuningChange(e.currentTarget.value, index)
                        }
                        placeholder={(6 - index).toString()}
                      />
                    ))}
                </div>
              </div>
            </Form>
            <div
              onClick={() => router.push("/editor/" + router.query.track)}
              className={editorNewStyles["editor-new-form-button"]}
            >
              <LoadingButton
                content="create"
                style="block"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};
export default EditorNew;
