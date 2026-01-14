import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this
import { Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import CommentsSection from "@/components/shared/CommentsSection";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // VS Code Dark Theme

const RiceDetail = () => {
  const { user, login } = useAuthStore(); // Get current user to check if they liked it
  const [likes, setLikes] = useState([]);
  const { id } = useParams();
  const [rice, setRice] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLiked = user && likes.includes(user._id);
  const isSaved = user?.savedRices?.includes(id);

  const handleLike = async () => {
    if (!user) return alert("Please login to like!");
    try {
      const { data } = await api.put(`/rices/${id}/like`);
      setLikes(data.likes);
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleSave = async () => {
    if (!user) return alert("Login to save!");
    try {
      const { data } = await api.put("/users/save", { riceId: id });

      // Update local user object with new saved list
      login({ ...user, savedRices: data });
    } catch (error) {
      console.error("Save failed");
    }
  };

  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this rice?")) return;

    try {
      await api.delete(`/rices/${id}`);
      navigate("/"); // Go back home after delete
    } catch (error) {
      alert("Failed to delete");
    }
  };

  useEffect(() => {
    const fetchRice = async () => {
      try {
        const { data } = await api.get(`/rices/${id}`); // We need to add this endpoint to backend next!
        setRice(data);
        setLikes(data.likes || []);
      } catch (error) {
        console.error("Error fetching rice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRice();
  }, [id]);

  if (loading)
    return <div className="text-center mt-20">Loading details...</div>;
  if (!rice) return <div className="text-center mt-20">Rice not found 😔</div>;

  return (
    <div className="container max-w-4xl mx-auto py-10 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{rice.title}</h1>
            {/* ... user info ... */}
          </div>

          <Button
            variant={isLiked ? "default" : "outline"}
            onClick={handleLike}
            className="gap-2"
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            {likes.length} Likes
          </Button>
          <Button variant="outline" size="icon" onClick={handleSave}>
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
          {user && rice.author && user._id === rice.author._id && (
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              className="ml-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          {/* Wrap Avatar and Name in a Link */}
          <Link
            to={`/profile/${rice.author?.username}`}
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={rice.author?.avatar} />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <span>
              Posted by{" "}
              <span className="font-semibold text-foreground">
                {rice.author?.username}
              </span>
            </span>
          </Link>

          <span>•</span>
          <span>{new Date(rice.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Main Image */}
      <div className="rounded-xl overflow-hidden border shadow-sm bg-muted">
        <img
          src={rice.imageUrl}
          alt={rice.title}
          className="w-full h-auto object-contain max-h-[600px]"
        />
      </div>

      {/* Configuration Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Specs */}
        <Card className="h-fit">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-lg">System Specs</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">OS / Distro</span>
                <Badge variant="secondary">{rice.config.distro}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Window Manager</span>
                <Badge variant="outline">{rice.config.windowManager}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shell</span>
                <span className="font-medium">{rice.config.shell}</span>
              </div>
            </div>

            {rice.config.dotfilesUrl && (
              <a
                href={rice.config.dotfilesUrl}
                target="_blank"
                rel="noreferrer"
                className="block mt-4"
              >
                <Button className="w-full">View Dotfiles on GitHub</Button>
              </a>
            )}
          </CardContent>
        </Card>

        {rice.config.codeSnippet && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Config Preview</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(rice.config.codeSnippet);
                  alert("Copied to clipboard!");
                }}
              >
                Copy Code
              </Button>
            </div>

            <div className="rounded-md overflow-hidden border">
              <SyntaxHighlighter
                language="bash" // You could make this dynamic later
                style={vscDarkPlus}
                showLineNumbers={true}
                customStyle={{ margin: 0, borderRadius: 0 }}
              >
                {rice.config.codeSnippet}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {/* Right Column: Description & Copyable Config */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">About this Setup</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {rice.description || "No description provided."}
            </p>
          </div>
          <CommentsSection riceId={rice._id} />
        </div>
      </div>
    </div>
  );
};

export default RiceDetail;
