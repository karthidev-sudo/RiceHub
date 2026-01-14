import { useEffect, useState } from "react";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const CommentsSection = ({ riceId }) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/comments/${riceId}`);
        setComments(data);
      } catch (error) {
        console.error("Failed to load comments", error);
      }
    };
    if (riceId) fetchComments();
  }, [riceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const { data } = await api.post("/comments", {
        text: newComment,
        riceId,
      });
      setComments([data, ...comments]);
      setNewComment("");
    } catch (error) {
      alert("Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      alert("Failed to delete comment");
    }
  };

  return (
    <div className="space-y-6 mt-10">
      <h3 className="text-xl font-semibold">Discussion ({comments.length})</h3>

      {/* INPUT FORM */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            {/* FIXED: Use 'user' here, not 'comment.author' */}
            <Link to={`/profile/${user.username}`}>
              <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username?.[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Ask about the wallpaper, fonts, etc..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-muted/50 p-4 rounded-lg text-center text-sm text-muted-foreground">
          Please <span className="font-semibold">login</span> to join the
          discussion.
        </div>
      )}

      <Separator />

      {/* COMMENT LIST */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="group flex gap-4">
              
              {/* 1. Link Avatar to Profile */}
              <Link to={`/profile/${comment.author?.username}`}>
                <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity">
                  <AvatarImage src={comment.author?.avatar} />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
              </Link>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    
                    {/* 2. Link Username to Profile */}
                    <Link 
                        to={`/profile/${comment.author?.username}`}
                        className="font-semibold text-sm hover:underline hover:text-primary transition-colors"
                    >
                      {comment.author?.username}
                    </Link>
                    
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* DELETE BUTTON */}
                  {user && comment.author?._id === user._id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-100/10"
                      onClick={() => handleDelete(comment._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;