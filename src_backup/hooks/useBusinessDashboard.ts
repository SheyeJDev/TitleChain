"use client";

import { useEffect, useMemo, useState } from "react";
import type { ActivityItem } from "../components/dashboard/ActivityFeed";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type BusinessProfile = {
  id: string;
  companyName: string;
  registrationNumber: string;
  country: string;
  industry: string;
  verificationStatus: string;
  user?: {
    id: string;
    walletAddress: string;
  };
};

type Invoice = {
  id: string;
  invoiceNumber?: string;
  amount?: number | string;
  dueDate?: string;
  status?: string;
  createdAt?: string;
  uploadedBy?: string;
};

type DashboardState = {
  profile: BusinessProfile | null;
  invoices: Invoice[];
};

async function fetchJson<T>(
  path: string,
  token: string,
  options?: { allowNotFound?: boolean },
): Promise<T | null> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404 && options?.allowNotFound) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem("titlechain_access_token") ??
    window.localStorage.getItem("access_token")
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en", {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) {
    return "No date set";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function useBusinessDashboard(accessToken?: string | null) {
  const [data, setData] = useState<DashboardState>({
    profile: null,
    invoices: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = accessToken ?? getStoredToken();

    if (!token) {
      setData({ profile: null, invoices: [] });
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const profile = await fetchJson<BusinessProfile>("/business/profile", token, {
          allowNotFound: true,
        });
        const invoices = await fetchJson<Invoice[]>("/invoices", token);
        const businessInvoices = profile?.user?.id
          ? (invoices ?? []).filter((invoice) => invoice.uploadedBy === profile.user?.id)
          : [];

        if (!cancelled) {
          setData({ profile, invoices: businessInvoices });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load dashboard");
          setData({ profile: null, invoices: [] });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return useMemo(() => {
    const activeInvoices = data.invoices.filter(
      (invoice) => invoice.status !== "rejected",
    );
    const totalBorrowed = activeInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.amount ?? 0),
      0,
    );
    const nextRepayment = activeInvoices
      .filter((invoice) => invoice.dueDate)
      .sort(
        (left, right) =>
          new Date(left.dueDate as string).getTime() -
          new Date(right.dueDate as string).getTime(),
      )[0];
    const activity: ActivityItem[] = data.invoices
      .slice()
      .sort(
        (left, right) =>
          new Date(right.createdAt ?? 0).getTime() -
          new Date(left.createdAt ?? 0).getTime(),
      )
      .slice(0, 5)
      .map((invoice) => ({
        id: invoice.id,
        title: invoice.invoiceNumber
          ? `Invoice ${invoice.invoiceNumber}`
          : "Invoice uploaded",
        description: `${formatCurrency(Number(invoice.amount ?? 0))} due ${formatDate(
          invoice.dueDate,
        )}`,
        timestamp: formatDate(invoice.createdAt),
        status: invoice.status,
      }));

    return {
      profile: data.profile,
      loading,
      error,
      summary: {
        totalBorrowed: formatCurrency(totalBorrowed),
        activeInvoices: activeInvoices.length.toString(),
        nextRepayment: nextRepayment ? formatDate(nextRepayment.dueDate) : "None scheduled",
      },
      activity,
      isEmpty: !loading && data.invoices.length === 0,
    };
  }, [data, error, loading]);
}
