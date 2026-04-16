import Script from "next/script";

const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const domains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;

export function UmamiAnalytics() {
  if (!scriptUrl || !websiteId) {
    return null;
  }

  return (
    <Script
      defer
      src={scriptUrl}
      data-website-id={websiteId}
      data-domains={domains}
      data-do-not-track="true"
      data-exclude-search="true"
      data-auto-track="true"
      strategy="afterInteractive"
    />
  );
}
