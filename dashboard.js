// Lucide icons setup
lucide.createIcons();

// Auth Check (Protected Route)
const token = localStorage.getItem("authToken");
if (!token) {
    // Agar logged-in nahi hai toh wapas login page par redirect kar dega
    // window.location.href = "index.html";
}

// Drawer Controls
const drawerOverlay = document.getElementById("drawerOverlay");
const openDrawerBtn = document.getElementById("openDrawerBtn");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");

openDrawerBtn.addEventListener("click", () => {
    drawerOverlay.style.display = "flex";
});

closeDrawerBtn.addEventListener("click", () => {
    drawerOverlay.style.display = "none";
});

// Expense / Income Toggle Logic
const typeExpense = document.getElementById("typeExpense");
const typeIncome = document.getElementById("typeIncome");

typeExpense.addEventListener("click", () => {
    typeExpense.classList.add("active-expense");
    typeIncome.classList.remove("active-income");
});

typeIncome.addEventListener("click", () => {
    typeIncome.classList.add("active-income");
    typeExpense.classList.remove("active-expense");
});

// Chart.js Setup for Financial Trends
const ctx = document.getElementById('financialChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
            {
                label: 'Income',
                data: [4000, 5000, 4500, 6500, 4200, 5100],
                borderColor: '#10b981',
                tension: 0.4,
                fill: false
            },
            {
                label: 'Expenses',
                data: [2000, 2800, 2400, 4000, 3100, 3200],
                borderColor: '#ef4444',
                tension: 0.4,
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: '#9ca3af' }
            }
        },
        scales: {
            x: { ticks: { color: '#9ca3af' }, grid: { display: false } },
            y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } }
        }
    }
});