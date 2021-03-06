import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import db from "./database";

/**
 * @param {Object} params
 * @returns {Object}
 */
export async function createUser(params) {
  const now = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(params.password, salt, 1000, 64, "sha512")
    .toString("hex");

  const values = {
    user_id: uuidv4(),
    created_ts: now,
    email: params.email,
    hash,
    salt,
  };

  const query = {
    text:
      "INSERT INTO users (user_id, created_ts, email, hash, salt) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    values: Object.values(values),
  };

  const { rows } = await db.query(query.text, query.values);

  return rows[0];
}

/**
 * @param {Object} params
 * @returns {Object}
 */
export async function findUser(params) {
  try {
    const query = {
      text: "SELECT * FROM users WHERE email=$1",
      values: [params.email],
    };

    const { rows } = await db.query(query.text, query.values);

    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

/**
 * @param {String} user
 * @param {String} inputPassword
 * @returns {Boolean}
 */
export async function validatePassword(user, inputPassword) {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, "sha512")
    .toString("hex");
  const passwordsMatch = user.hash === inputHash;
  return passwordsMatch;
}
