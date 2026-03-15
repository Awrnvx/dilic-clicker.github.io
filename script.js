// script.js - Полная версия игры с колесом фортуны и компенсацией

class ClickerGame {
    constructor() {
        this.userData = null;
        this.autoClickerInterval = null;
        this.playtimeInterval = null;
        this.bubbleFrame = null;
        this.lastBubbleTime = 0;
        this.settings = null;
        this.wheel = null; // Для колеса фортуны
        this.compensationShown = false; // Флаг для показа компенсации
        
        // Данные скинов
        this.skinsData = {
            'classic': {
                name: 'Классический скин',
                price: 0,
                image: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png',
                description: 'Стандартный курсор',
                currency: 'money'
            },
            'neon': {
                name: 'Неоновый скин',
                price: 1000,
                image: 'https://img.freepik.com/premium-photo/neon-style-computer-cursor-arrow-design-vector_1018059-4.jpg?semt=ais_hybrid&w=740',
                description: 'Яркий неоновый курсор',
                currency: 'money'
            },
            'monsters_skin': {
                name: 'Монстр скин',
                price: 0,
                image: 'https://avatars.mds.yandex.net/i?id=83ac2b7a91b5b67b7ffb26da4b8b1a2abd4fc83f-8981816-images-thumbs&n=13',
                description: 'Эксклюзивный скин монстра',
                currency: 'money'
            },
            'dragon_skin': {
                name: 'Драконий скин',
                price: 15000,
                image: 'https://avatars.mds.yandex.net/i?id=78aac0954c4f305798014e687e3d7f1d_l-6327735-images-thumbs&n=13',
                description: 'Мощный скин дракона',
                currency: 'dilicks'
            },
            // 👇 НОВЫЙ СКИН ИЗ КОЛЕСА
            'wheel_dragon_skin': {
                name: 'Колесный дракон',
                price: 0, // Не продается, только из колеса
                image: 'https://static.wikia.nocookie.net/59310fd4-7c46-4895-930e-6cea7982a142/scale-to-width/755',
                description: 'Особенный скин дракона (×250 множитель)',
                currency: 'special'
            }
        };
        
        // Достижения - ОБНОВЛЕНО ДОСТИЖЕНИЕ КОЛЛЕКЦИОНЕРА
        this.achievementsData = [
            {
                id: 'firstClick',
                name: 'Первый шаг',
                description: 'Сделайте первый клик',
                icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png',
                condition: (data) => data.clicks >= 1,
                reward: { money: 100, dilicks: 10 }
            },
            {
                id: 'clicker100',
                name: 'Начинающий кликер',
                description: 'Сделайте 100 кликов',
                icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png',
                condition: (data) => data.clicks >= 100,
                reward: { money: 500, dilicks: 50 }
            },
            {
                id: 'clicker1000',
                name: 'Опытный кликер',
                description: 'Сделайте 1000 кликов',
                icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png',
                condition: (data) => data.clicks >= 1000,
                reward: { money: 2000, dilicks: 200 }
            },
            {
                id: 'richMan',
                name: 'Богач',
                description: 'Накопите 10000 денег',
                icon: 'https://avatars.mds.yandex.net/i?id=d2747e92b4fb93d8cee0b3582cb46ea6_l-5332707-images-thumbs&n=13',
                condition: (data) => data.money >= 10000,
                reward: { money: 0, dilicks: 500 }
            },
            {
                id: 'dilicMaster',
                name: 'Мастер диликов',
                description: 'Накопите 5000 диликов',
                icon: 'https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg',
                condition: (data) => data.dilicks >= 5000,
                reward: { money: 5000, dilicks: 0 }
            },
            {
                id: 'skinCollector',
                name: 'Коллекционер',
                description: 'Соберите все 5 скинов',
                icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png',
                condition: (data) => data.inventory && data.inventory.length >= 5,
                reward: { money: 35000, dilicks: 0 } // 👈 35000 диликов
            },
            {
                id: 'critMaster',
                name: 'Повелитель критов',
                description: 'Увеличьте шанс крита до 50%',
                icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png',
                condition: (data) => data.critChance >= 50,
                reward: { money: 2000, dilicks: 200 }
            },
            {
                id: 'autoClickerMaster',
                name: 'Автоматизация',
                description: 'Купите 10 уровней автокликера',
                icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png',
                condition: (data) => data.autoClickerLevel >= 10,
                reward: { money: 5000, dilicks: 500 }
            },
            {
                id: 'wheelMaster',
                name: 'Властелин колеса',
                description: 'Получите особенного скина из колеса фортуны',
                icon: 'https://static.wikia.nocookie.net/59310fd4-7c46-4895-930e-6cea7982a142/scale-to-width/755',
                condition: (data) => data.inventory && data.inventory.includes('wheel_dragon_skin'),
                reward: { money: 10000, dilicks: 5000 }
            }
        ];
        
        // Прояямокоды
        this.promocodesData = {
            'WELCOME': {
                code: 'WELCOME',
                reward: { money: 500, dilicks: 100 },
                description: 'Приветственный бонус',
                maxActivations: 1,
                expiryDate: null
            },
            'DILICKS100': {
                code: 'DILICKS100',
                reward: { money: 0, dilicks: 100 },
                description: '100 диликов в подарок',
                maxActivations: 1,
                expiryDate: null
            },
            'MONEY1000': {
                code: 'MONEY1000',
                reward: { money: 1000, dilicks: 0 },
                description: '1000 монет',
                maxActivations: 1,
                expiryDate: null
            },
            'CLICKER2024': {
                code: 'CLICKER2024',
                reward: { money: 500, dilicks: 50 },
                description: 'Новогодний промокод',
                maxActivations: 1,
                expiryDate: new Date('2024-12-31').getTime()
            },
            'SUPERBONUS': {
                code: 'SUPERBONUS',
                reward: { money: 2000, dilicks: 200 },
                description: 'Супер бонус',
                maxActivations: 1,
                expiryDate: null
            },
            'NEONLOVER': {
                code: 'NEONLOVER',
                reward: { money: 1500, dilicks: 150 },
                description: 'Для любителей неона',
                maxActivations: 1,
                expiryDate: null
            },
            'MONSTERS-SKIN': {
                code: 'MONSTERS-SKIN',
                reward: { money: 0, dilicks: 0, skin: 'monsters_skin' },
                description: 'Скин монстра в подарок!',
                maxActivations: 1,
                expiryDate: null
            },
            'DRAGON-SKIN': {
                code: 'DRAGON-SKIN',
                reward: { money: 0, dilicks: 0, skin: 'dragon_skin' },
                description: 'Скин дракона в подарок!',
                maxActivations: 1,
                expiryDate: null
            },

        };
        
        this.init();
    }

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    async init() {
        const userId = localStorage.getItem('userId');
        const currentUser = localStorage.getItem('currentUser');
        
        if (!userId || !currentUser) {
            window.location.href = 'register.html';
            return;
        }
        
        try {
            const userRef = firebase.database().ref('users/' + userId);
            const snapshot = await userRef.once('value');
            
            if (snapshot.exists()) {
                this.userData = snapshot.val();
                console.log('✅ Данные загружены из Firebase');
                
                // 👇 ПРОВЕРЯЕМ НУЖНА ЛИ КОМПЕНСАЦИЯ
                await this.checkCompensation();
                
            } else {
                console.error('❌ Пользователь не найден');
                localStorage.clear();
                window.location.href = 'register.html';
                return;
            }
        } catch (error) {
            console.error('❌ Ошибка загрузки из Firebase:', error);
            localStorage.clear();
            window.location.href = 'register.html';
            return;
        }
        
        this.loadElements();
        this.setupEventListeners();
        this.startAutoClicker();
        this.startPlaytimeTracker();
        this.startBubbles();
        
        if (this.clickIcon && this.userData.currentSkin) {
            this.clickIcon.src = this.skinsData[this.userData.currentSkin].image;
        }
        
        // Инициализируем настройки
        this.settings = new Settings(this);
        
        this.updateUI();
        this.updateInventory();
        this.updateShopStatus();
        this.updateUpgradePrices();
        this.updatePromocodesList();
        this.updatePromocodesHistory();
        this.updateLeaderboard('clicks');
    }

    // ===== ПРОВЕРКА КОМПЕНСАЦИИ ДЛЯ СТАРЫХ ИГРОКОВ =====
    async checkCompensation() {
        // Проверяем, получал ли игрок компенсацию раньше
        if (this.userData.compensationReceived) {
            console.log('✅ Компенсация уже была получена');
            return;
        }
        
        // Проверяем, есть ли у игрока достижение "Коллекционер" (полученное при 4 скинах)
        const hasOldCollector = this.userData.completedAchievements && 
                                this.userData.completedAchievements.includes('skinCollector');
        
        // Проверяем, сколько сейчас скинов
        const currentSkinCount = this.userData.inventory?.length || 0;
        
        // Условие для компенсации:
        // 1. Игрок уже получал достижение "Коллекционер" (когда было 4 скина)
        // 2. ИЛИ у игрока 4 скина (почти коллекционер)
        // 3. И компенсация еще не выдавалась
        if ((hasOldCollector || currentSkinCount >= 4) && !this.userData.compensationReceived) {
            console.log('🎁 Игроку положена компенсация!');
            this.showCompensationDialog();
        }
    }

    // ===== ПОКАЗ ДИАЛОГА КОМПЕНСАЦИИ =====
    showCompensationDialog() {
        if (this.compensationShown) return;
        this.compensationShown = true;
        
        // Создаем модальное окно для компенсации
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'compensationModal';
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'all';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 450px; background: rgba(20,25,35,0.95); border: 2px solid gold; border-radius: 50px; padding: 30px; text-align: center;">
                <h2 style="color: gold; font-size: 2rem; margin-bottom: 20px;">🎁 БОНУС ОБНОВЛЕНИЯ</h2>
                <div style="margin: 20px 0;">
                    <img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 15px;">
                    <p style="color: white; font-size: 1.2rem; margin-bottom: 10px;">В игру добавлен 5-й скин!</p>
                    <p style="color: rgba(255,255,255,0.8); margin-bottom: 20px;">Для коллекционеров мы подготовили компенсацию:</p>
                    <div style="background: rgba(255,215,0,0.1); border-radius: 30px; padding: 15px; margin-bottom: 20px;">
                        <span style="color: gold; font-size: 2rem; font-weight: bold;">+4500</span>
                        <img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" style="width: 30px; height: 30px; border-radius: 50%; margin-left: 10px;">
                    </div>
                </div>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="modal-btn confirm" id="claimCompensation" style="background: rgba(76,175,80,0.2); border: 1px solid #4CAF50; color: white; padding: 12px 30px; border-radius: 40px; font-weight: bold; cursor: pointer;">ПОЛУЧИТЬ</button>
                    <button class="modal-btn cancel" id="closeCompensation" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 12px 30px; border-radius: 40px; font-weight: bold; cursor: pointer;">ПОЗЖЕ</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Обработчики
        document.getElementById('claimCompensation').addEventListener('click', () => {
            this.claimCompensation();
            modal.remove();
        });
        
        document.getElementById('closeCompensation').addEventListener('click', () => {
            modal.remove();
        });
    }

    // ===== ПОЛУЧЕНИЕ КОМПЕНСАЦИИ =====
    async claimCompensation() {
        // Добавляем 4500 диликов
        this.userData.dilicks += 4500;
        
        // Отмечаем, что компенсация получена
        this.userData.compensationReceived = true;
        
        // Сохраняем в Firebase
        await this.saveGame();
        
        // Обновляем интерфейс
        this.updateUI();
        
        // Показываем уведомление
        this.showNotification('✅ +4500 диликов получено!', 'success');
        
        console.log('✅ Компенсация выдана:', this.userData.dilicks);
    }

    // ===== УВЕДОМЛЕНИЕ =====
    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `settings-toast ${type}`;
        toast.innerHTML = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    createDefaultData() {
        return {
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
            compensationReceived: false, // 👈 Флаг для компенсации
            settings: {
                displayName: '',
                theme: 'dark',
                notifications: true,
                sound: true,
                animations: true,
                language: 'ru'
            },
            lastSave: Date.now()
        };
    }

    // ===== ЗАГРУЗКА ЭЛЕМЕНТОВ =====
    loadElements() {
        this.usernameDisplay = document.getElementById('usernameDisplay');
        this.moneySpan = document.getElementById('money');
        this.dilicksSpan = document.getElementById('dilicks');
        this.clicksSpan = document.getElementById('clicks');
        this.clickPowerSpan = document.getElementById('clickPower');
        this.playtimeSpan = document.getElementById('playtime');
        this.clickButton = document.getElementById('clickButton');
        this.clickIcon = document.getElementById('clickIcon');
        this.clickEffects = document.getElementById('clickEffects');
        
        this.navBtns = document.querySelectorAll('.nav-btn');
        this.tabs = document.querySelectorAll('.tab');
        
        this.buyBtns = document.querySelectorAll('.buy-btn');
        this.upgradeBtns = document.querySelectorAll('.upgrade-btn');
        
        this.seasonProgress = document.getElementById('seasonProgress');
        this.seasonLevel = document.getElementById('seasonLevel');
        this.buyPremiumBtn = document.getElementById('buyPremiumBtn');
        
        this.leaderboardBtns = document.querySelectorAll('[data-leaderboard]');
        this.leaderboardBody = document.getElementById('leaderboardBody');
        
        this.inventoryGrid = document.getElementById('inventoryGrid');
        
        this.profileUsername = document.getElementById('profileUsername');
        this.profileLevel = document.getElementById('profileLevel');
        this.profileClicks = document.getElementById('profileClicks');
        this.profileMoney = document.getElementById('profileMoney');
        this.profileDilicks = document.getElementById('profileDilicks');
        this.profilePlaytime = document.getElementById('profilePlaytime');
        this.profileAvatar = document.getElementById('profileAvatar');
        this.achievementsGrid = document.getElementById('achievementsGrid');
        this.ownedSkinsList = document.getElementById('ownedSkinsList');
        this.skinProgressFill = document.getElementById('skinProgressFill');
        this.ownedSkins = document.getElementById('ownedSkins');
        this.totalSkins = document.getElementById('totalSkins');
        
        this.promocodeInput = document.getElementById('promocodeInput');
        this.activatePromocodeBtn = document.getElementById('activatePromocodeBtn');
        this.promocodeMessage = document.getElementById('promocodeMessage');
        this.promocodesList = document.getElementById('promocodesList');
        this.promocodesHistory = document.getElementById('promocodesHistory');
        
        this.navToggleBtn = document.getElementById('navToggleBtn');
        this.navLinks = document.querySelector('.nav-links');
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    // ===== ОБРАБОТЧИКИ =====
    setupEventListeners() {
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                this.switchTab(tabId);
            });
        });
        
        if (this.clickButton) {
            this.clickButton.addEventListener('click', (e) => this.handleClick(e));
        }
        
        this.buyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = btn.dataset.item;
                const price = parseInt(btn.dataset.price);
                this.buyItem(item, price);
            });
        });
        
        this.upgradeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const upgradeItem = e.target.closest('.upgrade-item');
                if (upgradeItem) {
                    const upgradeType = upgradeItem.dataset.upgrade;
                    this.buyUpgrade(upgradeType);
                }
            });
        });
        
        this.leaderboardBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.leaderboardBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateLeaderboard(btn.dataset.leaderboard);
            });
        });
        
        if (this.buyPremiumBtn) {
            this.buyPremiumBtn.addEventListener('click', () => this.buyPremiumPass());
        }
        
        if (this.activatePromocodeBtn) {
            this.activatePromocodeBtn.addEventListener('click', () => this.activatePromocode());
        }
        if (this.promocodeInput) {
            this.promocodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.activatePromocode();
                }
            });
        }
        
        if (this.navToggleBtn) {
            this.navToggleBtn.addEventListener('click', () => {
                this.navLinks.classList.toggle('hidden');
                const icon = this.navToggleBtn.querySelector('.toggle-icon');
                if (this.navLinks.classList.contains('hidden')) {
                    icon.textContent = '▶';
                } else {
                    icon.textContent = '◀';
                }
            });
        }
    }

    // ===== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК =====
    switchTab(tabId) {
        this.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.id === tabId);
        });
        
        if (tabId === 'inventory') {
            this.updateInventory();
        }
        if (tabId === 'upgrades') {
            this.updateUpgradePrices();
        }
        if (tabId === 'profile') {
            this.updateProfile();
        }
        if (tabId === 'settings' && this.settings) {
            this.settings.updateUI();
        }
        if (tabId === 'promocodes') {
            this.updatePromocodesList();
            this.updatePromocodesHistory();
        }
        if (tabId === 'leaderboard') {
            const activeTab = document.querySelector('.leaderboard-tabs .active');
            const type = activeTab ? activeTab.dataset.leaderboard : 'clicks';
            this.updateLeaderboard(type);
        }
        // 👇 Обработка для колеса
        if (tabId === 'wheel') {
            // Создаем колесо при первом открытии
            if (!this.wheel) {
                this.wheel = new WheelOfFortune(this);
            }
        }
    }

    // ===== КЛИК =====
    handleClick(e) {
        let clickPower = this.userData.clickPower;
        
        // Проверяем, есть ли особенный скин с множителем 250
        if (this.userData.currentSkin === 'wheel_dragon_skin') {
            clickPower *= 250;
        }
        
        const critRoll = Math.random() * 100;
        
        if (critRoll < this.userData.critChance) {
            clickPower *= 2;
            this.createClickEffect(e.clientX, e.clientY, `КРИТ! x${clickPower}`);
        } else {
            this.createClickEffect(e.clientX, e.clientY, `+${clickPower}`);
        }
        
        this.userData.clicks++;
        this.userData.money += clickPower;
        this.userData.dilicks++;
        
        this.addSeasonExp(clickPower);
        
        this.updateUI();
        this.saveGame();
        this.checkAchievements();
    }

    createClickEffect(x, y, text) {
        if (!this.clickEffects) return;
        
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.textContent = text;
        
        const rect = this.clickEffects.getBoundingClientRect();
        effect.style.left = (x - rect.left) + 'px';
        effect.style.top = (y - rect.top) + 'px';
        
        this.clickEffects.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) effect.remove();
        }, 600);
    }

    // ===== ПОКУПКА СКИНА =====
    async buyItem(item, price) {
        // Особенный скин нельзя купить
        if (item === 'wheel_dragon_skin') {
            alert('❌ Этот скин можно получить только в колесе фортуны!');
            return;
        }
        
        if (item === 'dragon_skin') {
            if (this.userData.dilicks >= price) {
                this.userData.dilicks -= price;
            } else {
                alert(`❌ Недостаточно диликов! Есть: ${this.userData.dilicks}, нужно: ${price}`);
                return;
            }
        } else {
            if (this.userData.money >= price) {
                this.userData.money -= price;
            } else {
                alert(`❌ Недостаточно денег! Есть: ${this.userData.money}, нужно: ${price}`);
                return;
            }
        }
        
        if (!this.userData.inventory.includes(item)) {
            this.userData.inventory.push(item);
        }
        
        this.userData.currentSkin = item;
        if (this.clickIcon) {
            this.clickIcon.src = this.skinsData[item].image;
        }
        
        this.updateUI();
        await this.saveGame();
        this.updateInventory();
        this.updateShopStatus();
        this.checkAchievements();
        
        alert(`✅ Куплен скин: ${this.skinsData[item].name}`);
    }

    // ===== ПОКУПКА УЛУЧШЕНИЯ =====
    async buyUpgrade(upgradeType) {
        let currentLevel;
        let price;
        
        switch(upgradeType) {
            case 'clickPower':
                currentLevel = this.userData.clickPower;
                price = 50 + (currentLevel - 1) * 25;
                if (this.userData.dilicks >= price) {
                    this.userData.dilicks -= price;
                    this.userData.clickPower++;
                    this.updateUpgradePrices();
                    this.updateUI();
                    await this.saveGame();
                    this.checkAchievements();
                    alert(`✅ Усилитель клика улучшен до ${this.userData.clickPower} уровня!`);
                } else {
                    alert(`❌ Недостаточно диликов! Нужно: ${price}`);
                }
                break;
                
            case 'autoClicker':
                currentLevel = this.userData.autoClickerLevel;
                price = 100 + currentLevel * 100;
                if (this.userData.dilicks >= price) {
                    this.userData.dilicks -= price;
                    this.userData.autoClickerLevel++;
                    this.restartAutoClicker();
                    this.updateUpgradePrices();
                    this.updateUI();
                    await this.saveGame();
                    this.checkAchievements();
                    alert(`✅ Автокликер улучшен до ${this.userData.autoClickerLevel} уровня!`);
                } else {
                    alert(`❌ Недостаточно диликов! Нужно: ${price}`);
                }
                break;
                
            case 'critChance':
                currentLevel = this.userData.critChance;
                price = 200 + ((currentLevel - 5) / 5) * 50;
                if (this.userData.dilicks >= price) {
                    this.userData.dilicks -= price;
                    this.userData.critChance += 5;
                    this.updateUpgradePrices();
                    this.updateUI();
                    await this.saveGame();
                    this.checkAchievements();
                    alert(`✅ Шанс крита увеличен до ${this.userData.critChance}%!`);
                } else {
                    alert(`❌ Недостаточно диликов! Нужно: ${price}`);
                }
                break;
        }
    }

    // ===== ОБНОВЛЕНИЕ ЦЕН УЛУЧШЕНИЙ =====
    updateUpgradePrices() {
        document.querySelectorAll('.upgrade-item').forEach(item => {
            const upgradeType = item.dataset.upgrade;
            const priceElement = item.querySelector('.price-value');
            const levelElement = item.querySelector('.upgrade-level');
            
            if (!priceElement || !levelElement) return;
            
            let currentLevel;
            let newPrice;
            
            switch(upgradeType) {
                case 'clickPower':
                    currentLevel = this.userData.clickPower;
                    levelElement.textContent = currentLevel;
                    newPrice = 50 + (currentLevel - 1) * 25;
                    priceElement.textContent = newPrice;
                    break;
                    
                case 'autoClicker':
                    currentLevel = this.userData.autoClickerLevel;
                    levelElement.textContent = currentLevel;
                    newPrice = 100 + currentLevel * 100;
                    priceElement.textContent = newPrice;
                    break;
                    
                case 'critChance':
                    currentLevel = this.userData.critChance;
                    levelElement.textContent = currentLevel + '%';
                    newPrice = 200 + ((currentLevel - 5) / 5) * 50;
                    priceElement.textContent = newPrice;
                    break;
            }
        });
    }

    // ===== ОБНОВЛЕНИЕ СТАТУСА МАГАЗИНА =====
    updateShopStatus() {
        document.querySelectorAll('.shop-item').forEach(item => {
            const skinId = item.dataset.skin;
            const statusEl = document.getElementById(`status-${skinId}`);
            const buyBtn = item.querySelector('.buy-btn');
            
            if (this.userData.inventory && this.userData.inventory.includes(skinId)) {
                if (statusEl) statusEl.textContent = 'В инвентаре';
                if (buyBtn) {
                    buyBtn.textContent = 'Куплено';
                    buyBtn.classList.add('disabled');
                    buyBtn.disabled = true;
                }
            } else {
                if (statusEl) statusEl.textContent = 'Не куплено';
                if (buyBtn) {
                    buyBtn.textContent = 'Купить';
                    buyBtn.classList.remove('disabled');
                    buyBtn.disabled = false;
                }
            }
        });
    }

    // ===== ОБНОВЛЕНИЕ ИНВЕНТАРЯ =====
    updateInventory() {
        if (!this.inventoryGrid) return;
        
        this.inventoryGrid.innerHTML = '';
        
        const inventory = this.userData.inventory || ['classic'];
        if (!inventory.includes('classic')) inventory.unshift('classic');
        
        inventory.forEach((skinId) => {
            const skin = this.skinsData[skinId];
            if (!skin) return;
            
            const skinCard = document.createElement('div');
            skinCard.className = `glass-card inventory-item ${this.userData.currentSkin === skinId ? 'active' : ''}`;
            skinCard.dataset.skin = skinId;
            
            const isCurrentSkin = this.userData.currentSkin === skinId;
            
            let buttonHtml = '';
            if (isCurrentSkin) {
                buttonHtml = '<p class="skin-equipped">✅ ЭКИПИРОВАНО</p>';
            } else {
                buttonHtml = '<button class="glass-btn equip-btn">ЭКИПИРОВАТЬ</button>';
            }
            
            skinCard.innerHTML = `
                <div class="skin-preview">
                    <img src="${skin.image}" alt="${skin.name}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/4366/4366891.png'">
                </div>
                <h3>${skin.name}</h3>
                <p class="skin-description">${skin.description}</p>
                ${buttonHtml}
            `;
            
            const equipBtn = skinCard.querySelector('.equip-btn');
            if (equipBtn) {
                equipBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.equipSkin(skinId);
                });
            }
            
            this.inventoryGrid.appendChild(skinCard);
        });
    }

    // ===== ЭКИПИРОВКА СКИНА =====
    async equipSkin(skinId) {
        this.userData.currentSkin = skinId;
        if (this.clickIcon) {
            this.clickIcon.src = this.skinsData[skinId].image;
        }
        await this.saveGame();
        this.updateInventory();
        
        this.createClickEffect(
            window.innerWidth / 2, 
            window.innerHeight / 2, 
            `✨ ${this.skinsData[skinId].name} ✨`
        );
        
        if (this.clickIcon) {
            this.clickIcon.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (this.clickIcon) {
                    this.clickIcon.style.transform = 'scale(1)';
                }
            }, 200);
        }
    }

    // ===== АВТОКЛИКЕР =====
    startAutoClicker() {
        if (this.autoClickerInterval) {
            clearInterval(this.autoClickerInterval);
        }
        
        this.autoClickerInterval = setInterval(() => {
            if (this.userData.autoClickerLevel > 0) {
                for (let i = 0; i < this.userData.autoClickerLevel; i++) {
                    let clickPower = this.userData.clickPower;
                    
                    // Проверяем, есть ли особенный скин с множителем 250
                    if (this.userData.currentSkin === 'wheel_dragon_skin') {
                        clickPower *= 250;
                    }
                    
                    this.userData.clicks++;
                    this.userData.money += clickPower;
                    this.userData.dilicks++;
                    this.addSeasonExp(clickPower);
                }
                this.updateUI();
                this.saveGame();
                this.checkAchievements();
            }
        }, 1000);
    }

    restartAutoClicker() {
        this.startAutoClicker();
    }

    // ===== ТРЕКЕР ВРЕМЕНИ =====
    startPlaytimeTracker() {
        this.playtimeInterval = setInterval(() => {
            this.userData.playtime++;
            this.updatePlaytimeDisplay();
            this.saveGame();
        }, 1000);
    }

    updatePlaytimeDisplay() {
        if (!this.playtimeSpan) return;
        
        const hours = Math.floor(this.userData.playtime / 3600);
        const minutes = Math.floor((this.userData.playtime % 3600) / 60);
        const seconds = this.userData.playtime % 60;
        
        this.playtimeSpan.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // ===== СЕЗОННЫЙ ОПЫТ =====
    addSeasonExp(amount) {
        this.userData.seasonExp += amount;
        const expNeeded = 100 + (this.userData.seasonLevel * 50);
        
        while (this.userData.seasonExp >= expNeeded && this.userData.seasonLevel < 50) {
            this.userData.seasonExp -= expNeeded;
            this.userData.seasonLevel++;
            this.userData.money += 100;
            this.userData.dilicks += 10;
        }
        
        if (this.seasonProgress && this.seasonLevel) {
            const progress = (this.userData.seasonExp / expNeeded) * 100;
            this.seasonProgress.style.width = progress + '%';
            this.seasonLevel.textContent = this.userData.seasonLevel;
        }
    }

    // ===== ПРЕМИУМ ПРОПУСК =====
    async buyPremiumPass() {
        if (this.userData.dilicks >= 500) {
            this.userData.dilicks -= 500;
            this.userData.premiumPass = true;
            this.updateUI();
            await this.saveGame();
            alert('✅ Премиум пропуск активирован!');
        } else {
            alert(`❌ Недостаточно диликов! Нужно: 500`);
        }
    }

    // ===== ЛИДЕРБОРД =====
    async updateLeaderboard(type) {
        if (!this.leaderboardBody) return;
        
        this.leaderboardBody.innerHTML = '<tr><td colspan="3" class="empty-history">Загрузка...</td></tr>';
        
        try {
            const snapshot = await firebase.database().ref('users').once('value');
            
            if (!snapshot.exists()) {
                this.leaderboardBody.innerHTML = '<tr><td colspan="3" class="empty-history">Нет данных</td></tr>';
                return;
            }
            
            const users = snapshot.val();
            const leaderboard = [];
            
            for (let [id, userData] of Object.entries(users)) {
                let value = 0;
                switch(type) {
                    case 'clicks':
                        value = userData.clicks || 0;
                        break;
                    case 'money':
                        value = userData.money || 0;
                        break;
                    case 'playtime':
                        value = userData.playtime || 0;
                        break;
                }
                
                const displayName = userData.settings?.displayName || userData.username;
                leaderboard.push({ username: displayName, value, realUsername: userData.username });
            }
            
            leaderboard.sort((a, b) => b.value - a.value);
            
            const topPlayers = leaderboard.slice(0, 50);
            
            this.leaderboardBody.innerHTML = '';
            
            if (topPlayers.length === 0) {
                this.leaderboardBody.innerHTML = '<tr><td colspan="3" class="empty-history">Нет данных</td></tr>';
                return;
            }
            
            topPlayers.forEach((entry, index) => {
                const row = document.createElement('tr');
                let medal = '';
                if (index === 0) medal = '🥇';
                else if (index === 1) medal = '🥈';
                else if (index === 2) medal = '🥉';
                
                row.innerHTML = `
                    <td>${medal ? medal : index + 1}</td>
                    <td>${entry.username} ${entry.realUsername === localStorage.getItem('currentUser') ? '👑' : ''}</td>
                    <td>${this.formatLeaderboardValue(entry.value, type)}</td>
                `;
                
                if (entry.realUsername === localStorage.getItem('currentUser')) {
                    row.style.background = 'rgba(255, 215, 0, 0.1)';
                    row.style.border = '1px solid gold';
                }
                
                this.leaderboardBody.appendChild(row);
            });
            
        } catch (error) {
            console.error('Ошибка загрузки лидерборда:', error);
            this.leaderboardBody.innerHTML = '<tr><td colspan="3" class="empty-history">Ошибка загрузки</td></tr>';
        }
    }

    formatLeaderboardValue(value, type) {
        switch(type) {
            case 'playtime':
                const hours = Math.floor(value / 3600);
                const minutes = Math.floor((value % 3600) / 60);
                return `${hours}ч ${minutes}м`;
            default:
                return value.toLocaleString();
        }
    }

    // ===== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА =====
    async updateUI() {
        const displayName = this.userData.settings?.displayName || this.userData.username;
        if (this.usernameDisplay) {
            this.usernameDisplay.textContent = displayName;
        }
        if (this.moneySpan) {
            this.moneySpan.textContent = this.userData.money.toLocaleString();
        }
        if (this.dilicksSpan) {
            this.dilicksSpan.textContent = this.userData.dilicks.toLocaleString();
        }
        if (this.clicksSpan) {
            this.clicksSpan.textContent = this.userData.clicks.toLocaleString();
        }
        if (this.clickPowerSpan) {
            this.clickPowerSpan.textContent = this.userData.clickPower;
        }
        this.updatePlaytimeDisplay();
        
        if (this.seasonProgress && this.seasonLevel) {
            const expNeeded = 100 + (this.userData.seasonLevel * 50);
            const progress = (this.userData.seasonExp / expNeeded) * 100;
            this.seasonProgress.style.width = progress + '%';
            this.seasonLevel.textContent = this.userData.seasonLevel;
        }
        
        if (document.getElementById('profile')?.classList.contains('active')) {
            this.updateProfile();
        }
        
        // Обновляем баланс в колесе, если оно открыто
        if (this.wheel && this.wheel.balanceSpan) {
            this.wheel.balanceSpan.textContent = this.userData.dilicks.toLocaleString();
        }
    }

    // ===== СОХРАНЕНИЕ =====
    async saveGame() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                await firebase.database().ref('users/' + userId).update(this.userData);
            } catch (error) {
                console.error('❌ Ошибка сохранения:', error);
            }
        }
    }

    // ===== ВЫХОД =====
    async logout() {
        if (this.bubbleFrame) {
            cancelAnimationFrame(this.bubbleFrame);
        }
        if (this.autoClickerInterval) {
            clearInterval(this.autoClickerInterval);
        }
        if (this.playtimeInterval) {
            clearInterval(this.playtimeInterval);
        }
        
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userId');
        
        window.location.href = 'register.html';
    }

    // ===== ПУЗЫРЬКИ =====
    createBubble() {
        const existingBubbles = document.querySelectorAll('.bubble').length;
        if (existingBubbles > 10) return;
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const isMobile = window.innerWidth <= 768;
        const size = isMobile ? Math.random() * 30 + 10 : Math.random() * 50 + 20;
        
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.bottom = '-50px';
        
        const duration = isMobile ? 3 + Math.random() * 2 : 4 + Math.random() * 3;
        bubble.style.animationDuration = duration + 's';
        
        document.body.appendChild(bubble);
        
        setTimeout(() => {
            if (bubble.parentNode) bubble.remove();
        }, duration * 1000);
    }

    startBubbles() {
        const bubbleInterval = 2500;
        
        const createBubbleOptimized = (currentTime) => {
            if (currentTime - this.lastBubbleTime >= bubbleInterval) {
                this.createBubble();
                this.lastBubbleTime = currentTime;
            }
            this.bubbleFrame = requestAnimationFrame(createBubbleOptimized);
        };
        
        this.bubbleFrame = requestAnimationFrame(createBubbleOptimized);
    }

    // ===== ДОСТИЖЕНИЯ (С ИСПРАВЛЕННЫМ ПРОГРЕССОМ) =====
    checkAchievements() {
        if (!this.userData.completedAchievements) {
            this.userData.completedAchievements = [];
        }
        
        let newAchievementUnlocked = false;
        
        this.achievementsData.forEach(achievement => {
            const isCompleted = this.userData.completedAchievements.includes(achievement.id);
            const canComplete = achievement.condition(this.userData);
            
            if (canComplete && !isCompleted) {
                this.userData.completedAchievements.push(achievement.id);
                this.userData.money += achievement.reward.money;
                this.userData.dilicks += achievement.reward.dilicks;
                newAchievementUnlocked = true;
                
                // Специальная иконка для достижения "Коллекционер" при получении
                if (achievement.id === 'skinCollector') {
                    // Показываем уведомление с иконкой нового скина
                    this.showAchievementNotification({
                        ...achievement,
                        icon: this.skinsData['wheel_dragon_skin'].image
                    });
                } else {
                    this.showAchievementNotification(achievement);
                }
            }
        });
        
        if (newAchievementUnlocked) {
            this.saveGame();
            this.updateUI();
            if (document.getElementById('profile')?.classList.contains('active')) {
                this.updateProfile();
            }
        }
    }

    updateProfile() {
        if (!this.profileUsername) return;
        
        const displayName = this.userData.settings?.displayName || this.userData.username;
        this.profileUsername.textContent = displayName;
        this.profileLevel.textContent = this.userData.seasonLevel;
        this.profileClicks.textContent = this.userData.clicks.toLocaleString();
        this.profileMoney.textContent = this.userData.money.toLocaleString();
        this.profileDilicks.textContent = this.userData.dilicks.toLocaleString();
        
        const hours = Math.floor(this.userData.playtime / 3600);
        const minutes = Math.floor((this.userData.playtime % 3600) / 60);
        this.profilePlaytime.textContent = `${hours}ч ${minutes}м`;
        
        if (this.profileAvatar && this.userData.currentSkin) {
            this.profileAvatar.src = this.skinsData[this.userData.currentSkin].image;
        }
        
        this.renderAchievements();
        this.updateSkinStats();
    }

    renderAchievements() {
        if (!this.achievementsGrid) return;
        
        this.achievementsGrid.innerHTML = '';
        
        this.achievementsData.forEach(achievement => {
            const isCompleted = this.userData.completedAchievements?.includes(achievement.id);
            const progress = this.calculateAchievementProgress(achievement);
            
            const card = document.createElement('div');
            card.className = `achievement-card ${isCompleted ? 'completed' : ''}`;
            
            card.innerHTML = `
                <div class="achievement-icon ${!isCompleted ? 'locked' : ''}">
                    <img src="${achievement.icon}" alt="${achievement.name}">
                </div>
                <h3 class="achievement-title">${achievement.name}</h3>
                <p class="achievement-desc">${achievement.description}</p>
                <div class="achievement-progress">
                    <div class="achievement-progress-bar">
                        <div class="achievement-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="achievement-progress-text">
                        ${isCompleted ? 'Выполнено' : `${Math.round(progress)}%`}
                    </div>
                </div>
            `;
            
            this.achievementsGrid.appendChild(card);
        });
    }

    // ===== РАСЧЕТ ПРОГРЕССА ДОСТИЖЕНИЯ (С ФИКСАЦИЕЙ ВЫПОЛНЕННЫХ) =====
    calculateAchievementProgress(achievement) {
        // Если достижение уже выполнено - возвращаем 100%
        if (this.userData.completedAchievements?.includes(achievement.id)) {
            return 100;
        }
        
        switch(achievement.id) {
            case 'firstClick':
                return Math.min(100, (this.userData.clicks / 1) * 100);
            case 'clicker100':
                return Math.min(100, (this.userData.clicks / 100) * 100);
            case 'clicker1000':
                return Math.min(100, (this.userData.clicks / 1000) * 100);
            case 'richMan':
                return Math.min(100, (this.userData.money / 10000) * 100);
            case 'dilicMaster':
                return Math.min(100, (this.userData.dilicks / 5000) * 100);
            case 'skinCollector':
                const totalSkins = Object.keys(this.skinsData).length;
                const owned = this.userData.inventory?.length || 0;
                return Math.min(100, (owned / totalSkins) * 100);
            case 'critMaster':
                return Math.min(100, (this.userData.critChance / 50) * 100);
            case 'autoClickerMaster':
                return Math.min(100, (this.userData.autoClickerLevel / 10) * 100);
            case 'wheelMaster':
                return this.userData.inventory?.includes('wheel_dragon_skin') ? 100 : 0;
            default:
                return 0;
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        
        // Заменяем эмодзи на иконки валют
        let rewardText = '';
        if (achievement.reward.money > 0) {
            rewardText += `+${achievement.reward.money} <img src="https://avatars.mds.yandex.net/i?id=d2747e92b4fb93d8cee0b3582cb46ea6_l-5332707-images-thumbs&n=13" style="width: 20px; height: 20px; border-radius: 50%; vertical-align: middle;"> `;
        }
        if (achievement.reward.dilicks > 0) {
            rewardText += `+${achievement.reward.dilicks} <img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" style="width: 20px; height: 20px; border-radius: 50%; vertical-align: middle;">`;
        }
        
        notification.innerHTML = `
            <div class="notification-icon">
                <img src="${achievement.icon}" alt="${achievement.name}">
            </div>
            <div class="notification-content">
                <h4>Достижение получено!</h4>
                <p>${achievement.name}</p>
                <p class="notification-reward">
                    ${rewardText}
                </p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    updateSkinStats() {
        if (!this.ownedSkinsList) return;
        
        const totalSkins = Object.keys(this.skinsData).length;
        const ownedSkins = this.userData.inventory?.length || 0;
        
        if (this.skinProgressFill) {
            const progress = (ownedSkins / totalSkins) * 100;
            this.skinProgressFill.style.width = progress + '%';
            // Добавляем золотое свечение и делаем линию желтой
            this.skinProgressFill.style.background = 'linear-gradient(90deg, #ffd700, #ffaa00, #ffd700)';
            this.skinProgressFill.style.boxShadow = '0 0 15px gold, 0 0 30px rgba(255, 215, 0, 0.3)';
        }
        
        if (this.ownedSkins) {
            this.ownedSkins.textContent = ownedSkins;
            // Делаем цифры желтыми
            this.ownedSkins.style.color = 'gold';
            this.ownedSkins.style.textShadow = '0 0 10px gold';
        }
        if (this.totalSkins) {
            this.totalSkins.textContent = totalSkins;
            // Делаем цифры желтыми
            this.totalSkins.style.color = 'gold';
            this.totalSkins.style.textShadow = '0 0 10px gold';
        }
        
        this.ownedSkinsList.innerHTML = '';
        
        Object.entries(this.skinsData).forEach(([skinId, skin]) => {
            if (this.userData.inventory?.includes(skinId)) {
                const skinTag = document.createElement('div');
                skinTag.className = `skin-tag ${this.userData.currentSkin === skinId ? 'active' : ''}`;
                skinTag.innerHTML = `
                    <img src="${skin.image}" alt="${skin.name}">
                    <span>${skin.name}</span>
                `;
                this.ownedSkinsList.appendChild(skinTag);
            }
        });
    }

    // ===== ПРОМОКОДЫ =====
    activatePromocode() {
        if (!this.promocodeInput) return;
        
        const code = this.promocodeInput.value.trim().toUpperCase();
        
        if (!code) {
            this.showPromocodeMessage('Введите промокод', 'error');
            return;
        }
        
        const promocode = this.promocodesData[code];
        
        if (!promocode) {
            this.showPromocodeMessage('Промокод не найден', 'error');
            return;
        }
        
        if (promocode.expiryDate && Date.now() > promocode.expiryDate) {
            this.showPromocodeMessage('Срок действия промокода истек', 'error');
            return;
        }
        
        if (this.userData.activatedPromocodes && this.userData.activatedPromocodes.includes(code)) {
            this.showPromocodeMessage('Вы уже активировали этот промокод', 'error');
            return;
        }
        
        let rewardMessage = '';
        
        if (promocode.reward.money > 0) {
            this.userData.money += promocode.reward.money;
            rewardMessage += `+${promocode.reward.money} <img src="https://avatars.mds.yandex.net/i?id=d2747e92b4fb93d8cee0b3582cb46ea6_l-5332707-images-thumbs&n=13" style="width: 18px; height: 18px; border-radius: 50%;"> `;
        }
        
        if (promocode.reward.dilicks > 0) {
            this.userData.dilicks += promocode.reward.dilicks;
            rewardMessage += `+${promocode.reward.dilicks} <img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" style="width: 18px; height: 18px; border-radius: 50%;"> `;
        }
        
        if (promocode.reward.skin) {
            const skinId = promocode.reward.skin;
            if (this.skinsData[skinId] && !this.userData.inventory.includes(skinId)) {
                this.userData.inventory.push(skinId);
                rewardMessage += `+скин "${this.skinsData[skinId].name}" ✨`;
                
                if (!this.userData.currentSkin) {
                    this.userData.currentSkin = skinId;
                    if (this.clickIcon) {
                        this.clickIcon.src = this.skinsData[skinId].image;
                    }
                }
            } else {
                this.userData.dilicks += 100;
                rewardMessage += `+100 <img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" style="width: 18px; height: 18px; border-radius: 50%;"> (скин уже был)`;
            }
        }
        
        if (!this.userData.activatedPromocodes) {
            this.userData.activatedPromocodes = [];
        }
        this.userData.activatedPromocodes.push(code);
        
        if (!this.userData.promocodesHistory) {
            this.userData.promocodesHistory = [];
        }
        
        const now = new Date();
        const dateStr = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
        
        this.userData.promocodesHistory.push({
            code: code,
            reward: promocode.reward,
            date: dateStr,
            timestamp: Date.now()
        });
        
        this.saveGame();
        this.updateUI();
        this.updateInventory();
        this.updatePromocodesList();
        this.updatePromocodesHistory();
        
        this.showPromocodeMessage(`Промокод активирован! ${rewardMessage}`, 'success');
        this.promocodeInput.value = '';
        
        this.checkAchievements();
    }

    showPromocodeMessage(text, type) {
        if (!this.promocodeMessage) return;
        
        this.promocodeMessage.innerHTML = text;
        this.promocodeMessage.className = 'promocode-message ' + type;
        
        setTimeout(() => {
            if (this.promocodeMessage) {
                this.promocodeMessage.innerHTML = '';
                this.promocodeMessage.className = 'promocode-message';
            }
        }, 3000);
    }

    updatePromocodesList() {
        if (!this.promocodesList) return;
        
        this.promocodesList.innerHTML = '';
        
        Object.values(this.promocodesData).forEach(promocode => {
            const isActivated = this.userData.activatedPromocodes?.includes(promocode.code);
            const isExpired = promocode.expiryDate && Date.now() > promocode.expiryDate;
            
            if (isActivated || isExpired) return;
            
            const item = document.createElement('div');
            item.className = 'promocode-item';
            item.setAttribute('data-code', promocode.code);
            
            const rewardParts = [];
            if (promocode.reward.money > 0) {
                rewardParts.push(`<img src="https://avatars.mds.yandex.net/i?id=d2747e92b4fb93d8cee0b3582cb46ea6_l-5332707-images-thumbs&n=13" class="price-icon"> +${promocode.reward.money}`);
            }
            if (promocode.reward.dilicks > 0) {
                rewardParts.push(`<img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" class="price-icon"> +${promocode.reward.dilicks}`);
            }
            if (promocode.reward.skin) {
                rewardParts.push(`✨ +скин`);
            }
            
            item.innerHTML = `
                <div class="promocode-code">${promocode.code}</div>
                <div class="promocode-reward">
                    ${rewardParts.join(' ')}
                </div>
            `;
            
            item.addEventListener('click', () => {
                if (this.promocodeInput) {
                    this.promocodeInput.value = promocode.code;
                    this.promocodeInput.focus();
                }
            });
            
            this.promocodesList.appendChild(item);
        });
        
        if (this.promocodesList.children.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-history';
            emptyMessage.textContent = 'Нет доступных промокодов';
            this.promocodesList.appendChild(emptyMessage);
        }
    }

    updatePromocodesHistory() {
        if (!this.promocodesHistory) return;
        
        this.promocodesHistory.innerHTML = '';
        
        const history = this.userData.promocodesHistory || [];
        
        if (history.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-history';
            emptyMessage.textContent = 'История активаций пуста';
            this.promocodesHistory.appendChild(emptyMessage);
            return;
        }
        
        const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);
        
        sortedHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const rewardParts = [];
            if (item.reward.money > 0) {
                rewardParts.push(`<img src="https://avatars.mds.yandex.net/i?id=d2747e92b4fb93d8cee0b3582cb46ea6_l-5332707-images-thumbs&n=13" class="price-icon"> +${item.reward.money}`);
            }
            if (item.reward.dilicks > 0) {
                rewardParts.push(`<img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" class="price-icon"> +${item.reward.dilicks}`);
            }
            if (item.reward.skin) {
                rewardParts.push(`✨ +скин`);
            }
            
            historyItem.innerHTML = `
                <div class="history-code">${item.code}</div>
                <div class="history-reward">${rewardParts.join(' ')}</div>
                <div class="history-date">${item.date}</div>
            `;
            
            this.promocodesHistory.appendChild(historyItem);
        });
    }
}

// ========== КЛАСС НАСТРОЕК ==========
class Settings {
    constructor(game) {
        this.game = game;
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.updateUI();
    }

    loadSettings() {
        if (!this.game.userData.settings) {
            this.game.userData.settings = {
                displayName: this.game.userData.username,
                theme: 'dark',
                notifications: true,
                sound: true,
                animations: true,
                language: 'ru'
            };
        }
    }

    setupEventListeners() {
        // Сохранение никнейма
        const saveDisplayName = document.getElementById('saveDisplayName');
        if (saveDisplayName) {
            saveDisplayName.addEventListener('click', () => this.saveDisplayName());
        }

        // Смена пароля
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => this.changePassword());
        }

        // Тема
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => this.saveTheme(e.target.value));
        }

        // Уведомления
        const notificationsEnabled = document.getElementById('notificationsEnabled');
        if (notificationsEnabled) {
            notificationsEnabled.addEventListener('change', (e) => {
                this.game.userData.settings.notifications = e.target.checked;
                this.game.saveGame();
                this.showToast('✅ Настройки уведомлений сохранены', 'success');
            });
        }

        // Звук
        const soundEnabled = document.getElementById('soundEnabled');
        if (soundEnabled) {
            soundEnabled.addEventListener('change', (e) => {
                this.game.userData.settings.sound = e.target.checked;
                this.game.saveGame();
                this.showToast('✅ Настройки звука сохранены', 'success');
            });
        }

        // Анимации
        const animationsEnabled = document.getElementById('animationsEnabled');
        if (animationsEnabled) {
            animationsEnabled.addEventListener('change', (e) => {
                this.game.userData.settings.animations = e.target.checked;
                this.game.saveGame();
                this.showToast('✅ Настройки анимаций сохранены', 'success');
            });
        }

        // Язык
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => this.saveLanguage(e.target.value));
        }

        // Экспорт данных
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportData());
        }

        // Импорт данных
        const importDataBtn = document.getElementById('importDataBtn');
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => this.importData());
        }

        // Сброс прогресса
        const resetProgressBtn = document.getElementById('resetProgressBtn');
        if (resetProgressBtn) {
            resetProgressBtn.addEventListener('click', () => this.confirmResetProgress());
        }

        // Удаление аккаунта
        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => this.confirmDeleteAccount());
        }

        // Проверка обновлений
        const checkUpdatesBtn = document.getElementById('checkUpdatesBtn');
        if (checkUpdatesBtn) {
            checkUpdatesBtn.addEventListener('click', () => this.checkUpdates());
        }
    }

    updateUI() {
        const displayNameInput = document.getElementById('displayName');
        if (displayNameInput) {
            displayNameInput.value = this.game.userData.settings.displayName || this.game.userData.username;
        }

        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.value = this.game.userData.username;
        }

        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.game.userData.settings.theme || 'dark';
        }

        const notificationsEnabled = document.getElementById('notificationsEnabled');
        if (notificationsEnabled) {
            notificationsEnabled.checked = this.game.userData.settings.notifications !== false;
        }

        const soundEnabled = document.getElementById('soundEnabled');
        if (soundEnabled) {
            soundEnabled.checked = this.game.userData.settings.sound !== false;
        }

        const animationsEnabled = document.getElementById('animationsEnabled');
        if (animationsEnabled) {
            animationsEnabled.checked = this.game.userData.settings.animations !== false;
        }

        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.game.userData.settings.language || 'ru';
        }
    }

    async saveDisplayName() {
        const input = document.getElementById('displayName');
        const newName = input.value.trim();
        
        if (!newName) {
            this.showToast('❌ Введите никнейм', 'error');
            return;
        }

        if (newName.length > 20) {
            this.showToast('❌ Никнейм не должен превышать 20 символов', 'error');
            return;
        }

        this.game.userData.settings.displayName = newName;
        await this.game.saveGame();
        
        // Обновляем отображение в профиле и шапке
        const profileUsername = document.getElementById('profileUsername');
        if (profileUsername) {
            profileUsername.textContent = newName;
        }
        
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = newName;
        }
        
        this.showToast(`✅ Никнейм изменен на "${newName}"`, 'success');
    }

    async changePassword() {
        const oldPass = document.getElementById('oldPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;

        if (!oldPass || !newPass || !confirmPass) {
            this.showToast('❌ Заполните все поля', 'error');
            return;
        }

        if (newPass !== confirmPass) {
            this.showToast('❌ Новые пароли не совпадают', 'error');
            return;
        }

        if (newPass.length < 4) {
            this.showToast('❌ Пароль должен быть не менее 4 символов', 'error');
            return;
        }

        if (oldPass !== this.game.userData.password) {
            this.showToast('❌ Неверный старый пароль', 'error');
            return;
        }

        this.game.userData.password = newPass;
        await this.game.saveGame();
        
        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        this.showToast('✅ Пароль успешно изменен', 'success');
    }

    saveTheme(theme) {
        this.game.userData.settings.theme = theme;
        this.game.saveGame();
        
        const themeNames = {
            'dark': 'Тёмная',
            'light': 'Светлая',
            'auto': 'Как в системе'
        };
        
        this.showToast(`✅ Тема изменена на ${themeNames[theme] || theme}`, 'success');
        
        // Применяем тему
        if (theme === 'light') {
            document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        } else if (theme === 'dark') {
            document.body.style.background = 'linear-gradient(135deg, #0a0c15 0%, #121520 50%, #0a0c15 100%)';
        } else {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.style.background = 'linear-gradient(135deg, #0a0c15 0%, #121520 50%, #0a0c15 100%)';
            } else {
                document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
            }
        }
    }

    async saveLanguage(lang) {
        this.game.userData.settings.language = lang;
        await this.game.saveGame();
        
        const langNames = {
            'ru': 'Русский',
            'en': 'English',
            'tr': 'Türkçe',
            'es': 'Español'
        };
        
        this.showToast(`✅ Язык изменен на ${langNames[lang] || lang}`, 'success');
    }

    // ===== ЭКСПОРТ ДАННЫХ =====
    exportData() {
        try {
            const exportData = {
                username: this.game.userData.username,
                displayName: this.game.userData.settings?.displayName || this.game.userData.username,
                clicks: this.game.userData.clicks,
                money: this.game.userData.money,
                dilicks: this.game.userData.dilicks,
                clickPower: this.game.userData.clickPower,
                autoClickerLevel: this.game.userData.autoClickerLevel,
                critChance: this.game.userData.critChance,
                inventory: this.game.userData.inventory,
                currentSkin: this.game.userData.currentSkin,
                seasonLevel: this.game.userData.seasonLevel,
                seasonExp: this.game.userData.seasonExp,
                playtime: this.game.userData.playtime,
                completedAchievements: this.game.userData.completedAchievements,
                compensationReceived: this.game.userData.compensationReceived,
                settings: this.game.userData.settings,
                exportDate: new Date().toLocaleString()
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            
            const date = new Date();
            const fileName = `dilic_clicker_${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}.json`;
            
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showToast('✅ Данные успешно экспортированы', 'success');
        } catch (error) {
            console.error('Ошибка экспорта:', error);
            this.showToast('❌ Ошибка при экспорте данных', 'error');
        }
    }

    // ===== ИМПОРТ ДАННЫХ =====
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!confirm('⚠️ Импорт данных заменит текущий прогресс. Продолжить?')) {
                return;
            }
            
            this.showToast('📤 Чтение файла...', 'info');
            
            try {
                const reader = new FileReader();
                
                reader.onload = async (event) => {
                    try {
                        const importedData = JSON.parse(event.target.result);
                        
                        // Валидация
                        if (!this.validateImportedData(importedData)) {
                            this.showToast('❌ Неверный формат файла', 'error');
                            return;
                        }
                        
                        // Сохраняем логин и пароль
                        importedData.username = this.game.userData.username;
                        importedData.password = this.game.userData.password;
                        
                        this.game.userData = importedData;
                        await this.game.saveGame();
                        
                        this.updateUI();
                        this.game.updateUI();
                        this.game.updateInventory();
                        this.game.updateShopStatus();
                        this.game.updateUpgradePrices();
                        
                        this.showToast('✅ Данные успешно импортированы', 'success');
                        
                    } catch (parseError) {
                        this.showToast('❌ Ошибка чтения файла: неверный формат JSON', 'error');
                    }
                };
                
                reader.readAsText(file);
                
            } catch (error) {
                console.error('Ошибка импорта:', error);
                this.showToast('❌ Ошибка при импорте данных', 'error');
            }
        };
        
        input.click();
    }

    validateImportedData(data) {
        const requiredFields = ['clicks', 'money', 'dilicks', 'clickPower', 'inventory', 'currentSkin'];
        
        for (const field of requiredFields) {
            if (!(field in data)) {
                console.error(`Отсутствует поле: ${field}`);
                return false;
            }
        }
        
        if (typeof data.clicks !== 'number' || 
            typeof data.money !== 'number' || 
            typeof data.dilicks !== 'number') {
            console.error('Неверные типы данных');
            return false;
        }
        
        if (!Array.isArray(data.inventory)) {
            console.error('Инвентарь должен быть массивом');
            return false;
        }
        
        return true;
    }

    confirmResetProgress() {
        this.showModal(
            '🔄 Сброс прогресса',
            'Вы уверены, что хотите сбросить весь прогресс? Все клики, деньги и дилики будут обнулены. Это действие нельзя отменить.',
            () => this.resetProgress()
        );
    }

    async resetProgress() {
        const username = this.game.userData.username;
        const password = this.game.userData.password;
        
        const resetData = {
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
            compensationReceived: false,
            settings: this.game.userData.settings,
            lastSave: Date.now(),
            username: username,
            password: password
        };
        
        this.game.userData = resetData;
        await this.game.saveGame();
        
        this.game.updateUI();
        this.game.updateInventory();
        this.game.updateShopStatus();
        this.game.updateUpgradePrices();
        this.updateUI();
        
        this.showToast('✅ Прогресс сброшен', 'success');
    }

    confirmDeleteAccount() {
        this.showModal(
            '🗑️ Удаление аккаунта',
            'Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить. Все данные будут потеряны навсегда.',
            () => this.deleteAccount()
        );
    }

    async deleteAccount() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            await firebase.database().ref('users/' + userId).remove();
        }
        
        if (this.game.bubbleFrame) {
            cancelAnimationFrame(this.game.bubbleFrame);
        }
        if (this.game.autoClickerInterval) {
            clearInterval(this.game.autoClickerInterval);
        }
        if (this.game.playtimeInterval) {
            clearInterval(this.game.playtimeInterval);
        }
        
        localStorage.clear();
        window.location.href = 'register.html';
    }

    checkUpdates() {
        this.showToast('🔄 Установлена последняя версия 2.0.0', 'info');
    }

    showToast(message, type = 'info') {
        const oldToast = document.querySelector('.settings-toast');
        if (oldToast) oldToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `settings-toast ${type}`;
        toast.innerHTML = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showModal(title, message, onConfirm) {
        const oldModal = document.querySelector('.modal-overlay');
        if (oldModal) oldModal.remove();
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="modal-buttons">
                    <button class="modal-btn confirm">Да, подтверждаю</button>
                    <button class="modal-btn cancel">Отмена</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => modal.classList.add('active'), 10);
        
        modal.querySelector('.confirm').addEventListener('click', () => {
            onConfirm();
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.querySelector('.cancel').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
    }
}

// ===== КОЛЕСО ФОРТУНЫ (СРЕДНИЙ РАЗМЕР, КРУГЛЫЕ ВАЛЮТЫ, ИСПРАВЛЕННАЯ СТРЕЛКА) =====
class WheelOfFortune {
    constructor(game) {
        this.game = game;
        this.PRIZES = [
            { name: '2500 МОНЕТ', value: 2500, type: 'money', prob: 50, color: '#2e7d32' },
            { name: '5500 МОНЕТ', value: 5500, type: 'money', prob: 35, color: '#f9a825' },
            { name: '8500 МОНЕТ', value: 8500, type: 'money', prob: 25, color: '#ef6c00' },
            { name: '11500 МОНЕТ', value: 11500, type: 'money', prob: 15, color: '#d32f2f' },
            { name: '5000 ДИЛИКОВ', value: 5000, type: 'dilicks', prob: 5, color: '#7b1fa2' },
            { name: 'ОСОБЕННЫЙ СКИН', value: 'skin', type: 'skin', prob: 2.5, color: '#c2185b' }
        ];
        
        this.SPIN_COST = 2500;
        this.MONEY_ICON = 'https://avatars.mds.yandex.net/i?id=d2747e92b4fb93d8cee0b3582cb46ea6_l-5332707-images-thumbs&n=13';
        this.DILICKS_ICON = 'https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg';
        this.SKIN_ID = 'wheel_dragon_skin'; // ID нового скина
        
        this.rotation = 0;
        this.isSpinning = false;
        this.spinVelocity = 0;
        this.spinDeceleration = 0.985;
        this.spinActive = false;
        this.animationFrame = null;
        
        this.container = document.getElementById('wheelContainer');
        this.modal = null;
        
        this.init();
    }
    
    init() {
        this.render();
        this.setupEventListeners();
    }
    
    render() {
        const html = `
            <div class="wheel-card" style="padding: 25px 25px 30px;">
                <div class="wheel-header" style="margin-bottom: 15px;">
                    <h2 style="font-size: 2.2rem; margin-bottom: 5px;">✦ КОЛЕСО ФОРТУНЫ ✦</h2>
                    <p style="font-size: 1rem; margin-bottom: 8px; color: rgba(255,255,255,0.7);">Испытай удачу!</p>
                    <div class="wheel-price" style="padding: 6px 25px; background: rgba(255,215,0,0.1); border-radius: 40px; display: inline-block;">
                        <img src="${this.DILICKS_ICON}" style="width: 18px; height: 18px; border-radius: 50%; vertical-align: middle; margin-right: 5px;" onerror="this.src='https://cdn-icons-png.flaticon.com/512/4366/4366891.png'">
                        <span style="font-size: 1rem; color: gold;">${this.SPIN_COST} за крутку</span>
                    </div>
                </div>
                
                <div class="wheel-wrapper" style="width: 280px; height: 280px; margin: 10px auto; position: relative;">
                    <canvas id="wheelCanvas" width="450" height="450" class="wheel-canvas" style="width: 100%; height: 100%;"></canvas>
                    <div class="wheel-pointer" style="position: absolute; top: -5px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-top: 40px solid gold; filter: drop-shadow(0 8px 6px #00000099); z-index: 10;"></div>
                    <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); width: 16px; height: 16px; background: radial-gradient(circle, #ffd966, #b8860b); border-radius: 50%; box-shadow: 0 0 20px gold; z-index: 11;"></div>
                </div>
                
                <div class="wheel-controls" style="margin: 15px 0; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <button class="wheel-spin-btn" id="wheelSpinBtn" style="background: rgba(255,255,255,0.06); border: 0.5px solid rgba(255,255,255,0.12); color: white; padding: 12px 35px; border-radius: 50px; font-size: 1.6rem; font-weight: 600; text-transform: uppercase; letter-spacing: 3px; box-shadow: 0 8px 18px rgba(0,0,0,0.25); backdrop-filter: blur(8px); cursor: pointer; transition: all 0.15s ease; display: flex; align-items: center; gap: 10px;">
                        <span>🎡</span> КРУТИТЬ <span>🎡</span>
                    </button>
                    <div class="wheel-balance" style="color: white; font-size: 1rem; display: flex; align-items: center; gap: 5px;">
                        Твой баланс: 
                        <span id="wheelBalance" style="color: gold; font-weight: 600;">${this.game.userData.dilicks.toLocaleString()}</span>
                        <img src="${this.DILICKS_ICON}" style="width: 20px; height: 20px; border-radius: 50%;" onerror="this.src='https://cdn-icons-png.flaticon.com/512/4366/4366891.png'">
                    </div>
                </div>
                
                <div class="wheel-prizes" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: rgba(0,0,0,0.25); backdrop-filter: blur(10px); border-radius: 40px; border: 0.5px solid rgba(255,255,255,0.08); padding: 12px; margin: 15px 0;">
                    <div class="wheel-prize-item" style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(255,255,255,0.02); border-radius: 30px;">
                        <span class="wheel-prize-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #2e7d32; box-shadow: 0 0 10px #2e7d32;"></span>
                        <span class="wheel-prize-text" style="color: white; font-size: 0.85rem; display: flex; align-items: center; gap: 4px;"><strong style="color: gold;">50%</strong> 2500 <img src="${this.MONEY_ICON}" style="width: 16px; height: 16px; border-radius: 50%;"></span>
                    </div>
                    <div class="wheel-prize-item" style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(255,255,255,0.02); border-radius: 30px;">
                        <span class="wheel-prize-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #f9a825; box-shadow: 0 0 10px #f9a825;"></span>
                        <span class="wheel-prize-text" style="color: white; font-size: 0.85rem; display: flex; align-items: center; gap: 4px;"><strong style="color: gold;">35%</strong> 5500 <img src="${this.MONEY_ICON}" style="width: 16px; height: 16px; border-radius: 50%;"></span>
                    </div>
                    <div class="wheel-prize-item" style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(255,255,255,0.02); border-radius: 30px;">
                        <span class="wheel-prize-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #ef6c00; box-shadow: 0 0 10px #ef6c00;"></span>
                        <span class="wheel-prize-text" style="color: white; font-size: 0.85rem; display: flex; align-items: center; gap: 4px;"><strong style="color: gold;">25%</strong> 8500 <img src="${this.MONEY_ICON}" style="width: 16px; height: 16px; border-radius: 50%;"></span>
                    </div>
                    <div class="wheel-prize-item" style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(255,255,255,0.02); border-radius: 30px;">
                        <span class="wheel-prize-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #d32f2f; box-shadow: 0 0 10px #d32f2f;"></span>
                        <span class="wheel-prize-text" style="color: white; font-size: 0.85rem; display: flex; align-items: center; gap: 4px;"><strong style="color: gold;">15%</strong> 11500 <img src="${this.MONEY_ICON}" style="width: 16px; height: 16px; border-radius: 50%;"></span>
                    </div>
                    <div class="wheel-prize-item" style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(255,255,255,0.02); border-radius: 30px;">
                        <span class="wheel-prize-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #7b1fa2; box-shadow: 0 0 10px #7b1fa2;"></span>
                        <span class="wheel-prize-text" style="color: white; font-size: 0.85rem; display: flex; align-items: center; gap: 4px;"><strong style="color: gold;">5%</strong> 5000 <img src="${this.DILICKS_ICON}" style="width: 16px; height: 16px; border-radius: 50%;"></span>
                    </div>
                    <div class="wheel-prize-item" style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(255,255,255,0.02); border-radius: 30px;">
                        <span class="wheel-prize-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #c2185b; box-shadow: 0 0 10px #c2185b;"></span>
                        <span class="wheel-prize-text" style="color: white; font-size: 0.85rem; display: flex; align-items: center; gap: 4px;"><strong style="color: gold;">2.5%</strong> СКИН ✨</span>
                        <div class="wheel-skin-btn" id="showSkinBtn" style="background: rgba(255,215,0,0.15); border: 1px solid gold; color: gold; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-left: auto; cursor: pointer; font-size: 0.8rem;">?</div>
                    </div>
                </div>
                
                <div class="wheel-result" style="background: rgba(0,0,0,0.25); backdrop-filter: blur(10px); border-radius: 50px; border: 0.5px solid rgba(255,255,255,0.08); padding: 18px; text-align: center;" id="wheelResult">
                    <div class="wheel-result-label" style="color: rgba(255,255,255,0.5); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 8px;">ТВОЙ ВЫИГРЫШ</div>
                    <div class="wheel-result-value" style="font-size: 1.6rem; font-weight: 600; color: gold; text-shadow: 0 0 15px gold; display: flex; align-items: center; justify-content: center; gap: 8px;" id="wheelResultDisplay">НАЖМИ КРУТИТЬ</div>
                </div>
            </div>
            
            <!-- Модальное окно для скина -->
            <div class="wheel-skin-modal" id="skinModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(15px); z-index: 10000; align-items: center; justify-content: center; padding: 20px;">
                <div class="wheel-modal-content" style="max-width: 400px; width: 100%; background: rgba(20,25,35,0.95); backdrop-filter: blur(20px); border: 2px solid gold; border-radius: 50px; padding: 30px 25px; text-align: center; position: relative; animation: modalAppear 0.3s ease;">
                    <span class="wheel-modal-close" id="closeModal" style="position: absolute; top: 20px; right: 25px; font-size: 2rem; color: gold; cursor: pointer;">✕</span>
                    <h2 class="wheel-modal-title" style="color: gold; font-size: 2rem; margin-bottom: 15px; text-shadow: 0 0 20px gold;">✦ ОСОБЕННЫЙ СКИН ✦</h2>
                    <div class="wheel-skin-preview" style="width: 160px; height: 160px; margin: 15px auto; border-radius: 50%; border: 4px solid gold; overflow: hidden; box-shadow: 0 0 40px gold;">
                        <img src="https://static.wikia.nocookie.net/59310fd4-7c46-4895-930e-6cea7982a142/scale-to-width/755" alt="Special Skin" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://cdn-icons-png.flaticon.com/512/4366/4366891.png'">
                    </div>
                    <p class="wheel-skin-description" style="color: white; font-size: 1.1rem; margin: 15px 0; line-height: 1.5;">
                        ✨ Легендарный скин дракона<br>
                        <strong style="color: gold;">×250 МНОЖИТЕЛЬ</strong><br>
                        ко всем кликам
                    </p>
                    <div class="wheel-multiplier" style="display: inline-block; background: linear-gradient(145deg, #ffd966, #b8860b); padding: 8px 25px; border-radius: 40px; color: #1a0f00; font-weight: bold; font-size: 1.2rem; margin-top: 10px; box-shadow: 0 4px 0 #7a4f00;">×250</div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.spinBtn = document.getElementById('wheelSpinBtn');
        this.balanceSpan = document.getElementById('wheelBalance');
        this.resultDisplay = document.getElementById('wheelResultDisplay');
        this.modal = document.getElementById('skinModal');
        
        this.drawWheel();
    }
    
    setupEventListeners() {
        if (this.spinBtn) {
            this.spinBtn.addEventListener('click', () => this.spin());
        }
        
        const showSkinBtn = document.getElementById('showSkinBtn');
        const closeModal = document.getElementById('closeModal');
        
        if (showSkinBtn) {
            showSkinBtn.addEventListener('click', () => {
                this.modal.style.display = 'flex';
            });
        }
        
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.modal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.style.display = 'none';
            }
        });
    }
    
    drawWheel() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) * 0.4;
        
        this.ctx.clearRect(0, 0, w, h);
        
        let startAngle = this.rotation - Math.PI / 2;
        
        for (let i = 0; i < this.PRIZES.length; i++) {
            const prize = this.PRIZES[i];
            const sliceAngle = (prize.prob / 100) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;
            
            this.ctx.beginPath();
            this.ctx.moveTo(cx, cy);
            this.ctx.arc(cx, cy, r, startAngle, endAngle);
            this.ctx.closePath();
            
            this.ctx.fillStyle = prize.color;
            this.ctx.shadowColor = 'rgba(255,255,255,0.3)';
            this.ctx.shadowBlur = 15;
            this.ctx.fill();
            
            this.ctx.shadowBlur = 0;
            this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();
            
            startAngle = endAngle;
        }
        
        // Центр
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r * 0.15, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgba(255,255,255,0.1)';
        this.ctx.shadowColor = 'rgba(255,215,0,0.5)';
        this.ctx.shadowBlur = 20;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    spin() {
        if (this.isSpinning) return;
        
        // Проверяем баланс
        if (this.game.userData.dilicks < this.SPIN_COST) {
            this.resultDisplay.innerHTML = '❌ Недостаточно диликов!';
            return;
        }
        
        // Списываем дилики
        this.game.userData.dilicks -= this.SPIN_COST;
        this.balanceSpan.textContent = this.game.userData.dilicks.toLocaleString();
        this.game.updateUI();
        this.game.saveGame();
        
        // Запускаем вращение
        this.spinVelocity = 0.45 + Math.random() * 0.3;
        this.spinDeceleration = 0.982 + (Math.random() * 0.01);
        this.spinActive = true;
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        
        this.resultDisplay.innerHTML = '⏳ КРУТИТСЯ...';
        
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(() => this.spinAnimation());
    }
    
    spinAnimation() {
        if (!this.spinActive) return;
        
        this.rotation += this.spinVelocity;
        this.spinVelocity *= this.spinDeceleration;
        this.drawWheel();
        
        if (this.spinVelocity < 0.002) {
            this.spinActive = false;
            this.isSpinning = false;
            this.spinBtn.disabled = false;
            
            // Определяем результат
            const normalized = ((this.rotation % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
            let angle = (normalized + Math.PI/2) % (2*Math.PI);
            
            let cumulative = 0;
            let selectedPrize = this.PRIZES[0];
            
            for (let prize of this.PRIZES) {
                const slice = (prize.prob / 100) * 2 * Math.PI;
                if (angle >= cumulative && angle < cumulative + slice) {
                    selectedPrize = prize;
                    break;
                }
                cumulative += slice;
            }
            
            // Выдаем приз
            this.givePrize(selectedPrize);
            return;
        }
        
        this.animationFrame = requestAnimationFrame(() => this.spinAnimation());
    }
    
    givePrize(prize) {
        // Формируем строку результата с круглыми иконками
        let resultHTML = '';
        
        if (prize.type === 'skin') {
            // Проверяем, есть ли уже скин
            if (!this.game.userData.inventory.includes(this.SKIN_ID)) {
                this.game.userData.inventory.push(this.SKIN_ID);
                resultHTML = '✨ ОСОБЕННЫЙ СКИН ✨';
                this.resultDisplay.style.color = '#ffb7c5';
                this.resultDisplay.style.textShadow = '0 0 30px #ff69b4';
                
                // Уведомление
                this.game.showAchievementNotification({
                    name: 'ОСОБЕННЫЙ СКИН',
                    icon: this.game.skinsData[this.SKIN_ID].image,
                    reward: { money: 0, dilicks: 0 }
                });
            } else {
                // Если скин уже есть, даем 10000 диликов
                this.game.userData.dilicks += 10000;
                resultHTML = `
                    <span>🎉 +10000</span>
                    <img src="${this.DILICKS_ICON}" style="width: 24px; height: 24px; border-radius: 50%; vertical-align: middle;">
                    <span>(скин уже был)</span>
                `;
                this.resultDisplay.style.color = 'gold';
                this.resultDisplay.style.textShadow = '0 0 20px gold';
            }
        } else if (prize.type === 'money') {
            this.game.userData.money += prize.value;
            resultHTML = `
                <span> +${prize.value.toLocaleString()}</span>
                <img src="${this.MONEY_ICON}" style="width: 24px; height: 24px; border-radius: 50%; vertical-align: middle;">
            `;
        } else {
            this.game.userData.dilicks += prize.value;
            resultHTML = `
                <span>  +${prize.value.toLocaleString()}</span>
                <img src="${this.DILICKS_ICON}" style="width: 24px; height: 24px; border-radius: 50%; vertical-align: middle;">
            `;
        }
        
        this.resultDisplay.innerHTML = resultHTML;
        
        // Обновляем интерфейс
        this.balanceSpan.textContent = this.game.userData.dilicks.toLocaleString();
        this.game.updateUI();
        this.game.updateInventory();
        this.game.saveGame();
        this.game.checkAchievements(); // Проверяем достижения
        
        // Вибрация на телефоне
        if (navigator.vibrate) navigator.vibrate(100);
    }
}

// ===== ЗАПУСК ИГРЫ =====
document.addEventListener('DOMContentLoaded', () => {
    window.clickerGame = new ClickerGame();
});

// ===== ОБРАБОТЧИК ДЛЯ КАРТОЧЕК НА ОСТРОВЕ =====
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            if (tabId) {
                const navBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
                if (navBtn) {
                    navBtn.click();
                }
            }
        });
    });
});

// ===== ГОРЯЧИЕ КЛАВИШИ SHIFT+ENTER =====
document.addEventListener('keydown', (e) => {
    // SHIFT + ENTER для открытия колеса
    if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        
        // Находим кнопку колеса в навигации
        const wheelBtn = document.querySelector('.nav-btn[data-tab="wheel"]');
        if (wheelBtn) {
            wheelBtn.click();
            
            // Эффект нажатия
            wheelBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                wheelBtn.style.transform = '';
            }, 200);
        }
    }
});