// app/loading.tsx
export const dynamic = 'force-dynamic';
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-8 w-64" />
      <div className="grid lg:grid-cols-4 gap-6">
        <Skeleton className="h-150 hidden lg:block" />
        <div className="lg:col-span-3 space-y-4">
          <Skeleton className="h-12" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}