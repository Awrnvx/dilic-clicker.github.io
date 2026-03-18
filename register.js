// register.js - ПОЛНАЯ ИСПРАВЛЕННАЯ ВЕРСИЯ

// Очищаем localStorage при загрузке
localStorage.removeItem('currentUser');
localStorage.removeItem('userId');

class UserManager {
    constructor() {
        this.currentUser = null;
    }

    async register(username, password) {
        try {
            console.log('📝 Регистрация пользователя:', username);
            
            // Проверяем, есть ли уже такой пользователь
            const snapshot = await firebase.database().ref('users').orderByChild('username').equalTo(username).once('value');
            
            if (snapshot.exists()) {
                console.log('❌ Пользователь уже существует');
                return { success: false, message: 'Пользователь уже существует' };
            }
            
            // Создаем нового пользователя с уникальным ID
            const newUserRef = firebase.database().ref('users').push();
            const userId = newUserRef.key;
            
            console.log('🆔 Новый ID пользователя:', userId);
            
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
            
            console.log('📤 Отправка данных в Firebase...');
            await newUserRef.set(userData);
            console.log('✅ Пользователь создан с ID:', userId);
            
            return { success: true, message: 'Регистрация успешна' };
        } catch (error) {
            console.error('❌ Ошибка регистрации:', error);
            console.error('Детали ошибки:', error.message);
            return { success: false, message: 'Ошибка при регистрации: ' + error.message };
        }
    }

    async login(username, password) {
        try {
            console.log('🔑 Вход пользователя:', username);
            
            const snapshot = await firebase.database().ref('users').orderByChild('username').equalTo(username).once('value');
            
            if (!snapshot.exists()) {
                console.log('❌ Пользователь не найден');
                return { success: false, message: 'Неверный логин или пароль' };
            }
            
            let userData = null;
            let userId = null;
            
            snapshot.forEach(child => {
                userData = child.val();
                userId = child.key;
                console.log('✅ Пользователь найден, ID:', userId);
            });
            
            if (userData.password !== password) {
                console.log('❌ Пароль не совпадает');
                return { success: false, message: 'Неверный логин или пароль' };
            }
            
            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            localStorage.setItem('userId', userId);
            
            console.log('✅ Вход выполнен для пользователя:', username);
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
    console.log('🚀 Страница регистрации загружена');
    
    // Проверяем, не авторизован ли уже пользователь
    if (localStorage.getItem('currentUser') && localStorage.getItem('userId')) {
        console.log('👤 Пользователь уже авторизован, перенаправление на index.html');
        window.location.href = 'index.html';
        return;
    }
    
    const userManager = new UserManager();
    
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (!loginTab || !registerTab || !loginForm || !registerForm) {
        console.error('❌ Не найдены элементы формы');
        return;
    }
    
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
        console.log('📝 Отправка формы регистрации');
        
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        console.log('Логин:', username);
        
        if (!username || !password) {
            alert('❌ Заполните все поля');
            return;
        }
        
        if (username.length < 3) {
            alert('❌ Логин должен быть минимум 3 символа');
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
        console.log('Результат регистрации:', result);
        
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
    
    // Обработка входа
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('🔑 Отправка формы входа');
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        if (!username || !password) {
            alert('❌ Заполните все поля');
            return;
        }
        
        const result = await userManager.login(username, password);
        console.log('Результат входа:', result);
        
        if (result.success) {
            console.log('✅ Перенаправление на index.html');
            window.location.href = 'index.html';
        } else {
            alert('❌ ' + result.message);
            document.getElementById('loginPassword').value = '';
        }
    });
});