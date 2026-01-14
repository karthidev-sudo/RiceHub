import { useEffect, useState } from "react";
import api from "@/lib/api";
import RiceCard from "@/components/shared/RiceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Ensure you have input component
import { Link } from "react-router-dom";
import { Search } from "lucide-react"; // npm install lucide-react if missing

const Home = () => {
  const [rices, setRices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [sortType, setSortType] = useState("latest"); // 'latest' or 'top'

  // Common Linux Window Managers for quick filtering
  const filters = ["Hyprland", "i3", "KDE", "Gnome", "BSPWM"];

  useEffect(() => {
    // Inside useEffect
    let query = "/rices?";
    if (searchTerm) query += `search=${searchTerm}&`;
    if (activeFilter) query += `wm=${activeFilter}&`;
    if (sortType) query += `sort=${sortType}`; // <--- Send sort param
    // Create a debounce to avoid spamming the API while typing
    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        // Construct URL query params
        let query = "/rices?";
        if (searchTerm) query += `search=${searchTerm}&`;
        if (activeFilter) query += `wm=${activeFilter}`;

        const { data } = await api.get(query);
        setRices(data);
      } catch (error) {
        console.error("Failed to fetch rices:", error);
      } finally {
        setLoading(false);
      }
    }, 500); // Wait 500ms after typing stops

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, activeFilter]);

  return (
    <div className="space-y-8">
      {/* Hero / Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Rices</h1>
          <p className="text-muted-foreground mt-1">
            Discover the best Linux setups.
          </p>
        </div>
        <Link to="/create">
          <Button>+ Upload Rice</Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-muted/30 p-4 rounded-lg">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rices (e.g. Arch, Dark theme...)"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={activeFilter === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("")}
          >
            All
          </Button>
          {filters.map((wm) => (
            <Button
              key={wm}
              variant={activeFilter === wm ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(wm === activeFilter ? "" : wm)}
            >
              {wm}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <span className="text-sm text-muted-foreground self-center mr-2">
          Sort by:
        </span>
        <Button
          variant={sortType === "latest" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSortType("latest")}
        >
          Newest
        </Button>
        <Button
          variant={sortType === "top" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSortType("top")}
        >
          Most Popular
        </Button>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Skeleton Loading could go here */}
          <p className="col-span-3 text-center py-10 text-muted-foreground">
            Searching...
          </p>
        </div>
      ) : rices.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-lg">
          <h2 className="text-xl font-semibold">No rices found.</h2>
          <p className="text-muted-foreground">
            Try adjusting your search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rices.map((rice) => (
            <RiceCard key={rice._id} rice={rice} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
