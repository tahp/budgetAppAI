document.addEventListener('DOMContentLoaded', function () {
    // Initialize income chart
    var incomeCtx = document.getElementById('income-chart').getContext('2d');
    var incomeChart = new Chart(incomeCtx, {
        type: 'bar',
        data: {
            labels: ['Category 1', 'Category 2', 'Category 3'],
            datasets: [{
                label: 'Income',
                data: [100, 200, 150],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Initialize expense chart
    var expenseCtx = document.getElementById('expense-chart').getContext('2d');
    var expenseChart = new Chart(expenseCtx, {
        type: 'bar',
        data: {
            labels: ['Category 1', 'Category 2', 'Category 3'],
            datasets: [{
                label: 'Expenses',
                data: [80, 130, 180],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
