import React, { useState, useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';

const Budgets = () => {
  const { budgets, setBudgets, transactions, user } = useContext(FinanceContext);
  const [newBudget, setNewBudget] = useState({ category: '', limit: '' });

  const handleSetBudget = (e) => {
    e.preventDefault();
    setBudgets({ ...budgets, [newBudget.category]: Number(newBudget.limit) });
    setNewBudget({ category: '', limit: '' });
  };

  return (
    <div className="page-container">
      <h2>Budget Settings</h2>
      <form onSubmit={handleSetBudget} className="txn-form">
        <input type="text" placeholder="Category (e.g. Food)" value={newBudget.category} onChange={e => setNewBudget({...newBudget, category: e.target.value})} required />
        <input type="number" placeholder="Limit" value={newBudget.limit} onChange={e => setNewBudget({...newBudget, limit: e.target.value})} required />
        <button type="submit">Set Budget</button>
      </form>

      <div className="budget-list">
        {Object.keys(budgets).map(cat => {
          const spent = transactions
            .filter(t => t.category === cat && t.type === 'expense')
            .reduce((acc, t) => acc + Number(t.amount), 0);
          const limit = budgets[cat];
          const percent = Math.min((spent / limit) * 100, 100);

          return (
            <div key={cat} className="budget-card">
              <h4>{cat}</h4>
              <p>Spent: {user.currency}{spent} / {user.currency}{limit}</p>
              <div className="progress-bar">
                <div className="fill" style={{ width: `${percent}%`, backgroundColor: percent > 90 ? 'red' : 'green' }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budgets;