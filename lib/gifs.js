import { v4 as uuidv4 } from "uuid";

/**
 * @param {Object} params
 * @param {Function} db
 * @returns {Object}
 */
export async function createGif(params, db) {
  const now = new Date().toISOString();

  const values = {
    id: uuidv4(),
    file: params.file,
    name: params.name,
    tags: params.tags,
    created_ts: now,
    updated_ts: now,
  };

  const query = {
    text:
      "INSERT INTO gifs (id, file, name, tags, created_ts, updated_ts) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    values: Object.values(values),
  };

  try {
    const { rows } = await db.query(query.text, query.values);

    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

/**
 * @param {Object} params
 * @param {Function} db
 * @returns {Object}
 */
export async function editGif(params, db) {
  const now = new Date().toISOString();

  const values = {
    file: params.file,
    name: params.name,
    tags: params.tags,
    updated_ts: now,
    id: params.id,
  };

  const query = {
    text:
      "UPDATE gifs SET file = $1, name = $2, tags = $3, updated_ts = $4 WHERE id = $5 RETURNING *",
    values: Object.values(values),
  };

  try {
    const { rows } = await db.query(query.text, query.values);

    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

/**
 * @param {Object} params
 * @param {Function} db
 * @returns {Object}
 */
export async function deleteGif(params, db) {
  const values = {
    id: params.id,
  };

  const query = {
    text: "DELETE FROM gifs WHERE id = $1",
    values: Object.values(values),
  };

  try {
    const result = await db.query(query.text, query.values);
    const success = result.rowCount === 1;

    return { success };
  } catch (error) {
    console.log(error);
  }
}

/**
 * @param {Function} db
 * @returns {Object}
 */
export async function getGifList(db) {
  const query = {
    text: "SELECT * FROM gifs",
    values: [],
  };

  const { rows } = await db.query(query.text, query.values);

  return rows;
}

/**
 * @param {String} params
 * @param {Function} db
 * @returns {Object}
 */
export async function getGif(params, db) {
  const values = {
    id: params.id,
  };

  const query = {
    text: "SELECT * FROM gifs WHERE id = $1",
    values: Object.values(values),
  };

  const { rows } = await db.query(query.text, query.values);

  return rows[0];
}
