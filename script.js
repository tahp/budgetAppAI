// Theme toggle functionality
const themeToggleButton = document.getElementById('theme-toggle');

// Initialize theme from localStorage or default to dark mode
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark-mode';
  document.body.classList.add(savedTheme);
  themeToggleButton.textContent = savedTheme === 'dark-mode' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});

// Toggle theme and save preference
themeToggleButton.addEventListener('click', () => {
  const currentTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
  const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';

  document.body.classList.remove(currentTheme);
  document.body.classList.add(newTheme);
  localStorage.setItem('theme', newTheme);

  themeToggleButton.textContent = newTheme === 'dark-mode' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});