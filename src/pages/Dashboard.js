import React, { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const Dashboard = () => {
  const { transactions, user } = useContext(FinanceContext);

  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
  const savings = income - expense;

  const categoryData = [];
  transactions.filter(t => t.type === 'expense').forEach(t => {
    const existing = categoryData.find(c => c.name === t.category);
    if (existing) existing.value += Number(t.amount);
    else categoryData.push({ name: t.category, value: Number(t.amount) });
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="page-container">
      <h2>Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="cards-grid">
        <div className="card income">Total Income: {user.currency}{income}</div>
        <div className="card expense">Total Expenses: {user.currency}{expense}</div>
        <div className="card savings">Savings: {user.currency}{savings}</div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
           <h3>Expense by Category</h3>
           <PieChart width={300} height={300}>
             <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
               {categoryData.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
               ))}
             </Pie>
             <Tooltip />
           </PieChart>
        </div>
        
        <div className="chart-box">
            <h3>Income vs Expense</h3>
            <BarChart width={300} height={300} data={[{name: 'Total', Income: income, Expense: expense}]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Income" fill="#82ca9d" />
              <Bar dataKey="Expense" fill="#8884d8" />
            </BarChart>
        </div>
      </div>
      
      <h3>Recent Transactions</h3>
      <table className="txn-table">
        <thead><tr><th>Title</th><th>Amount</th><th>Type</th></tr></thead>
        <tbody>
          {transactions.slice(-5).map(t => (
            <tr key={t.id}>
              <td>{t.text}</td>
              <td style={{color: t.type==='expense'?'red':'green'}}>{user.currency}{t.amount}</td>
              <td>{t.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;