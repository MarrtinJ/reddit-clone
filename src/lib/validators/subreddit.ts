import { z } from "zod";

// declare a schema with zod
// schema is then parsed against the payload to remove unwanted data
// allows us to validate on both server and client side

export const SubredditValidator = z.object({
  name: z.string().min(3).max(21), // a string with min len 3 max len 21
});

export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string(),
});

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>;
