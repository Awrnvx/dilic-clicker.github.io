// register.js - ПОЛНАЯ БЕЗОПАСНАЯ ВЕРСИЯ

// Очищаем localStorage при загрузке
localStorage.removeItem('currentUser');
localStorage.removeItem('userId');

class UserManager {
    constructor() {
        this.currentUser = null;
    }

    async register(username, password) {
        try {
            // Проверяем, есть ли уже такой пользователь
            const snapshot = await firebase.database().ref('users').orderByChild('username').equalTo(username).once('value');
            
            if (snapshot.exists()) {
                return { success: false, message: 'Пользователь уже существует' };
            }
            
            // ✅ ВАЖНО: создаем НОВЫЙ уникальный ID через push()
            const newUserRef = firebase.database().ref('users').push();
            
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
                lastSave: Date.now(),
                createdAt: Date.now()
            };
            
            await newUserRef.set(userData);
            console.log('✅ Новый пользователь создан с ID:', newUserRef.key);
            
            return { success: true, message: 'Регистрация успешна' };
        } catch (error) {
            console.error('❌ Ошибка регистрации:', error);
            return { success: false, message: 'Ошибка при регистрации' };
        }
    }

    async login(username, password) {
        try {
            const snapshot = await firebase.database().ref('users').orderByChild('username').equalTo(username).once('value');
            
            if (!snapshot.exists()) {
                return { success: false, message: 'Неверный логин или пароль' };
            }
            
            let userData = null;
            let userId = null;
            
            snapshot.forEach(child => {
                userData = child.val();
                userId = child.key;
                console.log('Найден пользователь:', userData.username, 'с ID:', userId);
            });
            
            if (userData.password !== password) {
                console.log('Пароль не совпадает');
                return { success: false, message: 'Неверный логин или пароль' };
            }
            
            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            localStorage.setItem('userId', userId);
            
            console.log('✅ Вход выполнен для пользователя:', username, 'ID:', userId);
            return { success: true, message: 'Вход выполнен' };
        } catch (error) {
            console.error('❌ Ошибка входа:', error);
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
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if (!username || !password) {
            alert('❌ Заполните все поля');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('❌ Пароли не совпадают');
            return;
        }
        
        if (password.length < 4) {
            alert('❌ Пароль должен быть минимум 4 символа');
            return;
        }
        
        const result = await userManager.register(username, password);
        
        if (result.success) {
            alert('✅ Регистрация успешна! Теперь войдите.');
            loginTab.click();
            
            document.getElementById('regUsername').value = '';
            document.getElementById('regPassword').value = '';
            document.getElementById('regConfirmPassword').value = '';
        } else {
            alert('❌ ' + result.message);
        }
    });
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        if (!username || !password) {
            alert('❌ Заполните все поля');
            return;
        }
        
        const result = await userManager.login(username, password);
        
        if (result.success) {
            window.location.href = 'index.html';
        } else {
            alert('❌ ' + result.message);
            document.getElementById('loginPassword').value = '';
        }
    });
    
    if (localStorage.getItem('currentUser') && localStorage.getItem('userId')) {
        window.location.href = 'index.html';
    }
});