import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { getErrorMessage } from "../../utils/form";
import { Box, FormField, TextInput, Form } from "grommet";
import { Close } from "grommet-icons";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";
import { formatSearchString } from "../../utils/helpers";

import styles from "./gifSearch.module.css";

const DEBOUNCE_TIME_MS = 100;

export default function GifSearch(props) {
  const router = useRouter();
  const searchRef = useRef();

  const defaultValue = {
    search: props.search || "",
  };

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  useDebouncedEffect(handleValueUpdate, DEBOUNCE_TIME_MS, [value]);

  function handleValueUpdate() {
    if (defaultValue.search === value.search) {
      return;
    } else if (!value.search) {
      props.refreshGifs();
      router.push({ query: null });
    } else {
      searchGifs(value.search);
      router.push({ query: { search: value.search } });
    }
  }

  function searchGifs(value) {
    try {
      const search = formatSearchString(value);

      props.refreshGifs({ variables: { search } });
    } catch (error) {
      props.setError({ message: getErrorMessage(error) });
    }
  }

  function handleChange(nextValue) {
    setValue(nextValue);
  }

  function handleClickClose(event) {
    handleChange({ ...value, search: "" });
    searchRef.current.focus();
  }

  return (
    <Form value={value} onChange={handleChange}>
      <Box direction="row" pad={{ bottom: "medium" }}>
        <FormField
          name="search"
          htmlFor="search-input-id"
          className={styles.inputContainer}
        >
          <TextInput
            htmlFor="search-input-id"
            name="search"
            placeholder="Search..."
            ref={searchRef}
          />

          <Close
            size="small"
            className={styles.close}
            onClick={handleClickClose}
          />
        </FormField>
      </Box>
    </Form>
  );
}
