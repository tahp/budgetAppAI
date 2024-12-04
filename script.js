let currentAccount = '';
const transactions = {};
const accountSelect = document.getElementById('account-select');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  loadAccounts();
  initializeAccount();
});

// Event listeners for transactions and account changes
document.getElementById('add-income').addEventListener('click', () => addTransaction('income'));
document.getElementById('add-expense').addEventListener('click', () => addTransaction('expense'));
document.getElementById('create-account').addEventListener('click', createAccount);
document.getElementById('edit-account').addEventListener('click', editAccount);
accountSelect.addEventListener('change', initializeAccount); // Listen for account selection change

// Create a new account
function createAccount() {
  const accountName = prompt('Enter new account name:');
  if (accountName && !transactions[accountName]) {
    transactions[accountName] = [];
    saveAccounts();
    loadAccounts();
    accountSelect.value = accountName;
    initializeAccount();
  }
}

// Edit the current account name
function editAccount() {
  if (!currentAccount) {
    alert('No account selected to edit.');
    return;
  }
  const newAccountName = prompt('Enter new account name:', currentAccount);
  if (newAccountName && newAccountName !== currentAccount) {
    transactions[newAccountName] = transactions[currentAccount];
    delete transactions[currentAccount];
    currentAccount = newAccountName;
    saveAccounts();
    loadAccounts();
    accountSelect.value = newAccountName;
    initializeAccount();
  }
}

// Load accounts from localStorage
function loadAccounts() {
  const storedData = JSON.parse(localStorage.getItem('budgetTrackerData')) || {};
  Object.assign(transactions, storedData);
  updateAccountSelect();
}

// Save accounts to localStorage
function saveAccounts() {
  localStorage.setItem('budgetTrackerData', JSON.stringify(transactions));
}

// Initialize the selected account
function initializeAccount() {
  currentAccount = accountSelect.value;
  if (!currentAccount) {
    document.getElementById('transactions-list').innerHTML = 'No account selected.';
    updateCharts([]);
    return;
  }

  if (!transactions[currentAccount]) transactions[currentAccount] = [];
  updateUI();
}

// Update the account select dropdown
function updateAccountSelect() {
  accountSelect.innerHTML = '<option value="" disabled selected>Select an account</option>';
  for (const account in transactions) {
    const option = document.createElement('option');
    option.value = account;
    option.textContent = account;
    accountSelect.appendChild(option);
  }
}

// Add a transaction to the current account
function addTransaction(type) {
  if (!currentAccount) {
    alert('Please select or create an account before adding transactions.');
    return;
  }

  const category = document.getElementById('category').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);

  if (!category || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid category and amount.');
    return;
  }

  transactions[currentAccount].push({ type, category, amount });
  saveAccounts();
  updateUI();

  // Reset input fields
  document.getElementById('category').value = '';
  document.getElementById('amount').value = '';
}

// Update the transaction list and charts
function updateUI() {
  const transactionsList = document.getElementById('transactions-list');
  transactionsList.innerHTML = '';

  const currentTransactions = transactions[currentAccount] || [];
  currentTransactions.forEach(({ type, category, amount }, index) => {
    const item = document.createElement('div');
    item.textContent = `${category}: $${amount.toFixed(2)} (${type})`;
    transactionsList.appendChild(item);
  });

  updateCharts(currentTransactions);
}

// Update the income and expense charts
function updateCharts(currentTransactions) {
  const incomeData = {};
  const expenseData = {};

  currentTransactions.forEach(({ type, category, amount }) => {
    const dataObj = type === 'income' ? incomeData : expenseData;
    if (!dataObj[category]) dataObj[category] = 0;
    dataObj[category] += amount;
  });

  createChart('expenseChart', expenseData, 'Expenses by Category');
  createChart('incomeChart', incomeData, 'Income by Category');
}

let expenseChartInstance = null;
let incomeChartInstance = null;

function createChart(canvasId, data, title) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  if (canvasId === 'expenseChart' && expenseChartInstance) expenseChartInstance.destroy();
  if (canvasId === 'incomeChart' && incomeChartInstance) incomeChartInstance.destroy();

  const chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title
        }
      }
    }
  });

  if (canvasId === 'expenseChart') expenseChartInstance = chartInstance;
  else incomeChartInstance = chartInstance;
}