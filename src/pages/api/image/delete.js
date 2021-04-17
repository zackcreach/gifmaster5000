import { deleteImage } from "../../../../lib/file";

export default async function handler(req, res) {
  const key = req.query.key;

  try {
    const data = await deleteImage(key);

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
