// Очищаем старые данные при загрузке
localStorage.removeItem('currentUser');
localStorage.removeItem('userId');
localStorage.removeItem('userPassword');

class UserManager {
    constructor() {
        this.currentUser = null;
    }

    async register(username, password) {
        try {
            const snapshot = await firebase.database().ref('users').orderByChild('username').equalTo(username).once('value');
            
            if (snapshot.exists()) {
                return { success: false, message: 'Пользователь уже существует' };
            }
            
            const newUserRef = firebase.database().ref('users').push();
            const userData = this.createDefaultData(username, password);
            await newUserRef.set(userData);
            
            return { success: true, message: 'Регистрация успешна' };
        } catch (error) {
            console.error('Ошибка регистрации:', error);
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
            });
            
            if (userData.password !== password) {
                return { success: false, message: 'Неверный логин или пароль' };
            }
            
            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userPassword', password);
            
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
        localStorage.removeItem('userPassword');
    }

    createDefaultData(username, password) {
        return {
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
    }

    async saveUserData(userData) {
        const userId = localStorage.getItem('userId');
        if (userId) {
            await firebase.database().ref('users/' + userId).update(userData);
        }
    }

    async loadUserData() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            const snapshot = await firebase.database().ref('users/' + userId).once('value');
            return snapshot.val();
        }
        return null;
    }
}

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
    
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'index.html';
    }
});