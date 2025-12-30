import React, { createContext, useState, useEffect } from 'react';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Salary", amount: 5000, type: "income", category: "Salary", date: "2025-11-01" },
      { id: 2, text: "Groceries", amount: 200, type: "expense", category: "Food", date: "2025-11-02" }
    ];
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : { "Food": 500, "Travel": 200 };
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { name: "User", currency: "₹" };
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('user', JSON.stringify(user));
  }, [transactions, budgets, user]);

  const addTransaction = (txn) => setTransactions([...transactions, txn]);
  
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <FinanceContext.Provider value={{ 
      transactions, addTransaction, deleteTransaction, 
      budgets, setBudgets, 
      user, setUser 
    }}>
      {children}
    </FinanceContext.Provider>
  );
};