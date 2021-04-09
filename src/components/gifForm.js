import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { getErrorMessage } from "../../lib/form";
import {
  Heading,
  Box,
  FileInput,
  Button,
  FormField,
  TextInput,
  Form,
  Spinner,
  Image,
  Text,
} from "grommet";

import GifTags from "./gifTags";

export default function GifForm(props) {
  const defaultValue = {
    id: props.item?.id || null,
    file: props.item?.file || {},
    name: props.item?.name || "",
    tags: props.item?.tags || [],
  };

  const [localImageUrl, setLocalImageUrl] = useState(defaultValue.file?.url);
  const [upload, setUpload] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  const [addGif] = useMutation(AddGifMutation);
  const [editGif] = useMutation(EditGifMutation);

  useEffect(() => {
    if (isSubmitted === true && error.message == null) {
      props.refreshGifs();
    }
  }, [isSubmitted]);

  async function handleChangeFile(event) {
    const upload = event.target.files[0];
    setUpload(upload);

    const reader = new FileReader();
    reader.readAsDataURL(upload);
    reader.onload = (event) => {
      setLocalImageUrl(event.target.result);
      handleChange({
        ...value,
        name: value.name || upload.name.replace(/\.\w+/, ""),
      });
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", upload);

      let imageData = defaultValue.file;

      // Upload image
      if (upload != null) {
        const response = await fetch("/api/image/upload", {
          method: "POST",
          body: formData,
        });

        const { data } = await response.json();
        imageData = data;
      }

      const variables = {
        file: imageData || {},
        name: value.name,
        tags: value.tags,
      };

      if (defaultValue.id != null) {
        await editGif({ variables });
      } else {
        variables.id = value.id;
        await addGif({ variables });
      }
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
    setValue(nextValue);
  }

  return (
    <Box pad="large" gap="medium" width="medium">
      <Box direction="row" justify="between">
        <Heading level="3">Upload New Gif</Heading>
        {isLoading && <Spinner />}
      </Box>

      <Form
        value={value}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onReset={handleReset}
      >
        <Box pad={localImageUrl && { bottom: "medium" }}>
          <Image src={localImageUrl} />
        </Box>

        <Box pad={{ bottom: "medium" }}>
          <FileInput
            accept=".gif"
            required={!props.item?.id}
            onChange={handleChangeFile}
            disabled={isLoading}
            renderFile={(file) => (
              <Box direction="row" gap="small" pad={{ left: "medium" }}>
                <Text weight="bold">{file.name}</Text>
                <Text color="text-weak">{Math.round(file.size / 100)}kb</Text>
              </Box>
            )}
          />
        </Box>

        <FormField name="name" htmlFor="name-input-id" label="Name">
          <TextInput htmlFor="name-input-id" name="name" required />
        </FormField>

        <Box pad={{ bottom: "large" }}>
          <FormField name="tags" htmlFor="tags-input-id" label="Tags">
            <GifTags defaultValue={defaultValue} />
          </FormField>
        </Box>

        {error.message && (
          <Box pad={{ bottom: "medium", top: "medium" }}>
            <Text color="status-error">{error.message}</Text>
          </Box>
        )}

        {isSubmitted && (
          <Box pad={{ bottom: "medium", top: "medium" }}>
            <Text color="status-ok">Success!</Text>
          </Box>
        )}

        <Box direction="row" gap="xsmall">
          <Button type="submit" label="Submit" disabled={isLoading} primary />

          <Button type="reset" label="Reset" disabled={isLoading} />
        </Box>
      </Form>
    </Box>
  );
}

const AddGifMutation = gql`
  mutation AddGifMutation($file: JSON!, $name: String!, $tags: [String]) {
    addGif(input: { file: $file, name: $name, tags: $tags }) {
      gif {
        id
        file
        name
        tags
        created_ts
        updated_ts
      }
    }
  }
`;

const EditGifMutation = gql`
  mutation EditGifMutation(
    $file: JSON!
    $name: String!
    $tags: [String]
    $id: ID!
  ) {
    editGif(input: { file: $file, name: $name, tags: $tags, id: $id }) {
      gif {
        id
        file
        name
        tags
        created_ts
        updated_ts
      }
    }
  }
`;
