import axios from 'axios';
import './App.css';
import './styles/style.css'
import {useState, useEffect} from 'react';


function AnalysisPage({ expenses}) {
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are 0-indexed

    setSelectedMonth(`${year}-${month}`);
  }, []);

    const filteredExpenses = expenses.filter((expense) =>
        expense.date.startsWith(selectedMonth)
    );

    const totalSpending = filteredExpenses.reduce(
        (total, expense) => total + parseFloat(expense.amount),
        0
    );

    const daysInMonth = (yearMonth) => {
        const [year, month] = yearMonth.split('-');
        console.log(year)
        console.log(month)
        const date = new Date(year, month, 0); 
        return date.getDate();
    }
    const avgDailyExpenditure = (totalSpending / daysInMonth(selectedMonth)).toFixed(2);

    const categoryBreakdown = filteredExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
        return acc;
    }, {});
    return (
        <div className='analysis'>
            <label htmlFor="month"> Month and Year: </label>
                <input
                type="selectedMonth"
                id="selectedMonth"
                name="selectedMonth"
                value={selectedMonth}
                placeholder='yyyy-mm'
                onChange={(e) => setSelectedMonth(e.target.value)}
                required
                />
            <div className="monthly-analysis">
                <div className="analysis-section left">
                    <h3>Your Spending Report for {selectedMonth}</h3>
                    <p><strong>Total Spending:</strong> ${totalSpending.toFixed(2)}</p>
                    <p><strong>Average Daily Expenditure:</strong> ${avgDailyExpenditure}</p>
                    <h4>Expenditure per Category:</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(categoryBreakdown).map(([category, amount]) => (
                                <tr key={category}>
                                    <td>{category}</td>
                                    <td>${amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="analysis-section right">
                    <h3>Right Section</h3>
                    <p>This section can show detailed expense breakdowns or charts.</p>
                </div>

            </div>
        </div>
    )
}

export default AnalysisPage