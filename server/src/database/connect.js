import mongoose from "mongoose"




export default async function connect(url) {
  try {
  const conn = await mongoose.connect(url);
  console.log(conn.connection.host)
  } catch (e)
  {
    console.log("In database ", e.message)
  }
}