const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#020617"/>
  <path d="M19 44V20h7.2l5.8 10.8L37.8 20H45v24h-6.6V30.9l-4.4 8h-4l-4.4-8V44H19z" fill="#fff"/>
</svg>`;

export function GET() {
  return new Response(icon, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400"
    }
  });
}
