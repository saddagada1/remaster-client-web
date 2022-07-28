import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import searchInputStyles from "./SearchInput.module.css";

interface SearchInputProps {}

interface queryValues {
  query: string;
}

const SearchInput: React.FC<SearchInputProps> = ({}) => {
  const router = useRouter();
  const [initialValue, setInitialValue] = useState("");

  const validateQuery = (value: string) => {
    let error;
    if (!value) {
      error = "required";
    }
    return error;
  };

  useEffect(() => {
    if (router.query.q) {
      setInitialValue(router.query.q as string);
    }
    else {
      setInitialValue("");
    }
  }, [router.query.q])
  

  return (
    <div className={searchInputStyles["search-input-root"]}>
      <div className={searchInputStyles["search-input-label-fc"]}>
        <p>search</p>
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          query: initialValue,
        }}
        onSubmit={async (values: queryValues) => {
          router.push(`/search?q=${values.query}&c=${router.query.c ? router.query.c : "0"}`);
          values.query = ""
        }}
      >
        {({ isSubmitting }) => (
          <Form className={searchInputStyles["search-input-form-fc"]}>
            <Field
              className={searchInputStyles["search-input-form-field"]}
              id="query"
              name="query"
              type="text"
              validate={validateQuery}
            />
            <button
              className={searchInputStyles["search-input-form-button"]}
              type="submit"
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default SearchInput;
