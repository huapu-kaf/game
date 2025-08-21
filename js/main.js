// 主游戏控制器

// 获取canvas和2D上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 启用像素完美渲染
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;

// 全局游戏变量 - 确保在所有其他脚本之前初始化
window.gameTime = 0; // 游戏内时间（秒）
window.startTime = Math.floor(Date.now() / 1000);

// 游戏状态变量
let gameState = GameStates.CHARACTER_SELECT;
let selectedWeapon = null;
let gameOver = false;
let score = 0;
let frameCount = 0; // 帧计数

// 为了向后兼容，创建局部引用
let gameTime = window.gameTime;
let startTime = window.startTime;

// 初始化音频管理器
let audioManager;

// 开始游戏函数
function startGame() {
    gameState = GameStates.PLAYING;
    startTime = Math.floor(Date.now() / 1000);
    window.startTime = startTime;
    window.gameTime = 0;
    gameTime = 0;
    console.log(`游戏开始！选择的武器: ${selectedWeapon}`);
    
    // 播放背景音乐
    audioManager.playMusic('background');
}

// 重新开始游戏函数
function restartGame() {
    // 停止当前音乐
    audioManager.stopMusic();
    
    // 重置游戏状态
    gameState = GameStates.CHARACTER_SELECT;
    selectedWeapon = null;
    selectedCharacter = null;
    gameOver = false;
    score = 0;
    
    // 重置全局时间变量
    window.startTime = Math.floor(Date.now() / 1000);
    window.gameTime = 0;
    startTime = window.startTime;
    gameTime = window.gameTime;
    
    // 重置玩家
    player.x = GameConfig.PLAYER.INITIAL_X;
    player.y = GameConfig.PLAYER.INITIAL_Y;
    player.lastX = GameConfig.PLAYER.INITIAL_X;
    player.lastY = GameConfig.PLAYER.INITIAL_Y;
    player.velocityX = 0;
    player.velocityY = 0;
    player.movementTrail = [];
    player.actionGlow = 0;
    player.comboKills = 0;
    player.comboTimer = 0;
    player.killCount = 0;
    player.comboCount = 0;
    player.lastKillTime = 0;
    player.level = GameConfig.PLAYER.INITIAL_LEVEL;
    player.exp = GameConfig.PLAYER.INITIAL_EXP;
    player.expToNextLevel = GameConfig.PLAYER.INITIAL_EXP_TO_NEXT;
    player.health = GameConfig.PLAYER.INITIAL_HEALTH;
    player.invulnerable = 0;
    
    // 清空数组
    enemies.length = 0;
    bullets.length = 0;
    experienceGems.length = 0;
    orbitingBooks.length = 0;
    particles.length = 0;
    damageNumbers.length = 0;
    
    // 清空新武器数组
    if (typeof whipAttacks !== 'undefined') {
        whipAttacks.length = 0;
    }
    if (typeof crossBoomerangs !== 'undefined') {
        crossBoomerangs.length = 0;
    }
    if (typeof garlicAura !== 'undefined') {
        garlicAura.active = false;
        garlicAura.timer = 0;
    }
    
    // 重置武器（恢复初始配置）
    for (let weapon in weapons) {
        weapons[weapon].level = 0;
        if (weapons[weapon].cooldown !== undefined) {
            weapons[weapon].cooldown = 0;
        }
        // 恢复武器的初始冷却时间
        if (WeaponConfig[weapon] && WeaponConfig[weapon].maxCooldown) {
            weapons[weapon].maxCooldown = WeaponConfig[weapon].maxCooldown;
        }
    }
    
    // 重置屏幕震动
    screenShake.intensity = 0;
    screenShake.duration = 0;
    
    // 重置全屏特效
    fullScreenEffects.levelUpFlash = 0;
    fullScreenEffects.comboFlash = 0;
    fullScreenEffects.criticalSlowMotion = 0;
    
    // 重置升级系统
    if (typeof resetUpgradeSystem !== 'undefined') {
        resetUpgradeSystem();
    }
    
    // 确保升级菜单关闭
    if (typeof isUpgradeMenuOpen !== 'undefined') {
        isUpgradeMenuOpen = false;
    }
    if (typeof upgradeChoices !== 'undefined') {
        upgradeChoices = [];
    }
    
    // 重置成就系统
    if (typeof resetAchievements !== 'undefined') {
        resetAchievements();
    }
    
    console.log('游戏重置完成');
}

// 碰撞检测函数
function checkCollisions() {
    // 检查玩家与敌人的碰撞
    if (!gameOver && player.invulnerable === 0) {
        enemies.forEach(enemy => {
            if (player.x < enemy.x + enemy.getWidth() &&
                player.x + player.getWidth() > enemy.x &&
                player.y < enemy.y + enemy.getHeight() &&
                player.y + player.getHeight() > enemy.y) {
                
                // 玩家受伤
                let finalDamage = 20;
                
                // 检查护盾效果
                if (typeof hasShield !== 'undefined' && hasShield()) {
                    if (typeof consumeShield !== 'undefined') {
                        consumeShield();
                    }
                    // 护盾吸收伤害，播放护盾效果
                    if (typeof createParticles !== 'undefined') {
                        createParticles(player.x + player.getWidth()/2, player.y + player.getHeight()/2, '#9932CC', 8, 'magic');
                    }
                    finalDamage = 0;
                } else {
                    // 应用角色特殊能力
                    if (typeof handleCharacterDamageReduction !== 'undefined') {
                        finalDamage = handleCharacterDamageReduction(finalDamage);
                    }
                    player.health -= finalDamage;
                }
                player.invulnerable = GameConfig.GAMEPLAY.INVULNERABLE_TIME;
                
                // 播放玩家受伤音效
                audioManager.playSound('playerHurt', 0.8);
                
                // 创建受伤粒子效果
                createParticles(
                    player.x + player.getWidth()/2,
                    player.y + player.getHeight()/2,
                    '#FF0000',
                    8
                );
                
                // 轻微屏幕震动
                if (typeof startScreenShake !== 'undefined') {
                    startScreenShake(4, 10);
                }
                
                if (player.health <= 0) {
                    gameOver = true;
                    console.log('Game Over!');
                    
                    // 停止背景音乐并播放游戏结束音效
                    audioManager.stopMusic();
                    audioManager.playSound('gameOver');
                }
            }
        });
    }
}

// 游戏循环函数
function gameLoop() {
    // 更新游戏时间和帧计数
    frameCount++;
    if (gameState === GameStates.PLAYING && !gameOver) {
        gameTime = Math.floor((Date.now()/1000) - startTime);
        window.gameTime = gameTime; // 更新全局变量
        
        // 更新连击系统
        updateComboSystem();
        
        // 检查成就
        if (typeof checkAchievements !== 'undefined') {
            checkAchievements();
        }
        
        // 更新成就通知
        if (typeof updateAchievementNotifications !== 'undefined') {
            updateAchievementNotifications();
        }
    }
    
    // 清空整个画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制动态背景
    drawDynamicBackground();
    
    if (gameState === GameStates.CHARACTER_SELECT) {
        // 角色选择界面
        drawCharacterSelect();
    } else if (gameState === GameStates.WEAPON_SELECT) {
        // 武器选择界面
        drawWeaponSelect();
    } else if (gameState === GameStates.PLAYING) {
        // 应用屏幕震动
        ctx.save();
        if (screenShake.intensity > 0) {
            const shakeX = (Math.random() - 0.5) * screenShake.intensity;
            const shakeY = (Math.random() - 0.5) * screenShake.intensity;
            ctx.translate(shakeX, shakeY);
        }
        
        if (!gameOver) {
            // 只有在非升级菜单状态下才更新游戏逻辑
            const isPaused = typeof isUpgradeMenuOpen !== 'undefined' && isUpgradeMenuOpen;
            
            if (!isPaused) {
                // 更新玩家位置
                updatePlayer();
                
                // 更新敌人位置
                updateEnemies();
                
                // 更新子弹位置
                updateBullets();
                
                // 更新环绕圣书
                updateOrbitingBooks();
                
                // 更新新武器
                if (typeof updateNewWeapons !== 'undefined') {
                    updateNewWeapons();
                }
                
                // 更新道具系统
                if (typeof updateItems !== 'undefined') {
                    updateItems();
                }
                
                // 更新特效系统
                if (typeof updateParticles !== 'undefined') {
                    updateParticles();
                }
                
                if (typeof updateBloodSplats !== 'undefined') {
                    updateBloodSplats();
                }
                
                if (typeof updateBackgroundElements !== 'undefined') {
                    updateBackgroundElements();
                }
                
                // 更新屏幕震动
                if (typeof updateScreenShake !== 'undefined') {
                    updateScreenShake();
                }
                
                // 更新角色技能
                if (typeof updateCharacterAbilities !== 'undefined') {
                    updateCharacterAbilities();
                }
                
                // 更新波次系统
                if (typeof updateWaveSystem !== 'undefined') {
                    updateWaveSystem();
                }
                
                // 更新BOSS系统
                if (typeof checkBossSpawn !== 'undefined') {
                    checkBossSpawn();
                }
                
                if (typeof updateBossWarning !== 'undefined') {
                    updateBossWarning();
                }
                
                // 更新BOSS AI
                enemies.forEach(enemy => {
                    if (enemy.isBoss && typeof updateBossAI !== 'undefined') {
                        updateBossAI(enemy);
                    }
                });
                
                // 更新屏幕震动
                updateScreenShake();
                
                // 更新伤害数字
                updateDamageNumbers();
                
                // 更新全屏特效
                updateFullScreenEffects();
                
                // 检查碰撞
                checkCollisions();
            }
        } else {
            gameState = GameStates.GAME_OVER;
        }
        
        // 绘制背景特效
        if (typeof drawBackgroundElements !== 'undefined') {
            drawBackgroundElements();
        }
        
        // 绘制血迹
        if (typeof drawBloodSplats !== 'undefined') {
            drawBloodSplats();
        }
        
        // 绘制玩家
        drawPlayer();
        
        // 绘制敌人
        drawEnemies();
        
        // 绘制子弹
        drawBullets();
        
        // 绘制道具
        if (typeof drawItems !== 'undefined') {
            drawItems();
        }
        
        // 绘制环绕圣书
        drawOrbitingBooks();
        
        // 绘制新武器效果
        if (typeof drawNewWeapons !== 'undefined') {
            drawNewWeapons();
        }
        
        // 绘制经验宝石
        drawExperienceGems();
        
        // 绘制粒子效果
        drawParticles();
        
        // 绘制伤害数字
        drawDamageNumbers();
        
        // 恢复画布状态（取消震动效果）
        ctx.restore();
        
        // 绘制玩家效果状态（在震动效果之外）
        if (typeof drawPlayerEffectStatus !== 'undefined') {
            drawPlayerEffectStatus();
        }
        
        // 绘制角色状态信息
        if (typeof drawCharacterStatusUI !== 'undefined') {
            drawCharacterStatusUI();
        }
        
        // 绘制全屏特效（不受震动影响）
        drawFullScreenEffects();
        
        // 绘制UI（不受震动影响）
        if (typeof drawEnhancedUI !== 'undefined') {
            drawEnhancedUI();
        } else {
            drawUI();
        }
        
        // 绘制升级选择界面（如果打开）
        if (typeof drawUpgradeMenu !== 'undefined') {
            drawUpgradeMenu();
        }
        
        // 绘制成就通知
        if (typeof drawAchievementNotifications !== 'undefined') {
            drawAchievementNotifications();
        }
    } else if (gameState === GameStates.GAME_OVER) {
        // 游戏结束状态
        drawUI(); // 绘制基础UI
        
        // 绘制游戏结束界面
        if (typeof drawGameOver !== 'undefined') {
            drawGameOver();
        }
    }
    
    // 使用requestAnimationFrame实现持续循环
    requestAnimationFrame(gameLoop);
}

// 更新连击系统
function updateComboSystem() {
    const currentTime = Date.now();
    
    // 如果连击超时（3秒无击杀），重置连击
    if (player.comboCount > 0 && currentTime - player.lastKillTime > 3000) {
        player.comboCount = 0;
    }
}

// 增加击杀数
function addKill() {
    const currentTime = Date.now();
    
    // 增加总击杀数
    player.killCount++;
    
    // 增加BOSS击杀计数
    if (typeof bossKillCount !== 'undefined') {
        bossKillCount++;
        console.log(`击杀计数: ${bossKillCount}/${BossConfig.KILLS_PER_BOSS}`);
    }
    
    // 更新连击
    if (currentTime - player.lastKillTime < 3000) {
        player.comboCount++;
    } else {
        player.comboCount = 1;
    }
    
    player.lastKillTime = currentTime;
    
    // 播放击杀音效
    audioManager.playSound('enemyDeath', 0.7);
}

// 计算敌人生成数量
function getEnemySpawnCount() {
    // 基础生成数量为1
    let spawnCount = 1;
    
    // 根据时间增加难度
    if (gameTime > 60) spawnCount = 2;        // 1分钟后
    if (gameTime > 180) spawnCount = 3;       // 3分钟后
    if (gameTime > 300) spawnCount = 4;       // 5分钟后
    if (gameTime > 600) spawnCount = 5;       // 10分钟后
    
    // 根据当前波次微调
    const waveBonus = Math.floor(currentWave / 5);
    spawnCount += waveBonus;
    
    // 限制最大生成数量
    return Math.min(spawnCount, 8);
}

// 游戏初始化
function initGame() {
    // 初始化音频管理器
    audioManager = new AudioManager();
    
    // 初始化输入系统
    if (typeof initInputSystem !== 'undefined') {
        initInputSystem();
    } else {
        console.error('initInputSystem function not found');
    }
    
    // 加载资源
    loadAssets();
    
    // 等待资源加载完成后开始游戏
    function waitForAssets() {
        if (assets.loaded) {
            // 启动游戏循环
            gameLoop();
            
            // 设置动态敌人生成定时器
            setInterval(() => {
                if (gameState === GameStates.PLAYING && !gameOver) {
                    // BOSS战期间停止生成普通敌人，专注BOSS战斗
                    if (window.bossActive || bossActive) {
                        return; // BOSS战期间不生成普通敌人
                    }
                    
                    // 根据游戏时间动态调整生成数量
                    const spawnCount = getEnemySpawnCount();
                    for (let i = 0; i < spawnCount; i++) {
                        spawnEnemy();
                    }
                }
            }, GameConfig.GAMEPLAY.ENEMY_SPAWN_INTERVAL);
            
            // 设置射击定时器
            setInterval(() => {
                if (gameState === GameStates.PLAYING) {
                    shoot();
                }
            }, GameConfig.GAMEPLAY.SHOOT_INTERVAL);
            
        } else {
            setTimeout(waitForAssets, 100);
        }
    }
    
    waitForAssets();
}

// 启动游戏
initGame();