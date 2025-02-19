import React, { useState, useEffect } from "react";

const Comments = ({ locationId, token, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [rating, setRating] = useState(0);

  // ดึงข้อมูล comments
  useEffect(() => {
    fetchComments();
  }, [locationId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/location/${locationId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // เพิ่ม comment
  const handleAddComment = async () => {
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    const formData = new FormData();
    formData.append("text", newComment);
    formData.append("rating", rating);

    try {
      const response = await fetch(
        `http://localhost:8000/location/${locationId}/comment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to add comment");

      setNewComment("");
      setRating(0);
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // ลบ comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/location/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete comment");
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // แก้ไข comment
  const handleEditComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/location/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: editCommentText }),
        }
      );
      if (!response.ok) throw new Error("Failed to edit comment");
      setEditingCommentId(null);
      setEditCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  // เพิ่ม reply
  const handleAddReply = async (commentId) => {
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/location/comments/${commentId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: replyText, userId }),
        }
      );
      if (!response.ok) throw new Error("Failed to add reply");
      setReplyCommentId(null);
      setReplyText("");
      fetchComments();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div className="mb-10 mt-6 max-w-6xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      {!token ? (
        <p className="text-red-500">กรุณาเข้าสู่ระบบก่อน</p>
      ) : (
        <div className="mb-4">
          <textarea
            className="w-full border p-2 rounded-md"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <div className="flex space-x-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleAddComment}>
            Add Comment
          </button>
        </div>
      )}
      {comments.map((comment) => (
        <div key={comment.commentId} className="border p-4 rounded-md mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={`https://i.pravatar.cc/150?u=${comment.user.userId}`}
              alt={comment.user.firstName}
              className="w-10 h-10 rounded-full"
            />
            <h3 className="font-semibold">{comment.user.firstName} {comment.user.lastName}</h3>
          </div>
          {editingCommentId == comment.commentId ? (
            <div className="mt-2">
              <textarea
                className="w-full border p-2 rounded-md"
                value={editCommentText}
                onChange={(e) => setEditCommentText(e.target.value)}
              />
              <div className="mt-2 flex space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded-md" onClick={() => handleEditComment(comment.commentId)}>
                  Confirm
                </button>
                <button className="bg-gray-400 text-white px-3 py-1 rounded-md" onClick={() => setEditingCommentId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <p>{comment.text}</p>
              <div className="flex space-x-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-xl ${star <=  (comment.scores[0]?.score || 0) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                ))}
              </div>
              <small className="text-gray-500">{new Date(comment.date).toLocaleString()}</small>
              {userId == comment.user.userId && (
                <div className="mt-2 flex space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                    onClick={() => {
                      setEditingCommentId(comment.commentId);
                      setEditCommentText(comment.text);
                    }}
                  >
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={() => handleDeleteComment(comment.commentId)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
          {token && (
            <button className="text-blue-500 mt-2" onClick={() => setReplyCommentId(comment.commentId)}>
              Reply
            </button>
          )}
          {replyCommentId == comment.commentId && (
            <div className="mt-2">
              <textarea
                className="w-full border p-2 rounded-md"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
              />
              <div className="mt-2 flex space-x-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded-md" onClick={() => handleAddReply(comment.commentId)}>
                  Add Reply
                </button>
                <button className="bg-gray-400 text-white px-3 py-1 rounded-md" onClick={() => setReplyCommentId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          {comment.replies && comment.replies.map((reply) => (
            <div key={reply.commentId} className="ml-6 mt-3 pl-4 border-l border-gray-300">
              <div className="flex items-center space-x-3">
                <img
                  src={`https://i.pravatar.cc/150?u=${reply.user.userId}`}
                  alt={reply.user.firstName}
                  className="w-8 h-8 rounded-full"
                />
                <h4 className="font-medium">{reply.user.firstName} {reply.user.lastName}</h4>
              </div>
              {editingCommentId === reply.commentId ? (
                <div className="mt-2">
                  <textarea
                    className="w-full border p-2 rounded-md"
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                  />
                  <div className="mt-2 flex space-x-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded-md" onClick={() => handleEditComment(reply.commentId)}>
                      Confirm
                    </button>
                    <button className="bg-gray-400 text-white px-3 py-1 rounded-md" onClick={() => setEditingCommentId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <p>{reply.text}</p>
                  <small className="text-gray-500">{new Date(reply.date).toLocaleString()}</small>
                  {userId == reply.user.userId && (
                    <div className="mt-2 flex space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                        onClick={() => {
                          setEditingCommentId(reply.commentId);
                          setEditCommentText(reply.text);
                        }}
                      >
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={() => handleDeleteComment(reply.commentId)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Comments;