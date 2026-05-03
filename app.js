// State Management
let state = JSON.parse(localStorage.getItem('budgetState')) || {
    income: 0,
    tithRate: 10,
    transactions: [],
    monthKey: ""
};

const monthDisplay = document.getElementById('monthDisplay');
const heroBalance = document.getElementById('heroBalance');
const incomeInput = document.getElementById('incomeInput');
const tithDeduction = document.getElementById('tithDeduction');
const historyList = document.getElementById('historyList');
const tithRateDisplay = document.getElementById('tithRate');

// Auto-Reset Check
function init() {
    const now = new Date();
    const currentKey = `${now.getMonth()}-${now.getFullYear()}`;
    
    if (state.monthKey !== currentKey) {
        state = { income: 0, tithRate: 10, transactions: [], monthKey: currentKey };
        save();
    }
    
    monthDisplay.innerText = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    incomeInput.value = state.income || "";
    tithRateDisplay.innerText = state.tithRate;
    updateUI();
}

function updateUI() {
    const income = parseFloat(state.income) || 0;
    const tithing = (income * (state.tithRate / 100));
    
    const totalExpenses = state.transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const remaining = income - tithing - totalExpenses;

    // Update Hero Stats
    heroBalance.innerText = `$${remaining.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    tithDeduction.innerText = `-$${tithing.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    // Color coding balance
    heroBalance.className = remaining < 0 ? "text-6xl font-black text-red-400" : "text-6xl font-black text-white";

    // Render List
    historyList.innerHTML = '';
    [...state.transactions].reverse().forEach((t, index) => {
        historyList.innerHTML += `
            <div class="p-4 flex justify-between items-center animate-fadeIn">
                <div>
                    <p class="font-bold text-gray-800">${t.category}</p>
                    <p class="text-xs text-gray-400">${t.date}</p>
                </div>
                <p class="font-mono font-bold text-red-500">-$${t.amount.toFixed(2)}</p>
            </div>
        `;
    });
}

function save() {
    localStorage.setItem('budgetState', JSON.stringify(state));
    updateUI();
}

// Event Listeners
incomeInput.addEventListener('input', (e) => {
    state.income = parseFloat(e.target.value) || 0;
    save();
});

document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const cat = document.getElementById('catInput').value;
    const amt = parseFloat(document.getElementById('amtInput').value);
    
    if (amt > 0) {
        state.transactions.push({
            category: cat,
            amount: amt,
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        document.getElementById('amtInput').value = '';
        save();
    }
});

function changeTithing() {
    const newRate = prompt("Enter new Tithing percentage:", state.tithRate);
    if (newRate !== null) {
        state.tithRate = parseFloat(newRate) || 0;
        tithRateDisplay.innerText = state.tithRate;
        save();
    }
}

function resetApp() {
    if(confirm("Clear everything and start over?")) {
        state.income = 0;
        state.transactions = [];
        incomeInput.value = "";
        save();
    }
}

init();
