// register.js - Полная версия

// Очищаем localStorage при загрузке страницы
localStorage.removeItem('currentUser');
localStorage.removeItem('userId');

class UserManager {
    constructor() {
        this.currentUser = null;
    }

    async register(username, password) {
        try {
            // Проверяем, существует ли уже такой пользователь
            const usersRef = firebase.database().ref('users');
            const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
            
            if (snapshot.exists()) {
                return { success: false, message: 'Пользователь уже существует' };
            }
            
            // Создаем нового пользователя
            const newUserRef = usersRef.push();
            const userData = {
                username: username,
                password: password,
                clicks: 0,
                money: 1000,
                dilicks: 500,
                clickPower: 1,
                autoClickerLevel: 0,
                critChance: 5,
                inventory: ['classic'],
                currentSkin: 'classic',
                seasonLevel: 1,
                seasonExp: 0,
                playtime: 0,
                premiumPass: false,
                completedAchievements: [],
                activatedPromocodes: [],
                promocodesHistory: [],
                lastSave: Date.now()
            };
            
            await newUserRef.set(userData);
            return { success: true, message: 'Регистрация успешна' };
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            return { success: false, message: 'Ошибка при регистрации' };
        }
    }

    async login(username, password) {
        try {
            // Ищем пользователя по имени
            const usersRef = firebase.database().ref('users');
            const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
            
            if (!snapshot.exists()) {
                return { success: false, message: 'Неверный логин или пароль' };
            }
            
            // Получаем данные пользователя
            let userData = null;
            let userId = null;
            
            snapshot.forEach(child => {
                userData = child.val();
                userId = child.key;
            });
            
            // Проверяем пароль
            if (userData.password !== password) {
                return { success: false, message: 'Неверный логин или пароль' };
            }
            
            // Сохраняем данные в localStorage
            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            localStorage.setItem('userId', userId);
            
            return { success: true, message: 'Вход выполнен' };
        } catch (error) {
            console.error('Ошибка входа:', error);
            return { success: false, message: 'Ошибка при входе' };
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userId');
    }
}

// Инициализация при загрузке страницы
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
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }
        
        const result = await userManager.register(username, password);
        
        if (result.success) {
            alert('Регистрация успешна! Теперь войдите в систему.');
            loginTab.click();
        } else {
            alert(result.message);
        }
    });
    
    // Обработка входа
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        const result = await userManager.login(username, password);
        
        if (result.success) {
            window.location.href = 'index.html';
        } else {
            alert(result.message);
        }
    });
    
    // Если пользователь уже вошел - перенаправляем
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'index.html';
    }
});