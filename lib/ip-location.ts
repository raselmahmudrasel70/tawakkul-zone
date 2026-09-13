export async function getIPLocation(ip: string) {
  try {
    if (!ip || ip === "Unknown IP") {
      return null;
    }

    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,query`);

    const data = await res.json();

    if (data.status !== "success") {
      return null;
    }

    return {
      ip: data.query,
      country: data.country,
      region: data.regionName,
      city: data.city,
      isp: data.isp,
    };
  } catch {
    return null;
  }
}