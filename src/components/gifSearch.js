import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { getErrorMessage } from "../../utils/form";
import { Box, FormField, TextInput, Form } from "grommet";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";

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

  useDebouncedEffect(handleValueUpdate, 500, [value]);

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
      // Modify search field to satisfy postgres' to_tsquery() syntax
      const search = value.replace(/\s/g, " | ");

      props.refreshGifs({ variables: { search } });
    } catch (error) {
      props.setError({ message: getErrorMessage(error) });
    }
  }

  function handleChange(nextValue) {
    setValue(nextValue);
  }

  return (
    <Form value={value} onChange={handleChange}>
      <Box direction="row" pad={{ bottom: "medium" }}>
        <FormField
          name="search"
          htmlFor="search-input-id"
          style={{ width: "100%" }}
        >
          <TextInput
            htmlFor="search-input-id"
            name="search"
            placeholder="Search..."
            ref={searchRef}
          />
        </FormField>
      </Box>
    </Form>
  );
}
