import React, { useState, useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { toast } from 'react-toastify';

const Transactions = () => {
  const { transactions, addTransaction, deleteTransaction, user, budgets } = useContext(FinanceContext);
  const [form, setForm] = useState({ text: '', amount: '', type: 'expense', category: 'Food', date: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    
    if (form.type === 'expense' && budgets[form.category]) {
      const currentSpend = transactions
        .filter(t => t.category === form.category && t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.amount), 0);
        
      if (currentSpend + amount > budgets[form.category]) {
        toast.error(`Budget exceeded for ${form.category}!`); // Toast Alert
      }
    }

    addTransaction({ ...form, id: Date.now(), amount });
    toast.success("Transaction Added!");
    setForm({ text: '', amount: '', type: 'expense', category: 'Food', date: '' });
  };

  return (
    <div className="page-container">
      <h2>Transactions</h2>
      
      <form onSubmit={handleSubmit} className="txn-form">
        <input type="text" placeholder="Description" value={form.text} onChange={e => setForm({...form, text: e.target.value})} required />
        <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="text" placeholder="Category (e.g. Food)" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
        <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
        <button type="submit">Add Transaction</button>
      </form>

      <table className="txn-table">
        <thead>
          <tr><th>Date</th><th>Desc</th><th>Category</th><th>Amount</th><th>Action</th></tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.text}</td>
              <td>{t.category}</td>
              <td style={{color: t.type==='expense'?'red':'green'}}>
                {t.type === 'expense' ? '-' : '+'}{user.currency}{t.amount}
              </td>
              <td><button onClick={() => deleteTransaction(t.id)} className="btn-del">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;