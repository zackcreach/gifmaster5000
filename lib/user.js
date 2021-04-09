import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

/**
 * @param {Object} params
 * @param {Function} db
 * @returns {Object}
 */
export async function createUser(params, db) {
  const hash = crypto
    .pbkdf2Sync(params.password, salt, 1000, 64, "sha512")
    .toString("hex");
  const salt = crypto.randomBytes(16).toString("hex");
  const now = new Date().toISOString();

  const values = {
    id: uuidv4(),
    created_ts: now,
    email: params.email,
    hash,
    salt,
  };

  const query = {
    text:
      "INSERT INTO users (id, created_ts, email, hash, salt) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    values: Object.values(values),
  };

  const { rows } = await db.query(query.text, query.values);

  return rows[0];
}

/**
 * @param {Object} params
 * @param {Function} db
 * @returns {Object}
 */
export async function findUser(params, db) {
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
