import { Logo } from "oxisverse-logo-system"

export function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  }

  return (
    <div className="flex items-center flex-col justify-center bg-none h-[100vh]">
      <div className={`${sizeClasses[size]} border-er-primary border-t-transparent rounded-full animate-spin`} />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-screen flex bg-er-primary items-center justify-center">
      <div className="text-center my-auto flex">
        <Loader size="lg" />
      </div>
    </div>
  )
}
