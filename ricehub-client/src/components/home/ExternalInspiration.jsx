import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExternalInspiration = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/external");
        setItems(data.slice(0, 6)); // Show top 6 mixed results
      } catch (error) {
        console.error("Failed to load external rices", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10 text-muted-foreground">Loading inspiration...</div>;
  if (items.length === 0) return null;

  return (
    <div className="space-y-6 my-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">From the Community</h2>
          <p className="text-muted-foreground">Trending rices from GitHub & YouTube</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card 
            key={item.id} 
            className="group overflow-hidden border-zinc-800 bg-zinc-900/50 hover:border-primary/50 transition-all duration-300"
          >
            <div className="relative aspect-video overflow-hidden bg-black">
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="gap-1 bg-black/50 backdrop-blur text-white border-0">
                  {item.source === 'github' ? <Github className="h-3 w-3" /> : <Youtube className="h-3 w-3 text-red-500" />}
                  {item.source === 'github' ? 'Repo' : 'Video'}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                  by <span className="text-foreground font-medium">{item.author}</span>
                  <span>•</span>
                  <span>{item.stats}</span>
                </p>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                {item.description || "No description provided."}
              </p>

              <Button 
                asChild 
                variant="outline" 
                className="w-full bg-transparent border-zinc-700 hover:bg-zinc-800 hover:text-white group/btn"
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  View Source 
                  <ExternalLink className="ml-2 h-3 w-3 opacity-50 group-hover/btn:opacity-100" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExternalInspiration;