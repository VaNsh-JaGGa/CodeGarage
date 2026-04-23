import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import FixedNavBar from "../FixedNavBar";
import { apiRequest, getBlogCardData } from "../../utils/api";
import BlogHeroSection from "./BlogHeroSection";
import BlogCommentsSection from "./BlogCommentsSection";
import { useAuth } from "../AuthContext";


const defaultStats = {
  likeCount: 0,
  dislikeCount: 0,
  commentCount: 0,
  userReaction: null,
};

const countComments = (commentList = []) => {
  let totalComments = 0;

  for (const singleComment of commentList) {
    totalComments += 1;
    totalComments += countComments(singleComment.replies || []);
  }

  return totalComments;
};

const fetchBlogDetails = async (blogId) => {
  const detailsResponse = await apiRequest(`/blogs/${blogId}/details`);
  console.log("this is what");
  console.log(detailsResponse);
  const commentList = detailsResponse.comments || [];
  console.log("this is what commentList");
  console.log(commentList);

  return {
    blog: getBlogCardData(detailsResponse.blog),
    comments: commentList,
    stats: {
      likeCount: detailsResponse.stats?.likeCount || 0,
      dislikeCount: detailsResponse.stats?.dislikeCount || 0,
      userReaction: detailsResponse.stats?.userReaction || null,
      commentCount: detailsResponse.stats?.commentCount || countComments(commentList),
    },
  };
};

const BlogDetailsPage = () => {
  const { id } = useParams();
  const { isLoggedIn, currentUserId } = useAuth();
  console.log("isLoggedIn");
  console.log(isLoggedIn);

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [reactionLoading, setReactionLoading] = useState("");
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyLoadingId, setReplyLoadingId] = useState(null);
  const [visibleReplyGroups, setVisibleReplyGroups] = useState({});
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [error, setError] = useState("");

  const applyBlogData = (data) => {
    setBlog(data.blog);
    setComments(data.comments);
    setStats(data.stats);
  };

  const loadBlogDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchBlogDetails(id);
      applyBlogData(data);
    } catch (err) {
      setError(err.message || "Failed to load blog details");
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (nextStats) => {
    setStats((currentStats) => ({
      ...currentStats,
      ...nextStats,
    }));
  };

  useEffect(() => {
    loadBlogDetails();
  }, [id]);

  const handleReaction = async (type) => {
    try {
      setReactionLoading(type);
      const data = await apiRequest(`/likes/${id}`, {
        method: "POST",
        body: JSON.stringify({ type }),
      });
      updateStats(data.stats || {});
      toast.success("Reaction updated");
    } catch (err) {
      toast.error(err.message || "Failed to update reaction");
    } finally {
      setReactionLoading("");
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setCommentLoading(true);
      const data = await apiRequest(`/comments/${id}`, {
        method: "POST",
        body: JSON.stringify({ text: trimmedComment }),
      });
      setCommentText("");
      setComments(data.comments || []);
      updateStats({ commentCount: data.commentCount || 0 });
      toast.success("Comment added successfully");
    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReplyToggle = (commentId) => {
    setReplyOpenId((currentReplyId) =>
      currentReplyId === commentId ? null : commentId
    );
  };

  const handleReplyDraftChange = (commentId, value) => {
    setReplyDrafts((currentDrafts) => ({
      ...currentDrafts,
      [commentId]: value,
    }));
  };

  const handleRepliesVisibilityToggle = (commentId) => {
    setVisibleReplyGroups((currentGroups) => ({
      ...currentGroups,
      [commentId]: !currentGroups[commentId],
    }));
  };

  const handleReplySubmit = async (event, parentId) => {
    event.preventDefault();
    const replyText = (replyDrafts[parentId] || "").trim();

    if (!replyText) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      setReplyLoadingId(parentId);
      const data = await apiRequest(`/comments/${id}`, {
        method: "POST",
        body: JSON.stringify({ text: replyText, parentId }),
      });
      setReplyDrafts((currentDrafts) => ({
        ...currentDrafts,
        [parentId]: "",
      }));
      setReplyOpenId(null);
      setVisibleReplyGroups((currentGroups) => ({
        ...currentGroups,
        [parentId]: true,
      }));
      setComments(data.comments || []);
      updateStats({ commentCount: data.commentCount || 0 });
      toast.success("Reply added successfully");
    } catch (err) {
      toast.error(err.message || "Failed to add reply");
    } finally {
      setReplyLoadingId(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setDeleteLoadingId(commentId);
      await apiRequest(`/comments/delete/${commentId}`, {
        method: "DELETE",
      });

      const updatedData = await fetchBlogDetails(id);
      applyBlogData(updatedData); 
      toast.success("Comment deleted successfully");
    } catch (err) { 
      toast.error(err.message || "Failed to delete comment");
    } finally { 
      setDeleteLoadingId(null); 
    }
  };

  return (
    <div className="min-h-screen px-4 pb-10 pt-5 sm:px-6 lg:px-8">
      <Toaster />

      <div className="mx-auto max-w-7xl space-y-8">
        <FixedNavBar />

        {loading ? (
          <div className="rounded-[2rem] border border-[rgba(93,64,55,0.12)] bg-white/80 px-6 py-12 text-center text-[#6d5b56] shadow-[0_18px_60px_rgba(54,32,24,0.12)]">
            Loading blog details...
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-200 bg-white/80 px-6 py-12 text-center text-red-500 shadow-[0_18px_60px_rgba(54,32,24,0.12)]">
            {error}
          </div>
        ) : blog ? (
          <>
            <BlogHeroSection
              blog={blog}
              stats={stats}
              isLoggedIn={isLoggedIn}
              reactionLoading={reactionLoading}
              onReaction={handleReaction}
            />

            <BlogCommentsSection
              comments={comments}
              stats={stats}
              isLoggedIn={isLoggedIn}
              commentText={commentText}
              commentLoading={commentLoading}
              replyDrafts={replyDrafts}
              replyOpenId={replyOpenId}
              replyLoadingId={replyLoadingId}
              visibleReplyGroups={visibleReplyGroups}
              onCommentChange={setCommentText}
              onCommentSubmit={handleCommentSubmit}
              onReplyToggle={handleReplyToggle}
              onReplyDraftChange={handleReplyDraftChange}
              onReplySubmit={handleReplySubmit}
              onRepliesVisibilityToggle={handleRepliesVisibilityToggle}
              currentUserId={currentUserId}
              deleteLoadingId={deleteLoadingId}
              onDeleteComment={handleDeleteComment}
            />
          </>
        ) : (
          <div className="rounded-[2rem] border border-[rgba(93,64,55,0.12)] bg-white/80 px-6 py-12 text-center text-[#6d5b56] shadow-[0_18px_60px_rgba(54,32,24,0.12)]">
            Blog not found.
            <div className="mt-4">
              <Link to={isLoggedIn ? "/homedashboard" : "/"} className="font-semibold text-[#b85c38]">
                Go back
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetailsPage;
