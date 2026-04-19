import { Link } from "react-router-dom";

const formatCommentDate = (dateValue) => {
  return new Date(dateValue).toLocaleString();
};

const ReplyForm = ({
  commentId,
  replyDrafts,
  replyLoadingId,
  onReplyDraftChange,
  onReplySubmit,
}) => {
  return (
    <form
      onSubmit={(event) => onReplySubmit(event, commentId)}
      className="mt-4 space-y-3 rounded-[1.25rem] border border-[rgba(93,64,55,0.12)] bg-[#fcfaf7] p-4"
    >
      <textarea
        rows={3}
        value={replyDrafts[commentId] || ""}
        onChange={(event) => onReplyDraftChange(commentId, event.target.value)}
        placeholder="Write a reply..."
        className="w-full resize-none rounded-2xl border border-[rgba(93,64,55,0.12)] bg-white px-4 py-3 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)]"
      />
      <button
        type="submit"
        disabled={replyLoadingId === commentId}
        className={`inline-flex items-center justify-center rounded-full bg-[#241916] px-4 py-2.5 font-semibold text-white transition duration-200 hover:bg-[#3a2925] ${replyLoadingId === commentId ? "cursor-not-allowed opacity-70" : ""}`}
      >
        {replyLoadingId === commentId ? "Posting..." : "Post Reply"}
      </button>
    </form>
  );
};

const CommentItem = ({
  comment,
  level,
  isLoggedIn,
  replyDrafts,
  replyOpenId,
  replyLoadingId,
  visibleReplyGroups,
  onReplyToggle,
  onReplyDraftChange,
  onReplySubmit,
  onRepliesVisibilityToggle,
}) => {
  const childReplies = comment.replies || [];
  const hasReplies = childReplies.length > 0;
  const areRepliesVisible = Boolean(visibleReplyGroups[comment.id]);

  return (
    <div
      className={`rounded-[1.5rem] border border-[rgba(93,64,55,0.12)] bg-white/80 p-4 shadow-[0_10px_30px_rgba(46,25,20,0.06)] ${level > 0 ? "ml-4 sm:ml-8" : ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[#241916]">
          {comment.commenter?.username || "User"}
        </p>
        <p className="text-xs text-[#6d5b56]">
          {formatCommentDate(comment.createdAt)}
        </p>
      </div>

      <p className="mt-3 text-sm leading-7 text-[#6d5b56]">{comment.text}</p>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        {isLoggedIn ? (
          <button
            type="button"
            className="text-sm font-semibold text-[#b85c38] transition hover:text-[#8e4427]"
            onClick={() => onReplyToggle(comment.id)}
          >
            {replyOpenId === comment.id ? "Cancel" : "Reply"}
          </button>
        ) : null}

        {hasReplies ? (
          <button
            type="button"
            className="text-sm font-semibold text-[#241916] transition hover:text-[#8e4427]"
            onClick={() => onRepliesVisibilityToggle(comment.id)}
          >
            {areRepliesVisible
              ? "Hide replies"
              : `View ${childReplies.length} ${childReplies.length === 1 ? "reply" : "replies"}`}
          </button>
        ) : null}
      </div>

      {isLoggedIn && replyOpenId === comment.id ? (
        <ReplyForm
          commentId={comment.id}
          replyDrafts={replyDrafts}
          replyLoadingId={replyLoadingId}
          onReplyDraftChange={onReplyDraftChange}
          onReplySubmit={onReplySubmit}
        />
      ) : null}

      {hasReplies && areRepliesVisible ? (
        <div className="mt-4 space-y-4 border-l border-[rgba(93,64,55,0.12)] pl-3 sm:pl-5">
          <CommentTree
            comments={childReplies}
            level={level + 1}
            isLoggedIn={isLoggedIn}
            replyDrafts={replyDrafts}
            replyOpenId={replyOpenId}
            replyLoadingId={replyLoadingId}
            visibleReplyGroups={visibleReplyGroups}
            onReplyToggle={onReplyToggle}
            onReplyDraftChange={onReplyDraftChange}
            onReplySubmit={onReplySubmit}
            onRepliesVisibilityToggle={onRepliesVisibilityToggle}
          />
        </div>
      ) : null}
    </div>
  );
};

const CommentTree = (props) => {
  const { comments } = props;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} {...props} />
      ))}
    </div>
  );
};

const BlogCommentsSection = ({
  comments,
  stats,
  isLoggedIn,
  commentText,
  commentLoading,
  replyDrafts,
  replyOpenId,
  replyLoadingId,
  visibleReplyGroups,
  onCommentChange,
  onCommentSubmit,
  onReplyToggle,
  onReplyDraftChange,
  onReplySubmit,
  onRepliesVisibilityToggle,
}) => {
  return (
    <section className="rounded-[2rem] border border-[rgba(93,64,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,245,239,0.92))] p-6 shadow-[0_18px_60px_rgba(54,32,24,0.12)] sm:p-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[#b85c38]">Discussion</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#241916]">Comments</h2>
        </div>
        <p className="text-sm text-[#6d5b56]">
          Total comments: <span className="font-semibold text-[#241916]">{stats.commentCount}</span>
        </p>
      </div>

      {isLoggedIn ? (
        <form
          onSubmit={onCommentSubmit}
          className="mb-6 space-y-4 rounded-[1.5rem] border border-[rgba(93,64,55,0.12)] bg-white/80 p-5"
        >
          <label htmlFor="comment" className="block text-sm font-medium text-[#6d5b56]">
            Write a comment
          </label>
          <textarea
            id="comment"
            rows={4}
            value={commentText}
            onChange={(event) => onCommentChange(event.target.value)}
            placeholder="Share your thoughts about this blog..."
            className="w-full resize-none rounded-2xl border border-[rgba(93,64,55,0.12)] bg-white/90 px-4 py-3.5 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)]"
          />
          <button
            type="submit"
            disabled={commentLoading}
            className={`inline-flex w-full items-center justify-center rounded-full bg-[#b85c38] px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(184,92,56,0.26)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8e4427] ${commentLoading ? "cursor-not-allowed opacity-70" : ""} sm:w-auto`}
          >
            {commentLoading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="mb-6 rounded-[1.5rem] border border-[rgba(93,64,55,0.12)] bg-white/80 px-5 py-5 text-sm text-[#6d5b56]">
          <Link to="/login" className="font-semibold text-[#b85c38] hover:text-[#8e4427]">
            Log in
          </Link>{" "}
          to join the discussion and post a comment.
        </div>
      )}

      {comments.length > 0 ? (
        <CommentTree
          comments={comments}
          level={0}
          isLoggedIn={isLoggedIn}
          replyDrafts={replyDrafts}
          replyOpenId={replyOpenId}
          replyLoadingId={replyLoadingId}
          visibleReplyGroups={visibleReplyGroups}
          onReplyToggle={onReplyToggle}
          onReplyDraftChange={onReplyDraftChange}
          onReplySubmit={onReplySubmit}
          onRepliesVisibilityToggle={onRepliesVisibilityToggle}
        />
      ) : (
        <div className="rounded-[1.5rem] border border-[rgba(93,64,55,0.12)] bg-white/80 px-5 py-8 text-center text-[#6d5b56]">
          No comments yet for this blog.
        </div>
      )}
    </section>
  );
};

export default BlogCommentsSection;
