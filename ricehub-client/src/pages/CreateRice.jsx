import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea"; // Ensure you installed this: npx shadcn@latest add textarea
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import api from "../lib/api";

const CreateRice = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // 1. Create FormData (Required for file uploads)
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("windowManager", data.windowManager);
      formData.append("distro", data.distro);
      formData.append("dotfilesUrl", data.dotfilesUrl);
      formData.append("codeSnippet", data.codeSnippet);

      // Append the file (it's an array, we take the first one)
      if (data.image[0]) {
        formData.append("image", data.image[0]);
      }

      // 2. Send to Backend
      // Content-Type header is set automatically by axios when passing FormData
      await api.post("/rices", formData);

      // 3. Success!
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to create rice. Make sure you are logged in!");
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Share your Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                {...register("title", { required: true })}
                placeholder="My Awesome Hyprland Rice"
              />
              {errors.title && (
                <span className="text-red-500 text-sm">Title is required</span>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Screenshot</Label>
              <input
                type="file"
                accept="image/*"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium"
                {...register("image", { required: true })}
              />
              {errors.image && (
                <span className="text-red-500 text-sm">Image is required</span>
              )}
            </div>

            {/* Config Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Window Manager</Label>
                <Input
                  {...register("windowManager", { required: true })}
                  placeholder="e.g. Hyprland"
                />
              </div>
              <div className="space-y-2">
                <Label>Distro</Label>
                <Input
                  {...register("distro", { required: true })}
                  placeholder="e.g. Arch"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dotfiles URL (GitHub)</Label>
              <Input
                {...register("dotfilesUrl")}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label>Config Snippet (Optional)</Label>
              <Textarea
                {...register("codeSnippet")}
                placeholder="Paste your key config here (e.g. hyprland.conf content)..."
                className="font-mono text-sm min-h-[150px] bg-slate-950 text-slate-50"
              />
              <p className="text-xs text-muted-foreground">
                Paste your main config file here for others to copy.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Tell us about your theme, fonts, etc."
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Publish Rice"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRice;
