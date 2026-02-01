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

    const btn = document.getElementById("submit-btn");
    setLoading(btn, true);

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

        loginUser(login);
        showMessage("success", "Login realizado com sucesso!");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (error) {
        setLoading(btn, false);
        showMessage("error", error.message);
    }
}

function clearMessages() {
    const errorBox = document.getElementById("error-message");
    const successBox = document.getElementById("success-message");

    if (errorBox) errorBox.style.display = 'none';
    if (successBox) successBox.style.display = 'none';
}

function setLoading(btn, loading) {
    const text = btn.querySelector('.button-text');
    const icon = btn.querySelector('.button-icon');
    const spinner = btn.querySelector('.button-spinner');

    if (loading) {
        text.textContent = 'Entrando...';
        icon.style.display = 'none';
        spinner.style.display = 'inline-block';
        btn.disabled = true;
    } else {
        text.textContent = 'Entrar';
        icon.style.display = 'inline';
        spinner.style.display = 'none';
        btn.disabled = false;
    }
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