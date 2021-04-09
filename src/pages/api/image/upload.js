import multer from "multer";
import nextConnect from "next-connect";
import { uploadImage } from "../../../../lib/file";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default nextConnect()
  .use(upload.single("file"))
  .post(async (req, res) => {
    try {
      const data = await uploadImage(req.file);

      res.status(200).json({ data });
    } catch (error) {
      res
        .status(500)
        .send("Error: file could not be uploaded. Details: " + error);
    }
  });

export const config = {
  api: {
    sizeLimit: "100mb",
    bodyParser: false,
  },
};
