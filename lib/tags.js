import { v4 as uuidv4 } from "uuid";
import db from "./database";

/**
 * @param {Object} params
 * @returns {Object}
 */
export async function createTag(params) {
  const now = new Date().toISOString();

  const values = {
    tag_id: uuidv4(),
    tag_name: params.tag_name,
    created_ts: now,
    updated_ts: now,
  };

  const query = {
    text: `
      INSERT INTO 
        tags (tag_id, tag_name, created_ts, updated_ts) 
      VALUES 
        ($1, $2, $3, $4) 
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
export async function editTag(params) {
  const now = new Date().toISOString();

  const values = {
    tag_name: params.tag_name,
    updated_ts: now,
    tag_id: params.tag_id,
  };

  const query = {
    text: `
      UPDATE 
        tags 
      SET 
        tag_name = $1, updated_ts = $2 
      WHERE 
        tag_id = $3 
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
export async function deleteTag(params) {
  const values = {
    tag_id: params.tag_id,
  };

  const query = {
    text: `
      DELETE FROM 
        tags 
      WHERE 
        tag_id = $1 
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
 * @returns {Array}
 */
export async function getTagList(params) {
  const values = {
    limit: params.limit,
    offset: params.offset,
  };

  const query = {
    text: `
      SELECT 
        * 
      FROM 
        tags
    `,
    values: [],
  };

  // Add limit field in case of pagination
  if (values.limit) {
    query.text += `
      LIMIT 
        $1
    `;
    query.values.push(values.limit);
  }

  if (values.limit && values.offset) {
    query.text += `
      OFFSET 
        $2
    `;
    query.values.push(values.offset);
  }

  const { rows } = await db.query(query.text, query.values);

  return rows;
}

/**
 * @param {Object} params
 * @returns {Object}
 */
export async function getTag(params) {
  const values = {
    tag_id: params.tag_id,
  };

  const query = {
    text: `
      SELECT 
        * 
      FROM 
        tags 
      WHERE 
        tag_id = $1
    `,
    values: Object.values(values),
  };

  const { rows } = await db.query(query.text, query.values);

  return rows[0];
}
