localStorage.removeItem('currentUser');
localStorage.removeItem('userId');

class UserManager {
    async register(username, password) {
        try {
            const snapshot = await firebase.database().ref('users').orderByChild('username').equalTo(username).once('value');
            if (snapshot.exists()) {
                return { success: false, message: 'Пользователь уже существует' };
            }
            const newUserRef = firebase.database().ref('users').push();
            await newUserRef.set({
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
            });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async login(username, password) {
        try {
            const snapshot = await firebase.database().ref('users').orderByChild('username').equalTo(username).once('value');
            if (!snapshot.exists()) {
                return { success: false, message: 'Неверный логин или пароль' };
            }
            let userData, userId;
            snapshot.forEach(child => {
                userData = child.val();
                userId = child.key;
            });
            if (userData.password !== password) {
                return { success: false, message: 'Неверный логин или пароль' };
            }
            localStorage.setItem('currentUser', username);
            localStorage.setItem('userId', userId);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
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
        const result = await userManager.register(
            document.getElementById('regUsername').value,
            document.getElementById('regPassword').value
        );
        if (result.success) {
            alert('✅ Регистрация успешна!');
            loginTab.click();
        } else {
            alert('❌ ' + result.message);
        }
    });
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const result = await userManager.login(
            document.getElementById('loginUsername').value,
            document.getElementById('loginPassword').value
        );
        if (result.success) {
            window.location.href = 'index.html';
        } else {
            alert('❌ ' + result.message);
        }
    });
    
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'index.html';
    }
});