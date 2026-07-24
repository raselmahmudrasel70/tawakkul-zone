export async function collectSecurityInfo() {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
    };
  };

  // GPU (যদি পাওয়া যায়)
  let gpu = "Unknown";
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    if (gl && "getParameter" in gl) {
      const ext = (gl as WebGLRenderingContext).getExtension(
        "WEBGL_debug_renderer_info"
      );

      if (ext) {
        gpu = (gl as WebGLRenderingContext).getParameter(
          ext.UNMASKED_RENDERER_WEBGL
        );
      }
    }
  } catch {}

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages,

    platform: navigator.platform,

    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

    screen: {
      width: screen.width,
      height: screen.height,
    },

    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },

    pixelRatio: window.devicePixelRatio,

    cpuCores: navigator.hardwareConcurrency,

    memory: nav.deviceMemory ?? "Unknown",

    gpu,

    cookiesEnabled: navigator.cookieEnabled,

    online: navigator.onLine,

    connection: nav.connection?.effectiveType ?? "Unknown",

    downlink: nav.connection?.downlink ?? "Unknown",

    rtt: nav.connection?.rtt ?? "Unknown",

    touch:
      navigator.maxTouchPoints > 0,

    darkMode:
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  };
}