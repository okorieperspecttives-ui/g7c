export default function AdminLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-10 w-64 bg-secondary rounded-2xl mb-2" />
          <div className="h-6 w-80 bg-secondary/50 rounded-xl" />
        </div>
        <div className="h-12 w-40 bg-secondary rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary" />
            </div>
            <div className="h-4 w-24 bg-secondary/50 rounded-lg mb-2" />
            <div className="h-8 w-16 bg-secondary rounded-xl" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="h-64 rounded-3xl border border-border bg-card p-8" />
        <div className="h-64 rounded-3xl border border-border bg-card p-8" />
      </div>
    </div>
  );
}
