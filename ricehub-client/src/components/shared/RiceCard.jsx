import { Link } from "react-router-dom";
import { Heart, MessageSquare, Eye } from "lucide-react"; // Ensure icons are imported

const RiceCard = ({ rice }) => {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-lg">
      
      {/* 1. IMAGE LINK (Separate) */}
      <Link to={`/rice/${rice._id}`} className="block overflow-hidden">
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={rice.image}
            alt={rice.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {/* 2. TITLE LINK (Separate) */}
        <Link to={`/rice/${rice._id}`} className="mb-2 block">
          <h3 className="font-semibold leading-none tracking-tight hover:text-primary transition-colors line-clamp-1">
            {rice.title}
          </h3>
        </Link>
        
        {/* Description (Optional) */}
        {rice.description && (
           <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
             {rice.description}
           </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          {/* 3. AUTHOR LINK (Separate - No longer inside another link) */}
          <Link 
            to={`/profile/${rice.author?.username}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {/* Avatar (Optional fallback if no avatar image) */}
            <div className="h-6 w-6 rounded-full bg-zinc-800 overflow-hidden">
               {rice.author?.avatar && <img src={rice.author.avatar} alt="avatar" />}
            </div>
            <span className="font-medium">{rice.author?.username || "Unknown"}</span>
          </Link>
          
          {/* Stats (Likes/Views) */}
          <div className="flex items-center gap-3 text-muted-foreground text-xs">
             <div className="flex items-center gap-1">
               <Heart className="h-3 w-3" /> 
               <span>{rice.likes?.length || 0}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiceCard;