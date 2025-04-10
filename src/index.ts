import { GetConnection } from "../config/db";

export default async function Main() {
  const conn = await GetConnection();
}

Main();
