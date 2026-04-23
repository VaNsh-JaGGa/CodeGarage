import { Link } from "react-router-dom";

const StatCard = ({ label, value }) => {
  return (
    <div className="rounded-3xl border border-[rgba(93,64,55,0.12)] bg-white/80 px-5 py-5 text-center">
      <p className="text-sm uppercase tracking-[0.18em] text-[#6d5b56]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[#241916]">{value}</p>
    </div>
  );
};

const BlogHeroSection = ({
  blog,
  stats,
  isLoggedIn,
  reactionLoading,
  onReaction,
}) => {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[rgba(93,64,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,245,239,0.92))] shadow-[0_18px_60px_rgba(54,32,24,0.12)]">
      {blog.image ? (
        <img
          src={blog.image}
          alt={blog.title}
          className="h-[18rem] w-full object-cover object-center sm:h-[24rem]"
        />
      ) : null}

      <div className="space-y-6 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-[rgba(184,92,56,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8e4427]">
            {blog.category}
          </span>
          <span className="text-sm text-[#6d5b56]">{blog.date}</span>
          <span className="text-sm text-[#6d5b56]">By {blog.author}</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight text-[#241916] sm:text-5xl">
            {blog.title}
          </h1>
          <p className="text-base leading-8 text-[#6d5b56]">{blog.description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Likes" value={stats.likeCount} />
          <StatCard label="Dislikes" value={stats.dislikeCount} />
          <StatCard label="Comments" value={stats.commentCount} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {isLoggedIn ? (
            <>
              <button
                type="button"
                disabled={reactionLoading !== ""}
                className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 font-semibold transition duration-200 ${stats.userReaction === "like"
                  ? "bg-[#241916] text-white"
                  : "border border-[rgba(93,64,55,0.22)] bg-white/70 text-[#241916] hover:-translate-y-0.5 hover:border-[rgba(184,92,56,0.35)] hover:text-[#8e4427]"
                } ${reactionLoading !== "" ? "cursor-not-allowed opacity-70" : ""} sm:w-auto`}
                onClick={() => onReaction("like")}
              >
                {reactionLoading === "like" ? "Updating..." : "Like"}
              </button>

              <button
                type="button"
                disabled={reactionLoading !== ""}
                className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 font-semibold transition duration-200 ${stats.userReaction === "dislike"
                  ? "bg-[#b85c38] text-white"
                  : "border border-[rgba(93,64,55,0.22)] bg-white/70 text-[#241916] hover:-translate-y-0.5 hover:border-[rgba(184,92,56,0.35)] hover:text-[#8e4427]"
                } ${reactionLoading !== "" ? "cursor-not-allowed opacity-70" : ""} sm:w-auto`}
                onClick={() => onReaction("dislike")}
              >
                {reactionLoading === "dislike" ? "Updating..." : "Dislike"}
              </button>
            </>
          ) : (
            <p className="text-sm text-[#6d5b56] italic">
              <Link to="/login" className="font-semibold text-[#b85c38] hover:text-[#8e4427]">
                Log in
              </Link>{" "}
              to like or dislike this post.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogHeroSection;
