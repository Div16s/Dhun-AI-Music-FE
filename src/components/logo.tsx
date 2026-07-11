import Image from "next/image"

/**
 * Dhun AI brand mark. Renders /public/dhun-ai-icon_1.svg.
 * Size it from the parent via a class on `className` (defaults to 20px square).
 */
export function Logo({
  className,
  size = 20,
}: {
  className?: string
  size?: number
}) {
  return (
    <Image
      src="/dhun-ai-icon_1.svg"
      alt="Dhun AI"
      width={size}
      height={size}
      priority
      className={className}
    />
  )
}
