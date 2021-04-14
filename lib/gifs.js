import { v4 as uuidv4 } from "uuid";
import db from "./database";

/**
 * @param {Object} params
 * @returns {Object}
 */
export async function createGif(params) {
  const now = new Date().toISOString();

  const values = {
    gif_id: uuidv4(),
    gif_name: params.gif_name,
    file: params.file,
    tags: params.tags,
    created_ts: now,
    updated_ts: now,
  };

  const query = {
    text: `
      INSERT INTO 
        gifs (gif_id, gif_name, file, tags, created_ts, updated_ts) 
      VALUES 
        ($1, $2, $3, $4, $5, $6) 
      RETURNING 
        *
    `,
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
 * @returns {Object}
 */
export async function editGif(params) {
  const now = new Date().toISOString();

  const values = {
    gif_name: params.gif_name,
    file: params.file,
    tags: params.tags,
    updated_ts: now,
    gif_id: params.gif_id,
  };

  const query = {
    text: `
      UPDATE 
        gifs SET gif_name = $1, file = $2, tags = $3, updated_ts = $4 
      WHERE 
        gif_id = $5 
      RETURNING 
        *
    `,
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
 * @returns {Object}
 */
export async function deleteGif(params) {
  const values = {
    gif_id: params.gif_id,
  };

  const query = {
    text: `
      DELETE FROM 
        gifs 
      WHERE 
        gif_id = $1 
      RETURNING 
        *
    `,
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
 * @returns {Array}
 */
export async function getGifList(params) {
  const values = {
    search: params.search,
    limit: params.limit,
    offset: params.offset,
  };

  let valueCount = 0;
  const query = {
    text: `
      SELECT 
        gif_id, gif_name, file, coalesce(tags.data, '[]') AS tags, created_ts, updated_ts 
      FROM 
        gifs 
      LEFT JOIN LATERAL (
        SELECT 
          json_agg(json_build_object('tag_id', tag_id, 'tag_name', tag_name, 'created_ts', created_ts, 'updated_ts', updated_ts)) 
        AS 
          data 
        FROM 
          tags 
        WHERE 
          tag_id = ANY(tags)
      ) tags 
      ON true
    `,
    values: [],
  };

  if (values.search) {
    valueCount += 1;
    query.text += `
      WHERE 
        (to_tsvector(gif_name) @@ to_tsquery($${valueCount}))
      OR 
        (to_tsvector(tags.data) @@ to_tsquery($${valueCount}))
    `;
    query.values.push(values.search);
  }

  if (values.limit) {
    valueCount += 1;
    query.text += `
      LIMIT 
        $${valueCount}
    `;
    query.values.push(values.limit);
  }

  if (values.limit && values.offset) {
    valueCount += 1;
    query.text += `
      OFFSET 
        $${valueCount}
    `;
    query.values.push(values.offset);
  }

  try {
    const { rows } = await db.query(query.text, query.values);

    return rows;
  } catch (error) {
    console.log(error);
  }
}

/**
 * @param {Object} params
 * @returns {Object}
 */
export async function getGif(params) {
  const values = {
    gif_id: params.gif_id,
  };

  const query = {
    text: `
      SELECT 
        * 
      FROM 
        gifs 
      WHERE 
        gif_id = $1
    `,
    values: Object.values(values),
  };

  const { rows } = await db.query(query.text, query.values);

  return rows[0];
}
