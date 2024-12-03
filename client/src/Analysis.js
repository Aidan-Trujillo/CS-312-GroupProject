import axios from 'axios';
import './App.css';
import './styles/style.css'
import {
    useState, 
    useEffect
} from 'react';
import React from "react";
import { Pie } from "react-chartjs-2";

//imports for bar chart
import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, LinearScale} from "chart.js";

// Import Chart.js components for configuration
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// constants should be the same as in App.js
const CATEGORIES = ["Food", "Bills", "Fun", "Groceries", "Other"];



function AnalysisPage({expenses, setSelectedCategory, setAnalysis}) {
    //const [expenses, setSelectedCategory, setAnalysis] = props
    console.log(setSelectedCategory)
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are 0-indexed

    setSelectedMonth(`${year}-${month}`);
    setSelectedCategory("All")
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
                    <div className="right-section-title">
                    <h3>Right Section</h3>
                    <p>This section can show detailed expense breakdowns or charts.</p>
                    </div>
                    <div className="chart-container">
                        <PieChart
                            categoryBreakdown={categoryBreakdown}
                            setSelectedCategory={setSelectedCategory}
                            setAnalysis={setAnalysis}
                        />
                    </div>
                    <div className="chart-container">
                        <BarChart
                            categoryBreakdown={categoryBreakdown}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = (props) => {
    const {categoryBreakdown, setSelectedCategory, setAnalysis} = props
    // get labels and data
    var categoryLabels = []
    var categoryData = []
    console.log("Category Breakdown: ", categoryBreakdown.categoryBreakdown)


    // map the data into the labels and data
    Object.entries(categoryBreakdown).map(([category, amount]) => {
        console.log(`${category}: ${amount}`);
        categoryLabels.push(category)
        categoryData.push(amount)
    });

    // Data for the chart
    const data = {
      labels: categoryLabels,
      datasets: [
        {
          label: "Expense Categories",
          data: categoryData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",  // Light Red
            "rgba(75, 192, 192, 0.2)",  // Light Teal
            "rgba(255, 206, 86, 0.2)",  // Light Yellow
            "rgba(153, 102, 255, 0.2)", // Light Purple
            "rgba(54, 162, 235, 0.2)"   // Light Blue
            ],
          borderColor: [
            "rgba(255, 99, 132, 1)",    // Bold Red
            "rgba(75, 192, 192, 1)",    // Bold Teal
            "rgba(255, 206, 86, 1)",    // Bold Yellow
            "rgba(153, 102, 255, 1)",   // Bold Purple
            "rgba(54, 162, 235, 1)"     // Bold Blue
            ],        
          borderWidth: 1,
        },
      ],
    };
  
    // Chart options with onClick handler
    const options = {
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem) =>
              `${tooltipItem.label}: $${tooltipItem.raw}`,
          },
        },
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          // Get the index of the clicked slice
          const index = elements[0].index;
  
          // Get the label of the clicked slice
          const label = data.labels[index];

          // set the selected category to the label
          setSelectedCategory(label)

          // switch analysis to falce so that it goes back to the main page
          setAnalysis(false)
        }
      },
    };

  return (
    <div style={{ width: "400px", height: "400px" }}>
      <Pie data={data} options={options}/>
    </div>
  );
};

// register chart.js components for bar chart
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BarChart = (props) => {
    const { categoryBreakdown } = props;

    // Extract labels and data for the bar chart
    const categoryLabels = [];
    const categoryData = [];

    Object.entries(categoryBreakdown).forEach(([category, amount]) => {
        categoryLabels.push(category);
        categoryData.push(amount);
    });

    // Data for the chart
    const data = {
        labels: categoryLabels,
        datasets: [
            {
                label: "Expense Categories",
                data: categoryData,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",  // Light Red
                    "rgba(75, 192, 192, 0.2)",  // Light Teal
                    "rgba(255, 206, 86, 0.2)",  // Light Yellow
                    "rgba(153, 102, 255, 0.2)", // Light Purple
                    "rgba(54, 162, 235, 0.2)",  // Light Blue
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",    // Bold Red
                    "rgba(75, 192, 192, 1)",    // Bold Teal
                    "rgba(255, 206, 86, 1)",    // Bold Yellow
                    "rgba(153, 102, 255, 1)",   // Bold Purple
                    "rgba(54, 162, 235, 1)",    // Bold Blue
                ],
                borderWidth: 1,
            },
        ],
    };

    // Options for the chart
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) =>
                        `${tooltipItem.label}: $${tooltipItem.raw}`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ width: "400px", height: "400px" }}>
            <Bar data={data} options={options} />
        </div>
    );
};


export default AnalysisPage