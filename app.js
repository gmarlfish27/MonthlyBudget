const manualCategories = ["Mortgage", "Tara's Spending", "Garett's Spending", "Other"];

// Load data or initialize
let budgetData = JSON.parse(localStorage.getItem('householdBudget')) || {
    limit: 0,
    tithingPercent: 10,
    expenses: {}
};

function checkMonthlyReset() {
    const now = new Date();
    const currentMonthKey = `${now.getMonth()}-${now.getFullYear()}`;
    const lastSavedMonth = localStorage.getItem('budgetMonthKey');

    if (lastSavedMonth !== currentMonthKey) {
        budgetData = { limit: 0, tithingPercent: 10, expenses: {} };
        manualCategories.forEach(cat => budgetData.expenses[cat] = 0);
        localStorage.setItem('budgetMonthKey', currentMonthKey);
        saveData();
    }
    
    document.getElementById('currentMonthYear').innerText = 
        now.toLocaleString('default', { month: 'long', year: 'numeric' }) + " Budget";
    
    // Set initial values for config fields
    document.getElementById('monthlyLimit').value = budgetData.limit || "";
    document.getElementById('tithingPercent').value = budgetData.tithingPercent || 0;
}

function saveData() {
    localStorage.setItem('householdBudget', JSON.stringify(budgetData));
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('budgetTableBody');
    tbody.innerHTML = '';
    
    // 1. Calculate Tithing (Automatic)
    const limit = parseFloat(budgetData.limit) || 0;
    const tPercent = parseFloat(budgetData.tithingPercent) || 0;
    const tithingAmount = (limit * tPercent) / 100;

    // 2. Render Tithing Row first
    tbody.innerHTML += `
        <tr class="bg-blue-50/50">
            <td class="p-4 border-b font-semibold italic text-blue-800">Tithing (Auto ${tPercent}%)</td>
            <td class="p-4 border-b font-mono font-bold text-blue-800">$${tithingAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
        </tr>
    `;

    // 3. Calculate and Render Manual Expenses
    let spentTotal = tithingAmount;
    manualCategories.forEach(cat => {
        const amount = budgetData.expenses[cat] || 0;
        spentTotal += amount;
        tbody.innerHTML += `
            <tr>
                <td class="p-4 border-b">${cat}</td>
                <td class="p-4 border-b font-mono font-medium">$${amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            </tr>
        `;
    });

    const remaining = limit - spentTotal;

    // Update Summary UI
    document.getElementById('totalSpent').innerText = `$${spentTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    const remainingEl = document.getElementById('remainingBalance');
    remainingEl.innerText = `$${remaining.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    remainingEl.className = remaining < 0 
        ? "text-xl font-bold mt-1 text-red-600" 
        : "text-xl font-bold mt-1 text-green-600";
}

// Config Event Listeners
document.getElementById('monthlyLimit').addEventListener('input', (e) => {
    budgetData.limit = parseFloat(e.target.value) || 0;
    saveData();
});

document.getElementById('tithingPercent').addEventListener('input', (e) => {
    budgetData.tithingPercent = parseFloat(e.target.value) || 0;
    saveData();
});

// Expense Event Listener
document.getElementById('budgetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const cat = document.getElementById('category').value;
    const amt = parseFloat(document.getElementById('amount').value);

    if (!isNaN(amt)) {
        budgetData.expenses[cat] = (budgetData.expenses[cat] || 0) + amt;
        document.getElementById('amount').value = '';
        saveData();
    }
});

function clearDataManually() {
    if(confirm("Wipe all data for the current month?")) {
        budgetData = { limit: 0, tithingPercent: 10, expenses: {} };
        document.getElementById('monthlyLimit').value = "";
        document.getElementById('tithingPercent').value = 10;
        saveData();
    }
}

checkMonthlyReset();
renderTable();
