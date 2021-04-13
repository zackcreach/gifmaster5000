import { useState, useEffect } from "react";
import { getErrorMessage } from "../../utils/form";
import { Box, FormField, TextInput, Form } from "grommet";

export default function GifSearch(props) {
  const defaultValue = {
    search: "",
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSubmitted === true && error.message == null) {
    }
  }, [isSubmitted]);

  function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    // Modify search field to satisfy postgres' to_tsquery() syntax
    const search = event.value.search.replace(/\s/g, " | ");

    try {
      props.refreshGifs({
        variables: {
          search,
        },
      });
    } catch (error) {
      setError({ message: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
      setIsSubmitted(true);
    }
  }

  function handleReset() {
    handleChange(defaultValue);
  }

  function handleChange(nextValue) {
    if (!nextValue.search) {
      props.refreshGifs();
    }

    setValue(nextValue);
  }

  return (
    <Form
      value={value}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onReset={handleReset}
    >
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
          />
        </FormField>
      </Box>
    </Form>
  );
}
