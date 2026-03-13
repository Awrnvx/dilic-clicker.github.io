// Управление пользователями
class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || {};
        this.currentUser = null;
    }

    register(username, password) {
        if (this.users[username]) {
            return { success: false, message: 'Пользователь уже существует' };
        }
        
        this.users[username] = {
            password: password,
            data: this.createDefaultData()
        };
        
        localStorage.setItem('users', JSON.stringify(this.users));
        return { success: true, message: 'Регистрация успешна' };
    }

    login(username, password) {
        const user = this.users[username];
        if (!user || user.password !== password) {
            return { success: false, message: 'Неверный логин или пароль' };
        }
        
        this.currentUser = username;
        localStorage.setItem('currentUser', username);
        return { success: true, message: 'Вход выполнен' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    createDefaultData() {
        return {
            clicks: 0,
            money: 0,
            dilicks: 0,
            clickPower: 1,
            autoClickerLevel: 0,
            critChance: 5,
            skins: ['default'],
            currentSkin: 'default',
            seasonLevel: 1,
            seasonExp: 0,
            playtime: 0,
            lastSave: Date.now()
        };
    }

    saveUserData(userData) {
        if (this.currentUser && this.users[this.currentUser]) {
            this.users[this.currentUser].data = userData;
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }

    loadUserData() {
        if (this.currentUser && this.users[this.currentUser]) {
            return this.users[this.currentUser].data;
        }
        return null;
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const userManager = new UserManager();
    
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Переключение между вкладками
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });
    
    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });
    
    // Обработка регистрации
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }
        
        const result = userManager.register(username, password);
        
        if (result.success) {
            alert('Регистрация успешна! Теперь войдите в систему.');
            loginTab.click();
        } else {
            alert(result.message);
        }
    });
    
    // Обработка входа
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        const result = userManager.login(username, password);
        
        if (result.success) {
            window.location.href = 'index.html';
        } else {
            alert(result.message);
        }
    });
    
    // Проверка, если пользователь уже вошел
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'index.html';
    }
});