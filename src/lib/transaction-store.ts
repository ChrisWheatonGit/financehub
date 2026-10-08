"use client";
import { useEffect, useState } from "react";
import { isTransaction, SEED_TRANSACTIONS, type Transaction } from "@/lib/expense-data";

const STORAGE_KEY = "financehub:fictional-transactions:v1"; // Maintain compatibility with v0.2.
export function useDemoTransactions() {
  const [entries, setEntries] = useState<Transaction[]>(SEED_TRANSACTIONS);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw !== null) {
        const data: unknown = JSON.parse(raw);
        if (Array.isArray(data) && data.length <= 10000 && data.every(isTransaction)) setEntries(data);
      }
    } catch { /* Demo only: invalid storage falls back to fictional seed data. */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }
    catch { /* Browser storage disabled or full. */ }
  }, [entries, loaded]);
  return { entries, setEntries, loaded };
}
