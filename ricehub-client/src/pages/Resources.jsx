import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Terminal, Layout, Monitor } from "lucide-react";

// 📚 STATIC DATA: You can move this to a database later if you want
const resources = {
  wms: [
    { name: "Hyprland", desc: "A dynamic tiling Wayland compositor that doesn't sacrifice on looks.", tags: ["Wayland", "Tiling"], url: "https://hyprland.org/" },
    { name: "i3wm", desc: "The classic tiling window manager. Stable, fast, and X11 based.", tags: ["X11", "Tiling"], url: "https://i3wm.org/" },
    { name: "KDE Plasma", desc: "A powerful, customizable desktop environment. Good for beginners.", tags: ["Wayland/X11", "Floating"], url: "https://kde.org/plasma-desktop/" },
    { name: "BSPWM", desc: "A tiling window manager based on binary space partitioning.", tags: ["X11", "Tiling"], url: "https://github.com/baskerville/bspwm" },
  ],
  terminals: [
    { name: "Kitty", desc: "A GPU-based terminal emulator. Fast, feature-rich, and scriptable.", tags: ["GPU", "Images"], url: "https://sw.kovidgoyal.net/kitty/" },
    { name: "Alacritty", desc: "A modern terminal emulator that is the fastest of them all.", tags: ["GPU", "Rust"], url: "https://github.com/alacritty/alacritty" },
    { name: "WezTerm", desc: "A GPU-accelerated cross-platform terminal emulator and multiplexer.", tags: ["Lua", "GPU"], url: "https://wezfurlong.org/wezterm/" },
  ],
  bars: [
    { name: "Waybar", desc: "Highly customizable Wayland bar for Sway and Hyprland.", tags: ["Wayland", "CSS"], url: "https://github.com/Alexays/Waybar" },
    { name: "Polybar", desc: "A fast and easy-to-use tool for creating status bars.", tags: ["X11", "Ini"], url: "https://github.com/polybar/polybar" },
    { name: "Eww", desc: "ElKowars wacky widgets. Build complex widgets using a custom DSL.", tags: ["Wayland/X11", "Rust"], url: "https://elkowar.github.io/eww/" },
  ]
};

const ResourceCard = ({ item }) => (
  <Card className="bg-zinc-900/50 border-zinc-800 hover:border-primary/50 transition-colors group">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-xl text-primary group-hover:text-white transition-colors">
            {item.name}
          </CardTitle>
          <div className="flex gap-2 mt-2">
            {item.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] bg-zinc-800">{tag}</Badge>
            ))}
          </div>
        </div>
        <a href={item.url} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white">
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-zinc-400">{item.desc}</CardDescription>
    </CardContent>
  </Card>
);

const Resources = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">The Arsenal</h1>
        <p className="text-muted-foreground text-lg">
          The essential tools and components you need to build your dream setup.
        </p>
      </div>

      <Tabs defaultValue="wms" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900 h-14 p-1 mb-8">
          <TabsTrigger value="wms" className="data-[state=active]:bg-zinc-800 h-full gap-2">
            <Layout className="h-4 w-4" /> Window Managers
          </TabsTrigger>
          <TabsTrigger value="terminals" className="data-[state=active]:bg-zinc-800 h-full gap-2">
            <Terminal className="h-4 w-4" /> Terminals
          </TabsTrigger>
          <TabsTrigger value="bars" className="data-[state=active]:bg-zinc-800 h-full gap-2">
            <Monitor className="h-4 w-4" /> Bars & Widgets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wms" className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {resources.wms.map((item, i) => <ResourceCard key={i} item={item} />)}
        </TabsContent>
        
        <TabsContent value="terminals" className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {resources.terminals.map((item, i) => <ResourceCard key={i} item={item} />)}
        </TabsContent>
        
        <TabsContent value="bars" className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {resources.bars.map((item, i) => <ResourceCard key={i} item={item} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;