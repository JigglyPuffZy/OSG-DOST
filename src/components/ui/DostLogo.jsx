export default function DostLogo({ className = "h-10 w-10", alt = "DOST logo" }) {
  return (
    <img
      src="/dost-logo.svg"
      alt={alt}
      className={`block shrink-0 bg-transparent object-contain ${className}`}
      draggable={false}
    />
  )
}
