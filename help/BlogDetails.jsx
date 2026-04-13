// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";
// import RealNavBar from "./RealNavBar";
// import { apiRequest, getBlogCardData } from "../utils/api";

// const countComments = (comments) => {
//   return comments.reduce((total, comment) => {
//     return total + 1 + countComments(comment.replies || []);
//   }, 0);
// };

// const CommentTree = ({
//   comments,
//   level = 0,
//   replyDrafts,
//   replyOpenId,
//   replyLoadingId,
//   onReplyToggle,
//   onReplyDraftChange,
//   onReplySubmit,
// }) => {
//   return (
//     <div className="space-y-4">
//       {comments.map((comment) => (
//         <div
//           key={comment.id}
//           className={`rounded-[1.5rem] border border-[rgba(93,64,55,0.12)] bg-white/80 p-4 shadow-[0_10px_30px_rgba(46,25,20,0.06)] ${level > 0 ? "ml-4 sm:ml-8" : ""}`}
//         >
//           <div className="flex flex-wrap items-center justify-between gap-2">
//             <p className="text-sm font-semibold text-[#241916]">
//               {comment.commenter?.username || "User"}
//             </p>
//             <p className="text-xs text-[#6d5b56]">
//               {new Date(comment.createdAt).toLocaleString()}
//             </p>
//           </div>
//           <p className="mt-3 text-sm leading-7 text-[#6d5b56]">{comment.text}</p>

//           <div className="mt-4">
//             <button
//               type="button"
//               className="text-sm font-semibold text-[#b85c38] transition hover:text-[#8e4427]"
//               onClick={() => onReplyToggle(comment.id)}
//             >
//               {replyOpenId === comment.id ? "Cancel" : "Reply"}
//             </button>
//           </div>

//           {replyOpenId === comment.id ? (
//             <form
//               onSubmit={(e) => onReplySubmit(e, comment.id)}
//               className="mt-4 space-y-3 rounded-[1.25rem] border border-[rgba(93,64,55,0.12)] bg-[#fcfaf7] p-4"
//             >
//               <textarea
//                 rows={3}
//                 value={replyDrafts[comment.id] || ""}
//                 onChange={(e) => onReplyDraftChange(comment.id, e.target.value)}
//                 placeholder="Write a reply..."
//                 className="w-full resize-none rounded-2xl border border-[rgba(93,64,55,0.12)] bg-white px-4 py-3 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)]"
//               />
//               <button
//                 type="submit"
//                 disabled={replyLoadingId === comment.id}
//                 className={`inline-flex items-center justify-center rounded-full bg-[#241916] px-4 py-2.5 font-semibold text-white transition duration-200 hover:bg-[#3a2925] ${replyLoadingId === comment.id ? "cursor-not-allowed opacity-70" : ""}`}
//               >
//                 {replyLoadingId === comment.id ? "Posting..." : "Post Reply"}
//               </button>
//             </form>
//           ) : null}

//           {comment.replies?.length > 0 ? (
//             <div className="mt-4">
//               <CommentTree
//                 comments={comment.replies}
//                 level={level + 1}
//                 replyDrafts={replyDrafts}
//                 replyOpenId={replyOpenId}
//                 replyLoadingId={replyLoadingId}
//                 onReplyToggle={onReplyToggle}
//                 onReplyDraftChange={onReplyDraftChange}
//                 onReplySubmit={onReplySubmit}
//               />
//             </div>
//           ) : null}
//         </div>
//       ))}
//     </div>
//   );
// };

// const fetchBlogDetails = async (id) => {
//   const [blogResponse, likesResponse, commentsResponse] = await Promise.all([
//     apiRequest(`/blogs/${id}`),
//     apiRequest(`/likes/${id}`),
//     apiRequest(`/comments/${id}`),
//   ]);

//   return {
//     blog: getBlogCardData(blogResponse.blog),
//     comments: commentsResponse || [],
//     stats: {
//       likeCount: likesResponse.likeCount || 0,
//       dislikeCount: likesResponse.dislikeCount || 0,
//       userReaction: likesResponse.userReaction || null,
//       commentCount: countComments(commentsResponse || []),
//     },
//   };
// };

// const BlogDetails = () => {
//   const { id } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [stats, setStats] = useState({
//     likeCount: 0,
//     dislikeCount: 0,
//     commentCount: 0,
//     userReaction: null,
//   });
//   const [commentText, setCommentText] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [commentLoading, setCommentLoading] = useState(false);
//   const [reactionLoading, setReactionLoading] = useState("");
//   const [replyOpenId, setReplyOpenId] = useState(null);
//   const [replyDrafts, setReplyDrafts] = useState({});
//   const [replyLoadingId, setReplyLoadingId] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadBlogDetails = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const data = await fetchBlogDetails(id);
//         setBlog(data.blog);
//         setComments(data.comments);
//         setStats(data.stats);
//       } catch (err) {
//         setError(err.message || "Failed to load blog details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBlogDetails();
//   }, [id]);

//   const refreshBlogDetails = async () => {
//     const data = await fetchBlogDetails(id);
//     setBlog(data.blog);
//     setComments(data.comments);
//     setStats(data.stats);
//   };

//   const handleReaction = async (type) => {
//     try {
//       setReactionLoading(type);
//       await apiRequest(`/likes/${id}`, {
//         method: "POST",
//         body: JSON.stringify({ type }),
//       });
//       await refreshBlogDetails();
//       toast.success("Reaction updated");
//     } catch (err) {
//       toast.error(err.message || "Failed to update reaction");
//     } finally {
//       setReactionLoading("");
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();

//     if (!commentText.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }

//     try {
//       setCommentLoading(true);
//       await apiRequest(`/comments/${id}`, {
//         method: "POST",
//         body: JSON.stringify({ text: commentText.trim() }),
//       });
//       setCommentText("");
//       await refreshBlogDetails();
//       toast.success("Comment added successfully");
//     } catch (err) {
//       toast.error(err.message || "Failed to add comment");
//     } finally {
//       setCommentLoading(false);
//     }
//   };

//   const handleReplyToggle = (commentId) => {
//     setReplyOpenId((currentId) => (currentId === commentId ? null : commentId));
//   };

//   const handleReplyDraftChange = (commentId, value) => {
//     setReplyDrafts((prev) => ({
//       ...prev,
//       [commentId]: value,
//     }));
//   };

//   const handleReplySubmit = async (e, parentId) => {
//     e.preventDefault();
//     const replyText = (replyDrafts[parentId] || "").trim();

//     if (!replyText) {
//       toast.error("Reply cannot be empty");
//       return;
//     }

//     try {
//       setReplyLoadingId(parentId);
//       await apiRequest(`/comments/${id}`, {
//         method: "POST",
//         body: JSON.stringify({
//           text: replyText,
//           parentId,
//         }),
//       });
//       setReplyDrafts((prev) => ({
//         ...prev,
//         [parentId]: "",
//       }));
//       setReplyOpenId(null);
//       await refreshBlogDetails();
//       toast.success("Reply added successfully");
//     } catch (err) {
//       toast.error(err.message || "Failed to add reply");
//     } finally {
//       setReplyLoadingId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen px-4 pb-10 pt-5 sm:px-6 lg:px-8">
//       <Toaster />
//       <div className="mx-auto max-w-7xl space-y-8">
//         <RealNavBar />

//         {loading ? (
//           <div className="rounded-[2rem] border border-[rgba(93,64,55,0.12)] bg-white/80 px-6 py-12 text-center text-[#6d5b56] shadow-[0_18px_60px_rgba(54,32,24,0.12)]">
//             Loading blog details...
//           </div>
//         ) : error ? (
//           <div className="rounded-[2rem] border border-red-200 bg-white/80 px-6 py-12 text-center text-red-500 shadow-[0_18px_60px_rgba(54,32,24,0.12)]">
//             {error}
//           </div>
//         ) : blog ? (
//           <>
//             <section className="overflow-hidden rounded-[2rem] border border-[rgba(93,64,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,245,239,0.92))] shadow-[0_18px_60px_rgba(54,32,24,0.12)]">
//               {blog.image ? (
//                 <img
//                   src={blog.image}
//                   alt={blog.title}
//                   className="h-[18rem] w-full object-cover sm:h-[24rem]"
//                 />
//               ) : null}

//               <div className="space-y-6 p-6 sm:p-8 lg:p-10">
//                 <div className="flex flex-wrap items-center gap-3">
//                   <span className="inline-flex items-center rounded-full bg-[rgba(184,92,56,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8e4427]">
//                     {blog.category}
//                   </span>
//                   <span className="text-sm text-[#6d5b56]">{blog.date}</span>
//                   <span className="text-sm text-[#6d5b56]">By {blog.author}</span>
//                 </div>

//                 <div className="space-y-4">
//                   <h1 className="text-4xl font-semibold leading-tight text-[#241916] sm:text-5xl">
//                     {blog.title}
//                   </h1>
//                   <p className="text-base leading-8 text-[#6d5b56]">
//                     {blog.description}
//                   </p>
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-3">
//                   <div className="rounded-3xl border border-[rgba(93,64,55,0.12)] bg-white/80 px-5 py-5 text-center">
//                     <p className="text-sm uppercase tracking-[0.18em] text-[#6d5b56]">Likes</p>
//                     <p className="mt-2 text-3xl font-semibold text-[#241916]">{stats.likeCount}</p>
//                   </div>
//                   <div className="rounded-3xl border border-[rgba(93,64,55,0.12)] bg-white/80 px-5 py-5 text-center">
//                     <p className="text-sm uppercase tracking-[0.18em] text-[#6d5b56]">Dislikes</p>
//                     <p className="mt-2 text-3xl font-semibold text-[#241916]">{stats.dislikeCount}</p>
//                   </div>
//                   <div className="rounded-3xl border border-[rgba(93,64,55,0.12)] bg-white/80 px-5 py-5 text-center">
//                     <p className="text-sm uppercase tracking-[0.18em] text-[#6d5b56]">Comments</p>
//                     <p className="mt-2 text-3xl font-semibold text-[#241916]">{stats.commentCount}</p>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-3">
//                   <button
//                     type="button"
//                     disabled={reactionLoading !== ""}
//                     className={`inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold transition duration-200 ${stats.userReaction === "like"
//                       ? "bg-[#241916] text-white"
//                       : "border border-[rgba(93,64,55,0.22)] bg-white/70 text-[#241916] hover:-translate-y-0.5 hover:border-[rgba(184,92,56,0.35)] hover:text-[#8e4427]"
//                       } ${reactionLoading !== "" ? "cursor-not-allowed opacity-70" : ""}`}
//                     onClick={() => handleReaction("like")}
//                   >
//                     {reactionLoading === "like" ? "Updating..." : "Like"}
//                   </button>
//                   <button
//                     type="button"
//                     disabled={reactionLoading !== ""}
//                     className={`inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold transition duration-200 ${stats.userReaction === "dislike"
//                       ? "bg-[#b85c38] text-white"
//                       : "border border-[rgba(93,64,55,0.22)] bg-white/70 text-[#241916] hover:-translate-y-0.5 hover:border-[rgba(184,92,56,0.35)] hover:text-[#8e4427]"
//                       } ${reactionLoading !== "" ? "cursor-not-allowed opacity-70" : ""}`}
//                     onClick={() => handleReaction("dislike")}
//                   >
//                     {reactionLoading === "dislike" ? "Updating..." : "Dislike"}
//                   </button>
//                   <Link
//                     to="/realhome"
//                     className="inline-flex items-center justify-center rounded-full border border-[rgba(93,64,55,0.22)] bg-white/70 px-5 py-3 font-semibold text-[#241916] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(184,92,56,0.35)] hover:text-[#8e4427]"
//                   >
//                     Back to dashboard
//                   </Link>
//                 </div>
//               </div>
//             </section>

//             <section className="rounded-[2rem] border border-[rgba(93,64,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,245,239,0.92))] p-6 shadow-[0_18px_60px_rgba(54,32,24,0.12)] sm:p-8">
//               <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
//                 <div>
//                   <p className="text-sm uppercase tracking-[0.18em] text-[#b85c38]">Discussion</p>
//                   <h2 className="mt-2 text-3xl font-semibold text-[#241916]">Comments</h2>
//                 </div>
//                 <p className="text-sm text-[#6d5b56]">
//                   Total comments: <span className="font-semibold text-[#241916]">{stats.commentCount}</span>
//                 </p>
//               </div>

//               <form onSubmit={handleCommentSubmit} className="mb-6 space-y-4 rounded-[1.5rem] border border-[rgba(93,64,55,0.12)] bg-white/80 p-5">
//                 <label htmlFor="comment" className="block text-sm font-medium text-[#6d5b56]">
//                   Write a comment
//                 </label>
//                 <textarea
//                   id="comment"
//                   rows={4}
//                   value={commentText}
//                   onChange={(e) => setCommentText(e.target.value)}
//                   placeholder="Share your thoughts about this blog..."
//                   className="w-full resize-none rounded-2xl border border-[rgba(93,64,55,0.12)] bg-white/90 px-4 py-3.5 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)]"
//                 />
//                 <button
//                   type="submit"
//                   disabled={commentLoading}
//                   className={`inline-flex items-center justify-center rounded-full bg-[#b85c38] px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(184,92,56,0.26)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8e4427] ${commentLoading ? "cursor-not-allowed opacity-70" : ""}`}
//                 >
//                   {commentLoading ? "Posting..." : "Post Comment"}
//                 </button>
//               </form>

//               {comments.length > 0 ? (
//                 <CommentTree
//                   comments={comments}
//                   replyDrafts={replyDrafts}
//                   replyOpenId={replyOpenId}
//                   replyLoadingId={replyLoadingId}
//                   onReplyToggle={handleReplyToggle}
//                   onReplyDraftChange={handleReplyDraftChange}
//                   onReplySubmit={handleReplySubmit}
//                 />
//               ) : (
//                 <div className="rounded-[1.5rem] border border-[rgba(93,64,55,0.12)] bg-white/80 px-5 py-8 text-center text-[#6d5b56]">
//                   No comments yet for this blog.
//                 </div>
//               )}
//             </section>
//           </>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default BlogDetails;
