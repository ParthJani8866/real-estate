export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
      <div className="mt-3 h-10 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div key={idx} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="h-44 w-full animate-pulse bg-gray-200 dark:bg-zinc-800" />
            <div className="p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
              <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

