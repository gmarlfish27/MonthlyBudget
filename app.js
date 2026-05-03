const categories = ["Mortgage", "Tithing", "Tara's Spending", "Garett's Spending", "Other"];

// Initialize or Load Data
let budgetData = JSON.parse(localStorage.getItem('householdBudget')) || {};

// Check for Monthly Reset
function checkMonthlyReset() {
    const now = new Date();
    const currentMonthKey = `${now.getMonth()}-${now.getFullYear()}`;
    const lastSavedMonth = localStorage.getItem('budgetMonthKey');

    if (lastSavedMonth !== currentMonthKey) {
        // It's a new month! Reset data.
        budgetData = {};
        categories.forEach(cat => budgetData[cat] = 0);
        localStorage.setItem('budgetMonthKey', currentMonthKey);
        saveData();
    }
    
    document.getElementById('currentMonthYear').innerText = 
        now.toLocaleString('default', { month: 'long', year: 'numeric' }) + " Budget";
}

function saveData() {
    localStorage.setItem('householdBudget', JSON.stringify(budgetData));
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('budgetTableBody');
    tbody.innerHTML = '';
    let total = 0;

    categories.forEach(cat => {
        const amount = budgetData[cat] || 0;
        total += amount;
        tbody.innerHTML += `
            <tr>
                <td class="p-4 border-b">${cat}</td>
                <td class="p-4 border-b font-mono">$${amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            </tr>
        `;
    });

    document.getElementById('grandTotal').innerText = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}

// Handle Form Submission
document.getElementById('budgetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const cat = document.getElementById('category').value;
    const amt = parseFloat(document.getElementById('amount').value);

    if (!isNaN(amt)) {
        budgetData[cat] = (budgetData[cat] || 0) + amt;
        document.getElementById('amount').value = '';
        saveData();
    }
});

function clearDataManually() {
    if(confirm("Are you sure you want to reset the current month?")) {
        budgetData = {};
        categories.forEach(cat => budgetData[cat] = 0);
        saveData();
    }
}

// Startup
checkMonthlyReset();
renderTable();
