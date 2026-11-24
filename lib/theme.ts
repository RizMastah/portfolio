// Two color modes: dark (default) and light. Background colors here must match
// the --bg values in app/globals.css; they feed the browser's theme-color.
export type Theme = "dark" | "light";

export const THEME_KEY = "rab:theme";
const META_ID = "rab-theme-color";

export const themeColors: Record<Theme, string> = {
  dark: "#0c0f10",
  light: "#f4f3ef",
};

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.getElementById(META_ID)?.setAttribute("content", themeColors[theme]);
}

/**
 * Runs in <head> before first paint: marks JS as available (enables the
 * motion CSS) and applies the saved theme, so there is no flash.
 * It adds its own theme-color meta as the first one in <head> (browsers use the
 * first match) instead of editing the one Next.js renders, which React owns.
 */
export const themeBootScript = `(function(){var d=document.documentElement;d.classList.add('js');var t=null;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}t=t==='light'?'light':'dark';d.dataset.theme=t;var c=${JSON.stringify(
  themeColors,
)};var m=document.createElement('meta');m.name='theme-color';m.id='${META_ID}';m.content=c[t];document.head.prepend(m)})();`;
