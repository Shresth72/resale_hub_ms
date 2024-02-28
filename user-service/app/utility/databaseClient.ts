import { Client } from "pg";

export const DBClient = async () => {
  return new Client({
    host: "127.0.0.1", // EC2 `Public IP` of the RDS instance
    user: "root", // `Master username` of the RDS instance
    database: "user_service", // `Database name` of the RDS instance
    password: "root", // `Master password` of the RDS instance
    port: 8001 // `5432` of the RDS instance
  });
};
