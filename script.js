document.addEventListener("DOMContentLoaded", loadUsers);
const form = document.getElementById("userForm");
const userList = document.getElementById("userList");

// Carregar usuários do banco de dados e exibir na tabela
async function loadUsers() {
    userList.innerHTML = ""; // Limpa a tabela antes de carregar

    try {
        let resposta = await fetch("http://localhost:3000/consultar")
        let users = await resposta.json();

        users.forEach(user => addUserToTable(user));
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
    }
}

// Criar novo usuário
async function createUser(nome_usuario, email) {
    try {
        const res = await fetch('http://localhost:3000/cadastrar', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome_usuario, email })
        });
        loadUsers(); // Atualiza a lista
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert('Erro ao conectar ao servidor.');
    }
}


// Excluir usuário
async function deleteUser(id) {
    try {
        const res = await fetch(`http://localhost:3000/deletar/${id}`,
            {
                method: "DELETE"
            });

        if (res.ok) {
            loadUsers();
        } else {
            alert("Erro ao excluir usuário.");
        }
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Falha ao excluir usuário.");
    }
}


// Adicionar usuário à tabela
function addUserToTable(user) {
    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${user.nome_usuario}</td>
        <td>${user.email}</td>
        <td>
            <button onclick="editUser(${user.id})">✏️ Editar</button>
            <button onclick="deleteUser(${user.id})">🗑️ Excluir</button>
        </td>
    `;

    userList.appendChild(row);

}

async function editUser(id) {
    try {
        let resposta = await fetch(`http://localhost:3000/consultar/${id}`);
        let user = await resposta.json();

        // Preencher os campos do modal
        document.getElementById("id").value = user.id;
        document.getElementById("nome").value = user.nome_usuario;
        document.getElementById("email").value = user.email;

        // Exibir o modal
        // editModal.style.display = "block";
    } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        alert("Erro ao carregar os dados do usuário.");
    }
}

// Carregar os dados do usuário para edição
async function updateUser() {
    const id = document.getElementById("id").value;
    const nome_usuario = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    try {
        const res = await fetch(`http://localhost:3000/editar/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome_usuario, email })
        });
        if (res.status == 200) {
            alert("Usuário atualizado com sucesso!");
            // editModal.style.display = "none"; // Fecha o modal
        } else {
            alert("Erro ao atualizar usuário.");
        }
    } catch (error) {
        console.error("Erro ao atualizar:", error);
        alert("Falha ao atualizar usuário.");
    }
    loadUsers();
}






// Evento de envio do formulário
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = document.getElementById("id").value;
    const nome_usuario = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    if (id) {
        updateUser(id, nome_usuario, email);
    } else {
        createUser(nome_usuario, email);
    }
    form.reset();
});
