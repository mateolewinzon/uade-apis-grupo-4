// Función principal para cargar usuarios
async function loadUsers() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const tableContainer = document.getElementById('tableContainer');
    
    try {
        // Mostrar loading
        loading.style.display = 'block';
        error.style.display = 'none';
        tableContainer.style.display = 'none';
        
        // Hacer la llamada a la API
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        
        // Ocultar loading y mostrar tabla
        loading.style.display = 'none';
        displayUsers(users);
        
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        loading.style.display = 'none';
        error.style.display = 'block';
    }
}

// Función para mostrar usuarios en la tabla
function displayUsers(users) {

    // display hidden 
    
    const tableContainer = document.getElementById('tableContainer');
    const tableBody = document.getElementById('usersTableBody');
    
    // Limpiar tabla anterior
    tableBody.innerHTML = '';
    
    // Crear filas para cada usuario
    users.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.address.city}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Mostrar la tabla
    tableContainer.style.display = 'block';
}


// Cargar usuarios cuando la página se cargue
document.addEventListener('DOMContentLoaded', async () => {
    loadUsers();
});
