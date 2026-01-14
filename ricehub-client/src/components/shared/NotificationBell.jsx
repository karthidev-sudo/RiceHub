import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error(error);
    }
  };

  // Poll for notifications every 30 seconds (Simple real-time)
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async () => {
    if (unreadCount > 0) {
      try {
        await api.put("/notifications/read");
        setUnreadCount(0);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && handleMarkRead()}>
      <DropdownMenuTrigger className="relative outline-none">
        <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif) => (
              <DropdownMenuItem key={notif._id} className="p-3 cursor-default focus:bg-muted/50">
                <div className="flex items-start gap-3 w-full">
                  
                  {/* 1. Avatar -> Link to Profile */}
                  <Link to={`/profile/${notif.sender?.username}`} className="mt-1">
                    <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity">
                      <AvatarImage src={notif.sender?.avatar} />
                      <AvatarFallback>{notif.sender?.username?.[0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                  
                  <div className="flex flex-col gap-1 w-full">
                    <span className="text-sm">
                      {/* 2. Username -> Link to Profile */}
                      <Link 
                        to={`/profile/${notif.sender?.username}`}
                        className="font-semibold hover:underline"
                      >
                        {notif.sender?.username}
                      </Link>{" "}
                      
                      {/* 3. Action Text -> Link to Rice Detail */}
                      <Link to={`/rice/${notif.rice?._id}`} className="hover:text-muted-foreground transition-colors">
                        {notif.type === "like" ? "liked" : "commented on"}{" "}
                        <span className="font-medium text-muted-foreground">
                          "{notif.rice?.title}"
                        </span>
                      </Link>
                    </span>
                    
                    <span className="text-xs text-muted-foreground">
                        {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Blue dot for unread */}
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;