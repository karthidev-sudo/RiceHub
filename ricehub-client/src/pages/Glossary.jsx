import { useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

// 📚 DATA: The Dictionary
const glossaryData = [
  {
    category: "Core Concepts",
    terms: [
      { term: "Rice / Ricing", def: "The act of making visual improvements and customizations to your desktop environment. Derived from 'Race Inspired Cosmetic Enhancements' (cars)." },
      { term: "Dotfiles", def: "Configuration files on Unix-like systems. They start with a dot (e.g., .bashrc) and are usually hidden by default. They store user preferences." },
      { term: "Workflow", def: "The specific way a user interacts with their computer to achieve tasks. Examples: 'Mouse-driven', 'Keyboard-centric', 'Workspace-based'." },
      { term: "RTFM", def: "Read The F***ing Manual. A common (aggressive) response in Linux communities telling users to read documentation before asking questions." },
    ]
  },
  {
    category: "Architecture",
    terms: [
      { term: "Kernel", def: "The core of the operating system that manages hardware and resources. Linux is the kernel; the OS is technically GNU/Linux." },
      { term: "Shell", def: "A command-line interface to interact with the OS. Examples: Bash, Zsh, Fish." },
      { term: "X11 / Xorg", def: "The legacy display server protocol. Stable and compatible, but old and 'bloated'. It lacks modern features like perfect mixed-DPI scaling." },
      { term: "Wayland", def: "The modern replacement for X11. It is more secure, smoother (no tearing), and architecture-cleaner. Hyprland is a Wayland compositor." },
      { term: "Compositor", def: "Software that manages the display of windows. In Wayland, the Window Manager IS the compositor. It handles effects like transparency and blur." },
    ]
  },
  {
    category: "Window Management",
    terms: [
      { term: "Tiling WM", def: "A window manager that automatically arranges windows to fill the screen in a non-overlapping grid (tiles). Examples: i3, Hyprland, Sway." },
      { term: "Floating WM", def: "The traditional window management style (like Windows/macOS) where windows can overlap and be dragged freely." },
      { term: "Dynamic WM", def: "A Window Manager that can switch between Tiling and Floating layouts on the fly (e.g., DWM, AwesomeWM)." },
      { term: "Workspaces", def: "Virtual desktops that allow you to group windows together. Tiling WMs often use numbered workspaces (1-9)." },
    ]
  },
  {
    category: "Visuals & Theming",
    terms: [
      { term: "GTK", def: "GIMP Toolkit. A widget toolkit used for creating GUIs. Used by GNOME, XFCE, and many apps. Theming GTK is a core part of ricing." },
      { term: "Qt", def: "A cross-platform app framework. Used by KDE Plasma. Often difficult to make look identical to GTK apps." },
      { term: "Nerd Fonts", def: "Fonts patched with thousands of icons (glyphs). Essential for displaying icons in terminal, bars, and file managers." },
      { term: "Blur / Kawase", def: "A visual effect that blurs the background behind transparent windows. 'Dual Kawase' is a high-quality blur algorithm supported by Hyprland." },
    ]
  }
];

const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // 🔍 Filter Logic
  const filteredData = glossaryData.map(category => ({
    ...category,
    terms: category.terms.filter(item => 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.def.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.terms.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* 🟢 HEADER */}
      <div className="border-b bg-zinc-950/50 py-12">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-primary mb-4 opacity-80" />
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            The Knowledge Base
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Decode the jargon. Understand the system.
          </p>
          
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              className="pl-10 h-12 text-lg bg-zinc-900/50 border-zinc-800 focus-visible:ring-primary"
              placeholder="Search for terms (e.g., 'Compositor', 'Wayland')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 🟢 CONTENT LIST */}
      <div className="container mx-auto max-w-3xl px-4 py-12">
        {filteredData.length > 0 ? (
          <div className="space-y-10">
            {filteredData.map((category, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-primary">{category.category}</h2>
                  <div className="h-[1px] flex-1 bg-zinc-800"></div>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                  {category.terms.map((item, j) => (
                    <AccordionItem 
                      key={j} 
                      value={`item-${i}-${j}`} 
                      className="border border-zinc-800 rounded-xl px-4 bg-card/30 overflow-hidden transition-all hover:border-zinc-700"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <span className="text-lg font-medium text-left">{item.term}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-zinc-400 text-base leading-relaxed pb-4">
                        {item.def}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl">No results found for "{searchTerm}"</p>
            <p className="text-sm mt-2">Try searching for generic terms like "Window" or "Shell".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Glossary;