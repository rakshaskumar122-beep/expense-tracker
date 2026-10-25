import { createContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

export const TransactionContext = createContext();

const sortKey = (t) => {
  if (typeof t.createdAt === "number") return t.createdAt;
  const d = Date.parse(t.date);
  return Number.isNaN(d) ? 0 : d;
};

export const Provider = ({ children, userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);

  // One-time upload of data already saved in this device's localStorage
  useEffect(() => {
    if (!userId) return;
    const flag = `migrated_${userId}`;
    if (localStorage.getItem(flag)) return;

    const migrate = async () => {
      try {
        const oldTx =
          JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
        const oldBudgets =
          JSON.parse(localStorage.getItem(`budgets_${userId}`)) || {};

        for (let i = 0; i < oldTx.length; i += 400) {
          const batch = writeBatch(db);
          oldTx.slice(i, i + 400).forEach((t) => {
            const id = String(t.id || crypto.randomUUID());
            const clean = JSON.parse(JSON.stringify({ ...t, id }));
            batch.set(doc(db, "users", userId, "transactions", id), clean);
          });
          await batch.commit();
        }

        if (Object.keys(oldBudgets).length > 0) {
          await setDoc(doc(db, "users", userId, "meta", "budgets"), oldBudgets, {
            merge: true,
          });
        }

        localStorage.setItem(flag, "1");
      } catch (err) {
        console.error("Migration failed:", err);
      }
    };

    migrate();
  }, [userId]);

  // Live sync: transactions
  useEffect(() => {
    if (!userId) return;
    const unsub = onSnapshot(
      collection(db, "users", userId, "transactions"),
      (snap) => {
        const list = snap.docs.map((d) => d.data());
               list.sort(
          (a, b) =>
            (b.date || "").localeCompare(a.date || "") ||
            (b.createdAt || 0) - (a.createdAt || 0)
        );
        setTransactions(list);
        setLoading(false);
      },
      (err) => {
        console.error("Transactions listener error:", err);
        setLoading(false);
      }
    );
    return unsub;
  }, [userId]);

  // Live sync: budgets
  useEffect(() => {
    if (!userId) return;
    const unsub = onSnapshot(
      doc(db, "users", userId, "meta", "budgets"),
      (snap) => setBudgets(snap.exists() ? snap.data() : {}),
      (err) => console.error("Budgets listener error:", err)
    );
    return unsub;
  }, [userId]);

  const addTransaction = async (t) => {
    const id = String(t.id || crypto.randomUUID());
    const data = JSON.parse(
      JSON.stringify({ ...t, id, createdAt: t.createdAt ?? Date.now() })
    );
    try {
      await setDoc(doc(db, "users", userId, "transactions", id), data);
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, "users", userId, "transactions", String(id)));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const saveBudgets = async (next) => {
    try {
      await setDoc(doc(db, "users", userId, "meta", "budgets"), next);
    } catch (err) {
      console.error("Budget save failed:", err);
    }
  };

  const setBudget = (cat, limit) => saveBudgets({ ...budgets, [cat]: limit });

  const removeBudget = (cat) => {
    const next = { ...budgets };
    delete next[cat];
    saveBudgets(next);
  };

  const balance = transactions.reduce(
    (acc, t) => (t.type === "Income" ? acc + t.amount : acc - t.amount),
    0
  );

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        balance,
        addTransaction,
        deleteTransaction,
        budgets,
        setBudget,
        removeBudget,
        loading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};