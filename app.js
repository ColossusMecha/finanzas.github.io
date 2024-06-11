document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar los elementos del DOM
    const transactionForm = document.getElementById('transaction-form');
    const historyList = document.getElementById('history-list');
    const expenseChartCanvas = document.getElementById('expense-chart');

    // Obtener las transacciones del almacenamiento local o inicializar un arreglo vacío
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    console.log("Initial transactions:", transactions);

    // Función para agregar una transacción
    function addTransaction(event) {
        event.preventDefault();
        
        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        
        console.log("Form values - Type:", type, "Description:", description, "Amount:", amount);

        if (!description || isNaN(amount) || amount <= 0) {
            alert("Por favor, complete todos los campos correctamente.");
            return;
        }

        // Crear un objeto de transacción con un identificador único
        const transaction = {
            id: Date.now(),
            type,
            description,
            amount
        };

        transactions.push(transaction);
        console.log("New transaction added:", transaction);
        console.log("Updated transactions:", transactions);

        // Renderizar el historial de transacciones y actualizar la gráfica
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderHistory();
        updateChart();
    }

    // Función para renderizar el historial de transacciones
    function renderHistory() {
        historyList.innerHTML = '';
        transactions.forEach(transaction => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${transaction.type === 'income' ? 'Ingreso' : 'Gasto'}: ${transaction.description} - $${transaction.amount}</span>
                <button class="delete-btn" data-id="${transaction.id}">Eliminar</button>
            `;
            listItem.classList.add(transaction.type === 'income' ? 'income' : 'expense');
            historyList.appendChild(listItem);
        });
        // Agregar eventos de clic a los botones de eliminación
        addDeleteEventListeners();
        console.log("Rendered history list:", historyList);
    }

    // Función para actualizar la gráfica de gastos
    function updateChart() {
        // Filtrar las transacciones por tipo (ingreso o gasto)
        const expenseAmounts = transactions.filter(transaction => transaction.type === 'expense').map(transaction => transaction.amount);
        const incomeAmounts = transactions.filter(transaction => transaction.type === 'income').map(transaction => transaction.amount);

        // Calcular el total de gastos e ingresos
        const totalExpenses = expenseAmounts.reduce((acc, amount) => acc + amount, 0);
        const totalIncomes = incomeAmounts.reduce((acc, amount) => acc + amount, 0);

         // Obtener el contexto del lienzo de la gráfica
        const ctx = expenseChartCanvas.getContext('2d');

         // Crear una nueva instancia de Chart.js para la gráfica de gastos e ingresos
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Gastos', 'Ingresos'],
                datasets: [{
                    data: [totalExpenses, totalIncomes],
                    backgroundColor: ['#ff6384', '#36a2eb'],
                    hoverBackgroundColor: ['#ff6384', '#36a2eb']
                }]
            },
            options: {
                responsive: true
            }
        });
        console.log("Updated chart with data:", [totalExpenses, totalIncomes]);
    }

    // Función para agregar eventos de clic a los botones de eliminación
    function addDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const transactionId = button.getAttribute('data-id');
                deleteTransaction(transactionId);
            });
        });
    }

    function deleteTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== parseInt(id));
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderHistory();
        updateChart();
    }
    // Agregar un evento de envío al formulario para agregar transacciones
    transactionForm.addEventListener('submit', addTransaction);
    // Renderizar el historial de transacciones y actualizar la gráfica cuando se carga la página
    renderHistory();
    updateChart();
});

