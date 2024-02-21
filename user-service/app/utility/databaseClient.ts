import { Client } from "pg";

export const DBClient = async () => {
  return new Client({
    host: "user-service.endpoint.ap-southeast-1.rds.amazonaws.com",
    user: "user_service",
    database: "user_service",
    password: "rds_password",
    port: 8001
  });
};
