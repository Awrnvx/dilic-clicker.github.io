// ========== АДМИН ПАНЕЛЬ - РАБОЧАЯ ВЕРСИЯ ==========

(function() {
    console.log('🔥 admin-ui.js загружен!');
    
    // Показ сообщений
    function showInPanel(text, isError = false) {
        const resultDiv = document.getElementById('adminResult');
        if (!resultDiv) return;
        
        resultDiv.style.display = 'block';
        const msgDiv = document.createElement('div');
        msgDiv.style.color = isError ? '#ff6b6b' : '#0f0';
        msgDiv.style.marginBottom = '3px';
        msgDiv.style.fontSize = '11px';
        msgDiv.style.fontFamily = 'monospace';
        msgDiv.style.padding = '2px 0';
        msgDiv.innerHTML = `[${new Date().toLocaleTimeString()}] ${text}`;
        resultDiv.appendChild(msgDiv);
        resultDiv.scrollTop = resultDiv.scrollHeight;
    }
    
    function getUserId() {
        return document.getElementById('adminUserId')?.value || '-Onbl-wmWqYsAV-cYUWm';
    }
    
    // Загрузка
    window.addEventListener('load', function() {
        setTimeout(function() {
            
            // GET
            const getBtn = document.getElementById('adminGetData');
            if (getBtn) {
                getBtn.onclick = function(e) {
                    e.preventDefault();
                    const userId = getUserId();
                    showInPanel(`🔍 Запрос данных для ${userId}...`);
                    
                    firebase.database().ref('users/' + userId).once('value')
                        .then(snapshot => {
                            if (snapshot.exists()) {
                                const data = snapshot.val();
                                showInPanel(`✅ ${data.username}:`);
                                showInPanel(`   💰 Деньги: ${data.money}`);
                                showInPanel(`   💎 Дилики: ${data.dilicks}`);
                                showInPanel(`   🖱️ Клики: ${data.clicks}`);
                                showInPanel(`   📦 Инвентарь: ${data.inventory.join(', ')}`);
                            } else {
                                showInPanel(`❌ Игрок ${userId} не найден`, true);
                            }
                            showInPanel(`──────────────────`);
                        })
                        .catch(error => showInPanel(`❌ Ошибка: ${error.message}`, true));
                    return false;
                };
            }
            
            // ДИЛИКИ SET
            const dilicksSet = document.getElementById('adminDilicksSet');
            if (dilicksSet) {
                dilicksSet.onclick = function(e) {
                    e.preventDefault();
                    const userId = getUserId();
                    const amount = parseInt(document.getElementById('adminDilicksAmount')?.value || '0');
                    
                    if (isNaN(amount)) {
                        showInPanel('❌ Введите число', true);
                        return false;
                    }
                    
                    showInPanel(`🔍 SET дилики: ${amount}...`);
                    
                    firebase.database().ref('users/' + userId).update({ dilicks: amount })
                        .then(() => {
                            showInPanel(`✅ Дилики установлены: ${amount} 💎`);
                            showInPanel(`🔄 Обновляю данные...`);
                            return firebase.database().ref('users/' + userId).once('value');
                        })
                        .then(snapshot => {
                            if (snapshot.exists()) {
                                const data = snapshot.val();
                                showInPanel(`   Новый баланс: ${data.dilicks} 💎`);
                                
                                // Обновляем интерфейс если это текущий игрок
                                if (userId === localStorage.getItem('userId')) {
                                    document.getElementById('dilicks').textContent = data.dilicks;
                                }
                            }
                            showInPanel(`──────────────────`);
                        })
                        .catch(error => showInPanel(`❌ Ошибка: ${error.message}`, true));
                    return false;
                };
            }
            
            // ДИЛИКИ ADD
            const dilicksAdd = document.getElementById('adminDilicksAdd');
            if (dilicksAdd) {
                dilicksAdd.onclick = function(e) {
                    e.preventDefault();
                    const userId = getUserId();
                    const amount = parseInt(document.getElementById('adminDilicksAmount')?.value || '0');
                    
                    if (isNaN(amount)) {
                        showInPanel('❌ Введите число', true);
                        return false;
                    }
                    
                    showInPanel(`🔍 ADD дилики: +${amount}...`);
                    
                    firebase.database().ref('users/' + userId).once('value')
                        .then(snapshot => {
                            if (snapshot.exists()) {
                                const current = snapshot.val().dilicks || 0;
                                const newAmount = current + amount;
                                showInPanel(`   Текущие: ${current} 💎`);
                                showInPanel(`   Добавляем: +${amount} 💎`);
                                
                                return firebase.database().ref('users/' + userId).update({ dilicks: newAmount })
                                    .then(() => {
                                        showInPanel(`✅ Новые дилики: ${newAmount} 💎`);
                                        
                                        if (userId === localStorage.getItem('userId')) {
                                            document.getElementById('dilicks').textContent = newAmount;
                                        }
                                        
                                        return firebase.database().ref('users/' + userId).once('value');
                                    });
                            }
                        })
                        .then(() => showInPanel(`──────────────────`))
                        .catch(error => showInPanel(`❌ Ошибка: ${error.message}`, true));
                    return false;
                };
            }
            
            // ДЕНЬГИ SET
            const moneySet = document.getElementById('adminMoneySet');
            if (moneySet) {
                moneySet.onclick = function(e) {
                    e.preventDefault();
                    const userId = getUserId();
                    const amount = parseInt(document.getElementById('adminMoneyAmount')?.value || '0');
                    
                    if (isNaN(amount)) {
                        showInPanel('❌ Введите число', true);
                        return false;
                    }
                    
                    showInPanel(`🔍 SET деньги: ${amount}...`);
                    
                    firebase.database().ref('users/' + userId).update({ money: amount })
                        .then(() => {
                            showInPanel(`✅ Деньги установлены: ${amount} 💰`);
                            
                            if (userId === localStorage.getItem('userId')) {
                                document.getElementById('money').textContent = amount;
                            }
                            
                            showInPanel(`──────────────────`);
                        })
                        .catch(error => showInPanel(`❌ Ошибка: ${error.message}`, true));
                    return false;
                };
            }
            
            // ДЕНЬГИ ADD
            const moneyAdd = document.getElementById('adminMoneyAdd');
            if (moneyAdd) {
                moneyAdd.onclick = function(e) {
                    e.preventDefault();
                    const userId = getUserId();
                    const amount = parseInt(document.getElementById('adminMoneyAmount')?.value || '0');
                    
                    if (isNaN(amount)) {
                        showInPanel('❌ Введите число', true);
                        return false;
                    }
                    
                    showInPanel(`🔍 ADD деньги: +${amount}...`);
                    
                    firebase.database().ref('users/' + userId).once('value')
                        .then(snapshot => {
                            if (snapshot.exists()) {
                                const current = snapshot.val().money || 0;
                                const newAmount = current + amount;
                                
                                return firebase.database().ref('users/' + userId).update({ money: newAmount })
                                    .then(() => {
                                        showInPanel(`✅ Новые деньги: ${newAmount} 💰`);
                                        
                                        if (userId === localStorage.getItem('userId')) {
                                            document.getElementById('money').textContent = newAmount;
                                        }
                                    });
                            }
                        })
                        .then(() => showInPanel(`──────────────────`))
                        .catch(error => showInPanel(`❌ Ошибка: ${error.message}`, true));
                    return false;
                };
            }
            
            // КЛИКИ SET
            const clicksSet = document.getElementById('adminClicksSet');
            if (clicksSet) {
                clicksSet.onclick = function(e) {
                    e.preventDefault();
                    const userId = getUserId();
                    const amount = parseInt(document.getElementById('adminClicksAmount')?.value || '0');
                    
                    if (isNaN(amount)) {
                        showInPanel('❌ Введите число', true);
                        return false;
                    }
                    
                    showInPanel(`🔍 SET клики: ${amount}...`);
                    
                    firebase.database().ref('users/' + userId).update({ clicks: amount })
                        .then(() => {
                            showInPanel(`✅ Клики установлены: ${amount} 🖱️`);
                            
                            if (userId === localStorage.getItem('userId')) {
                                document.getElementById('clicks').textContent = amount;
                            }
                            
                            showInPanel(`──────────────────`);
                        })
                        .catch(error => showInPanel(`❌ Ошибка: ${error.message}`, true));
                    return false;
                };
            }
            
            // КЛИКИ ADD
            const clicksAdd = document.getElementById('adminClicksAdd');
            if (clicksAdd) {
                clicksAdd.onclick = function(e) {
                    e.preventDefault();
                    const userId = getUserId();
                    const amount = parseInt(document.getElementById('adminClicksAmount')?.value || '0');
                    
                    if (isNaN(amount)) {
                        showInPanel('❌ Введите число', true);
                        return false;
                    }
                    
                    showInPanel(`🔍 ADD клики: +${amount}...`);
                    
                    firebase.database().ref('users/' + userId).once('value')
                        .then(snapshot => {
                            if (snapshot.exists()) {
                                const current = snapshot.val().clicks || 0;
                                const newAmount = current + amount;
                                
                                return firebase.database().ref('users/' + userId).update({ clicks: newAmount })
                                    .then(() => {
                                        showInPanel(`✅ Новые клики: ${newAmount} 🖱️`);
                                        
                                        if (userId === localStorage.getItem('userId')) {
                                            document.getElementById('clicks').textContent = newAmount;
                                        }
                                    });
                            }
                        })
                        .then(() => showInPanel(`──────────────────`))
                        .catch(error => showInPanel(`❌ Ошибка: ${error.message}`, true));
                    return false;
                };
            }
            
            // СКИН GIVE
            const skinGive = document.getElementById('adminSkinGive');
            if (skinGive) {
                skinGive.onclick = function(e) {
                    e.preventDefault();
                    const userId = getUserId();
                    const skinId = document.getElementById('adminSkinSelect')?.value;
                    const skinNames = {
                        'classic': 'Классический',
                        'neon': 'Неоновый',
                        'monsters_skin': 'Монстр',
                        'dragon_skin': 'Драконий'
                    };
                    
                    showInPanel(`🔍 Добавляю скин: ${skinNames[skinId]}...`);
                    
                    firebase.database().ref('users/' + userId).once('value')
                        .then(snapshot => {
                            if (snapshot.exists()) {
                                const userData = snapshot.val();
                                let inventory = userData.inventory || ['classic'];
                                
                                if (!inventory.includes(skinId)) {
                                    inventory.push(skinId);
                                    return firebase.database().ref('users/' + userId).update({ inventory })
                                        .then(() => {
                                            showInPanel(`✅ Скин "${skinNames[skinId]}" добавлен!`);
                                        });
                                } else {
                                    showInPanel(`ℹ️ Скин уже есть в инвентаре`);
                                }
                            }
                        })
                        .then(() => showInPanel(`──────────────────`))
                        .catch(error => showInPanel(`❌ Ошибка: ${error.message}`, true));
                    return false;
                };
            }
            
            // ЭКИПИРОВАТЬ
            const skinEquip = document.getElementById('adminEquipSkin');
            if (skinEquip) {
                skinEquip.onclick = function(e) {
                    e.preventDefault();
                    const userId = getUserId();
                    const skinId = document.getElementById('adminSkinSelect')?.value;
                    const skinNames = {
                        'classic': 'Классический',
                        'neon': 'Неоновый',
                        'monsters_skin': 'Монстр',
                        'dragon_skin': 'Драконий'
                    };
                    
                    showInPanel(`🔍 Экипирую скин: ${skinNames[skinId]}...`);
                    
                    firebase.database().ref('users/' + userId).once('value')
                        .then(snapshot => {
                            if (snapshot.exists() && snapshot.val().inventory.includes(skinId)) {
                                return firebase.database().ref('users/' + userId).update({ currentSkin: skinId })
                                    .then(() => {
                                        showInPanel(`✅ Скин "${skinNames[skinId]}" экипирован!`);
                                        
                                        if (userId === localStorage.getItem('userId')) {
                                            const game = window.clickerGame;
                                            if (game && game.skinsData && game.skinsData[skinId]) {
                                                document.getElementById('clickIcon').src = game.skinsData[skinId].image;
                                                showInPanel(`✅ Иконка обновлена`);
                                            }
                                        }
                                    });
                            } else {
                                showInPanel(`❌ Скина нет в инвентаре!`, true);
                            }
                        })
                        .then(() => showInPanel(`──────────────────`))
                        .catch(error => showInPanel(`❌ Ошибка: ${error.message}`, true));
                    return false;
                };
            }
            
            // УДАЛИТЬ СКИН
            const skinRemove = document.getElementById('adminSkinRemove');
            if (skinRemove) {
                skinRemove.onclick = function(e) {
                    e.preventDefault();
                    const userId = getUserId();
                    const skinId = document.getElementById('adminSkinSelect')?.value;
                    
                    if (skinId === 'classic') {
                        showInPanel('❌ Нельзя удалить классический скин!', true);
                        return false;
                    }
                    
                    showInPanel(`🔍 Удаляю скин...`);
                    
                    firebase.database().ref('users/' + userId).once('value')
                        .then(snapshot => {
                            if (snapshot.exists()) {
                                const userData = snapshot.val();
                                let inventory = userData.inventory.filter(id => id !== skinId);
                                
                                const updates = { inventory };
                                if (userData.currentSkin === skinId) {
                                    updates.currentSkin = 'classic';
                                }
                                
                                return firebase.database().ref('users/' + userId).update(updates)
                                    .then(() => {
                                        showInPanel(`✅ Скин удален!`);
                                    });
                            }
                        })
                        .then(() => showInPanel(`──────────────────`))
                        .catch(error => showInPanel(`❌ Ошибка: ${error.message}`, true));
                    return false;
                };
            }
            
            // СБРОС
            const resetBtn = document.getElementById('adminResetProgress');
            if (resetBtn) {
                resetBtn.onclick = function(e) {
                    e.preventDefault();
                    if (!confirm('⚠️ Точно сбросить прогресс?')) return false;
                    
                    const userId = getUserId();
                    showInPanel(`🔍 Сброс прогресса...`);
                    
                    firebase.database().ref('users/' + userId).once('value')
                        .then(snapshot => {
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
                                
                                return firebase.database().ref('users/' + userId).set(resetData);
                            }
                        })
                        .then(() => {
                            showInPanel(`✅ Прогресс сброшен!`);
                            
                            if (userId === localStorage.getItem('userId')) {
                                showInPanel(`🔄 Перезагрузка через 2 сек...`);
                                setTimeout(() => location.reload(), 2000);
                            }
                            
                            showInPanel(`──────────────────`);
                        })
                        .catch(error => showInPanel(`❌ Ошибка: ${error.message}`, true));
                    return false;
                };
            }
            
            // Кнопка очистки лога
            const resultDiv = document.getElementById('adminResult');
            if (resultDiv) {
                const clearBtn = document.createElement('button');
                clearBtn.className = 'glass-btn small';
                clearBtn.style.marginTop = '10px';
                clearBtn.style.width = '100%';
                clearBtn.style.background = 'rgba(255,255,255,0.1)';
                clearBtn.innerHTML = '🗑️ ОЧИСТИТЬ ЛОГ';
                clearBtn.onclick = function(e) {
                    e.preventDefault();
                    resultDiv.innerHTML = '';
                    resultDiv.style.display = 'none';
                };
                resultDiv.parentNode.insertBefore(clearBtn, resultDiv.nextSibling);
            }
            
            showInPanel('✅ Админ-панель запущена');
            showInPanel(`🎯 ID игрока: ${getUserId()}`);
            showInPanel(`──────────────────`);
            
        }, 1000);
    });
})();