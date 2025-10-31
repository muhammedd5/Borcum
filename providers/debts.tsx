import { useCallback, useEffect, useMemo, useState } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Debt } from "@/types";

const DEBTS_STORAGE_KEY = "debts";

export type DebtsStateValue = {
  debts: Debt[];
  isLoading: boolean;
  addDebt: (debt: Omit<Debt, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateDebt: (id: string, debt: Partial<Debt>) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  getDebtById: (id: string) => Debt | undefined;
};

export const [DebtsProvider, useDebts] = createContextHook<DebtsStateValue>(() => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        console.log("[Debts] Loading debts from storage");
        const storedDebts = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
        if (storedDebts) {
          const parsed = JSON.parse(storedDebts);
          console.log("[Debts] Loaded debts", { count: parsed.length });
          setDebts(parsed);
        }
      } catch (error) {
        console.error("[Debts] Error loading debts", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDebts();
  }, []);

  const saveDebts = useCallback(async (newDebts: Debt[]) => {
    try {
      await AsyncStorage.setItem(DEBTS_STORAGE_KEY, JSON.stringify(newDebts));
      console.log("[Debts] Saved debts", { count: newDebts.length });
    } catch (error) {
      console.error("[Debts] Error saving debts", error);
    }
  }, []);

  const addDebt = useCallback(async (debt: Omit<Debt, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newDebt: Debt = {
      ...debt,
      id: `debt_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    console.log("[Debts] Adding debt", newDebt);
    const updatedDebts = [...debts, newDebt];
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  }, [debts, saveDebts]);

  const updateDebt = useCallback(async (id: string, updates: Partial<Debt>) => {
    console.log("[Debts] Updating debt", { id, updates });
    const updatedDebts = debts.map(debt => 
      debt.id === id 
        ? { ...debt, ...updates, updatedAt: new Date().toISOString() }
        : debt
    );
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  }, [debts, saveDebts]);

  const deleteDebt = useCallback(async (id: string) => {
    console.log("[Debts] Deleting debt", { id });
    const updatedDebts = debts.filter(debt => debt.id !== id);
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  }, [debts, saveDebts]);

  const getDebtById = useCallback((id: string) => {
    return debts.find(debt => debt.id === id);
  }, [debts]);

  return useMemo<DebtsStateValue>(() => ({
    debts,
    isLoading,
    addDebt,
    updateDebt,
    deleteDebt,
    getDebtById,
  }), [debts, isLoading, addDebt, updateDebt, deleteDebt, getDebtById]);
});
