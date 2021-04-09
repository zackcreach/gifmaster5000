import { deleteImage } from "../../../../lib/file";

export default async function handler(req, res) {
  const filename = req.query.filename;

  try {
    const data = await deleteImage(filename);

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).send("Error: file could not be deleted. Details: " + error);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
