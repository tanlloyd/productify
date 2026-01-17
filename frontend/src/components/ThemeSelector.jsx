import { useEffect, useState } from "react";
import { PaletteIcon } from "lucide-react";

const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

function ThemeSelector() {
  const [theme, setTheme] = useState(() => {        // store current theme, default theme to forest 
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "forest";
    }
    return "forest";
  });

  useEffect(() => {     // apply theme to whole app
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-1">
        <PaletteIcon className="size-4" />
        <span className="hidden sm:inline">Theme</span>
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-200 rounded-box z-50 w-56 p-2 shadow-xl max-h-96 overflow-y-auto flex-nowrap"
      >
        {THEMES.map((t) => (        // loop through all available themes
          <li key={t}>
            <button
              onClick={() => setTheme(t)}
              className={`flex justify-between ${
                theme === t ? "bg-primary text-primary-content" : ""
              }`}
            >
              <span className="capitalize">{t}</span>
              <div className="flex gap-0.5" data-theme={t}>     {/* preview of theme */}
                <span className="w-2 h-4 rounded-sm bg-primary" />
                <span className="w-2 h-4 rounded-sm bg-secondary" />
                <span className="w-2 h-4 rounded-sm bg-accent" />
                <span className="w-2 h-4 rounded-sm bg-neutral" />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ThemeSelector;

// choose theme
