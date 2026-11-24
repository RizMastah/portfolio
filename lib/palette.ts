export type PaletteId = "morning" | "lab" | "evening" | "night";

export const PALETTES: {
  id: PaletteId;
  label: string;
  hours: string;
  from: number;
  swatch: string;
}[] = [
  { id: "morning", label: "Morning", hours: "06–10", from: 6, swatch: "#f5c542" },
  { id: "lab", label: "Lab", hours: "10–18", from: 10, swatch: "#3ddc97" },
  { id: "evening", label: "Evening", hours: "18–22", from: 18, swatch: "#ff8a3d" },
  { id: "night", label: "Late night", hours: "22–06", from: 22, swatch: "#a493ff" },
];

export function nanjingHour(date = new Date()) {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Shanghai",
      hour: "numeric",
      hourCycle: "h23",
    }).format(date),
  );
}

export function paletteForHour(hour: number): PaletteId {
  if (hour >= 22 || hour < 6) return "night";
  if (hour >= 18) return "evening";
  if (hour >= 10) return "lab";
  return "morning";
}

/**
 * Runs in <head> before first paint: marks JS as available (enables motion
 * CSS) and applies the saved/automatic palette and theme, so there is no flash.
 */
export const paletteBootScript = `(function(){var d=document.documentElement;d.classList.add('js');var p=null,t=null;try{p=localStorage.getItem('rab:palette');t=localStorage.getItem('rab:theme')}catch(e){}if(!p){var h=+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'numeric',hourCycle:'h23'}).format(new Date());p=h>=22||h<6?'night':h>=18?'evening':h>=10?'lab':'morning'}d.dataset.palette=p;d.dataset.theme=t==='light'?'light':'dark'})();`;
