import { type Votes } from '@/hooks/useVoteSystem';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
  ssl: true,
});

const client = await pool.connect();

export const addUserVotes = async (username: string, allVotes: Votes) => {
  const sql = `INSERT INTO votes (username, category_id, option_id, rank) VALUES (?, ?, ?, ?)`;

  const inserts = allVotes.flatMap((categoryVotes, index) => {
    const categoryId = (index + 1).toString();
    return categoryVotes.map((vote, index) => {
      const rank = index + 1;
      return {
        sql,
        args: [username, categoryId, vote, rank],
      };
    });
  });

  const result = await client.batch(inserts, 'write');

  return result;
};

export const cleanUserVotes = async (username: string) => {
  const result = await client.execute({
    sql: `DELETE FROM votes WHERE username = ?`, // SQL INJECTION DE LOCURA
    args: [username],
  });

  return result;
};

export const createBasicTable = async () => {
  try {
    const result = await client.query(
      'CREATE TABLE IF NOT EXISTS votes (username text, category_id text, option_id text, rank int, PRIMARY KEY (username, category_id, option_id))'
    );

    return result;
  } catch (e) {
    // console.error(e);
    client.release();
  }
  // const result = await client.query(
  //   'CREATE TABLE IF NOT EXISTS votes (username text, category_id text, option_id text, rank int, PRIMARY KEY (username, category_id, option_id))'
  // );

  // return result;
};
