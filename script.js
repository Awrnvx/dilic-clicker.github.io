// script.js - ПОЛНАЯ ВЕРСИЯ С ПРОВЕРКОЙ АДМИНА

class ClickerGame {
    constructor() {
        this.userData = null;
        this.autoClickerInterval = null;
        this.playtimeInterval = null;
        this.bubbleFrame = null;
        this.lastBubbleTime = 0;
        this.settings = null;
        this.wheel = null;
        this.compensationShown = false;
        
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
            'wheel_dragon_skin': {
                name: 'Колесный дракон',
                price: 0,
                image: 'https://static.wikia.nocookie.net/59310fd4-7c46-4895-930e-6cea7982a142/scale-to-width/755',
                description: 'Особенный скин дракона (×250 множитель)',
                currency: 'special'
            }
        };
        
        // Достижения
        this.achievementsData = [
            { id: 'firstClick', name: 'Первый шаг', description: 'Сделайте первый клик', icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png', condition: (data) => data.clicks >= 1, reward: { money: 100, dilicks: 10 } },
            { id: 'clicker100', name: 'Начинающий кликер', description: 'Сделайте 100 кликов', icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png', condition: (data) => data.clicks >= 100, reward: { money: 500, dilicks: 50 } },
            { id: 'clicker1000', name: 'Опытный кликер', description: 'Сделайте 1000 кликов', icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png', condition: (data) => data.clicks >= 1000, reward: { money: 2000, dilicks: 200 } },
            { id: 'richMan', name: 'Богач', description: 'Накопите 10000 денег', icon: 'https://avatars.mds.yandex.net/i?id=d2747e92b4fb93d8cee0b3582cb46ea6_l-5332707-images-thumbs&n=13', condition: (data) => data.money >= 10000, reward: { money: 0, dilicks: 500 } },
            { id: 'dilicMaster', name: 'Мастер диликов', description: 'Накопите 5000 диликов', icon: 'https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg', condition: (data) => data.dilicks >= 5000, reward: { money: 5000, dilicks: 0 } },
            { id: 'skinCollector', name: 'Коллекционер', description: 'Соберите все 5 скинов', icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png', condition: (data) => data.inventory && data.inventory.length >= 5, reward: { money: 35000, dilicks: 0 } },
            { id: 'critMaster', name: 'Повелитель критов', description: 'Увеличьте шанс крита до 50%', icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png', condition: (data) => data.critChance >= 50, reward: { money: 2000, dilicks: 200 } },
            { id: 'autoClickerMaster', name: 'Автоматизация', description: 'Купите 10 уровней автокликера', icon: 'https://cdn-icons-png.flaticon.com/512/4366/4366891.png', condition: (data) => data.autoClickerLevel >= 10, reward: { money: 5000, dilicks: 500 } },
            { id: 'wheelMaster', name: 'Властелин колеса', description: 'Получите особенного скина из колеса фортуны', icon: 'https://static.wikia.nocookie.net/59310fd4-7c46-4895-930e-6cea7982a142/scale-to-width/755', condition: (data) => data.inventory && data.inventory.includes('wheel_dragon_skin'), reward: { money: 10000, dilicks: 5000 } }
        ];
        
        // Промокоды
        this.promocodesData = {
            'WELCOME': { code: 'WELCOME', reward: { money: 500, dilicks: 100 }, description: 'Приветственный бонус', maxActivations: 1, expiryDate: null },
            'DILICKS100': { code: 'DILICKS100', reward: { money: 0, dilicks: 100 }, description: '100 диликов в подарок', maxActivations: 1, expiryDate: null },
            'MONEY1000': { code: 'MONEY1000', reward: { money: 1000, dilicks: 0 }, description: '1000 монет', maxActivations: 1, expiryDate: null },
            'CLICKER2024': { code: 'CLICKER2024', reward: { money: 500, dilicks: 50 }, description: 'Новогодний промокод', maxActivations: 1, expiryDate: new Date('2024-12-31').getTime() },
            'SUPERBONUS': { code: 'SUPERBONUS', reward: { money: 2000, dilicks: 200 }, description: 'Супер бонус', maxActivations: 1, expiryDate: null },
            'NEONLOVER': { code: 'NEONLOVER', reward: { money: 1500, dilicks: 150 }, description: 'Для любителей неона', maxActivations: 1, expiryDate: null },
            'MONSTERS-SKIN': { code: 'MONSTERS-SKIN', reward: { money: 0, dilicks: 0, skin: 'monsters_skin' }, description: 'Скин монстра в подарок!', maxActivations: 1, expiryDate: null },
            'DRAGON-SKIN': { code: 'DRAGON-SKIN', reward: { money: 0, dilicks: 0, skin: 'dragon_skin' }, description: 'Скин дракона в подарок!', maxActivations: 1, expiryDate: null }
        };
        
        this.init();
    }

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
                console.log('✅ Данные загружены');
                await this.checkCompensation();
            } else {
                localStorage.clear();
                window.location.href = 'register.html';
                return;
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
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
        
        this.settings = new Settings(this);
        this.checkIfCreator(); // 👈 ПРОВЕРКА АДМИНА
        
        this.updateUI();
        this.updateInventory();
        this.updateShopStatus();
        this.updateUpgradePrices();
        this.updatePromocodesList();
        this.updatePromocodesHistory();
        this.updateLeaderboard('clicks');
    }

    // ===== ПРОВЕРКА АДМИНА =====
    checkIfCreator() {
        const userId = localStorage.getItem('userId');
        const adminLink = document.getElementById('adminLinkBtn');
        const creatorId = '-Onbl-wmWqYsAV-cYUWm'; // ТВОЙ ID
        
        if (userId === creatorId && adminLink) {
            adminLink.style.display = 'inline-block';
            console.log('👑 Админ-кнопка активирована');
        }
    }

    async checkCompensation() {
        if (this.userData.compensationReceived) return;
        
        const hasOldCollector = this.userData.completedAchievements?.includes('skinCollector');
        const currentSkinCount = this.userData.inventory?.length || 0;
        
        if ((hasOldCollector || currentSkinCount >= 4) && !this.userData.compensationReceived) {
            this.showCompensationDialog();
        }
    }

    showCompensationDialog() {
        if (this.compensationShown) return;
        this.compensationShown = true;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width:450px; background:rgba(20,25,35,0.95); border:2px solid gold; border-radius:50px; padding:30px; text-align:center;">
                <h2 style="color:gold; font-size:2rem;">🎁 БОНУС ОБНОВЛЕНИЯ</h2>
                <div style="margin:20px 0;">
                    <img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" style="width:60px;height:60px;border-radius:50%;">
                    <p style="color:white;">В игру добавлен 5-й скин!</p>
                    <div style="background:rgba(255,215,0,0.1); border-radius:30px; padding:15px;">
                        <span style="color:gold; font-size:2rem;">+4500</span>
                        <img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" style="width:30px;height:30px;border-radius:50%;">
                    </div>
                </div>
                <div style="display:flex; gap:15px; justify-content:center;">
                    <button class="modal-btn confirm" id="claimCompensation" style="background:rgba(76,175,80,0.2); border:1px solid #4CAF50; padding:12px 30px; border-radius:40px;">ПОЛУЧИТЬ</button>
                    <button class="modal-btn cancel" id="closeCompensation" style="background:rgba(255,255,255,0.1); padding:12px 30px; border-radius:40px;">ПОЗЖЕ</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('claimCompensation').onclick = () => { this.claimCompensation(); modal.remove(); };
        document.getElementById('closeCompensation').onclick = () => modal.remove();
    }

    async claimCompensation() {
        this.userData.dilicks += 4500;
        this.userData.compensationReceived = true;
        await this.saveGame();
        this.updateUI();
        this.showNotification('✅ +4500 диликов получено!', 'success');
    }

    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `settings-toast ${type}`;
        toast.innerHTML = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
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
        this.navToggleBtn = document.getElementById('navToggleBtn');
        this.navLinks = document.querySelector('.nav-links');
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.onclick = () => this.logout();
    }

    setupEventListeners() {
        this.navBtns.forEach(btn => btn.onclick = () => this.switchTab(btn.dataset.tab));
        if (this.clickButton) this.clickButton.onclick = (e) => this.handleClick(e);
        this.buyBtns.forEach(btn => btn.onclick = (e) => { e.stopPropagation(); this.buyItem(btn.dataset.item, parseInt(btn.dataset.price)); });
        this.upgradeBtns.forEach(btn => btn.onclick = (e) => { const item = e.target.closest('.upgrade-item'); if (item) this.buyUpgrade(item.dataset.upgrade); });
        this.leaderboardBtns.forEach(btn => btn.onclick = () => { this.leaderboardBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); this.updateLeaderboard(btn.dataset.leaderboard); });
        if (this.buyPremiumBtn) this.buyPremiumBtn.onclick = () => this.buyPremiumPass();
        if (this.activatePromocodeBtn) this.activatePromocodeBtn.onclick = () => this.activatePromocode();
        if (this.promocodeInput) this.promocodeInput.onkeypress = (e) => { if (e.key === 'Enter') this.activatePromocode(); };
        if (this.navToggleBtn) this.navToggleBtn.onclick = () => { this.navLinks.classList.toggle('hidden'); const icon = this.navToggleBtn.querySelector('.toggle-icon'); icon.textContent = this.navLinks.classList.contains('hidden') ? '▶' : '◀'; };
    }

    switchTab(tabId) {
        this.navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        this.tabs.forEach(tab => tab.classList.toggle('active', tab.id === tabId));
        if (tabId === 'inventory') this.updateInventory();
        if (tabId === 'upgrades') this.updateUpgradePrices();
        if (tabId === 'profile') this.updateProfile();
        if (tabId === 'settings' && this.settings) this.settings.updateUI();
        if (tabId === 'promocodes') { this.updatePromocodesList(); this.updatePromocodesHistory(); }
        if (tabId === 'leaderboard') { const active = document.querySelector('.leaderboard-tabs .active'); this.updateLeaderboard(active ? active.dataset.leaderboard : 'clicks'); }
        if (tabId === 'wheel' && !this.wheel) this.wheel = new WheelOfFortune(this);
    }

    handleClick(e) {
        let clickPower = this.userData.clickPower;
        if (this.userData.currentSkin === 'wheel_dragon_skin') clickPower *= 250;
        
        if (Math.random() * 100 < this.userData.critChance) {
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
        if (item === 'wheel_dragon_skin') { alert('❌ Только в колесе фортуны!'); return; }
        if (item === 'dragon_skin') {
            if (this.userData.dilicks < price) { alert(`❌ Нужно ${price} диликов`); return; }
            this.userData.dilicks -= price;
        } else {
            if (this.userData.money < price) { alert(`❌ Нужно ${price} денег`); return; }
            this.userData.money -= price;
        }
        if (!this.userData.inventory.includes(item)) this.userData.inventory.push(item);
        this.userData.currentSkin = item;
        if (this.clickIcon) this.clickIcon.src = this.skinsData[item].image;
        this.updateUI();
        await this.saveGame();
        this.updateInventory();
        this.updateShopStatus();
        this.checkAchievements();
        alert(`✅ Куплен: ${this.skinsData[item].name}`);
    }

    async buyUpgrade(type) {
        let level, price;
        switch(type) {
            case 'clickPower':
                level = this.userData.clickPower;
                price = 50 + (level - 1) * 25;
                if (this.userData.dilicks >= price) {
                    this.userData.dilicks -= price;
                    this.userData.clickPower++;
                    alert(`✅ Усилитель клика до ${this.userData.clickPower} уровня`);
                } else { alert(`❌ Нужно ${price} диликов`); return; }
                break;
            case 'autoClicker':
                level = this.userData.autoClickerLevel;
                price = 100 + level * 100;
                if (this.userData.dilicks >= price) {
                    this.userData.dilicks -= price;
                    this.userData.autoClickerLevel++;
                    this.restartAutoClicker();
                    alert(`✅ Автокликер до ${this.userData.autoClickerLevel} уровня`);
                } else { alert(`❌ Нужно ${price} диликов`); return; }
                break;
            case 'critChance':
                level = this.userData.critChance;
                price = 200 + ((level - 5) / 5) * 50;
                if (this.userData.dilicks >= price) {
                    this.userData.dilicks -= price;
                    this.userData.critChance += 5;
                    alert(`✅ Шанс крита до ${this.userData.critChance}%`);
                } else { alert(`❌ Нужно ${price} диликов`); return; }
                break;
            default: return;
        }
        this.updateUpgradePrices();
        this.updateUI();
        await this.saveGame();
        this.checkAchievements();
    }

    updateUpgradePrices() {
        document.querySelectorAll('.upgrade-item').forEach(item => {
            const type = item.dataset.upgrade;
            const priceEl = item.querySelector('.price-value');
            const levelEl = item.querySelector('.upgrade-level');
            if (!priceEl || !levelEl) return;
            if (type === 'clickPower') { levelEl.textContent = this.userData.clickPower; priceEl.textContent = 50 + (this.userData.clickPower - 1) * 25; }
            else if (type === 'autoClicker') { levelEl.textContent = this.userData.autoClickerLevel; priceEl.textContent = 100 + this.userData.autoClickerLevel * 100; }
            else if (type === 'critChance') { levelEl.textContent = this.userData.critChance + '%'; priceEl.textContent = 200 + ((this.userData.critChance - 5) / 5) * 50; }
        });
    }

    updateShopStatus() {
        document.querySelectorAll('.shop-item').forEach(item => {
            const skinId = item.dataset.skin;
            const statusEl = document.getElementById(`status-${skinId}`);
            const buyBtn = item.querySelector('.buy-btn');
            if (this.userData.inventory?.includes(skinId)) {
                if (statusEl) statusEl.textContent = 'В инвентаре';
                if (buyBtn) { buyBtn.textContent = 'Куплено'; buyBtn.disabled = true; buyBtn.classList.add('disabled'); }
            } else {
                if (statusEl) statusEl.textContent = 'Не куплено';
                if (buyBtn) { buyBtn.textContent = 'Купить'; buyBtn.disabled = false; buyBtn.classList.remove('disabled'); }
            }
        });
    }

    updateInventory() {
        if (!this.inventoryGrid) return;
        this.inventoryGrid.innerHTML = '';
        const inventory = [...(this.userData.inventory || ['classic'])];
        if (!inventory.includes('classic')) inventory.unshift('classic');
        inventory.forEach(skinId => {
            const skin = this.skinsData[skinId];
            if (!skin) return;
            const card = document.createElement('div');
            card.className = `glass-card inventory-item ${this.userData.currentSkin === skinId ? 'active' : ''}`;
            card.innerHTML = `
                <div class="skin-preview"><img src="${skin.image}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/4366/4366891.png'"></div>
                <h3>${skin.name}</h3>
                <p class="skin-description">${skin.description}</p>
                ${this.userData.currentSkin === skinId ? '<p class="skin-equipped">✅ ЭКИПИРОВАНО</p>' : '<button class="glass-btn equip-btn">ЭКИПИРОВАТЬ</button>'}
            `;
            const equipBtn = card.querySelector('.equip-btn');
            if (equipBtn) equipBtn.onclick = (e) => { e.stopPropagation(); this.equipSkin(skinId); };
            this.inventoryGrid.appendChild(card);
        });
    }

    async equipSkin(skinId) {
        this.userData.currentSkin = skinId;
        if (this.clickIcon) this.clickIcon.src = this.skinsData[skinId].image;
        await this.saveGame();
        this.updateInventory();
        this.createClickEffect(window.innerWidth / 2, window.innerHeight / 2, `✨ ${this.skinsData[skinId].name} ✨`);
        if (this.clickIcon) { this.clickIcon.style.transform = 'scale(0.8)'; setTimeout(() => { if (this.clickIcon) this.clickIcon.style.transform = 'scale(1)'; }, 200); }
    }

    startAutoClicker() {
        if (this.autoClickerInterval) clearInterval(this.autoClickerInterval);
        this.autoClickerInterval = setInterval(() => {
            if (this.userData.autoClickerLevel > 0) {
                for (let i = 0; i < this.userData.autoClickerLevel; i++) {
                    let power = this.userData.clickPower;
                    if (this.userData.currentSkin === 'wheel_dragon_skin') power *= 250;
                    this.userData.clicks++;
                    this.userData.money += power;
                    this.userData.dilicks++;
                    this.addSeasonExp(power);
                }
                this.updateUI();
                this.saveGame();
                this.checkAchievements();
            }
        }, 1000);
    }

    restartAutoClicker() { this.startAutoClicker(); }

    startPlaytimeTracker() {
        if (this.playtimeInterval) clearInterval(this.playtimeInterval);
        this.playtimeInterval = setInterval(() => { this.userData.playtime++; this.updatePlaytimeDisplay(); this.saveGame(); }, 1000);
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
        let needed = 100 + (this.userData.seasonLevel * 50);
        while (this.userData.seasonExp >= needed && this.userData.seasonLevel < 50) {
            this.userData.seasonExp -= needed;
            this.userData.seasonLevel++;
            this.userData.money += 100;
            this.userData.dilicks += 10;
            needed = 100 + (this.userData.seasonLevel * 50);
        }
        if (this.seasonProgress && this.seasonLevel) {
            this.seasonProgress.style.width = ((this.userData.seasonExp / needed) * 100) + '%';
            this.seasonLevel.textContent = this.userData.seasonLevel;
        }
    }

    async buyPremiumPass() {
        if (this.userData.dilicks >= 500) {
            this.userData.dilicks -= 500;
            this.userData.premiumPass = true;
            this.updateUI();
            await this.saveGame();
            alert('✅ Премиум пропуск активирован!');
        } else { alert('❌ Нужно 500 диликов'); }
    }

    async updateLeaderboard(type) {
        if (!this.leaderboardBody) return;
        this.leaderboardBody.innerHTML = '得到了<td colspan="3">Загрузка...</td>⁠';
        try {
            const snapshot = await firebase.database().ref('users').once('value');
            if (!snapshot.exists()) { this.leaderboardBody.innerHTML = '<tr><td colspan="3">Нет данных</td></tr>'; return; }
            const users = snapshot.val();
            const leaderboard = [];
            for (let [id, userData] of Object.entries(users)) {
                let value = 0;
                if (type === 'clicks') value = userData.clicks || 0;
                else if (type === 'money') value = userData.money || 0;
                else if (type === 'playtime') value = userData.playtime || 0;
                const name = userData.settings?.displayName || userData.username;
                leaderboard.push({ username: name, value, real: userData.username });
            }
            leaderboard.sort((a, b) => b.value - a.value);
            this.leaderboardBody.innerHTML = '';
            leaderboard.slice(0, 50).forEach((entry, i) => {
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1;
                const row = document.createElement('tr');
                if (entry.real === localStorage.getItem('currentUser')) row.style.background = 'rgba(255,215,0,0.1)';
                row.innerHTML = `<td>${medal}</td><td>${entry.username}${entry.real === localStorage.getItem('currentUser') ? ' 👑' : ''}</td><td>${this.formatLeaderboardValue(entry.value, type)}</td>`;
                this.leaderboardBody.appendChild(row);
            });
        } catch (error) {
            this.leaderboardBody.innerHTML = '<tr><td colspan="3">Ошибка загрузки</td></tr>';
        }
    }

    formatLeaderboardValue(value, type) {
        if (type === 'playtime') { const h = Math.floor(value / 3600); const m = Math.floor((value % 3600) / 60); return `${h}ч ${m}м`; }
        return value.toLocaleString();
    }

    async updateUI() {
        const name = this.userData.settings?.displayName || this.userData.username;
        if (this.usernameDisplay) this.usernameDisplay.textContent = name;
        if (this.moneySpan) this.moneySpan.textContent = this.userData.money.toLocaleString();
        if (this.dilicksSpan) this.dilicksSpan.textContent = this.userData.dilicks.toLocaleString();
        if (this.clicksSpan) this.clicksSpan.textContent = this.userData.clicks.toLocaleString();
        if (this.clickPowerSpan) this.clickPowerSpan.textContent = this.userData.clickPower;
        this.updatePlaytimeDisplay();
        const needed = 100 + (this.userData.seasonLevel * 50);
        if (this.seasonProgress) this.seasonProgress.style.width = ((this.userData.seasonExp / needed) * 100) + '%';
        if (this.seasonLevel) this.seasonLevel.textContent = this.userData.seasonLevel;
        if (document.getElementById('profile')?.classList.contains('active')) this.updateProfile();
        if (this.wheel?.balanceSpan) this.wheel.balanceSpan.textContent = this.userData.dilicks.toLocaleString();
    }

    async saveGame() {
        const userId = localStorage.getItem('userId');
        if (userId && this.userData) await firebase.database().ref('users/' + userId).update(this.userData);
    }

    async logout() {
        if (this.bubbleFrame) cancelAnimationFrame(this.bubbleFrame);
        if (this.autoClickerInterval) clearInterval(this.autoClickerInterval);
        if (this.playtimeInterval) clearInterval(this.playtimeInterval);
        localStorage.clear();
        window.location.href = 'register.html';
    }

    createBubble() {
        if (document.querySelectorAll('.bubble').length > 10) return;
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = (window.innerWidth <= 768 ? Math.random() * 30 + 10 : Math.random() * 50 + 20);
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.bottom = '-50px';
        bubble.style.animationDuration = (window.innerWidth <= 768 ? 3 + Math.random() * 2 : 4 + Math.random() * 3) + 's';
        document.body.appendChild(bubble);
        setTimeout(() => bubble.remove(), 8000);
    }

    startBubbles() {
        const interval = 2500;
        const fn = (time) => { if (time - this.lastBubbleTime >= interval) { this.createBubble(); this.lastBubbleTime = time; } this.bubbleFrame = requestAnimationFrame(fn); };
        this.bubbleFrame = requestAnimationFrame(fn);
    }

    checkAchievements() {
        if (!this.userData.completedAchievements) this.userData.completedAchievements = [];
        let unlocked = false;
        this.achievementsData.forEach(ach => {
            if (!this.userData.completedAchievements.includes(ach.id) && ach.condition(this.userData)) {
                this.userData.completedAchievements.push(ach.id);
                this.userData.money += ach.reward.money;
                this.userData.dilicks += ach.reward.dilicks;
                unlocked = true;
                this.showAchievementNotification(ach);
            }
        });
        if (unlocked) { this.saveGame(); this.updateUI(); if (document.getElementById('profile')?.classList.contains('active')) this.updateProfile(); }
    }

    updateProfile() {
        if (!this.profileUsername) return;
        const name = this.userData.settings?.displayName || this.userData.username;
        this.profileUsername.textContent = name;
        this.profileLevel.textContent = this.userData.seasonLevel;
        this.profileClicks.textContent = this.userData.clicks.toLocaleString();
        this.profileMoney.textContent = this.userData.money.toLocaleString();
        this.profileDilicks.textContent = this.userData.dilicks.toLocaleString();
        const h = Math.floor(this.userData.playtime / 3600);
        const m = Math.floor((this.userData.playtime % 3600) / 60);
        this.profilePlaytime.textContent = `${h}ч ${m}м`;
        if (this.profileAvatar && this.userData.currentSkin) this.profileAvatar.src = this.skinsData[this.userData.currentSkin].image;
        this.renderAchievements();
        this.updateSkinStats();
    }

    renderAchievements() {
        if (!this.achievementsGrid) return;
        this.achievementsGrid.innerHTML = '';
        this.achievementsData.forEach(ach => {
            const done = this.userData.completedAchievements?.includes(ach.id);
            const progress = this.calcAchieveProgress(ach);
            const card = document.createElement('div');
            card.className = `achievement-card ${done ? 'completed' : ''}`;
            card.innerHTML = `
                <div class="achievement-icon ${!done ? 'locked' : ''}"><img src="${ach.icon}"></div>
                <h3 class="achievement-title">${ach.name}</h3>
                <p class="achievement-desc">${ach.description}</p>
                <div class="achievement-progress"><div class="achievement-progress-bar"><div class="achievement-progress-fill" style="width:${progress}%"></div></div><div class="achievement-progress-text">${done ? 'Выполнено' : Math.round(progress) + '%'}</div></div>
            `;
            this.achievementsGrid.appendChild(card);
        });
    }

    calcAchieveProgress(ach) {
        if (this.userData.completedAchievements?.includes(ach.id)) return 100;
        switch(ach.id) {
            case 'firstClick': return Math.min(100, (this.userData.clicks / 1) * 100);
            case 'clicker100': return Math.min(100, (this.userData.clicks / 100) * 100);
            case 'clicker1000': return Math.min(100, (this.userData.clicks / 1000) * 100);
            case 'richMan': return Math.min(100, (this.userData.money / 10000) * 100);
            case 'dilicMaster': return Math.min(100, (this.userData.dilicks / 5000) * 100);
            case 'skinCollector': return Math.min(100, ((this.userData.inventory?.length || 0) / Object.keys(this.skinsData).length) * 100);
            case 'critMaster': return Math.min(100, (this.userData.critChance / 50) * 100);
            case 'autoClickerMaster': return Math.min(100, (this.userData.autoClickerLevel / 10) * 100);
            case 'wheelMaster': return this.userData.inventory?.includes('wheel_dragon_skin') ? 100 : 0;
            default: return 0;
        }
    }

    showAchievementNotification(ach) {
        const notif = document.createElement('div');
        notif.className = 'achievement-notification';
        let reward = '';
        if (ach.reward.money > 0) reward += `+${ach.reward.money} 💰 `;
        if (ach.reward.dilicks > 0) reward += `+${ach.reward.dilicks} 💎`;
        notif.innerHTML = `<div class="notification-icon"><img src="${ach.icon}"></div><div class="notification-content"><h4>Достижение получено!</h4><p>${ach.name}</p><p class="notification-reward">${reward}</p></div>`;
        document.body.appendChild(notif);
        setTimeout(() => notif.classList.add('show'), 100);
        setTimeout(() => { notif.classList.remove('show'); setTimeout(() => notif.remove(), 300); }, 3000);
    }

    updateSkinStats() {
        if (!this.ownedSkinsList) return;
        const total = Object.keys(this.skinsData).length;
        const owned = this.userData.inventory?.length || 0;
        if (this.skinProgressFill) { this.skinProgressFill.style.width = (owned / total * 100) + '%'; this.skinProgressFill.style.background = 'linear-gradient(90deg, #ffd700, #ffaa00, #ffd700)'; }
        if (this.ownedSkins) { this.ownedSkins.textContent = owned; this.ownedSkins.style.color = 'gold'; }
        if (this.totalSkins) { this.totalSkins.textContent = total; this.totalSkins.style.color = 'gold'; }
        this.ownedSkinsList.innerHTML = '';
        Object.entries(this.skinsData).forEach(([id, skin]) => {
            if (this.userData.inventory?.includes(id)) {
                const tag = document.createElement('div');
                tag.className = `skin-tag ${this.userData.currentSkin === id ? 'active' : ''}`;
                tag.innerHTML = `<img src="${skin.image}"><span>${skin.name}</span>`;
                this.ownedSkinsList.appendChild(tag);
            }
        });
    }

    activatePromocode() {
        if (!this.promocodeInput) return;
        const code = this.promocodeInput.value.trim().toUpperCase();
        if (!code) { this.showPromocodeMessage('Введите промокод', 'error'); return; }
        const promo = this.promocodesData[code];
        if (!promo) { this.showPromocodeMessage('Промокод не найден', 'error'); return; }
        if (promo.expiryDate && Date.now() > promo.expiryDate) { this.showPromocodeMessage('Срок истек', 'error'); return; }
        if (this.userData.activatedPromocodes?.includes(code)) { this.showPromocodeMessage('Уже активирован', 'error'); return; }
        let msg = '';
        if (promo.reward.money) { this.userData.money += promo.reward.money; msg += `+${promo.reward.money}💰 `; }
        if (promo.reward.dilicks) { this.userData.dilicks += promo.reward.dilicks; msg += `+${promo.reward.dilicks}💎 `; }
        if (promo.reward.skin) {
            const skinId = promo.reward.skin;
            if (!this.userData.inventory.includes(skinId)) { this.userData.inventory.push(skinId); msg += `+скин "${this.skinsData[skinId].name}" ✨`; }
            else { this.userData.dilicks += 100; msg += `+100💎 (скин уже был)`; }
        }
        if (!this.userData.activatedPromocodes) this.userData.activatedPromocodes = [];
        this.userData.activatedPromocodes.push(code);
        if (!this.userData.promocodesHistory) this.userData.promocodesHistory = [];
        const now = new Date();
        this.userData.promocodesHistory.push({ code, reward: promo.reward, date: `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()}`, timestamp: Date.now() });
        this.saveGame();
        this.updateUI();
        this.updateInventory();
        this.updatePromocodesList();
        this.updatePromocodesHistory();
        this.showPromocodeMessage(`Активирован! ${msg}`, 'success');
        this.promocodeInput.value = '';
        this.checkAchievements();
    }

    showPromocodeMessage(text, type) {
        if (!this.promocodeMessage) return;
        this.promocodeMessage.innerHTML = text;
        this.promocodeMessage.className = 'promocode-message ' + type;
        setTimeout(() => { if (this.promocodeMessage) { this.promocodeMessage.innerHTML = ''; this.promocodeMessage.className = 'promocode-message'; } }, 3000);
    }

    updatePromocodesList() {
        if (!this.promocodesList) return;
        this.promocodesList.innerHTML = '';
        Object.values(this.promocodesData).forEach(promo => {
            if (this.userData.activatedPromocodes?.includes(promo.code)) return;
            if (promo.expiryDate && Date.now() > promo.expiryDate) return;
            const item = document.createElement('div');
            item.className = 'promocode-item';
            let parts = [];
            if (promo.reward.money) parts.push(`<img src="https://avatars.mds.yandex.net/i?id=d2747e92b4fb93d8cee0b3582cb46ea6_l-5332707-images-thumbs&n=13" class="price-icon"> +${promo.reward.money}`);
            if (promo.reward.dilicks) parts.push(`<img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" class="price-icon"> +${promo.reward.dilicks}`);
            if (promo.reward.skin) parts.push(`✨ +скин`);
            item.innerHTML = `<div class="promocode-code">${promo.code}</div><div class="promocode-reward">${parts.join(' ')}</div>`;
            item.onclick = () => { if (this.promocodeInput) { this.promocodeInput.value = promo.code; this.promocodeInput.focus(); } };
            this.promocodesList.appendChild(item);
        });
        if (this.promocodesList.children.length === 0) { const empty = document.createElement('div'); empty.className = 'empty-history'; empty.textContent = 'Нет доступных промокодов'; this.promocodesList.appendChild(empty); }
    }

    updatePromocodesHistory() {
        if (!this.promocodesHistory) return;
        this.promocodesHistory.innerHTML = '';
        const history = this.userData.promocodesHistory || [];
        if (history.length === 0) { const empty = document.createElement('div'); empty.className = 'empty-history'; empty.textContent = 'История пуста'; this.promocodesHistory.appendChild(empty); return; }
        history.sort((a, b) => b.timestamp - a.timestamp).forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            let parts = [];
            if (item.reward.money) parts.push(`<img src="https://avatars.mds.yandex.net/i?id=d2747e92b4fb93d8cee0b3582cb46ea6_l-5332707-images-thumbs&n=13" class="price-icon"> +${item.reward.money}`);
            if (item.reward.dilicks) parts.push(`<img src="https://i.pinimg.com/736x/df/49/fd/df49fd562d564016dcc4070b5e83c521.jpg" class="price-icon"> +${item.reward.dilicks}`);
            if (item.reward.skin) parts.push(`✨ +скин`);
            div.innerHTML = `<div class="history-code">${item.code}</div><div class="history-reward">${parts.join(' ')}</div><div class="history-date">${item.date}</div>`;
            this.promocodesHistory.appendChild(div);
        });
    }
}

// ========== КЛАСС НАСТРОЕК ==========
class Settings {
    constructor(game) { this.game = game; this.init(); }
    init() { this.loadSettings(); this.setupEventListeners(); this.updateUI(); }
    loadSettings() { if (!this.game.userData.settings) this.game.userData.settings = { displayName: this.game.userData.username, theme: 'dark', notifications: true, sound: true, animations: true, language: 'ru' }; }
    setupEventListeners() {
        const save = document.getElementById('saveDisplayName'); if (save) save.onclick = () => this.saveDisplayName();
        const pass = document.getElementById('changePasswordBtn'); if (pass) pass.onclick = () => this.changePassword();
        const theme = document.getElementById('themeSelect'); if (theme) theme.onchange = (e) => this.saveTheme(e.target.value);
        const notif = document.getElementById('notificationsEnabled'); if (notif) notif.onchange = (e) => { this.game.userData.settings.notifications = e.target.checked; this.game.saveGame(); this.showToast('✅ Настройки сохранены', 'success'); };
        const sound = document.getElementById('soundEnabled'); if (sound) sound.onchange = (e) => { this.game.userData.settings.sound = e.target.checked; this.game.saveGame(); this.showToast('✅ Настройки сохранены', 'success'); };
        const anim = document.getElementById('animationsEnabled'); if (anim) anim.onchange = (e) => { this.game.userData.settings.animations = e.target.checked; this.game.saveGame(); this.showToast('✅ Настройки сохранены', 'success'); };
        const lang = document.getElementById('languageSelect'); if (lang) lang.onchange = (e) => this.saveLanguage(e.target.value);
        const exp = document.getElementById('exportDataBtn'); if (exp) exp.onclick = () => this.exportData();
        const imp = document.getElementById('importDataBtn'); if (imp) imp.onclick = () => this.importData();
        const reset = document.getElementById('resetProgressBtn'); if (reset) reset.onclick = () => this.confirmResetProgress();
        const del = document.getElementById('deleteAccountBtn'); if (del) del.onclick = () => this.confirmDeleteAccount();
        const upd = document.getElementById('checkUpdatesBtn'); if (upd) upd.onclick = () => this.checkUpdates();
    }
    updateUI() {
        const name = document.getElementById('displayName'); if (name) name.value = this.game.userData.settings.displayName || this.game.userData.username;
        const user = document.getElementById('username'); if (user) user.value = this.game.userData.username;
        const theme = document.getElementById('themeSelect'); if (theme) theme.value = this.game.userData.settings.theme || 'dark';
        const notif = document.getElementById('notificationsEnabled'); if (notif) notif.checked = this.game.userData.settings.notifications !== false;
        const sound = document.getElementById('soundEnabled'); if (sound) sound.checked = this.game.userData.settings.sound !== false;
        const anim = document.getElementById('animationsEnabled'); if (anim) anim.checked = this.game.userData.settings.animations !== false;
        const lang = document.getElementById('languageSelect'); if (lang) lang.value = this.game.userData.settings.language || 'ru';
    }
    async saveDisplayName() {
        const input = document.getElementById('displayName');
        const newName = input.value.trim();
        if (!newName) { this.showToast('❌ Введите никнейм', 'error'); return; }
        if (newName.length > 20) { this.showToast('❌ Максимум 20 символов', 'error'); return; }
        this.game.userData.settings.displayName = newName;
        await this.game.saveGame();
        const profile = document.getElementById('profileUsername'); if (profile) profile.textContent = newName;
        const display = document.getElementById('usernameDisplay'); if (display) display.textContent = newName;
        this.showToast(`✅ Никнейм изменен на "${newName}"`, 'success');
    }
    async changePassword() {
        const old = document.getElementById('oldPassword').value;
        const newp = document.getElementById('newPassword').value;
        const conf = document.getElementById('confirmPassword').value;
        if (!old || !newp || !conf) { this.showToast('❌ Заполните все поля', 'error'); return; }
        if (newp !== conf) { this.showToast('❌ Пароли не совпадают', 'error'); return; }
        if (newp.length < 4) { this.showToast('❌ Минимум 4 символа', 'error'); return; }
        if (old !== this.game.userData.password) { this.showToast('❌ Неверный старый пароль', 'error'); return; }
        this.game.userData.password = newp;
        await this.game.saveGame();
        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        this.showToast('✅ Пароль изменен', 'success');
    }
    saveTheme(theme) {
        this.game.userData.settings.theme = theme;
        this.game.saveGame();
        const names = { dark: 'Тёмная', light: 'Светлая', auto: 'Как в системе' };
        this.showToast(`✅ Тема: ${names[theme] || theme}`, 'success');
        if (theme === 'light') document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        else if (theme === 'dark') document.body.style.background = 'linear-gradient(135deg, #0a0c15 0%, #121520 50%, #0a0c15 100%)';
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.body.style.background = 'linear-gradient(135deg, #0a0c15 0%, #121520 50%, #0a0c15 100%)';
        else document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    }
    async saveLanguage(lang) {
        this.game.userData.settings.language = lang;
        await this.game.saveGame();
        const names = { ru: 'Русский', en: 'English', tr: 'Türkçe', es: 'Español' };
        this.showToast(`✅ Язык: ${names[lang] || lang}`, 'success');
    }
    exportData() {
        try {
            const data = {
                username: this.game.userData.username,
                displayName: this.game.userData.settings?.displayName,
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
                settings: this.game.userData.settings
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const date = new Date();
            link.download = `dilic_clicker_${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.json`;
            link.click();
            URL.revokeObjectURL(url);
            this.showToast('✅ Данные экспортированы', 'success');
        } catch (e) { this.showToast('❌ Ошибка экспорта', 'error'); }
    }
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!confirm('⚠️ Импорт заменит текущий прогресс?')) return;
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                if (!this.validate(data)) { this.showToast('❌ Неверный формат', 'error'); return; }
                data.username = this.game.userData.username;
                data.password = this.game.userData.password;
                this.game.userData = data;
                await this.game.saveGame();
                this.updateUI();
                this.game.updateUI();
                this.game.updateInventory();
                this.game.updateShopStatus();
                this.game.updateUpgradePrices();
                this.showToast('✅ Данные импортированы', 'success');
            } catch (err) { this.showToast('❌ Ошибка импорта', 'error'); }
        };
        input.click();
    }
    validate(data) {
        const required = ['clicks', 'money', 'dilicks', 'clickPower', 'inventory', 'currentSkin'];
        for (const f of required) if (!(f in data)) return false;
        if (typeof data.clicks !== 'number' || typeof data.money !== 'number' || typeof data.dilicks !== 'number') return false;
        if (!Array.isArray(data.inventory)) return false;
        return true;
    }
    confirmResetProgress() { this.showModal('🔄 Сброс прогресса', 'Вы уверены? Все данные будут обнулены.', () => this.resetProgress()); }
    async resetProgress() {
        const username = this.game.userData.username;
        const password = this.game.userData.password;
        this.game.userData = {
            username, password,
            clicks: 0, money: 1000, dilicks: 500, clickPower: 1, autoClickerLevel: 0, critChance: 5,
            inventory: ['classic'], currentSkin: 'classic', seasonLevel: 1, seasonExp: 0, playtime: 0,
            premiumPass: false, completedAchievements: [], activatedPromocodes: [], promocodesHistory: [],
            compensationReceived: false, settings: this.game.userData.settings, lastSave: Date.now()
        };
        await this.game.saveGame();
        this.game.updateUI();
        this.game.updateInventory();
        this.game.updateShopStatus();
        this.game.updateUpgradePrices();
        this.updateUI();
        this.showToast('✅ Прогресс сброшен', 'success');
    }
    confirmDeleteAccount() { this.showModal('🗑️ Удаление аккаунта', 'Вы уверены? Данные будут потеряны навсегда.', () => this.deleteAccount()); }
    async deleteAccount() {
        const userId = localStorage.getItem('userId');
        if (userId) await firebase.database().ref('users/' + userId).remove();
        if (this.game.bubbleFrame) cancelAnimationFrame(this.game.bubbleFrame);
        if (this.game.autoClickerInterval) clearInterval(this.game.autoClickerInterval);
        if (this.game.playtimeInterval) clearInterval(this.game.playtimeInterval);
        localStorage.clear();
        window.location.href = 'register.html';
    }
    checkUpdates() { this.showToast('🔄 Версия 2.0.0 (последняя)', 'info'); }
    showToast(msg, type) {
        const toast = document.createElement('div');
        toast.className = `settings-toast ${type}`;
        toast.innerHTML = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
    }
    showModal(title, msg, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `<div class="modal-content"><h3>${title}</h3><p>${msg}</p><div class="modal-buttons"><button class="modal-btn confirm">Да</button><button class="modal-btn cancel">Отмена</button></div></div>`;
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
        modal.querySelector('.confirm').onclick = () => { onConfirm(); modal.classList.remove('active'); setTimeout(() => modal.remove(), 300); };
        modal.querySelector('.cancel').onclick = () => { modal.classList.remove('active'); setTimeout(() => modal.remove(), 300); };
    }
}

// ===== КОЛЕСО ФОРТУНЫ =====
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
        this.SKIN_ID = 'wheel_dragon_skin';
        this.rotation = 0;
        this.isSpinning = false;
        this.spinVelocity = 0;
        this.spinDeceleration = 0.985;
        this.spinActive = false;
        this.animationFrame = null;
        this.container = document.getElementById('wheelContainer');
        this.init();
    }
    init() { this.render(); this.setupEventListeners(); }
    render() {
        this.container.innerHTML = `
            <div class="wheel-card"><div class="wheel-header"><h2>✦ КОЛЕСО ФОРТУНЫ ✦</h2><p class="wheel-subtitle">Испытай удачу!</p><div class="wheel-price"><img src="${this.DILICKS_ICON}" class="wheel-price-icon"><span>${this.SPIN_COST} за крутку</span></div></div><div class="wheel-wrapper"><canvas id="wheelCanvas" width="450" height="450" class="wheel-canvas"></canvas><div class="wheel-pointer"></div><div class="wheel-pointer-center"></div></div><div class="wheel-controls"><button class="wheel-spin-btn" id="wheelSpinBtn"><span>🎡</span> КРУТИТЬ <span>🎡</span></button><div class="wheel-balance">Твой баланс: <span id="wheelBalance">${this.game.userData.dilicks.toLocaleString()}</span><img src="${this.DILICKS_ICON}" class="wheel-balance-icon"></div></div><div class="wheel-prizes"><div class="wheel-prize-item"><span class="wheel-prize-dot" style="background:#2e7d32"></span><span class="wheel-prize-text"><strong>50%</strong> 2.5k <img src="${this.MONEY_ICON}" class="wheel-prize-icon"></span></div><div class="wheel-prize-item"><span class="wheel-prize-dot" style="background:#f9a825"></span><span class="wheel-prize-text"><strong>35%</strong> 5.5k <img src="${this.MONEY_ICON}" class="wheel-prize-icon"></span></div><div class="wheel-prize-item"><span class="wheel-prize-dot" style="background:#ef6c00"></span><span class="wheel-prize-text"><strong>25%</strong> 8.5k <img src="${this.MONEY_ICON}" class="wheel-prize-icon"></span></div><div class="wheel-prize-item"><span class="wheel-prize-dot" style="background:#d32f2f"></span><span class="wheel-prize-text"><strong>15%</strong> 11.5k <img src="${this.MONEY_ICON}" class="wheel-prize-icon"></span></div><div class="wheel-prize-item"><span class="wheel-prize-dot" style="background:#7b1fa2"></span><span class="wheel-prize-text"><strong>5%</strong> 5k <img src="${this.DILICKS_ICON}" class="wheel-prize-icon"></span></div><div class="wheel-prize-item skin-prize"><div class="wheel-prize-skin-content"><span class="wheel-prize-dot" style="background:#c2185b"></span><span class="wheel-prize-text"><strong>2.5%</strong> СКИН ✨</span></div><div class="wheel-skin-btn" id="showSkinBtn">?</div></div></div><div class="wheel-result" id="wheelResult"><div class="wheel-result-label">ТВОЙ ВЫИГРЫШ</div><div class="wheel-result-value" id="wheelResultDisplay">НАЖМИ КРУТИТЬ</div></div></div>
            <div class="wheel-skin-modal" id="skinModal"><div class="wheel-modal-content"><span class="wheel-modal-close" id="closeModal">✕</span><h2 class="wheel-modal-title">✦ ОСОБЕННЫЙ СКИН ✦</h2><div class="wheel-skin-preview"><img src="https://static.wikia.nocookie.net/59310fd4-7c46-4895-930e-6cea7982a142/scale-to-width/755"></div><p class="wheel-skin-description">✨ Легендарный скин дракона<br><strong>×250 МНОЖИТЕЛЬ</strong><br>ко всем кликам</p><div class="wheel-multiplier">×250</div></div></div>
        `;
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.spinBtn = document.getElementById('wheelSpinBtn');
        this.balanceSpan = document.getElementById('wheelBalance');
        this.resultDisplay = document.getElementById('wheelResultDisplay');
        this.modal = document.getElementById('skinModal');
        this.drawWheel();
    }
    setupEventListeners() {
        if (this.spinBtn) this.spinBtn.onclick = () => this.spin();
        const showBtn = document.getElementById('showSkinBtn');
        const closeBtn = document.getElementById('closeModal');
        if (showBtn) showBtn.onclick = () => this.modal.style.display = 'flex';
        if (closeBtn) closeBtn.onclick = () => this.modal.style.display = 'none';
        window.onclick = (e) => { if (e.target === this.modal) this.modal.style.display = 'none'; };
    }
    drawWheel() {
        const w = this.canvas.width, h = this.canvas.height, cx = w/2, cy = h/2, r = Math.min(w, h) * 0.4;
        this.ctx.clearRect(0, 0, w, h);
        let start = this.rotation - Math.PI/2;
        for (let p of this.PRIZES) {
            const angle = (p.prob / 100) * 2 * Math.PI;
            const end = start + angle;
            this.ctx.beginPath();
            this.ctx.moveTo(cx, cy);
            this.ctx.arc(cx, cy, r, start, end);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            this.ctx.stroke();
            start = end;
        }
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r * 0.15, 0, 2*Math.PI);
        this.ctx.fillStyle = 'rgba(255,255,255,0.1)';
        this.ctx.fill();
    }
    spin() {
        if (this.isSpinning) return;
        if (this.game.userData.dilicks < this.SPIN_COST) { this.resultDisplay.innerHTML = '❌ Недостаточно диликов!'; return; }
        this.game.userData.dilicks -= this.SPIN_COST;
        this.balanceSpan.textContent = this.game.userData.dilicks.toLocaleString();
        this.game.updateUI();
        this.game.saveGame();
        this.spinVelocity = 0.45 + Math.random() * 0.3;
        this.spinDeceleration = 0.982 + Math.random() * 0.01;
        this.spinActive = true;
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.resultDisplay.innerHTML = '⏳ КРУТИТСЯ...';
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(() => this.spinAnim());
    }
    spinAnim() {
        if (!this.spinActive) return;
        this.rotation += this.spinVelocity;
        this.spinVelocity *= this.spinDeceleration;
        this.drawWheel();
        if (this.spinVelocity < 0.002) {
            this.spinActive = false;
            this.isSpinning = false;
            this.spinBtn.disabled = false;
            const norm = ((this.rotation % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
            let angle = (norm + Math.PI/2) % (2*Math.PI);
            let cum = 0;
            let selected = this.PRIZES[0];
            for (let p of this.PRIZES) {
                const slice = (p.prob / 100) * 2 * Math.PI;
                if (angle >= cum && angle < cum + slice) { selected = p; break; }
                cum += slice;
            }
            this.givePrize(selected);
            return;
        }
        this.animationFrame = requestAnimationFrame(() => this.spinAnim());
    }
    givePrize(prize) {
        let html = '';
        if (prize.type === 'skin') {
            if (!this.game.userData.inventory.includes(this.SKIN_ID)) {
                this.game.userData.inventory.push(this.SKIN_ID);
                html = '✨ ОСОБЕННЫЙ СКИН ✨';
                this.resultDisplay.style.color = '#ffb7c5';
                this.game.showAchievementNotification({ name: 'ОСОБЕННЫЙ СКИН', icon: this.game.skinsData[this.SKIN_ID].image, reward: { money: 0, dilicks: 0 } });
            } else {
                this.game.userData.dilicks += 10000;
                html = `<span>🎉 +10000</span><img src="${this.DILICKS_ICON}" class="wheel-result-icon"><span>(скин уже был)</span>`;
            }
        } else if (prize.type === 'money') {
            this.game.userData.money += prize.value;
            html = `<span>+${prize.value.toLocaleString()}</span><img src="${this.MONEY_ICON}" class="wheel-result-icon">`;
        } else {
            this.game.userData.dilicks += prize.value;
            html = `<span>+${prize.value.toLocaleString()}</span><img src="${this.DILICKS_ICON}" class="wheel-result-icon">`;
        }
        this.resultDisplay.innerHTML = html;
        this.balanceSpan.textContent = this.game.userData.dilicks.toLocaleString();
        this.game.updateUI();
        this.game.updateInventory();
        this.game.saveGame();
        this.game.checkAchievements();
        if (navigator.vibrate) navigator.vibrate(100);
    }
}

// ===== ЗАПУСК =====
document.addEventListener('DOMContentLoaded', () => {
    window.clickerGame = new ClickerGame();
});

// Обработчики для острова
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            if (tabId) {
                const navBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
                if (navBtn) navBtn.click();
            }
        });
    });
});

// Горячие клавиши
document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        const wheelBtn = document.querySelector('.nav-btn[data-tab="wheel"]');
        if (wheelBtn) {
            wheelBtn.click();
            wheelBtn.style.transform = 'scale(0.95)';
            setTimeout(() => { wheelBtn.style.transform = ''; }, 200);
        }
    }
});