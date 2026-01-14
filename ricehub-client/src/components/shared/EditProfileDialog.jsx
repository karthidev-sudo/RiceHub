import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const EditProfileDialog = () => {
  const { user, login } = useAuthStore(); // login updates the local store
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      username: user?.username,
      bio: user?.bio,
      github: user?.socials?.github,
      twitter: user?.socials?.twitter,
    }
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("bio", data.bio);
      formData.append("github", data.github);
      formData.append("twitter", data.twitter);

      // Only append avatar if user picked a file
      if (data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }

      // API Call
      const res = await api.put("/users/profile", formData);
      
      // Update Local State (So UI updates instantly)
      login(res.data); // We reuse the 'login' action to update user data
      
      setOpen(false); // Close modal
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input {...register("username")} />
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea {...register("bio")} placeholder="Tell us about yourself..." />
          </div>
          
          <div className="space-y-2">
            <Label>Avatar</Label>
            <Input type="file" accept="image/*" {...register("avatar")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>GitHub Username</Label>
                <Input {...register("github")} placeholder="kxrthi" />
            </div>
            <div className="space-y-2">
                <Label>Twitter/X</Label>
                <Input {...register("twitter")} placeholder="@..." />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;