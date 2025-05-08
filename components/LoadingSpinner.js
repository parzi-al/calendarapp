export default function LoadingSpinner({ size = "medium" }) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}
      ></div>
    </div>
  )
}
