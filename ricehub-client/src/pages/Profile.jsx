import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import RiceCard from "@/components/shared/RiceCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import EditProfileDialog from "@/components/shared/EditProfileDialog";
import useAuthStore from "@/store/authStore"; // <--- 1. Import this
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { username } = useParams();

  // 2. Get the currently logged-in user
  const { user: currentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState("posts"); // "posts" or "saved"
  const [savedRices, setSavedRices] = useState([]);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${username}`);
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab === "saved" && savedRices.length === 0) {
        try {
            const { data } = await api.get("/users/saved");
            setSavedRices(data);
        } catch (error) {
            console.error("Failed to fetch saved rices");
        }
    }
};

  if (loading)
    return <div className="text-center mt-20">Loading Profile...</div>;
  if (!profileData)
    return <div className="text-center mt-20">User not found</div>;

  const { user: profileUser, rices } = profileData;

  // 3. Logic: Is this MY profile?
  const isOwnProfile = currentUser && currentUser._id === profileUser._id;

  return (
    <div className="container max-w-5xl mx-auto py-10 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
          <AvatarImage src={profileUser.avatar} />
          <AvatarFallback className="text-4xl">
            {profileUser.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{profileUser.username}</h1>

          {/* 4. PRIVACY CHECK: Only show email if it's me */}
          {isOwnProfile ? (
            <p className="text-muted-foreground">{profileUser.email}</p>
          ) : (
            <p className="text-muted-foreground italic text-sm">
              Contact Hidden
            </p>
          )}

          <p className="text-sm text-gray-500">
            Member since {new Date(profileUser.createdAt).toLocaleDateString()}
          </p>
        </div>
        {isOwnProfile && (
          <div className="pt-2">
            <EditProfileDialog />
          </div>
        )}
      </div>

      <Separator className="my-8" />

      {/* TABS HEADER */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={activeTab === "posts" ? "default" : "outline"}
          onClick={() => handleTabChange("posts")}
        >
          {isOwnProfile ? "My Posts" : "Posts"}
        </Button>

        {/* Only show Saved tab if it is MY profile */}
        {isOwnProfile && (
          <Button
            variant={activeTab === "saved" ? "default" : "outline"}
            onClick={() => handleTabChange("saved")}
          >
            Saved Collection
          </Button>
        )}
      </div>

      {/* GRID CONTENT */}
      <div className="space-y-6">
        {activeTab === "posts" ? (
          // SHOW POSTS
          rices.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">
              No posts yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rices.map((rice) => (
                <RiceCard key={rice._id} rice={rice} />
              ))}
            </div>
          )
        ) : // SHOW SAVED
        savedRices.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">
            You haven't saved anything yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedRices.map((rice) => (
              <RiceCard key={rice._id} rice={rice} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
