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
        
        this.achievementsData = [
            { id: 'firstClick', name: 'Первый шаг', description: 'Сделайте первый клик', icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png', condition: (data) => data.clicks >= 1, reward: { money: 100, dilicks: 10 } },
            { id: 'clicker100', name: 'Начинающий кликер', description: 'Сделайте 100 кликов', icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png', condition: (data) => data.clicks >= 100, reward: { money: 500, dilicks: 50 } },
            { id: 'clicker1000', name: 'Опытный кликер', description: 'Сделайте 1000 кликов', icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png', condition: (data) => data.clicks >= 1000, reward: { money: 2000, dilicks: 200 } },
            { id: 'richMan', name: 'Богач', description: 'Накопите 10000 денег', icon: 'https://avatars.mds.yandex.net/i?id=d2747e92b4fb93d8cee0b3582cb46ea6_l-5332707-images-thumbs&n=13', condition: (data) => data.money >= 10000, reward: { money: 0, dilicks: 500 } },
            { id: 'dilicMaster', name: 'Мастер диликов', description: 'Накопите 5000 диликов', icon: 'https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg', condition: (data) => data.dilicks >= 5000, reward: { money: 5000, dilicks: 0 } },
            { id: 'skinCollector', name: 'Коллекционер', description: 'Соберите все скины', icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png', condition: (data) => data.inventory && data.inventory.length >= 3, reward: { money: 3000, dilicks: 300 } },
            { id: 'critMaster', name: 'Повелитель критов', description: 'Увеличьте шанс крита до 50%', icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png', condition: (data) => data.critChance >= 50, reward: { money: 2000, dilicks: 200 } },
            { id: 'autoClickerMaster', name: 'Автоматизация', description: 'Купите 10 уровней автокликера', icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png', condition: (data) => data.autoClickerLevel >= 10, reward: { money: 5000, dilicks: 500 } }
        ];
        
        this.promocodesData = {
            'WELCOME': { code: 'WELCOME', reward: { money: 500, dilicks: 100 }, description: 'Приветственный бонус', maxActivations: 1, expiryDate: null },
            'DILICKS100': { code: 'DILICKS100', reward: { money: 0, dilicks: 100 }, description: '100 диликов в подарок', maxActivations: 1, expiryDate: null },
            'MONEY1000': { code: 'MONEY1000', reward: { money: 1000, dilicks: 0 }, description: '1000 монет', maxActivations: 1, expiryDate: null },
            'CLICKER2024': { code: 'CLICKER2024', reward: { money: 500, dilicks: 50 }, description: 'Новогодний промокод', maxActivations: 1, expiryDate: new Date('2024-12-31').getTime() },
            'SUPERBONUS': { code: 'SUPERBONUS', reward: { money: 2000, dilicks: 200 }, description: 'Супер бонус', maxActivations: 1, expiryDate: null },
            'NEONLOVER': { code: 'NEONLOVER', reward: { money: 1500, dilicks: 150 }, description: 'Для любителей неона', maxActivations: 1, expiryDate: null },
            'MONSTERS-SKIN': { code: 'MONSTERS-SKIN', reward: { money: 0, dilicks: 0, skin: 'monsters_skin' }, description: 'Скин монстра в подарок!', maxActivations: 1, expiryDate: null }
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
        
        try {
            const userRef = firebase.database().ref('users/' + currentUser);
            const snapshot = await userRef.once('value');
            
            if (snapshot.exists()) {
                this.userData = snapshot.val();
            } else {
                this.userData = this.createDefaultData();
                await userRef.set(this.userData);
            }
        } catch (error) {
            console.log('Firebase error, using localStorage');
            this.userData = this.userManager.loadUserData() || this.createDefaultData();
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
        this.updateLeaderboard('clicks');
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
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
    }

    setupEventListeners() {
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        if (this.clickButton) {
            this.clickButton.addEventListener('click', (e) => this.handleClick(e));
        }
        
        this.buyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.buyItem(btn.dataset.item, parseInt(btn.dataset.price));
            });
        });
        
        this.upgradeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const upgradeItem = e.target.closest('.upgrade-item');
                if (upgradeItem) this.buyUpgrade(upgradeItem.dataset.upgrade);
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
                if (e.key === 'Enter') this.activatePromocode();
            });
        }
    }

    switchTab(tabId) {
        this.navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        this.tabs.forEach(tab => tab.classList.toggle('active', tab.id === tabId));
        
        if (tabId === 'inventory') this.updateInventory();
        if (tabId === 'upgrades') this.updateUpgradePrices();
        if (tabId === 'profile') this.updateProfile();
        if (tabId === 'promocodes') {
            this.updatePromocodesList();
            this.updatePromocodesHistory();
        }
        if (tabId === 'leaderboard') {
            const activeTab = document.querySelector('.leaderboard-tabs .active');
            this.updateLeaderboard(activeTab ? activeTab.dataset.leaderboard : 'clicks');
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
        setTimeout(() => effect.remove(), 600);
    }

    async buyItem(item, price) {
        if (this.userData.money >= price) {
            this.userData.money -= price;
            if (!this.userData.inventory.includes(item)) this.userData.inventory.push(item);
            this.userData.currentSkin = item;
            if (this.clickIcon) this.clickIcon.src = this.skinsData[item].image;
            
            this.updateUI();
            await this.saveGame();
            this.updateInventory();
            this.updateShopStatus();
            this.checkAchievements();
            alert(`Куплен скин: ${this.skinsData[item].name}`);
        } else {
            alert('Недостаточно денег!');
        }
    }

    async buyUpgrade(upgradeType) {
        let currentLevel, price;
        
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
                    alert(`Усилитель клика улучшен до ${this.userData.clickPower} уровня!`);
                } else alert(`Недостаточно диликов! Нужно: ${price}`);
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
                    alert(`Автокликер улучшен до ${this.userData.autoClickerLevel} уровня!`);
                } else alert(`Недостаточно диликов! Нужно: ${price}`);
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
                    alert(`Шанс крита увеличен до ${this.userData.critChance}%!`);
                } else alert(`Недостаточно диликов! Нужно: ${price}`);
                break;
        }
    }

    updateUpgradePrices() {
        document.querySelectorAll('.upgrade-item').forEach(item => {
            const type = item.dataset.upgrade;
            const priceEl = item.querySelector('.price-value');
            const levelEl = item.querySelector('.upgrade-level');
            if (!priceEl || !levelEl) return;
            
            if (type === 'clickPower') {
                levelEl.textContent = this.userData.clickPower;
                priceEl.textContent = 50 + (this.userData.clickPower - 1) * 25;
            } else if (type === 'autoClicker') {
                levelEl.textContent = this.userData.autoClickerLevel;
                priceEl.textContent = 100 + this.userData.autoClickerLevel * 100;
            } else if (type === 'critChance') {
                levelEl.textContent = this.userData.critChance + '%';
                priceEl.textContent = 200 + ((this.userData.critChance - 5) / 5) * 50;
            }
        });
    }

    updateShopStatus() {
        document.querySelectorAll('.shop-item').forEach(item => {
            const skinId = item.dataset.skin;
            const statusEl = document.getElementById(`status-${skinId}`);
            const buyBtn = item.querySelector('.buy-btn');
            const owned = this.userData.inventory?.includes(skinId);
            
            if (owned) {
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
        
        const inventory = this.userData.inventory || ['classic'];
        if (!inventory.includes('classic')) inventory.unshift('classic');
        
        inventory.forEach((skinId, index) => {
            const skin = this.skinsData[skinId];
            if (!skin) return;
            
            const card = document.createElement('div');
            card.className = `glass-card inventory-item ${this.userData.currentSkin === skinId ? 'active' : ''}`;
            card.dataset.skin = skinId;
            
            const isCurrent = this.userData.currentSkin === skinId;
            const btnHtml = isCurrent ? '<p class="skin-equipped">✅ ЭКИПИРОВАНО</p>' : '<button class="glass-btn equip-btn">ЭКИПИРОВАТЬ</button>';
            
            card.innerHTML = `
                <div class="skin-preview"><img src="${skin.image}" alt="${skin.name}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/4366/4366891.png'"></div>
                <h3>${skin.name}</h3>
                <p class="skin-description">${skin.description}</p>
                ${btnHtml}
            `;
            
            const equipBtn = card.querySelector('.equip-btn');
            if (equipBtn) {
                equipBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.equipSkin(skinId);
                });
            }
            
            this.inventoryGrid.appendChild(card);
        });
    }

    async equipSkin(skinId) {
        this.userData.currentSkin = skinId;
        if (this.clickIcon) this.clickIcon.src = this.skinsData[skinId].image;
        await this.saveGame();
        this.updateInventory();
        this.createClickEffect(window.innerWidth/2, window.innerHeight/2, `✨ ${this.skinsData[skinId].name} ✨`);
        
        if (this.clickIcon) {
            this.clickIcon.style.transform = 'scale(0.8)';
            setTimeout(() => this.clickIcon.style.transform = 'scale(1)', 200);
        }
    }

    startAutoClicker() {
        if (this.autoClickerInterval) clearInterval(this.autoClickerInterval);
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

    restartAutoClicker() { this.startAutoClicker(); }

    startPlaytimeTracker() {
        this.playtimeInterval = setInterval(() => {
            this.userData.playtime++;
            this.updatePlaytimeDisplay();
            this.saveGame();
        }, 1000);
    }

    updatePlaytimeDisplay() {
        if (!this.playtimeSpan) return;
        const h = Math.floor(this.userData.playtime / 3600);
        const m = Math.floor((this.userData.playtime % 3600) / 60);
        const s = this.userData.playtime % 60;
        this.playtimeSpan.textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }

    addSeasonExp(amount) {
        this.userData.seasonExp += amount;
        const needed = 100 + this.userData.seasonLevel * 50;
        while (this.userData.seasonExp >= needed && this.userData.seasonLevel < 50) {
            this.userData.seasonExp -= needed;
            this.userData.seasonLevel++;
            this.userData.money += 100;
            this.userData.dilicks += 10;
        }
        if (this.seasonProgress && this.seasonLevel) {
            this.seasonProgress.style.width = (this.userData.seasonExp / needed * 100) + '%';
            this.seasonLevel.textContent = this.userData.seasonLevel;
        }
    }

    async buyPremiumPass() {
        if (this.userData.dilicks >= 500) {
            this.userData.dilicks -= 500;
            this.userData.premiumPass = true;
            this.updateUI();
            await this.saveGame();
            alert('Премиум пропуск активирован!');
        } else alert('Недостаточно диликов! Нужно: 500');
    }

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
            
            for (let [username, data] of Object.entries(users)) {
                let value = 0;
                if (type === 'clicks') value = data.clicks || 0;
                else if (type === 'money') value = data.money || 0;
                else if (type === 'playtime') value = data.playtime || 0;
                leaderboard.push({ username, value });
            }
            
            leaderboard.sort((a, b) => b.value - a.value);
            this.leaderboardBody.innerHTML = '';
            
            leaderboard.slice(0, 50).forEach((entry, index) => {
                const row = document.createElement('tr');
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1;
                row.innerHTML = `<td>${medal}</td><td>${entry.username}${entry.username === this.userManager.currentUser ? ' 👑' : ''}</td><td>${type === 'playtime' ? Math.floor(entry.value/3600)+'ч '+Math.floor((entry.value%3600)/60)+'м' : entry.value.toLocaleString()}</td>`;
                if (entry.username === this.userManager.currentUser) {
                    row.style.background = 'rgba(255, 215, 0, 0.1)';
                    row.style.border = '1px solid gold';
                }
                this.leaderboardBody.appendChild(row);
            });
        } catch (error) {
            this.leaderboardBody.innerHTML = '<tr><td colspan="3" class="empty-history">Ошибка загрузки</td></tr>';
        }
    }

    async updateUI() {
        if (this.usernameDisplay) this.usernameDisplay.textContent = this.userManager.currentUser;
        if (this.moneySpan) this.moneySpan.textContent = this.userData.money.toLocaleString();
        if (this.dilicksSpan) this.dilicksSpan.textContent = this.userData.dilicks.toLocaleString();
        if (this.clicksSpan) this.clicksSpan.textContent = this.userData.clicks.toLocaleString();
        if (this.clickPowerSpan) this.clickPowerSpan.textContent = this.userData.clickPower;
        this.updatePlaytimeDisplay();
        
        if (this.seasonProgress && this.seasonLevel) {
            const needed = 100 + this.userData.seasonLevel * 50;
            this.seasonProgress.style.width = (this.userData.seasonExp / needed * 100) + '%';
            this.seasonLevel.textContent = this.userData.seasonLevel;
        }
        
        if (document.getElementById('profile').classList.contains('active')) this.updateProfile();
    }

    async saveGame() {
        this.userManager.saveUserData(this.userData);
        try {
            await firebase.database().ref('users/' + this.userManager.currentUser).set(this.userData);
        } catch (e) {}
    }

    async logout() {
        if (this.bubbleFrame) cancelAnimationFrame(this.bubbleFrame);
        if (this.autoClickerInterval) clearInterval(this.autoClickerInterval);
        if (this.playtimeInterval) clearInterval(this.playtimeInterval);
        this.userManager.logout();
        window.location.href = 'register.html';
    }

    createBubble() {
        if (document.querySelectorAll('.bubble').length > 10) return;
        const b = document.createElement('div');
        b.className = 'bubble';
        const isMobile = window.innerWidth <= 768;
        const size = isMobile ? Math.random() * 30 + 10 : Math.random() * 50 + 20;
        b.style.width = size + 'px';
        b.style.height = size + 'px';
        b.style.left = Math.random() * 100 + '%';
        b.style.bottom = '-50px';
        b.style.animationDuration = (isMobile ? 3 + Math.random() * 2 : 4 + Math.random() * 3) + 's';
        document.body.appendChild(b);
        setTimeout(() => b.remove(), 6000);
    }

    startBubbles() {
        const interval = 2500;
        const anim = (t) => {
            if (t - this.lastBubbleTime >= interval) {
                this.createBubble();
                this.lastBubbleTime = t;
            }
            this.bubbleFrame = requestAnimationFrame(anim);
        };
        this.bubbleFrame = requestAnimationFrame(anim);
    }

    checkAchievements() {
        if (!this.userData.completedAchievements) this.userData.completedAchievements = [];
        let unlocked = false;
        
        this.achievementsData.forEach(a => {
            if (!this.userData.completedAchievements.includes(a.id) && a.condition(this.userData)) {
                this.userData.completedAchievements.push(a.id);
                this.userData.money += a.reward.money;
                this.userData.dilicks += a.reward.dilicks;
                unlocked = true;
                this.showAchievementNotification(a);
            }
        });
        
        if (unlocked) {
            this.saveGame();
            this.updateUI();
            if (document.getElementById('profile').classList.contains('active')) this.updateProfile();
        }
    }

    updateProfile() {
        if (!this.profileUsername) return;
        this.profileUsername.textContent = this.userManager.currentUser;
        this.profileLevel.textContent = this.userData.seasonLevel;
        this.profileClicks.textContent = this.userData.clicks.toLocaleString();
        this.profileMoney.textContent = this.userData.money.toLocaleString();
        this.profileDilicks.textContent = this.userData.dilicks.toLocaleString();
        
        const h = Math.floor(this.userData.playtime / 3600);
        const m = Math.floor((this.userData.playtime % 3600) / 60);
        this.profilePlaytime.textContent = `${h}ч ${m}м`;
        
        if (this.profileAvatar && this.userData.currentSkin) {
            this.profileAvatar.src = this.skinsData[this.userData.currentSkin].image;
        }
        
        this.renderAchievements();
        this.updateSkinStats();
    }

    renderAchievements() {
        if (!this.achievementsGrid) return;
        this.achievementsGrid.innerHTML = '';
        
        this.achievementsData.forEach(a => {
            const completed = this.userData.completedAchievements?.includes(a.id);
            const progress = this.calcProgress(a);
            const card = document.createElement('div');
            card.className = `achievement-card ${completed ? 'completed' : ''}`;
            card.innerHTML = `
                <div class="achievement-icon ${!completed ? 'locked' : ''}"><img src="${a.icon}" alt="${a.name}"></div>
                <h3 class="achievement-title">${a.name}</h3>
                <p class="achievement-desc">${a.description}</p>
                <div class="achievement-progress">
                    <div class="achievement-progress-bar"><div class="achievement-progress-fill" style="width: ${progress}%"></div></div>
                    <div class="achievement-progress-text">${completed ? 'Выполнено' : Math.round(progress)+'%'}</div>
                </div>
            `;
            this.achievementsGrid.appendChild(card);
        });
    }

    calcProgress(a) {
        if (a.id === 'firstClick') return Math.min(100, this.userData.clicks / 1 * 100);
        if (a.id === 'clicker100') return Math.min(100, this.userData.clicks / 100 * 100);
        if (a.id === 'clicker1000') return Math.min(100, this.userData.clicks / 1000 * 100);
        if (a.id === 'richMan') return Math.min(100, this.userData.money / 10000 * 100);
        if (a.id === 'dilicMaster') return Math.min(100, this.userData.dilicks / 5000 * 100);
        if (a.id === 'skinCollector') return Math.min(100, (this.userData.inventory?.length || 0) / 3 * 100);
        if (a.id === 'critMaster') return Math.min(100, this.userData.critChance / 50 * 100);
        if (a.id === 'autoClickerMaster') return Math.min(100, this.userData.autoClickerLevel / 10 * 100);
        return 0;
    }

    showAchievementNotification(a) {
        const n = document.createElement('div');
        n.className = 'achievement-notification';
        n.innerHTML = `<div class="notification-icon"><img src="${a.icon}"></div><div class="notification-content"><h4>Достижение получено!</h4><p>${a.name}</p><p class="notification-reward">+${a.reward.money} 💰 +${a.reward.dilicks} 💎</p></div>`;
        document.body.appendChild(n);
        setTimeout(() => n.classList.add('show'), 100);
        setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 3000);
    }

    updateSkinStats() {
        if (!this.ownedSkinsList) return;
        const total = Object.keys(this.skinsData).length;
        const owned = this.userData.inventory?.length || 0;
        if (this.skinProgressFill) this.skinProgressFill.style.width = (owned / total * 100) + '%';
        if (this.ownedSkins) this.ownedSkins.textContent = owned;
        if (this.totalSkins) this.totalSkins.textContent = total;
        
        this.ownedSkinsList.innerHTML = '';
        Object.entries(this.skinsData).forEach(([id, skin]) => {
            if (this.userData.inventory?.includes(id)) {
                const tag = document.createElement('div');
                tag.className = `skin-tag ${this.userData.currentSkin === id ? 'active' : ''}`;
                tag.innerHTML = `<img src="${skin.image}" alt="${skin.name}"><span>${skin.name}</span>`;
                this.ownedSkinsList.appendChild(tag);
            }
        });
    }

    activatePromocode() {
        if (!this.promocodeInput) return;
        const code = this.promocodeInput.value.trim().toUpperCase();
        if (!code) return this.showPromocodeMessage('Введите промокод', 'error');
        
        const promo = this.promocodesData[code];
        if (!promo) return this.showPromocodeMessage('Промокод не найден', 'error');
        if (promo.expiryDate && Date.now() > promo.expiryDate) return this.showPromocodeMessage('Срок истек', 'error');
        if (this.userData.activatedPromocodes?.includes(code)) return this.showPromocodeMessage('Уже активирован', 'error');
        
        let msg = '';
        if (promo.reward.money > 0) { this.userData.money += promo.reward.money; msg += `+${promo.reward.money}💰 `; }
        if (promo.reward.dilicks > 0) { this.userData.dilicks += promo.reward.dilicks; msg += `+${promo.reward.dilicks}💎 `; }
        
        if (promo.reward.skin) {
            const skinId = promo.reward.skin;
            if (this.skinsData[skinId] && !this.userData.inventory.includes(skinId)) {
                this.userData.inventory.push(skinId);
                msg += `+скин "${this.skinsData[skinId].name}" ✨`;
                if (!this.userData.currentSkin) {
                    this.userData.currentSkin = skinId;
                    if (this.clickIcon) this.clickIcon.src = this.skinsData[skinId].image;
                }
            } else {
                this.userData.dilicks += 100;
                msg += `+100💎 (скин уже был)`;
            }
        }
        
        if (!this.userData.activatedPromocodes) this.userData.activatedPromocodes = [];
        this.userData.activatedPromocodes.push(code);
        
        if (!this.userData.promocodesHistory) this.userData.promocodesHistory = [];
        const now = new Date();
        const dateStr = `${now.getDate().toString().padStart(2,'0')}.${(now.getMonth()+1).toString().padStart(2,'0')}.${now.getFullYear()}`;
        this.userData.promocodesHistory.push({ code, reward: promo.reward, date: dateStr, timestamp: Date.now() });
        
        this.saveGame();
        this.updateUI();
        this.updateInventory();
        this.updatePromocodesList();
        this.updatePromocodesHistory();
        this.showPromocodeMessage(`Промокод активирован! ${msg}`, 'success');
        this.promocodeInput.value = '';
        this.checkAchievements();
    }

    showPromocodeMessage(text, type) {
        if (!this.promocodeMessage) return;
        this.promocodeMessage.textContent = text;
        this.promocodeMessage.className = 'promocode-message ' + type;
        setTimeout(() => {
            this.promocodeMessage.textContent = '';
            this.promocodeMessage.className = 'promocode-message';
        }, 3000);
    }

    updatePromocodesList() {
        if (!this.promocodesList) return;
        this.promocodesList.innerHTML = '';
        
        Object.values(this.promocodesData).forEach(p => {
            if (this.userData.activatedPromocodes?.includes(p.code) || (p.expiryDate && Date.now() > p.expiryDate)) return;
            
            const item = document.createElement('div');
            item.className = 'promocode-item';
            item.dataset.code = p.code;
            
            const parts = [];
            if (p.reward.money > 0) parts.push(`<img src="https://avatars.mds.yandex.net/i?id=d2747e92b4fb93d8cee0b3582cb46ea6_l-5332707-images-thumbs&n=13" class="price-icon"> +${p.reward.money}`);
            if (p.reward.dilicks > 0) parts.push(`<img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" class="price-icon"> +${p.reward.dilicks}`);
            if (p.reward.skin) parts.push(`✨ +скин`);
            
            item.innerHTML = `<div class="promocode-code">${p.code}</div><div class="promocode-reward">${parts.join(' ')}</div>`;
            item.addEventListener('click', () => {
                this.promocodeInput.value = p.code;
                this.promocodeInput.focus();
            });
            this.promocodesList.appendChild(item);
        });
        
        if (this.promocodesList.children.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-history';
            empty.textContent = 'Нет доступных промокодов';
            this.promocodesList.appendChild(empty);
        }
    }

    updatePromocodesHistory() {
        if (!this.promocodesHistory) return;
        this.promocodesHistory.innerHTML = '';
        
        const history = this.userData.promocodesHistory || [];
        if (history.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-history';
            empty.textContent = 'История активаций пуста';
            this.promocodesHistory.appendChild(empty);
            return;
        }
        
        [...history].sort((a,b) => b.timestamp - a.timestamp).forEach(item => {
            const el = document.createElement('div');
            el.className = 'history-item';
            
            const parts = [];
            if (item.reward.money > 0) parts.push(`<img src="https://avatars.mds.yandex.net/i?id=d2747e92b4fb93d8cee0b3582cb46ea6_l-5332707-images-thumbs&n=13" class="price-icon"> +${item.reward.money}`);
            if (item.reward.dilicks > 0) parts.push(`<img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" class="price-icon"> +${item.reward.dilicks}`);
            if (item.reward.skin) parts.push(`✨ +скин`);
            
            el.innerHTML = `<div class="history-code">${item.code}</div><div class="history-reward">${parts.join(' ')}</div><div class="history-date">${item.date}</div>`;
            this.promocodesHistory.appendChild(el);
        });
    }
}

class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || {};
        this.currentUser = null;
    }

    register(username, password) {
        if (this.users[username]) return { success: false, message: 'Пользователь уже существует' };
        const data = { clicks:0, money:1000, dilicks:500, clickPower:1, autoClickerLevel:0, critChance:5, inventory:['classic'], currentSkin:'classic', seasonLevel:1, seasonExp:0, playtime:0, premiumPass:false, completedAchievements:[], activatedPromocodes:[], promocodesHistory:[], lastSave:Date.now() };
        this.users[username] = { password, data };
        localStorage.setItem('users', JSON.stringify(this.users));
        return { success: true, message: 'Регистрация успешна' };
    }

    login(username, password) {
        const user = this.users[username];
        if (!user || user.password !== password) return { success: false, message: 'Неверный логин или пароль' };
        this.currentUser = username;
        localStorage.setItem('currentUser', username);
        return { success: true, message: 'Вход выполнен' };
    }

    logout() { this.currentUser = null; localStorage.removeItem('currentUser'); }
    saveUserData(d) { if (this.currentUser) { this.users[this.currentUser].data = d; localStorage.setItem('users', JSON.stringify(this.users)); } }
    loadUserData() { return this.currentUser ? this.users[this.currentUser]?.data : null; }
}

document.addEventListener('DOMContentLoaded', () => new ClickerGame());