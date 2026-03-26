type ActivityItem = {
  title: string;
  subtitle: string;
  amount?: string;
};

type RecentActivityProps = {
  title: string;
  items: ActivityItem[];
};

export function RecentActivity({ title, items }: RecentActivityProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">Latest updates and activity</p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4"
          >
            <div>
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="mt-1 text-sm text-gray-500">{item.subtitle}</p>
            </div>

            {item.amount ? (
              <div className="text-sm font-semibold text-gray-700">{item.amount}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}