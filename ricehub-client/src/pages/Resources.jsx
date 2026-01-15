import { useState } from "react";
import { ExternalLink, Terminal, Layout, Monitor, MousePointer2, Bell, Cpu, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// 📚 DATA: The Massive Library
const categories = [
  { id: "wms", label: "Window Managers", icon: Layout },
  { id: "terminals", label: "Terminals", icon: Terminal },
  { id: "bars", label: "Bars & Widgets", icon: Monitor },
  { id: "launchers", label: "Launchers", icon: MousePointer2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "tools", label: "System Tools", icon: Cpu },
  { id: "themes", label: "Theming", icon: Palette },
];

const resourceData = {
  wms: [
    { name: "Hyprland", desc: "A dynamic tiling Wayland compositor based on wlroots that doesn't sacrifice on looks.", tags: ["Wayland", "Dynamic", "C++"], url: "https://hyprland.org/" },
    { name: "Sway", desc: "i3-compatible Wayland compositor. Rock stable, drop-in replacement for i3 users.", tags: ["Wayland", "Tiling", "C"], url: "https://swaywm.org/" },
    { name: "i3wm", desc: "The world's most popular tiling window manager. Lightweight, stable, and X11 based.", tags: ["X11", "Tiling", "C"], url: "https://i3wm.org/" },
    { name: "AwesomeWM", desc: "Highly configurable, next-generation framework window manager for X. Scripted in Lua.", tags: ["X11", "Dynamic", "Lua"], url: "https://awesomewm.org/" },
    { name: "BSPWM", desc: "Binary Space Partitioning Window Manager. Files are configured via shell scripts.", tags: ["X11", "Tiling", "C"], url: "https://github.com/baskerville/bspwm" },
    { name: "DWM", desc: "Dynamic Window Manager for X. Suckless philosophy. Configured by editing source code.", tags: ["X11", "Dynamic", "C"], url: "https://dwm.suckless.org/" },
  ],
  terminals: [
    { name: "Kitty", desc: "The modern standard. GPU-accelerated, image support, and highly scriptable.", tags: ["GPU", "Python/C", "Images"], url: "https://sw.kovidgoyal.net/kitty/" },
    { name: "Alacritty", desc: "A cross-platform, OpenGL terminal emulator. Known for being the fastest terminal in existence.", tags: ["GPU", "Rust", "Speed"], url: "https://github.com/alacritty/alacritty" },
    { name: "WezTerm", desc: "A GPU-accelerated cross-platform terminal emulator and multiplexer.", tags: ["GPU", "Lua", "Multiplexer"], url: "https://wezfurlong.org/wezterm/" },
    { name: "Foot", desc: "A fast, lightweight, and minimalistic Wayland terminal emulator.", tags: ["Wayland", "Lightweight"], url: "https://codeberg.org/dnkl/foot" },
  ],
  bars: [
    { name: "Waybar", desc: "Highly customizable Wayland bar for Sway and Wlroots based compositors.", tags: ["Wayland", "CSS"], url: "https://github.com/Alexays/Waybar" },
    { name: "Eww", desc: "ElKowars Wacky Widgets. Build complex widgets and bars using a custom DSL.", tags: ["Rust", "Widgets", "Complex"], url: "https://elkowar.github.io/eww/" },
    { name: "Polybar", desc: "A fast and easy-to-use tool for creating status bars. The standard for X11.", tags: ["X11", "INI"], url: "https://github.com/polybar/polybar" },
    { name: "AGS", desc: "Aylur's GTK Shell. A widget system for Wayland configured using GJS (JS/TS).", tags: ["Wayland", "JS", "Advanced"], url: "https://github.com/Aylur/ags" },
  ],
  launchers: [
    { name: "Rofi", desc: "A window switcher, application launcher and dmenu replacement.", tags: ["X11", "Themable"], url: "https://github.com/davatorium/rofi" },
    { name: "Wofi", desc: "A launcher/menu program for Wayland compositors like Sway.", tags: ["Wayland", "GTK"], url: "https://hg.sr.ht/~scoopta/wofi" },
    { name: "Fuzzel", desc: "Application launcher for wlroots based Wayland compositors, similar to rofi.", tags: ["Wayland", "Fast"], url: "https://codeberg.org/dnkl/fuzzel" },
    { name: "Tofi", desc: "An extremely fast, minimalistic, and lightweight launcher for Wayland.", tags: ["Wayland", "Minimal"], url: "https://github.com/philj56/tofi" },
  ],
  notifications: [
    { name: "Dunst", desc: "Lightweight notification daemon. Highly customizable look and feel.", tags: ["X11", "Minimal"], url: "https://dunst-project.org/" },
    { name: "Mako", desc: "A lightweight notification daemon for Wayland.", tags: ["Wayland", "Simple"], url: "https://github.com/emersion/mako" },
    { name: "SwayNC", desc: "A simple notification daemon with a control center panel for Sway/Hyprland.", tags: ["Wayland", "Control Center"], url: "https://github.com/ErikReider/SwayNotificationCenter" },
  ],
  tools: [
    { name: "Neofetch", desc: "A command-line system information tool written in bash 3.2+.", tags: ["CLI", "Info"], url: "https://github.com/dylanaraps/neofetch" },
    { name: "Fastfetch", desc: "Like neofetch, but much faster because it's written in C.", tags: ["CLI", "C", "Fast"], url: "https://github.com/fastfetch-cli/fastfetch" },
    { name: "Btop", desc: "Resource monitor that shows usage and stats for processor, memory, disks, network and processes.", tags: ["TUI", "Monitoring"], url: "https://github.com/aristocratos/btop" },
    { name: "Ranger", desc: "A VIM-inspired file manager for the console.", tags: ["TUI", "Python"], url: "https://github.com/ranger/ranger" },
  ],
  themes: [
    { name: "Catppuccin", desc: "A community-driven pastel theme that aims to be the middle ground between high and low contrast.", tags: ["Pastel", "Popular"], url: "https://github.com/catppuccin/catppuccin" },
    { name: "Nord", desc: "An arctic, north-bluish color palette.", tags: ["Cold", "Blue"], url: "https://www.nordtheme.com/" },
    { name: "Gruvbox", desc: "A retro groove color scheme for a comfortable reading environment.", tags: ["Retro", "Warm"], url: "https://github.com/morhetz/gruvbox" },
    { name: "Dracula", desc: "Dark theme for many editors, shells, and more.", tags: ["Dark", "Vampire"], url: "https://draculatheme.com/" },
  ],
};

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState("wms");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {/* 🟢 SIDEBAR (Sticky) */}
      <aside className="hidden w-64 flex-col border-r bg-zinc-950/50 p-4 md:flex fixed h-full top-16 left-0 overflow-y-auto">
        <div className="mb-6 px-2">
          <h2 className="text-xl font-bold tracking-tight">The Arsenal</h2>
          <p className="text-xs text-muted-foreground mt-1">Essential tools for your setup.</p>
        </div>
        <nav className="space-y-1">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => setActiveCategory(cat.id)}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </Button>
          ))}
        </nav>
      </aside>

      {/* 🟢 MAIN CONTENT */}
      <main className="flex-1 p-6 md:ml-64">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {categories.find((c) => c.id === activeCategory)?.label}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Curated list of the best tools in this category.
          </p>
        </div>
        
        <Separator className="my-6" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resourceData[activeCategory]?.map((item, index) => (
            <Card key={index} className="group transition-all hover:border-primary/50 hover:shadow-lg bg-zinc-900/40 backdrop-blur">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] uppercase font-mono tracking-wider">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-zinc-800 rounded-full"
                  >
                    <ExternalLink className="h-5 w-5 text-primary" />
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed text-zinc-400">
                  {item.desc}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Resources;