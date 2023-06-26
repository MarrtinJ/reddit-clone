import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "../../../../config";
import { notFound } from "next/navigation";
import MiniCreatePost from "@/components/MiniCreatePost";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = params;

  // check if user is logged in
  const session = await getAuthSession();

  // retrieve subreddit data from db
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },

        // the number of posts to take
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  // return 404 page if subreddit not found
  if (!subreddit) return notFound();

  return (
    <h1 className="font-bold text-3xl md:text-4xl h-14">
      b/{subreddit.name}
      <MiniCreatePost session={session} />
      {/* show posts in user feed */}
    </h1>
  );
};

export default page;
