import { useState, useEffect, useRef } from "react";
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

const MODAL_CLOSE_DELAY = 250;

export default function GifForm(props) {
  const title = props.item ? "Edit Gif" : "Upload Gif";
  const relativeUrl = props.item?.file?.url?.relative;
  const userId = props.user.data?.viewer?.user_id;

  const defaultValue = {
    gif_id: props.item?.gif_id || null,
    gif_name: props.item?.gif_name || null,
    file: props.item?.file || {},
    tags: props.item?.tags || [],
    created_by: userId || null,
    updated_by: userId || null,
  };

  const defaultState = {
    localImageUrl: relativeUrl ? `${props.publicHost}/${relativeUrl}` : null,
  };

  const nameInputRef = useRef();
  const [localImageUrl, setLocalImageUrl] = useState(
    defaultState.localImageUrl
  );
  const [upload, setUpload] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  const [addTag] = useMutation(AddTagMutation);
  const [addGif] = useMutation(AddGifMutation);
  const [editGif] = useMutation(EditGifMutation);

  useEffect(() => {
    nameInputRef.current.focus();
  }, []);

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

      let imageData = defaultValue.file;
      if (upload != null) {
        // Get signed url for file upload
        const signedResponse = await fetch("/api/image/signed", {
          method: "POST",
          body: JSON.stringify({ mimetype: upload.type }),
        });
        const signedData = await signedResponse.json();

        // Add additional fields returned from signed response to formData for upload
        Object.entries(signedData.fields).map(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("file", upload);

        // Upload file, expect 204 (no content)
        await fetch(signedData.url, {
          method: "POST",
          body: formData,
        });

        // Assemble data for new db record
        imageData = {
          bucket: signedData.fields.bucket,
          url: {
            relative: signedData.fields.key,
            absolute: `${signedData.url}/${signedData.fields.key}`,
          },
        };
      }

      // Post any new tags
      const modifiedTags = [];
      for (const tag of value.tags) {
        if (typeof tag === "string") {
          const tagResponse = await addTag({
            variables: {
              tag_name: tag,
              created_by: defaultValue.created_by,
              updated_by: defaultValue.updated_by,
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
        updated_by: defaultValue.updated_by,
      };

      if (defaultValue.gif_id != null) {
        variables.gif_id = value.gif_id;
        await editGif({ variables });
      } else {
        variables.created_by = defaultValue.created_by;
        await addGif({ variables });
      }

      props.refreshGifs();
      setTimeout(props.toggleModalUpload, MODAL_CLOSE_DELAY);
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
    let status = null;

    if (isLoading) {
      status = <Spinner />;
    } else if (!isLoading && isSubmitted) {
      if (error.message != null) {
        status = <Alert color="status-error" />;
      } else {
        status = <StatusGood color="brand" />;
      }
    }

    return status;
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

        <Box pad={{ bottom: "medium" }} style={{ overflow: "hidden" }}>
          <FileInput
            accept=".gif"
            onChange={handleChangeFile}
            onDrop={handleChangeFile}
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
          <TextInput
            htmlFor="name-input-id"
            name="gif_name"
            ref={nameInputRef}
            required
          />
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
  mutation AddTagMutation(
    $tag_name: String!
    $created_by: ID!
    $updated_by: ID!
  ) {
    addTag(
      input: {
        tag_name: $tag_name
        created_by: $created_by
        updated_by: $updated_by
      }
    ) {
      tag {
        tag_id
      }
    }
  }
`;

const AddGifMutation = gql`
  mutation AddGifMutation(
    $file: JSON!
    $gif_name: String!
    $tags: [String]
    $created_by: ID!
    $updated_by: ID!
  ) {
    addGif(
      input: {
        file: $file
        gif_name: $gif_name
        tags: $tags
        created_by: $created_by
        updated_by: $updated_by
      }
    ) {
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
    $updated_by: ID!
  ) {
    editGif(
      input: {
        gif_id: $gif_id
        gif_name: $gif_name
        file: $file
        tags: $tags
        updated_by: $updated_by
      }
    ) {
      gif {
        gif_id
      }
    }
  }
`;
