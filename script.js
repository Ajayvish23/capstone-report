
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const darkModeToggle = document.getElementById('dark-mode-icon');
const expenseChartCtx = document.getElementById('expenseChart').getContext('2d');

let transactions = [];
let darkMode = false;

// Toggle Dark Mode
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkMode = !darkMode;
    darkModeToggle.classList.toggle('fa-moon', !darkMode);
    darkModeToggle.classList.toggle('fa-sun', darkMode);
});

// Add Transaction
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please provide transaction details');
        return;
    }
    const transaction = {
        id: Date.now(),
        text: text.value,
        amount: parseFloat(amount.value),
        category: category.value,
    };
    transactions.push(transaction);
    updateDOM();
    updateChart();
    text.value = '';
    amount.value = '';
});

function updateDOM() {
    list.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach((t) => {
        const sign = t.amount < 0 ? '-' : '+';
        if (t.amount > 0) totalIncome += t.amount;
        else totalExpense += t.amount;
        const li = document.createElement('li');
        li.innerHTML = `${t.text} (${t.category}) <span>${sign}$${Math.abs(t.amount).toFixed(2)}</span>`;
        list.appendChild(li);
    });
    balance.innerText = `$${(totalIncome + totalExpense).toFixed(2)}`;
    income.innerText = `+$${totalIncome.toFixed(2)}`;
    expense.innerText = `-$${Math.abs(totalExpense).toFixed(2)}`;
}

// Initialize Chart
let chart;
function updateChart() {
    const categories = [...new Set(transactions.map(t => t.category))];
    const categoryData = categories.map(cat => {
        return transactions.filter(t => t.category === cat).reduce((acc, curr) => acc + curr.amount, 0);
    });
    if (chart) chart.destroy();
    chart = new Chart(expenseChartCtx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: categoryData,
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
            }],
        },
    });
}
