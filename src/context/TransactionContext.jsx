import { createContext, useReducer, useEffect, useState } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return [action.payload, ...state];
    case "DELETE_TRANSACTION":
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
};

export const TransactionContext = createContext();

export const Provider = ({ children, userId }) => {
  const key = `transactions_${userId}`;
  const bKey = `budgets_${userId}`;

  const [transactions, dispatch] = useReducer(
    reducer,
    key,
    (k) => JSON.parse(localStorage.getItem(k)) || []
  );
  const [budgets, setBudgets] = useState(
    () => JSON.parse(localStorage.getItem(bKey)) || {}
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(transactions));
  }, [transactions, key]);

  useEffect(() => {
    localStorage.setItem(bKey, JSON.stringify(budgets));
  }, [budgets, bKey]);

  const addTransaction = (t) => dispatch({ type: "ADD_TRANSACTION", payload: t });
  const deleteTransaction = (id) => dispatch({ type: "DELETE_TRANSACTION", payload: id });
  const setBudget = (cat, limit) => setBudgets((b) => ({ ...b, [cat]: limit }));
  const removeBudget = (cat) =>
    setBudgets((b) => {
      const n = { ...b };
      delete n[cat];
      return n;
    });

  const balance = transactions.reduce(
    (acc, t) => (t.type === "Income" ? acc + t.amount : acc - t.amount),
    0
  );

  return (
    <TransactionContext.Provider
      value={{
        transactions, balance, addTransaction, deleteTransaction,
        budgets, setBudget, removeBudget,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};