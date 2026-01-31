document.addEventListener("DOMContentLoaded", () => {
    initializeLoginForm();
});

function initializeLoginForm() {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", handleLoginSubmit);

    const inputs = form.querySelectorAll(".form-input");
    inputs.forEach(input => {
        input.addEventListener("focus", clearMessages);
    });
}

async function handleLoginSubmit(event) {
    event.preventDefault();

    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!login || !password) {
        showMessage("error", "Preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ login, password })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || "Erro ao autenticar");
        }

        showMessage("success", "Login realizado com sucesso!");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (error) {
        showMessage("error", error.message);
    }
}

function clearMessages() {
    const errorBox = document.getElementById("error-message");
    const successBox = document.getElementById("success-message");

    if (errorBox) errorBox.style.display = 'none';
    if (successBox) successBox.style.display = 'none';
}

function showMessage(type, text) {
    clearMessages();

    const targetId = type === 'success' ? 'success-message' : 'error-message';
    const target = document.getElementById(targetId);

    if (target) {
        target.querySelector('.message-text').textContent = text;
        target.style.display = 'flex';
    }
}