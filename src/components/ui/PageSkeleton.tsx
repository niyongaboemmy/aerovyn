export function PageSkeleton() {
  return (
    <div
      className="min-h-screen animate-pulse pt-28"
      style={{ background: 'var(--bg-base)' }}
      aria-label="Loading…"
      role="status"
    >
      {/* Hero strip */}
      <div className="grid-bg pb-20 px-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="h-3 w-24 rounded-full" style={{ background: 'rgba(0,245,196,0.12)' }} />
          <div className="h-14 w-64 rounded-xl md:h-20 md:w-96" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="h-4 w-80 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
      </div>

      {/* Content cards */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-7 space-y-3"
              style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="h-3 w-16 rounded-full" style={{ background: 'rgba(0,245,196,0.1)' }} />
              <div className="h-5 w-3/4 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="h-3 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <div className="h-3 w-5/6 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <div className="h-3 w-2/3 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
