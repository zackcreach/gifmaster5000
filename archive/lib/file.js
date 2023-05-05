import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const client = new AWS.S3({
  region: process.env.AWSREGION,
  accessKeyId: process.env.AWSACCESSKEY,
  secretAccessKey: process.env.AWSSECRETKEY,
});

/**
 * @param {String} mimetype
 * @returns {Object}
 */
export function getSignedImageData(mimetype) {
  const extension = mimetype.replace(/image\//, ".");
  const params = {
    Bucket: process.env.AWSBUCKET,
    ContentEncoding: "base64",
    ContentType: mimetype,
    Expires: 60,
    Fields: {
      key: `${uuidv4()}${extension}`,
      "content-type": mimetype,
    },
  };

  try {
    const result = client.createPresignedPost(params);

    return {
      success: true,
      fields: result.fields,
      url: result.url,
    };
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * @param {String} key
 * @returns {Object}
 */
export async function deleteImage(key) {
  const params = {
    Bucket: process.env.AWSBUCKET,
    Key: key,
  };

  try {
    const result = await client.deleteObject(params).promise();

    return {
      success: result.DeleteMarker,
      versionId: result.VersionId,
    };
  } catch (error) {
    throw new Error(error);
  }
}
