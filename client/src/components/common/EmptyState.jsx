export default function EmptyState({
  icon: Icon,
  title = 'Nothing to show yet',
  description = 'Information will appear here once the connected service is ready.',
  action,
}) {
  return (
    <div className="card-surface rounded-2xl border border-dashed border-slate-200 p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        {Icon ? <Icon className="h-6 w-6" /> : null}
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}