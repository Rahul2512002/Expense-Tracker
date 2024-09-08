document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const categorySelect = document.getElementById('category');
    const expenseList = document.getElementById('expense-list');
    const expenseChart = document.getElementById('expense-chart').getContext('2d');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let chart;

    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const expenseItem = document.createElement('div');
            expenseItem.classList.add('expense-item');
            expenseItem.innerHTML = `
                <span>${expense.description}</span>
                <span>${expense.amount}</span>
                <span>${expense.category}</span>
                <button onclick="deleteExpense('${expense.description}')">Delete</button>
            `;
            expenseList.appendChild(expenseItem);
        });
        updateChart();
    }

    function addExpense(description, amount, category) {
        expenses.push({ description, amount, category });
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    }

    function deleteExpense(description) {
        expenses = expenses.filter(expense => expense.description !== description);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    }

    function updateChart() {
        const categoryTotals = expenses.reduce((acc, { category, amount }) => {
            acc[category] = (acc[category] || 0) + parseFloat(amount);
            return acc;
        }, {});

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(expenseChart, {
            type: 'pie',
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    data: Object.values(categoryTotals),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: $${tooltipItem.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }

    expenseForm.addEventListener('submit', event => {
        event.preventDefault();
        const description = descriptionInput.value;
        const amount = amountInput.value;
        const category = categorySelect.value;
        if (description && amount) {
            addExpense(description, amount, category);
            descriptionInput.value = '';
            amountInput.value = '';
        }
    });

    renderExpenses();
});
