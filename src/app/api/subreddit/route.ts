import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // check if the user exists
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // ensure that the data being passed is what we expect
    const body = await req.json();

    // if the payload fails parsing, throws an error
    const { name } = SubredditValidator.parse(body);

    // check if subreddit with current name already exists
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExists) {
      return new Response("Subreddit already exists", { status: 409 });
    }

    // if subreddit does not exist, create new subreddit
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // make the creator subscribe to the subreddit
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });

    // if subreddit creation successful
    return new Response(subreddit.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // if we receive a ZodError, then the wrong datatype was passed into the route
      return new Response("error.message", { status: 422 });
    }

    return new Response("Could not create subreadit", { status: 500 });
  }
}
