// Server-safe part of the effects switch (see lib/fx.ts for the client hook).
export const FX_KEY = "rab:fx";
export const FX_EVENT = "rab:fx-change";

/** Inline boot snippet: restore the saved choice before first paint. */
export const fxBootScript = `try{if(localStorage.getItem("${FX_KEY}")==="off")document.documentElement.classList.add("fx-off")}catch(e){}`;
