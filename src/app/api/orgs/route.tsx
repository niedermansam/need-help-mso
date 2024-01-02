
import { NextResponse } from "next/server";

import "dotenv/config";
import { connect } from "@planetscale/database";

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};



export async function GET(req:Request) {

const conn = connect(config);
    const { rows } =
      (await conn.execute(`SELECT Organization.id, name, programs, tags FROM Organization 
LEFT JOIN OrgPrograms ON (Organization.id = OrgPrograms.id)
LEFT JOIN OrgTag ON (Organization.id = OrgTag.id);`)) as {
        rows: unknown;
      };

    console.log(rows)


    return      NextResponse.json(rows)

}