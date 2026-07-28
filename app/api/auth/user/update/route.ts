import { getDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request) {
  const session = await requireAuth();
  const db = await getDB();

  const userCollection = db.collection("user");

  const body = await req.json();

  const updatedUser = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(session.user.id) },
    {
      $set: body,
    },
    { returnDocument: "after" },
  );

  return Response.json({ success: true, user: updatedUser });
}
