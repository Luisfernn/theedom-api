/**
 * auth.js
 * Controle simples de autenticação (frontend)
 */

const AUTH_KEY = 'bl_logged_user';

/**
 * Marca o usuário como logado
 * @param {string} login
 */
function loginUser(login) {
    localStorage.setItem(AUTH_KEY, login);
}

/**
 * Remove o login do usuário
 */
function logoutUser() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}

/**
 * Verifica se o usuário está logado
 * @returns {boolean}
 */
function isAuthenticated() {
    return !!localStorage.getItem(AUTH_KEY);
}

/**
 * Protege páginas privadas
 * Se não estiver logado → redireciona para login
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

/*Função de logout*/
function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}