class ClickerGame {
    constructor() {
        this.userManager = new UserManager();
        this.userData = null;
        this.autoClickerInterval = null;
        this.playtimeInterval = null;
        this.lastUpdate = Date.now();
        this.bubbleFrame = null;
        this.lastBubbleTime = 0;
        
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
            }
        };
        
        // Достижения (ачивки)
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
                description: 'Соберите все скины',
                icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png',
                condition: (data) => data.inventory && data.inventory.length >= 3,
                reward: { money: 3000, dilicks: 300 }
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
            }
        ];
        
        // Промокоды
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
            'MONSTERS-SKIN': {  // НОВЫЙ ПРОМОКОД С ВАШИМ НАЗВАНИЕМ
                code: 'MONSTERS-SKIN',
                reward: { money: 0, dilicks: 0, skin: 'monsters_skin' },
                description: 'Скин монстра в подарок!',
                maxActivations: 1,
                expiryDate: null
            }
        };
        
        this.init();
    }

    async init() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.href = 'register.html';
            return;
        }
        
        this.userManager.currentUser = currentUser;
        this.userData = this.userManager.loadUserData();
        
        if (!this.userData) {
            this.userData = this.createDefaultData();
        } else {
            if (!this.userData.inventory || !this.userData.inventory.includes('classic')) {
                if (!this.userData.inventory) this.userData.inventory = [];
                if (!this.userData.inventory.includes('classic')) {
                    this.userData.inventory.unshift('classic');
                }
            }
            if (!this.userData.currentSkin) {
                this.userData.currentSkin = 'classic';
            }
            if (!this.userData.activatedPromocodes) {
                this.userData.activatedPromocodes = [];
            }
            if (!this.userData.promocodesHistory) {
                this.userData.promocodesHistory = [];
            }
        }
        
        this.loadElements();
        this.setupEventListeners();
        this.startAutoClicker();
        this.startPlaytimeTracker();
        this.startBubbles();
        
        if (this.clickIcon && this.userData.currentSkin) {
            this.clickIcon.src = this.skinsData[this.userData.currentSkin].image;
        }
        
        this.updateUI();
        this.updateInventory();
        this.updateShopStatus();
        this.updateUpgradePrices();
        this.updatePromocodesList();
        this.updatePromocodesHistory();
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
            lastSave: Date.now()
        };
    }

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
        
        // Элементы профиля
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
        
        // Элементы промокодов
        this.promocodeInput = document.getElementById('promocodeInput');
        this.activatePromocodeBtn = document.getElementById('activatePromocodeBtn');
        this.promocodeMessage = document.getElementById('promocodeMessage');
        this.promocodesList = document.getElementById('promocodesList');
        this.promocodesHistory = document.getElementById('promocodesHistory');
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

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
                const item = e.target.dataset.item;
                const price = parseInt(e.target.dataset.price);
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
        
        // Обработчик для промокодов
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
    }

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
        if (tabId === 'promocodes') {
            this.updatePromocodesList();
            this.updatePromocodesHistory();
        }
    }

    handleClick(e) {
        let clickPower = this.userData.clickPower;
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
        
        // Проверяем ачивки при каждом клике
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

    buyItem(item, price) {
        if (this.userData.money >= price) {
            this.userData.money -= price;
            
            if (!this.userData.inventory.includes(item)) {
                this.userData.inventory.push(item);
            }
            
            this.userData.currentSkin = item;
            if (this.clickIcon) {
                this.clickIcon.src = this.skinsData[item].image;
            }
            
            this.updateUI();
            this.saveGame();
            this.updateInventory();
            this.updateShopStatus();
            
            // Проверяем ачивки после покупки
            this.checkAchievements();
            
            alert(`Куплен скин: ${this.skinsData[item].name}`);
        } else {
            alert('Недостаточно денег!');
        }
    }

    buyUpgrade(upgradeType) {
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
                    this.saveGame();
                    this.checkAchievements();
                    alert(`Усилитель клика улучшен до ${this.userData.clickPower} уровня!`);
                } else {
                    alert(`Недостаточно диликов! Нужно: ${price}`);
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
                    this.saveGame();
                    this.checkAchievements();
                    alert(`Автокликер улучшен до ${this.userData.autoClickerLevel} уровня!`);
                } else {
                    alert(`Недостаточно диликов! Нужно: ${price}`);
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
                    this.saveGame();
                    this.checkAchievements();
                    alert(`Шанс крита увеличен до ${this.userData.critChance}%!`);
                } else {
                    alert(`Недостаточно диликов! Нужно: ${price}`);
                }
                break;
        }
    }

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

    updateInventory() {
        if (!this.inventoryGrid) return;
        
        this.inventoryGrid.innerHTML = '';
        
        if (!this.userData.inventory || !Array.isArray(this.userData.inventory)) {
            this.userData.inventory = ['classic'];
        }
        
        if (!this.userData.inventory.includes('classic')) {
            this.userData.inventory.unshift('classic');
        }
        
        this.userData.inventory.forEach((skinId, index) => {
            const skin = this.skinsData[skinId];
            if (!skin) return;
            
            const skinCard = document.createElement('div');
            skinCard.className = `glass-card inventory-item ${this.userData.currentSkin === skinId ? 'active' : ''}`;
            skinCard.dataset.skin = skinId;
            skinCard.style.setProperty('--item-index', index);
            
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

    equipSkin(skinId) {
        this.userData.currentSkin = skinId;
        if (this.clickIcon) {
            this.clickIcon.src = this.skinsData[skinId].image;
        }
        this.saveGame();
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

    startAutoClicker() {
        if (this.autoClickerInterval) {
            clearInterval(this.autoClickerInterval);
        }
        
        this.autoClickerInterval = setInterval(() => {
            if (this.userData.autoClickerLevel > 0) {
                for (let i = 0; i < this.userData.autoClickerLevel; i++) {
                    this.userData.clicks++;
                    this.userData.money += this.userData.clickPower;
                    this.userData.dilicks++;
                    this.addSeasonExp(this.userData.clickPower);
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

    addSeasonExp(amount) {
        this.userData.seasonExp += amount;
        const expNeeded = this.getSeasonExpNeeded();
        
        while (this.userData.seasonExp >= expNeeded && this.userData.seasonLevel < 50) {
            this.userData.seasonExp -= expNeeded;
            this.userData.seasonLevel++;
            this.rewardSeasonLevel();
        }
        
        if (this.seasonProgress && this.seasonLevel) {
            const progress = (this.userData.seasonExp / expNeeded) * 100;
            this.seasonProgress.style.width = progress + '%';
            this.seasonLevel.textContent = this.userData.seasonLevel;
        }
    }

    getSeasonExpNeeded() {
        return 100 + (this.userData.seasonLevel * 50);
    }

    rewardSeasonLevel() {
        this.userData.money += 100;
        this.userData.dilicks += 10;
    }

    buyPremiumPass() {
        if (this.userData.dilicks >= 500) {
            this.userData.dilicks -= 500;
            this.userData.premiumPass = true;
            this.updateUI();
            this.saveGame();
            alert('Премиум пропуск активирован!');
        } else {
            alert(`Недостаточно диликов! Нужно: 500`);
        }
    }

    updateLeaderboard(type) {
        if (!this.leaderboardBody) return;
        
        const users = this.userManager.users;
        const leaderboard = [];
        
        for (let [username, userData] of Object.entries(users)) {
            let value = 0;
            switch(type) {
                case 'clicks':
                    value = userData.data.clicks;
                    break;
                case 'money':
                    value = userData.data.money;
                    break;
                case 'playtime':
                    value = userData.data.playtime;
                    break;
            }
            
            leaderboard.push({ username, value });
        }
        
        leaderboard.sort((a, b) => b.value - a.value);
        
        this.leaderboardBody.innerHTML = '';
        leaderboard.slice(0, 10).forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.username}</td>
                <td>${this.formatLeaderboardValue(entry.value, type)}</td>
            `;
            this.leaderboardBody.appendChild(row);
        });
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

    updateUI() {
        if (this.usernameDisplay) {
            this.usernameDisplay.textContent = this.userManager.currentUser;
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
            const expNeeded = this.getSeasonExpNeeded();
            const progress = (this.userData.seasonExp / expNeeded) * 100;
            this.seasonProgress.style.width = progress + '%';
            this.seasonLevel.textContent = this.userData.seasonLevel;
        }
        
        // Обновляем профиль, если он открыт
        if (document.getElementById('profile').classList.contains('active')) {
            this.updateProfile();
        }
    }

    saveGame() {
        this.userManager.saveUserData(this.userData);
    }

    logout() {
        if (this.bubbleFrame) {
            cancelAnimationFrame(this.bubbleFrame);
        }
        if (this.autoClickerInterval) {
            clearInterval(this.autoClickerInterval);
        }
        if (this.playtimeInterval) {
            clearInterval(this.playtimeInterval);
        }
        this.userManager.logout();
        window.location.href = 'register.html';
    }

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

    // МЕТОДЫ ДЛЯ ПРОФИЛЯ И АЧИВОК

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
                
                this.showAchievementNotification(achievement);
            }
        });
        
        if (newAchievementUnlocked) {
            this.saveGame();
            this.updateUI();
            if (document.getElementById('profile').classList.contains('active')) {
                this.updateProfile();
            }
        }
    }

    updateProfile() {
        if (!this.profileUsername) return;
        
        this.profileUsername.textContent = this.userManager.currentUser;
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

    calculateAchievementProgress(achievement) {
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
                const totalSkins = 3;
                const owned = this.userData.inventory?.length || 0;
                return Math.min(100, (owned / totalSkins) * 100);
            case 'critMaster':
                return Math.min(100, (this.userData.critChance / 50) * 100);
            case 'autoClickerMaster':
                return Math.min(100, (this.userData.autoClickerLevel / 10) * 100);
            default:
                return 0;
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-icon">
                <img src="${achievement.icon}" alt="${achievement.name}">
            </div>
            <div class="notification-content">
                <h4>Достижение получено!</h4>
                <p>${achievement.name}</p>
                <p class="notification-reward">
                    +${achievement.reward.money} 💰 +${achievement.reward.dilicks} 💎
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
        }
        
        if (this.ownedSkins) {
            this.ownedSkins.textContent = ownedSkins;
        }
        if (this.totalSkins) {
            this.totalSkins.textContent = totalSkins;
        }
        
        this.ownedSkinsList.innerHTML = '';
        
        Object.entries(this.skinsData).forEach(([skinId, skin]) => {
            const isOwned = this.userData.inventory?.includes(skinId);
            const isActive = this.userData.currentSkin === skinId;
            
            if (isOwned) {
                const skinTag = document.createElement('div');
                skinTag.className = `skin-tag ${isActive ? 'active' : ''}`;
                skinTag.innerHTML = `
                    <img src="${skin.image}" alt="${skin.name}">
                    <span>${skin.name}</span>
                `;
                this.ownedSkinsList.appendChild(skinTag);
            }
        });
    }

    // МЕТОДЫ ДЛЯ ПРОМОКОДОВ

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
        
        // Проверка на срок действия
        if (promocode.expiryDate && Date.now() > promocode.expiryDate) {
            this.showPromocodeMessage('Срок действия промокода истек', 'error');
            return;
        }
        
        // Проверка на уже активированный
        if (this.userData.activatedPromocodes && this.userData.activatedPromocodes.includes(code)) {
            this.showPromocodeMessage('Вы уже активировали этот промокод', 'error');
            return;
        }
        
        // Активация промокода (выдача наград)
        let rewardMessage = '';
        
        // Выдаем деньги, если есть
        if (promocode.reward.money > 0) {
            this.userData.money += promocode.reward.money;
            rewardMessage += `+${promocode.reward.money}💰 `;
        }
        
        // Выдаем дилики, если есть
        if (promocode.reward.dilicks > 0) {
            this.userData.dilicks += promocode.reward.dilicks;
            rewardMessage += `+${promocode.reward.dilicks}💎 `;
        }
        
        // Выдаем скин, если есть
        if (promocode.reward.skin) {
            const skinId = promocode.reward.skin;
            // Проверяем, есть ли такой скин в данных и нет ли его уже у игрока
            if (this.skinsData[skinId] && !this.userData.inventory.includes(skinId)) {
                this.userData.inventory.push(skinId);
                rewardMessage += `+скин "${this.skinsData[skinId].name}" ✨`;
                
                // Если у игрока еще нет активного скина, автоматически надеваем новый
                if (!this.userData.currentSkin) {
                    this.userData.currentSkin = skinId;
                    if (this.clickIcon) {
                        this.clickIcon.src = this.skinsData[skinId].image;
                    }
                }
            } else {
                // Если скин уже есть, выдаем небольшую компенсацию
                this.userData.dilicks += 100;
                rewardMessage += `+100💎 (скин уже был)`;
            }
        }
        
        // Сохраняем активацию
        if (!this.userData.activatedPromocodes) {
            this.userData.activatedPromocodes = [];
        }
        this.userData.activatedPromocodes.push(code);
        
        // Добавляем в историю
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
        this.updateInventory(); // Обновляем инвентарь, чтобы новый скин отобразился
        this.updatePromocodesList();
        this.updatePromocodesHistory();
        
        this.showPromocodeMessage(`Промокод активирован! ${rewardMessage}`, 'success');
        this.promocodeInput.value = '';
        
        // Проверяем ачивки после активации
        this.checkAchievements();
    }

    getPromocodeActivationCount(code) {
        if (!this.userData.activatedPromocodes) return 0;
        return this.userData.activatedPromocodes.filter(c => c === code).length;
    }

    showPromocodeMessage(text, type) {
        if (!this.promocodeMessage) return;
        
        this.promocodeMessage.textContent = text;
        this.promocodeMessage.className = 'promocode-message ' + type;
        
        setTimeout(() => {
            if (this.promocodeMessage) {
                this.promocodeMessage.textContent = '';
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
        
        // Сортируем по дате (сначала новые)
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

class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || {};
        this.currentUser = null;
    }

    register(username, password) {
        if (this.users[username]) {
            return { success: false, message: 'Пользователь уже существует' };
        }
        
        const defaultData = {
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
        
        this.users[username] = {
            password: password,
            data: defaultData
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

document.addEventListener('DOMContentLoaded', () => {
    new ClickerGame();
});