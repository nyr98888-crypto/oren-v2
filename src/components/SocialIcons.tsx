"use client";

import { useId, type SVGProps } from "react";

type IconProps = {
  className?: string;
  size?: number;
} & Omit<SVGProps<SVGSVGElement>, "width" | "height" | "className">;

function baseSize(size?: number) {
  return size ?? 22;
}

export function FacebookIcon({ className, size, ...rest }: IconProps) {
  const s = baseSize(size);
  return (
    <svg
      viewBox="0 0 24 24"
      width={s}
      height={s}
      className={className}
      aria-hidden
      {...rest}
    >
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.5 22.05V14.4h2.55l.38-2.97H13.5V9.53c0-.86.24-1.45 1.47-1.45h1.57V5.42A21.1 21.1 0 0 0 14.1 5.25c-2.3 0-3.88 1.4-3.88 3.98v2.2H7.7v2.97h2.52v7.65h3.28Z"
      />
    </svg>
  );
}

export function InstagramIcon({ className, size, ...rest }: IconProps) {
  const s = baseSize(size);
  const gid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 24 24"
      width={s}
      height={s}
      className={className}
      aria-hidden
      {...rest}
    >
      <defs>
        <linearGradient id={`ig-${gid}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F77737" />
          <stop offset="50%" stopColor="#FD1D1D" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill={`url(#ig-${gid})`} />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="#fff" />
      <rect
        x="3.8"
        y="3.8"
        width="16.4"
        height="16.4"
        rx="4.5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function WhatsAppIcon({ className, size, ...rest }: IconProps) {
  const s = baseSize(size);
  return (
    <svg
      viewBox="0 0 24 24"
      width={s}
      height={s}
      className={className}
      aria-hidden
      {...rest}
    >
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#fff"
        d="M17.47 14.38c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.98 2.67 1.12 2.85.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.57.65.21 1.25.18 1.72.11.52-.08 1.6-.65 1.83-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.32Z"
      />
      <path
        fill="#fff"
        d="M12.04 4.1a7.9 7.9 0 0 0-6.75 11.98L4.1 19.9l3.9-1.02a7.9 7.9 0 1 0 4.04-14.78Zm0 14.35a6.44 6.44 0 0 1-3.28-.9l-.24-.14-2.31.6.62-2.25-.15-.23a6.45 6.45 0 1 1 5.36 2.92Z"
      />
    </svg>
  );
}

export function TelegramIcon({ className, size, ...rest }: IconProps) {
  const s = baseSize(size);
  return (
    <svg
      viewBox="0 0 24 24"
      width={s}
      height={s}
      className={className}
      aria-hidden
      {...rest}
    >
      <circle cx="12" cy="12" r="12" fill="#229ED9" />
      <path
        fill="#fff"
        d="M17.7 7.15 15.9 16.4c-.13.6-.49.75-.99.47l-2.74-2.02-1.32 1.27c-.15.15-.27.27-.55.27l.2-2.8 5.1-4.61c.22-.2-.05-.31-.34-.12l-6.3 3.97-2.72-.85c-.59-.18-.6-.59.12-.88l10.63-4.1c.49-.18.92.12.71.85Z"
      />
    </svg>
  );
}

export function TikTokIcon({ className, size, ...rest }: IconProps) {
  const s = baseSize(size);
  return (
    <svg
      viewBox="0 0 24 24"
      width={s}
      height={s}
      className={className}
      aria-hidden
      {...rest}
    >
      <rect width="24" height="24" rx="6" fill="#000" />
      <path
        fill="#00f2fe"
        d="M16.6 7.35a4.1 4.1 0 0 1-2.35-2.1h-.05v9.05a3.25 3.25 0 1 1-2.8-3.22v-2.1a5.35 5.35 0 1 0 4.9 5.32V9.45a6.2 6.2 0 0 0 2.35.55V7.9a4.1 4.1 0 0 1-2.05-.55Z"
        transform="translate(-0.7 0.5)"
      />
      <path
        fill="#fe0979"
        d="M16.6 7.35a4.1 4.1 0 0 1-2.35-2.1h-.05v9.05a3.25 3.25 0 1 1-2.8-3.22v-2.1a5.35 5.35 0 1 0 4.9 5.32V9.45a6.2 6.2 0 0 0 2.35.55V7.9a4.1 4.1 0 0 1-2.05-.55Z"
        transform="translate(0.7 -0.5)"
      />
      <path
        fill="#fff"
        d="M16.6 7.35a4.1 4.1 0 0 1-2.35-2.1h-.05v9.05a3.25 3.25 0 1 1-2.8-3.22v-2.1a5.35 5.35 0 1 0 4.9 5.32V9.45a6.2 6.2 0 0 0 2.35.55V7.9a4.1 4.1 0 0 1-2.05-.55Z"
      />
    </svg>
  );
}

export function LinkedInIcon({ className, size, ...rest }: IconProps) {
  const s = baseSize(size);
  return (
    <svg
      viewBox="0 0 24 24"
      width={s}
      height={s}
      className={className}
      aria-hidden
      {...rest}
    >
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M7.1 9.35H4.85V19.1H7.1V9.35ZM5.97 5.1a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6ZM19.15 19.1h-2.24v-4.75c0-1.13-.02-2.58-1.57-2.58-1.57 0-1.81 1.23-1.81 2.5V19.1H11.3V9.35h2.15v1.33h.03c.3-.57 1.03-1.17 2.12-1.17 2.27 0 2.69 1.49 2.69 3.43V19.1Z"
      />
    </svg>
  );
}

export function YouTubeIcon({ className, size, ...rest }: IconProps) {
  const s = baseSize(size);
  return (
    <svg
      viewBox="0 0 24 24"
      width={s}
      height={s}
      className={className}
      aria-hidden
      {...rest}
    >
      <rect x="1.5" y="5" width="21" height="14" rx="4" fill="#FF0000" />
      <path fill="#fff" d="M10 9.2v5.6l5-2.8-5-2.8Z" />
    </svg>
  );
}

export function ThreadsIcon({ className, size, ...rest }: IconProps) {
  const s = baseSize(size);
  return (
    <svg
      viewBox="0 0 24 24"
      width={s}
      height={s}
      className={className}
      aria-hidden
      {...rest}
    >
      <rect width="24" height="24" rx="6" fill="#111111" stroke="#fff" strokeWidth="1" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        d="M9.2 9.6c.6-1.4 1.9-2.2 3.5-2.2 2.3 0 3.8 1.5 3.8 3.7 0 2.9-1.7 4.8-4.5 4.8-1.9 0-3.4-1-3.8-2.6"
      />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        d="M8.6 12.2c.2 2.8 2 4.6 4.6 4.6 3.4 0 5.5-2.4 5.5-6.1 0-3.2-2-5.3-5.1-5.3-2.5 0-4.3 1.5-4.9 3.8"
      />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M8.8 13.1c1.1.9 2.5 1.4 4 1.1 1.7-.3 2.5-1.5 2.5-2.8 0-1.5-1.1-2.4-2.7-2.4-1.8 0-3 .9-3.2 2.5-.1.8.2 1.5.8 1.9.7.5 1.7.5 2.5.2"
      />
    </svg>
  );
}

export function XIcon({ className, size, ...rest }: IconProps) {
  const s = baseSize(size);
  return (
    <svg
      viewBox="0 0 24 24"
      width={s}
      height={s}
      className={className}
      aria-hidden
      {...rest}
    >
      <rect width="24" height="24" rx="6" fill="#000" />
      <path
        fill="#fff"
        d="M16.8 6.2h1.9l-4.15 4.74L19.5 17.8h-3.5l-2.74-3.58L9.9 17.8H8l4.44-5.07L6.7 6.2h3.58l2.47 3.28 2.05-3.28Zm-.67 10.42h1.05L9.97 7.28H8.84l7.29 9.34Z"
      />
    </svg>
  );
}

export function PinterestIcon({ className, size, ...rest }: IconProps) {
  const s = baseSize(size);
  return (
    <svg
      viewBox="0 0 24 24"
      width={s}
      height={s}
      className={className}
      aria-hidden
      {...rest}
    >
      <circle cx="12" cy="12" r="12" fill="#E60023" />
      <path
        fill="#fff"
        d="M11.4 19.6c.1-.6.2-1.5.35-2.3.08-.4.52-2.1.52-2.1s-.13-.27-.13-.66c0-.62.36-1.08.81-1.08.38 0 .57.29.57.63 0 .38-.24.96-.37 1.49-.1.45.22.81.66.81 1.08 0 1.8-1.39 1.8-3.03 0-1.25-.85-2.19-2.4-2.19-1.74 0-2.83 1.29-2.83 2.74 0 .5.15.85.39 1.12.1.1.12.18.08.32l-.14.55c-.04.17-.15.23-.33.14-1.1-.45-1.62-1.65-1.62-3 0-2.23 1.9-4.9 5.65-4.9 3.03 0 5.02 2.18 5.02 4.52 0 3.1-1.72 5.4-4.27 5.4-.85 0-1.66-.46-1.94-.98l-.53 2.02c-.19.73-.57 1.47-.91 2.04-.74.14-1.5.22-2.28.22-.58 0-1.15-.05-1.7-.14.64-.86 1.2-1.85 1.55-2.87Z"
      />
    </svg>
  );
}

export type SocialPlatformId =
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "telegram"
  | "tiktok"
  | "linkedin"
  | "youtube"
  | "threads"
  | "x"
  | "twitter"
  | "pinterest";

const PLATFORM_COMPONENTS: Record<
  SocialPlatformId,
  (props: IconProps) => JSX.Element
> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  tiktok: TikTokIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
  threads: ThreadsIcon,
  x: XIcon,
  twitter: XIcon,
  pinterest: PinterestIcon,
};

export function SocialIcon({
  platform,
  className,
  size,
}: {
  platform: string;
  className?: string;
  size?: number;
}) {
  const key = platform.toLowerCase() as SocialPlatformId;
  const Comp = PLATFORM_COMPONENTS[key] ?? FacebookIcon;
  return <Comp className={className} size={size} />;
}
