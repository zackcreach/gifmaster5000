import { Image, Box } from "grommet";
import { Close, Edit } from "grommet-icons";

import styles from "./gifCard.module.css";

export default function GifCard(props) {
  function handleClickEdit(event) {
    props.setItem({
      id: props.id,
      file: props.file,
      name: props.name,
      tags: props.tags,
    });
  }

  return (
    <Box key={props.id} style={{ position: "relative" }}>
      <div
        className={styles.closeContainer}
        onClick={props.handleClickDelete}
        id={props.id}
        data-filename={props.file?.filename}
      >
        <Close size="small" color="white" />
      </div>

      <div className={styles.editContainer} onClick={handleClickEdit}>
        <Edit size="small" color="white" />
      </div>

      <Image
        src={props.file?.url}
        fit="cover"
        style={{ borderRadius: "5px" }}
      />
    </Box>
  );
}
