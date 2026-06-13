"use client";

import React from "react";
import { ActivityFeed } from "../../../components/dashboard/ActivityFeed";
import { SummaryCard } from "../../../components/dashboard/SummaryCard";
import { useBusinessDashboard } from "../../../hooks/useBusinessDashboard";

export default function BusinessDashboardPage() {
  const { profile, summary, activity, loading, error, isEmpty } =
    useBusinessDashboard();

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-slate-500">Loading business dashboard...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-slate-500">Business dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            {profile?.companyName ?? "Your TitleChain workspace"}
          </h1>
        </div>
        {profile?.verificationStatus && (
          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize text-slate-700">
            {profile.verificationStatus}
          </span>
        )}
      </header>

      {error && (
        <section className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total borrowed"
          value={summary.totalBorrowed}
          detail="Across active financed invoices"
          tone="success"
        />
        <SummaryCard
          title="Active invoices"
          value={summary.activeInvoices}
          detail="Invoices still in the funding lifecycle"
        />
        <SummaryCard
          title="Next repayment"
          value={summary.nextRepayment}
          detail="Based on the nearest invoice due date"
          tone="warning"
        />
      </section>

      {isEmpty ? (
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-950">No assets yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Create your business profile and upload your first invoice to see borrowing
            activity, repayment timing, and asset updates here.
          </p>
        </section>
      ) : (
        <ActivityFeed items={activity} />
      )}
    </main>
  );
}
