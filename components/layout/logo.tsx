import Image from "next/image";

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-9 w-9 sm:h-10 sm:w-10",
  lg: "h-11 w-11 sm:h-12 sm:w-12",
} as const;

export default function Logo({
  size = "md",
  className = "",
}: {
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  return (
    <Image
      src="/thriveparthtransparent.png"
      alt="ThriveParth logo"
      width={56}
      height={56}
      priority
      sizes="(max-width: 640px) 36px, 48px"
      className={`object-contain shrink-0 ${sizeClasses[size]} ${className}`}
    />
  );
}
