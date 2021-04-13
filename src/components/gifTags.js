import { useState, useEffect, useCallback } from "react";
import { FormClose } from "grommet-icons";
import { Box, Button, Keyboard, Text, TextInput } from "grommet";

export default function GifTags(props) {
  const [selectedTags, setSelectedTags] = useState(
    _getFormattedSuggestions(props.defaultValue.tags)
  );
  const [suggestions, setSuggestions] = useState(
    _getFormattedSuggestions(props.availableTags)
  );

  useEffect(() => {
    props.handleChange({ ...props.value, tags: selectedTags });
  }, [selectedTags]);

  const onRemoveTag = (tag) => {
    const removeIndex = selectedTags.indexOf(tag);
    const newTags = [...selectedTags];
    if (removeIndex >= 0) {
      newTags.splice(removeIndex, 1);
    }
    setSelectedTags(newTags);
  };

  const onAddTag = (tag) => setSelectedTags([...selectedTags, tag]);

  const onFilterSuggestion = (value) =>
    setSuggestions(
      _getFormattedSuggestions(props.availableTags).filter(
        (suggestion) =>
          suggestion.label.toLowerCase().indexOf(value.toLowerCase()) >= 0
      )
    );

  return (
    <TagInput
      suggestions={suggestions}
      value={selectedTags}
      onRemove={onRemoveTag}
      onAdd={onAddTag}
      onChange={({ target: { value } }) => onFilterSuggestion(value)}
    />
  );
}

const Tag = ({ children, onRemove, ...rest }) => {
  const tag = (
    <Box
      direction="row"
      align="center"
      background="brand"
      pad={{ horizontal: "small", vertical: "xxsmall" }}
      margin={{ vertical: "xxsmall" }}
      round="medium"
      {...rest}
    >
      <Text size="xsmall" margin={{ right: "xxsmall" }}>
        {children}
      </Text>
      {onRemove && <FormClose size="small" color="white" />}
    </Box>
  );

  if (onRemove) {
    return <Button onClick={onRemove}>{tag}</Button>;
  }
  return tag;
};

const TagInput = ({ value = [], onAdd, onChange, onRemove, ...rest }) => {
  const [currentTag, setCurrentTag] = useState("");
  const [box, setBox] = useState();
  const boxRef = useCallback(setBox, []);

  const updateCurrentTag = (event) => {
    setCurrentTag(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  const onAddTag = (tag) => {
    if (onAdd) {
      onAdd(tag);
    }
  };

  const onEnter = () => {
    if (currentTag.length) {
      onAddTag(currentTag);
      setCurrentTag("");
    }
  };

  const renderValue = () =>
    value.map((node) => (
      <Tag margin="xxsmall" key={node.value} onRemove={() => onRemove(node)}>
        {node.label || node}
      </Tag>
    ));

  return (
    <Keyboard onEnter={onEnter}>
      <Box
        direction="row"
        align="center"
        pad={{ horizontal: "xsmall" }}
        ref={boxRef}
        wrap
      >
        {value.length > 0 && renderValue()}
        <Box flex style={{ minWidth: "120px" }}>
          <TextInput
            type="search"
            plain
            dropTarget={box}
            {...rest}
            onChange={updateCurrentTag}
            value={currentTag}
            onSuggestionSelect={(event) => onAddTag(event.suggestion)}
          />
        </Box>
      </Box>
    </Keyboard>
  );
};

function _getFormattedSuggestions(tags) {
  return tags.map((tag) => ({
    label: tag.tag_name,
    value: tag.tag_id,
  }));
}
