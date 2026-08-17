"use client";

type GoogleAvatarProps = {
  src: string;
  alt?: string;
  className?: string;
  /** Tailwind size classes for the outer box; defaults to fill parent. */
  sizeClassName?: string;
};

/**
 * Google profile photos 403 when the request sends a Referer.
 * Use a plain img with referrerPolicy — next/image is unreliable for this.
 */
export function GoogleAvatar({
  src,
  alt = "",
  className = "h-full w-full object-cover",
}: GoogleAvatarProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Google avatars require referrerPolicy
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      decoding="async"
    />
  );
}
