import { currentUser } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const user = await currentUser();
  console.log(user);
  // Load any data your application needs for the API route
  return res.json({ Saludo: "Hola" });
}
