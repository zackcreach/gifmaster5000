import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { getErrorMessage } from "../../utils/form";
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
import { StatusGood, Alert } from "grommet-icons";

import GifTags from "./gifTags";

const MODAL_CLOSE_DELAY = 400;

export default function GifForm(props) {
  const title = props.item ? "Edit Gif" : "Upload Gif";

  const defaultValue = {
    gif_id: props.item?.gif_id || null,
    gif_name: props.item?.gif_name || null,
    file: props.item?.file || {},
    tags: props.item?.tags || [],
  };

  const [localImageUrl, setLocalImageUrl] = useState(defaultValue.file?.url);
  const [upload, setUpload] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  const [addTag] = useMutation(AddTagMutation);
  const [addGif] = useMutation(AddGifMutation);
  const [editGif] = useMutation(EditGifMutation);

  useEffect(() => {
    if (isSubmitted === true && error.message == null) {
      props.refreshGifs();
    }
  }, [isSubmitted]);

  async function handleChangeFile(event) {
    const upload = event.target.files[0];

    if (upload == null) {
      return;
    }

    setUpload(upload);

    const reader = new FileReader();
    reader.readAsDataURL(upload);
    reader.onload = (event) => {
      setLocalImageUrl(event.target.result);
      handleChange({
        ...value,
        gif_name: value.gif_name || upload.name.replace(/\.\w+/, ""),
      });
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", upload);

      // Upload image
      let imageData = defaultValue.file;
      if (upload != null) {
        const response = await fetch("/api/image/upload", {
          method: "POST",
          body: formData,
        });

        const { data } = await response.json();
        imageData = data;
      }

      // Post any new tags
      const modifiedTags = [];
      for (const tag of value.tags) {
        if (typeof tag === "string") {
          const tagResponse = await addTag({
            variables: {
              tag_name: tag,
            },
          });

          const tag_id = tagResponse?.data?.addTag?.tag?.tag_id || null;

          modifiedTags.push(tag_id);
        } else {
          modifiedTags.push(tag.value);
        }
      }

      const variables = {
        file: imageData || {},
        gif_name: value.gif_name,
        tags: modifiedTags,
      };

      if (defaultValue.gif_id != null) {
        variables.gif_id = value.gif_id;
        await editGif({ variables });
      } else {
        await addGif({ variables });
      }

      props.refreshGifs();
      setTimeout(props.toggleModal, MODAL_CLOSE_DELAY);
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

  function handleKeyDown(event) {
    if ((event.charCode || event.keyCode) === 13) {
      event.preventDefault();
    }
  }

  function renderStatus() {
    if (isLoading) {
      return <Spinner />;
    } else if (!isLoading && isSubmitted && error.message == null) {
      return <StatusGood color="brand" />;
    } else if (!isLoading && isSubmitted && error.message != null) {
      return <Alert color="status-error" />;
    }

    return null;
  }

  return (
    <Box pad="large" gap="medium" width="medium" background="dark-1">
      <Box direction="row" justify="between" align="center">
        <Heading level="3">{title}</Heading>
        {renderStatus()}
      </Box>

      <Form
        value={value}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onReset={handleReset}
        onKeyDown={handleKeyDown}
      >
        <Box pad={localImageUrl && { bottom: "medium" }}>
          <Image src={localImageUrl} />
        </Box>

        <Box pad={{ bottom: "medium" }}>
          <FileInput
            accept=".gif"
            required={!props.item?.gif_id}
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

        <FormField name="gif_name" htmlFor="name-input-id" label="Name">
          <TextInput htmlFor="name-input-id" name="gif_name" required />
        </FormField>

        <Box pad={{ bottom: "large" }}>
          <FormField name="tags" htmlFor="tags-input-id" label="Tags">
            <GifTags
              defaultValue={defaultValue}
              availableTags={props.availableTags}
              value={value}
              handleChange={handleChange}
            />
          </FormField>
        </Box>

        {isSubmitted && error.message && (
          <Box pad={{ bottom: "medium" }}>
            <Text color="status-error">{error.message}</Text>
          </Box>
        )}

        <Box direction="row" gap="xsmall">
          <Button type="submit" label="Submit" disabled={isLoading} primary />
        </Box>
      </Form>
    </Box>
  );
}

const AddTagMutation = gql`
  mutation AddTagMutation($tag_name: String!) {
    addTag(input: { tag_name: $tag_name }) {
      tag {
        tag_id
      }
    }
  }
`;

const AddGifMutation = gql`
  mutation AddGifMutation($file: JSON!, $gif_name: String!, $tags: [String]) {
    addGif(input: { file: $file, gif_name: $gif_name, tags: $tags }) {
      gif {
        gif_id
      }
    }
  }
`;

const EditGifMutation = gql`
  mutation EditGifMutation(
    $gif_id: ID!
    $gif_name: String!
    $file: JSON!
    $tags: [String]
  ) {
    editGif(
      input: { gif_id: $gif_id, gif_name: $gif_name, file: $file, tags: $tags }
    ) {
      gif {
        gif_id
      }
    }
  }
`;
