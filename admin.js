// ========== АДМИН ПАНЕЛЬ ДЛЯ DILIC CLICKER ==========
// Использовать в консоли браузера (F12)
// Целевой игрок: -Onbl-wmWqYsAV-cYUWm

const AdminPanel = {
    // ID целевого игрока
    targetUserId: '-Onbl-wmWqYsAV-cYUWm',
    
    // Инициализация
    init() {
        console.log('🚀 Админ-панель загружена!');
        console.log('🎯 Целевой игрок:', this.targetUserId);
        console.log('📝 Доступные команды:');
        console.log('   AdminPanel.getData() - показать данные игрока');
        console.log('   AdminPanel.dilicks.set(1000) - установить дилики');
        console.log('   AdminPanel.dilicks.add(500) - добавить дилики');
        console.log('   AdminPanel.money.set(1000) - установить деньги');
        console.log('   AdminPanel.money.add(500) - добавить деньги');
        console.log('   AdminPanel.clicks.set(1000) - установить клики');
        console.log('   AdminPanel.clicks.add(500) - добавить клики');
        console.log('   AdminPanel.skins.list() - список доступных скинов');
        console.log('   AdminPanel.skins.give("dragon_skin") - дать скин');
        console.log('   AdminPanel.skins.remove("neon") - удалить скин');
        console.log('   AdminPanel.skins.equip("dragon_skin") - экипировать скин');
        console.log('   AdminPanel.reset() - сбросить прогресс');
        console.log('   AdminPanel.setUsername("new_name") - сменить логин');
        console.log('   AdminPanel.setPassword("new_pass") - сменить пароль');
    },
    
    // ===== ОСНОВНЫЕ КОМАНДЫ =====
    
    // Получить данные игрока
    async getData() {
        try {
            const snapshot = await firebase.database().ref('users/' + this.targetUserId).once('value');
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log('✅ ДАННЫЕ ИГРОКА:');
                console.log('   👤 Логин:', data.username);
                console.log('   🔑 Пароль:', data.password);
                console.log('   🖱️ Клики:', data.clicks);
                console.log('   💰 Деньги:', data.money);
                console.log('   💎 Дилики:', data.dilicks);
                console.log('   ⚡ Сила клика:', data.clickPower);
                console.log('   🤖 Автокликер:', data.autoClickerLevel);
                console.log('   🎯 Шанс крита:', data.critChance + '%');
                console.log('   📦 Инвентарь:', data.inventory);
                console.log('   ✨ Текущий скин:', data.currentSkin);
                console.log('   🏆 Сезон:', data.seasonLevel);
                console.log('   ⏱️ Время в игре:', data.playtime + ' сек');
                return data;
            } else {
                console.error('❌ Игрок не найден');
                return null;
            }
        } catch (error) {
            console.error('❌ Ошибка:', error);
        }
    },
    
    // ===== УПРАВЛЕНИЕ ДИЛИКАМИ =====
    
    dilicks: {
        // Установить точное количество
        async set(amount) {
            try {
                const userRef = firebase.database().ref('users/' + AdminPanel.targetUserId);
                const snapshot = await userRef.once('value');
                
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const oldBalance = userData.dilicks;
                    
                    await userRef.update({ dilicks: amount });
                    
                    console.log(`💰 DILICKS SET: ${oldBalance} → ${amount}`);
                    console.log(`✅ Новый баланс диликов: ${amount}`);
                    
                    await AdminPanel.getData();
                } else {
                    console.error('❌ Игрок не найден');
                }
            } catch (error) {
                console.error('❌ Ошибка:', error);
            }
        },
        
        // Добавить дилики
        async add(amount) {
            try {
                const userRef = firebase.database().ref('users/' + AdminPanel.targetUserId);
                const snapshot = await userRef.once('value');
                
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const oldBalance = userData.dilicks;
                    const newBalance = oldBalance + amount;
                    
                    await userRef.update({ dilicks: newBalance });
                    
                    console.log(`💰 DILICKS ADD: ${oldBalance} + ${amount} = ${newBalance}`);
                    console.log(`✅ Новый баланс диликов: ${newBalance}`);
                    
                    await AdminPanel.getData();
                } else {
                    console.error('❌ Игрок не найден');
                }
            } catch (error) {
                console.error('❌ Ошибка:', error);
            }
        }
    },
    
    // ===== УПРАВЛЕНИЕ ДЕНЬГАМИ =====
    
    money: {
        // Установить точное количество
        async set(amount) {
            try {
                const userRef = firebase.database().ref('users/' + AdminPanel.targetUserId);
                const snapshot = await userRef.once('value');
                
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const oldBalance = userData.money;
                    
                    await userRef.update({ money: amount });
                    
                    console.log(`💰 MONEY SET: ${oldBalance} → ${amount}`);
                    console.log(`✅ Новый баланс денег: ${amount}`);
                    
                    await AdminPanel.getData();
                } else {
                    console.error('❌ Игрок не найден');
                }
            } catch (error) {
                console.error('❌ Ошибка:', error);
            }
        },
        
        // Добавить деньги
        async add(amount) {
            try {
                const userRef = firebase.database().ref('users/' + AdminPanel.targetUserId);
                const snapshot = await userRef.once('value');
                
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const oldBalance = userData.money;
                    const newBalance = oldBalance + amount;
                    
                    await userRef.update({ money: newBalance });
                    
                    console.log(`💰 MONEY ADD: ${oldBalance} + ${amount} = ${newBalance}`);
                    console.log(`✅ Новый баланс денег: ${newBalance}`);
                    
                    await AdminPanel.getData();
                } else {
                    console.error('❌ Игрок не найден');
                }
            } catch (error) {
                console.error('❌ Ошибка:', error);
            }
        }
    },
    
    // ===== УПРАВЛЕНИЕ КЛИКАМИ =====
    
    clicks: {
        // Установить количество кликов
        async set(amount) {
            try {
                const userRef = firebase.database().ref('users/' + AdminPanel.targetUserId);
                const snapshot = await userRef.once('value');
                
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const oldClicks = userData.clicks;
                    
                    await userRef.update({ clicks: amount });
                    
                    console.log(`🖱️ CLICKS SET: ${oldClicks} → ${amount}`);
                    console.log(`✅ Новое количество кликов: ${amount}`);
                    
                    await AdminPanel.getData();
                } else {
                    console.error('❌ Игрок не найден');
                }
            } catch (error) {
                console.error('❌ Ошибка:', error);
            }
        },
        
        // Добавить клики
        async add(amount) {
            try {
                const userRef = firebase.database().ref('users/' + AdminPanel.targetUserId);
                const snapshot = await userRef.once('value');
                
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const oldClicks = userData.clicks;
                    const newClicks = oldClicks + amount;
                    
                    await userRef.update({ clicks: newClicks });
                    
                    console.log(`🖱️ CLICKS ADD: ${oldClicks} + ${amount} = ${newClicks}`);
                    console.log(`✅ Новое количество кликов: ${newClicks}`);
                    
                    await AdminPanel.getData();
                } else {
                    console.error('❌ Игрок не найден');
                }
            } catch (error) {
                console.error('❌ Ошибка:', error);
            }
        }
    },
    
    // ===== УПРАВЛЕНИЕ СКИНАМИ =====
    
    skins: {
        // Список всех доступных скинов
        list() {
            const skins = {
                'classic': 'Классический скин (бесплатно)',
                'neon': 'Неоновый скин (1000 денег)',
                'monsters_skin': 'Монстр скин (промокод)',
                'dragon_skin': 'Драконий скин (15000 диликов)'
            };
            
            console.log('📋 ДОСТУПНЫЕ СКИНЫ:');
            Object.entries(skins).forEach(([id, name]) => {
                console.log(`   • ${id}: ${name}`);
            });
            
            return skins;
        },
        
        // Дать скин игроку
        async give(skinId) {
            try {
                const userRef = firebase.database().ref('users/' + AdminPanel.targetUserId);
                const snapshot = await userRef.once('value');
                
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    let inventory = userData.inventory || ['classic'];
                    
                    if (!inventory.includes(skinId)) {
                        inventory.push(skinId);
                        await userRef.update({ inventory: inventory });
                        
                        console.log(`✅ Скин "${skinId}" добавлен в инвентарь!`);
                        console.log('📦 Текущий инвентарь:', inventory);
                    } else {
                        console.log(`ℹ️ Скин "${skinId}" уже есть в инвентаре`);
                    }
                    
                    return inventory;
                } else {
                    console.error('❌ Игрок не найден');
                }
            } catch (error) {
                console.error('❌ Ошибка:', error);
            }
        },
        
        // Удалить скин из инвентаря
        async remove(skinId) {
            try {
                const userRef = firebase.database().ref('users/' + AdminPanel.targetUserId);
                const snapshot = await userRef.once('value');
                
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    let inventory = userData.inventory || ['classic'];
                    
                    if (inventory.includes(skinId)) {
                        if (skinId === 'classic') {
                            console.log('❌ Нельзя удалить классический скин!');
                            return;
                        }
                        
                        inventory = inventory.filter(id => id !== skinId);
                        
                        if (userData.currentSkin === skinId) {
                            await userRef.update({ 
                                inventory: inventory,
                                currentSkin: 'classic'
                            });
                            console.log(`✅ Скин "${skinId}" удален. Текущий скин сброшен на classic`);
                        } else {
                            await userRef.update({ inventory: inventory });
                            console.log(`✅ Скин "${skinId}" удален из инвентаря`);
                        }
                        
                        console.log('📦 Текущий инвентарь:', inventory);
                    } else {
                        console.log(`ℹ️ Скина "${skinId}" нет в инвентаре`);
                    }
                    
                    return inventory;
                } else {
                    console.error('❌ Игрок не найден');
                }
            } catch (error) {
                console.error('❌ Ошибка:', error);
            }
        },
        
        // Экипировать скин
        async equip(skinId) {
            try {
                const userRef = firebase.database().ref('users/' + AdminPanel.targetUserId);
                const snapshot = await userRef.once('value');
                
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    
                    if (userData.inventory.includes(skinId)) {
                        await userRef.update({ currentSkin: skinId });
                        console.log(`✅ Скин "${skinId}" экипирован!`);
                    } else {
                        console.log(`❌ Скина "${skinId}" нет в инвентаре! Сначала дай скин командой skins.give()`);
                    }
                } else {
                    console.error('❌ Игрок не найден');
                }
            } catch (error) {
                console.error('❌ Ошибка:', error);
            }
        }
    },
    
    // ===== ДОПОЛНИТЕЛЬНЫЕ КОМАНДЫ =====
    
    // Сбросить прогресс
    async reset() {
        try {
            const userRef = firebase.database().ref('users/' + this.targetUserId);
            const snapshot = await userRef.once('value');
            
            if (snapshot.exists()) {
                const userData = snapshot.val();
                
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
                    lastSave: Date.now(),
                    username: userData.username,
                    password: userData.password
                };
                
                await userRef.set(resetData);
                
                console.log('🔄 ПРОГРЕСС СБРОШЕН!');
                console.log('✅ Игрок вернулся к начальным настройкам');
                
                await this.getData();
            } else {
                console.error('❌ Игрок не найден');
            }
        } catch (error) {
            console.error('❌ Ошибка:', error);
        }
    },
    
    // Изменить логин
    async setUsername(newUsername) {
        try {
            const userRef = firebase.database().ref('users/' + this.targetUserId);
            await userRef.update({ username: newUsername });
            
            console.log(`👤 Логин изменен на: ${newUsername}`);
            
            await this.getData();
        } catch (error) {
            console.error('❌ Ошибка:', error);
        }
    },
    
    // Изменить пароль
    async setPassword(newPassword) {
        try {
            const userRef = firebase.database().ref('users/' + this.targetUserId);
            await userRef.update({ password: newPassword });
            
            console.log(`🔑 Пароль изменен на: ${newPassword}`);
            
            await this.getData();
        } catch (error) {
            console.error('❌ Ошибка:', error);
        }
    }
};

// Автоматическая инициализация при загрузке
AdminPanel.init();

// Делаем доступным в консоли
window.AdminPanel = AdminPanel;