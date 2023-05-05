import { getSignedImageData } from "../../../../lib/file";

export default function handler(req, res) {
  const { mimetype } = JSON.parse(req.body);

  try {
    const response = getSignedImageData(mimetype);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).send("Error: signed url post failed. Details: " + error);
  }
}
