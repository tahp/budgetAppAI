let totalIncome = 0;
let totalExpenses = 0;
let expensesByCategory = {};
let incomeByCategory = {};
let currentUser = null;

// Declare chart variables
let expenseChart;
let incomeChart;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    
    // Initialize Expense Chart
    const expenseCtx = document.getElementById('expense-chart').getContext('2d');
    if (expenseCtx) {
        console.log("Initializing expense chart");
        expenseChart = new Chart(expenseCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                }]
            }
        });
    } else {
        console.error("Failed to get context for expense-chart");
    }

    // Initialize Income Chart
    const incomeCtx = document.getElementById('income-chart').getContext('2d');
    if (incomeCtx) {
        console.log("Initializing income chart");
        incomeChart = new Chart(incomeCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: ['#84FF63', '#A2EB36', '#CEFF56', '#C04BC0', '#66FF99', '#40FF9F'],
                }]
            }
        });
    } else {
        console.error("Failed to get context for income-chart");
    }
    function updateExpenseChart() {
        console.log("Updating expense chart", expensesByCategory);
        if (expenseChart) {
            expenseChart.data.labels = Object.keys(expensesByCategory);
            expenseChart.data.datasets[0].data = Object.values(expensesByCategory);
            console.log("Updated expense chart data:", expenseChart.data);
            expenseChart.update();
        } else {
            console.error("Expense chart not initialized");
        }
    }
    

    function updateIncomeChart() {
        console.log("Updating income chart", incomeByCategory);
        if (incomeChart) {
            incomeChart.data.labels = Object.keys(incomeByCategory);
            incomeChart.data.datasets[0].data = Object.values(incomeByCategory);
            console.log("Updated income chart data:", incomeChart.data);
            incomeChart.update();
        } else {
            console.error("Income chart not initialized");
        }
    }
    

    // User System: Register, Login, Logout
    document.getElementById('register-btn').addEventListener('click', registerUser);
    document.getElementById('login-btn').addEventListener('click', loginUser);
    document.getElementById('logout-btn').addEventListener('click', logoutUser);

    function registerUser() {
        const username = document.getElementById('username').value.trim();
        if (!username) return alert('Please enter a username.');
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) return alert('Username already exists. Please log in.');
        users[username] = { totalIncome: 0, totalExpenses: 0, expensesByCategory: {}, incomeByCategory: {} };
        localStorage.setItem('users', JSON.stringify(users));
        alert('User registered successfully!');
    }

    function loginUser() {
        const username = document.getElementById('username').value.trim();
        if (!username) return alert('Please enter a username.');
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (!users[username]) return alert('User not found. Please register first.');
        currentUser = username;
        localStorage.setItem('currentUser', currentUser);
        loadUserData();
    }

    function logoutUser() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        document.getElementById('app-container').classList.add('hidden');
        document.getElementById('auth-container').classList.remove('hidden');
    }

    function loadUserData() {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        currentUser = localStorage.getItem('currentUser');
        document.getElementById('user-display').textContent = currentUser ? currentUser : "User";

        const users = JSON.parse(localStorage.getItem('users')) || {};
        const userData = users[currentUser] || {};
        totalIncome = userData.totalIncome || 0;
        totalExpenses = userData.totalExpenses || 0;
        expensesByCategory = userData.expensesByCategory || {};
        incomeByCategory = userData.incomeByCategory || {};

        updateSummary();
        updateExpenseChart();
        updateIncomeChart();
    }

    function saveUserData() {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        users[currentUser] = { totalIncome, totalExpenses, expensesByCategory, incomeByCategory };
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Handle form submission for adding income and expenses
    document.getElementById('budget-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const income = parseFloat(document.getElementById('income').value) || 0;
        const expense = parseFloat(document.getElementById('expense').value) || 0;
        const category = document.getElementById('category').value.trim() || "Uncategorized";

        console.log("Adding income and expense", { income, expense, category });

        if (income > 0) {
            totalIncome += income;
            incomeByCategory[category] = (incomeByCategory[category] || 0) + income;
        }

        if (expense > 0) {
            totalExpenses += expense;
            expensesByCategory[category] = (expensesByCategory[category] || 0) + expense;
        }

        saveUserData();
        updateSummary();
        updateExpenseChart();
        updateIncomeChart();

        document.getElementById('income').value = '';
        document.getElementById('expense').value = '';
        document.getElementById('category').value = '';
    });

    function updateSummary() {
        document.getElementById('total-income').textContent = `Total Income: $${totalIncome.toFixed(2)}`;
        document.getElementById('total-expenses').textContent = `Total Expenses: $${totalExpenses.toFixed(2)}`;
        document.getElementById('balance').textContent = `Balance: $${(totalIncome - totalExpenses).toFixed(2)}`;
    }

    // Automatically load user data on page load if logged in
    if (localStorage.getItem('currentUser')) loadUserData();
});
