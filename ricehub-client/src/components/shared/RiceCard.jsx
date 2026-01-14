import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // npx shadcn@latest add badge
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // npx shadcn@latest add avatar
import { Link } from "react-router-dom"; // Ensure Link is imported

const RiceCard = ({ rice }) => {
  return (
    <div className="group relative">
      {/* 1. The Main Card Link (Opens Rice Detail) */}
      <Link to={`/rice/${rice._id}`}>
        <Card className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors duration-300">
          {/* Image */}
          <div className="aspect-video relative overflow-hidden bg-muted">
            <img
              src={rice.imageUrl}
              alt={rice.title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
            />
          </div>

          <CardHeader className="p-4 pb-2">
            <h3 className="font-bold text-lg leading-none truncate">
              {rice.title}
            </h3>
          </CardHeader>

          <CardContent className="p-4 pt-0 flex-grow">
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {rice.config.distro}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {rice.config.windowManager}
              </Badge>
            </div>
          </CardContent>

          {/* Footer with Author Link */}
          <div className="p-4 pt-0 mt-auto flex items-center gap-2">
            {/* 2. The User Link (Opens Profile) 
                 We use object to stop propagation so clicking the user doesn't open the rice detail 
             */}
            <Link
              to={`/profile/${rice.author?.username}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors z-10"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={rice.author?.avatar} />
                <AvatarFallback>{rice.author?.username?.[0]}</AvatarFallback>
              </Avatar>
              <span>{rice.author?.username}</span>
            </Link>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default RiceCard;
