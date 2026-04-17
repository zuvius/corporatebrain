"use client";

interface IconProps {
  className?: string;
  size?: number;
}

// Slack Icon
export function SlackIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 127 127"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M27.2 80.1c0 7.3-5.9 13.2-13.2 13.2S.8 87.4.8 80.1c0-7.3 5.9-13.2 13.2-13.2h13.2v13.2zm6.6 0c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2V80.1z"
        fill="#E01E5A"
      />
      <path
        d="M47 27c-7.3 0-13.2-5.9-13.2-13.2S39.7.6 47 .6s13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9s5.9-13.2 13.2-13.2H47z"
        fill="#36C5F0"
      />
      <path
        d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6s13.2 5.9 13.2 13.2v33.1z"
        fill="#2EB67D"
      />
      <path
        d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2s5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2H80.1z"
        fill="#ECB22E"
      />
    </svg>
  );
}

// Google Drive Icon
export function GoogleDriveIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M24 4L8 28h32L24 4z" fill="#0066DA" />
      <path d="M8 28L2 38h18l-12-10z" fill="#00AC47" />
      <path d="M40 28l-6 10h18l-12-10z" fill="#00832D" />
      <path d="M24 28l6 10h12l-18-10z" fill="#2684FC" />
      <path d="M24 28l-6 10H6l18-10z" fill="#EA4335" />
      <path d="M24 4l16 24h-10L24 4z" fill="#FFBA00" />
    </svg>
  );
}

// Notion Icon
export function NotionIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="8" fill="#000" />
      <path
        d="M12 8h24l-4 4H16l-4-4z"
        fill="#fff"
      />
      <path
        d="M12 8v32l4-4V12l-4-4z"
        fill="#fff"
      />
      <path
        d="M36 8v32l-4-4V12l4-4z"
        fill="#fff"
      />
      <path
        d="M20 16h8v4h-8v-4z"
        fill="#fff"
      />
      <text
        x="24"
        y="38"
        textAnchor="middle"
        fill="#fff"
        fontSize="14"
        fontWeight="bold"
        fontFamily="serif"
      >
        N
      </text>
    </svg>
  );
}

// Microsoft Teams Icon
export function MicrosoftTeamsIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="8" fill="#5059C9" />
      <circle cx="32" cy="14" r="8" fill="#7B83EB" />
      <rect x="20" y="22" width="20" height="20" rx="4" fill="#7B83EB" />
      <circle cx="14" cy="34" r="6" fill="#7B83EB" />
      <circle cx="14" cy="18" r="6" fill="#7B83EB" />
    </svg>
  );
}

// Gmail Icon
export function GmailIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="8" fill="#EA4335" />
      <path d="M24 14l-12 8v14h8V26h8v10h8V22l-12-8z" fill="#fff" />
      <path d="M24 14l12 8-12-8z" fill="#C5221F" />
      <path d="M12 22l12-8-12 8z" fill="#FBBC04" />
    </svg>
  );
}

// URL/Globe Icon for custom URL integration
export function UrlIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// File Upload Icon
export function FileUploadIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12 18v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15l3-3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Get icon by provider
export function getIntegrationIcon(provider: string, size = 48) {
  switch (provider) {
    case "slack":
      return <SlackIcon size={size} />;
    case "google_drive":
      return <GoogleDriveIcon size={size} />;
    case "gmail":
      return <GmailIcon size={size} />;
    case "notion":
      return <NotionIcon size={size} />;
    case "microsoft_teams":
      return <MicrosoftTeamsIcon size={size} />;
    case "url":
      return <UrlIcon size={size} />;
    case "file_upload":
      return <FileUploadIcon size={size} />;
    default:
      return (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-2xl">
          🔌
        </div>
      );
  }
}
