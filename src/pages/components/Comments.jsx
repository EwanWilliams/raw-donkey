import React, { useState, useEffect } from "react";

export default function Comments({ recipeId, isLoggedIn }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  /* --- Fetch comments --- */
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/recipe/${recipeId}/comments`);
        if (!response.ok) throw new Error("Failed to fetch comments");
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    if (recipeId) {
      fetchComments();
    }
  }, [recipeId]);

  /* --- Handle comment submission --- */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/recipe/${recipeId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ commentText: commentText.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();
      setComments([data.comment, ...comments]);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <section className="recipe-details-panel recipe-details-panel--comments">
      <h2 className="recipe-details-panel-title">
        Comments ({comments.length})
      </h2>

      {/* Comment form for logged-in users */}
      {isLoggedIn ? (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts about this recipe..."
            className="comment-textarea"
            rows="4"
            disabled={submittingComment}
          />
          <button
            type="submit"
            className="comment-submit-btn"
            disabled={!commentText.trim() || submittingComment}
          >
            {submittingComment ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="recipe-details-help">
          Please log in to leave a comment.
        </p>
      )}

      {/* Display comments */}
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <span className="comment-username">
                  {comment.username}
                </span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-text">{comment.commentText}</p>
            </div>
          ))
        ) : (
          <p className="recipe-details-help">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </section>
  );
}
