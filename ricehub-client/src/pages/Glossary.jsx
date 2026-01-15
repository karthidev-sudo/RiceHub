import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const terms = [
  { term: "Rice / Ricing", def: "The act of making visual improvements and customizations to your desktop environment. Derived from 'Race Inspired Cosmetic Enhancements' (cars)." },
  { term: "Dotfiles", def: "Configuration files on Unix-like systems. They start with a dot (e.g., .bashrc) and are usually hidden by default." },
  { term: "Window Manager (WM)", def: "System software that controls the placement and appearance of windows. Examples: i3, Hyprland, Awesome." },
  { term: "Compositor", def: "Software that provides a buffer for windows to be drawn on, allowing for effects like transparency, shadows, and animations. (e.g., Picom, Hyprland)." },
  { term: "Desktop Environment (DE)", def: "A complete bundle of software that provides a consistent user interface (WM, File Manager, Panels, Settings). Examples: GNOME, KDE." },
  { term: "Tiling WM", def: "A window manager that automatically arranges windows to fill the screen without overlapping, like tiles on a floor." },
  { term: "Bar / Panel", def: "A strip (usually at the top or bottom) displaying information like time, battery, workspaces, and system tray." },
];

const Glossary = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl min-h-screen">
       <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">The Glossary</h1>
        <p className="text-muted-foreground">Understanding the language of Linux customization.</p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {terms.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border border-zinc-800 rounded-lg px-4 bg-zinc-900/30">
            <AccordionTrigger className="hover:no-underline hover:text-primary text-lg">
              {item.term}
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400 leading-relaxed pb-4">
              {item.def}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Glossary;