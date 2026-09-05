import { registerAs } from '@nestjs/config';

export type DatabaseConnection = 'sqlite' | 'mysql';

export interface DatabaseConfig {
  /** Database driver to use: `sqlite` (default) or `mysql`. */
  connection: DatabaseConnection;
  /**
   * SQLite: path to the database file (relative to the project root).
   * MySQL: name of the database/schema to connect to.
   */
  database: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
}

export default registerAs('database', (): DatabaseConfig => {
  const connection: DatabaseConnection =
    (process.env.DB_CONNECTION ?? 'sqlite').toLowerCase() === 'mysql'
      ? 'mysql'
      : 'sqlite';

  return {
    connection,
    database:
      process.env.DB_DATABASE ??
      (connection === 'mysql' ? 'spotlight' : './database/spotlight.db'),
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT) || (connection === 'mysql' ? 3306 : 0),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  };
});
