import React from "react";

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status?: string;
};

type ActivityFeedProps = {
  items: ActivityItem[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
        <h2 className="text-base font-semibold text-slate-900">No activity yet</h2>
        <p className="mt-2 text-sm text-slate-500">
          Uploaded invoices and repayment updates will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">Recent activity</h2>
      </div>
      <ul className="divide-y divide-slate-200">
        {items.map((item) => (
          <li key={item.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              </div>
              {item.status && (
                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {item.status}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-400">{item.timestamp}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
