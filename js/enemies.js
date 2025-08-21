// 敌人系统

// 敌人数组
const enemies = [];

// 波次系统
let currentWave = 1;
let waveTimer = 0;
let waveEnemiesSpawned = 0;
let waveEnemiesTotal = 10; // 初始波次敌人数
let waveActive = true;
let bossActive = false;
let bossSpawned = false;

// BOSS敌人类型
const BossTypes = {
    GIANT: {
        name: '巨型魔物',
        health: 500,
        speed: 0.8,
        size: 60,
        color: '#8B0000',
        exp: 300,
        damage: 20,
        abilities: ['charge', 'spawn_minions']
    },
    ELEMENTAL: {
        name: '元素领主',
        health: 350,
        speed: 1.2,
        size: 45,
        color: '#4B0082',
        exp: 250,
        damage: 15,
        abilities: ['teleport', 'magic_missiles']
    },
    SWARM_QUEEN: {
        name: '虫群女王',
        health: 400,
        speed: 1.0,
        size: 50,
        color: '#006400',
        exp: 275,
        damage: 12,
        abilities: ['continuous_spawn', 'poison_cloud']
    }
};

// 波次管理系统
function updateWaveSystem() {
    if (!waveActive && enemies.length === 0 && !bossActive) {
        // 开始新波次
        currentWave++;
        waveEnemiesSpawned = 0;
        waveEnemiesTotal = Math.floor(10 + currentWave * 2.5); // 每波增加敌人数
        waveActive = true;
        bossSpawned = false;
        
        // 每5波出现BOSS
        if (currentWave % 5 === 0) {
            setTimeout(() => {
                if (enemies.length <= 3) { // 等待大部分敌人清理完
                    spawnBoss();
                }
            }, 3000);
        }
        
        console.log(`第 ${currentWave} 波开始! 敌人数: ${waveEnemiesTotal}`);
    }
    
    if (waveActive && waveEnemiesSpawned >= waveEnemiesTotal) {
        waveActive = false;
        console.log(`第 ${currentWave} 波敌人全部生成完毕`);
    }
}

// 生成BOSS
function spawnBoss() {
    if (bossSpawned) return;
    
    const bossTypeKeys = Object.keys(BossTypes);
    const randomBossType = BossTypes[bossTypeKeys[Math.floor(Math.random() * bossTypeKeys.length)]];
    
    // BOSS从随机边缘生成
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
        case 0: x = Math.random() * canvas.width; y = -80; break;
        case 1: x = canvas.width + 80; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = canvas.height + 80; break;
        case 3: x = -80; y = Math.random() * canvas.height; break;
    }
    
    const boss = {
        x: x,
        y: y,
        type: randomBossType,
        speed: randomBossType.speed * (0.8 + Math.random() * 0.4),
        health: randomBossType.health * (1 + currentWave * 0.1), // BOSS随波次变强
        maxHealth: randomBossType.health * (1 + currentWave * 0.1),
        lastHitPlayer: false,
        isHit: 0,
        isBoss: true,
        abilityTimer: 0,
        lastAbilityTime: Date.now(),
        getWidth() { return this.type.size; },
        getHeight() { return this.type.size; }
    };
    
    enemies.push(boss);
    bossActive = true;
    bossSpawned = true;
    
    console.log(`BOSS出现: ${randomBossType.name}`);
    
    // 播放BOSS出现音效
    if (audioManager) {
        audioManager.playSound('enemyDeath', 1.0); // 暂时使用现有音效
    }
}

// 波次系统变量
let enemySpawnRate = 1;
let waveStartTime = 0;

// 生成敌人函数（波次系统）
function spawnEnemy() {
    // 计算当前波次
    const newWave = Math.floor(gameTime / 30) + 1;
    if (newWave > currentWave) {
        currentWave = newWave;
        waveStartTime = gameTime;
        console.log(`第${currentWave}波开始！`);
    }
    
    // 根据波次调整生成率
    enemySpawnRate = 1 + (currentWave - 1) * 0.3;
    
    // 随机选择从哪一边生成敌人
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
        case 0: // 上边
            x = Math.random() * canvas.width;
            y = -50;
            break;
        case 1: // 右边
            x = canvas.width + 50;
            y = Math.random() * canvas.height;
            break;
        case 2: // 下边
            x = Math.random() * canvas.width;
            y = canvas.height + 50;
            break;
        case 3: // 左边
            x = -50;
            y = Math.random() * canvas.height;
            break;
    }
    
    // 根据波次和时间选择敌人类型
    let enemyType = selectEnemyType();
    
    const enemy = {
        x: x,
        y: y,
        type: enemyType,
        speed: enemyType.speed * (1 + Math.random() * 0.3), // 轻微随机化
        health: enemyType.health,
        maxHealth: enemyType.health,
        isHit: 0,
        lastDirection: { x: 0, y: 0 }, // 用于AI行为
        behaviorTimer: 0,
        getWidth() { return enemyType.size; },
        getHeight() { return enemyType.size; }
    };
    
    enemies.push(enemy);
}

// 根据波次选择敌人类型
function selectEnemyType() {
    const waveProgress = (gameTime - waveStartTime) / 30;
    const totalGameTime = gameTime;
    
    // 基础敌人概率（前5分钟）
    if (totalGameTime < 300) {
        const random = Math.random();
        if (random < 0.5) return EnemyTypes.SKELETON;
        if (random < 0.8) return EnemyTypes.ZOMBIE;
        return EnemyTypes.BAT;
    }
    
    // 中期敌人（5-10分钟）
    if (totalGameTime < 600) {
        const random = Math.random();
        if (random < 0.3) return EnemyTypes.SKELETON;
        if (random < 0.5) return EnemyTypes.ZOMBIE;
        if (random < 0.7) return EnemyTypes.BAT;
        if (random < 0.9) return EnemyTypes.GHOST;
        return EnemyTypes.WEREWOLF;
    }
    
    // 后期敌人（10分钟后）
    const random = Math.random();
    if (random < 0.2) return EnemyTypes.SKELETON;
    if (random < 0.35) return EnemyTypes.ZOMBIE;
    if (random < 0.5) return EnemyTypes.BAT;
    if (random < 0.7) return EnemyTypes.GHOST;
    if (random < 0.9) return EnemyTypes.WEREWOLF;
    if (random < 0.98) return EnemyTypes.VAMPIRE;
    return EnemyTypes.DEMON;
}

// Boss敌人生成（每3分钟一个小Boss）
function spawnBossEnemy() {
    if (gameTime > 0 && gameTime % 180 === 0) {
        const bossTypes = [EnemyTypes.WEREWOLF, EnemyTypes.VAMPIRE, EnemyTypes.DEMON];
        const bossType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
        
        // 创建强化版Boss
        const boss = {
            x: canvas.width / 2,
            y: -100,
            type: { ...bossType },
            speed: bossType.speed * 0.8, // 稍慢但更强
            health: bossType.health * 3, // 3倍血量
            maxHealth: bossType.health * 3,
            isHit: 0,
            isBoss: true,
            lastX: canvas.width / 2,
            lastY: -100,
            getWidth() { return this.type.size * 1.5; },
            getHeight() { return this.type.size * 1.5; }
        };
        
        boss.type.exp = bossType.exp * 5; // 5倍经验
        enemies.push(boss);
        
        console.log(`Boss ${bossType.name} 降临！`);
    }
}

// 更新敌人位置（智能AI）
function updateEnemies() {
    enemies.forEach(enemy => {
        // 计算敌人到玩家的方向
        const dx = player.x + player.getWidth()/2 - (enemy.x + enemy.getWidth()/2);
        const dy = player.y + player.getHeight()/2 - (enemy.y + enemy.getHeight()/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let moveX = 0, moveY = 0;
        
        if (distance > 0) {
            const unitX = dx / distance;
            const unitY = dy / distance;
            
            // 特殊能力处理
            updateEnemySpecialAbilities(enemy);
            
            // 根据敌人类型实现不同AI行为
            switch(enemy.type.name) {
                case '骷髅兵':
                    // 直线追击
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
                    
                case '僵尸':
                    // 缓慢但稳定的移动
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
                    
                case '蝙蝠':
                    // 波浪型移动
                    const waveOffset = Math.sin(Date.now() * 0.01 + enemy.x * 0.01) * 2;
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed + waveOffset * 0.3;
                    break;
                    
                case '幽灵':
                    // 相位移动（穿越式）
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
                    
                case '狼人':
                    // 冲刺式移动
                    enemy.behaviorTimer = enemy.behaviorTimer || 0;
                    enemy.behaviorTimer++;
                    
                    if (enemy.behaviorTimer < 30) {
                        // 冲刺阶段
                        moveX = unitX * enemy.speed * 1.8;
                        moveY = unitY * enemy.speed * 1.8;
                    } else if (enemy.behaviorTimer < 60) {
                        // 暂停阶段
                        moveX = 0;
                        moveY = 0;
                    } else {
                        enemy.behaviorTimer = 0;
                    }
                    break;
                    
                case '吸血鬼':
                    // 智能移动：偶尔瞬移
                    enemy.behaviorTimer = enemy.behaviorTimer || 0;
                    enemy.behaviorTimer++;
                    
                    if (enemy.behaviorTimer > 120 && Math.random() < 0.05) {
                        // 瞬移到玩家附近
                        const angle = Math.random() * Math.PI * 2;
                        const teleportDistance = 80 + Math.random() * 40;
                        enemy.x = player.x + Math.cos(angle) * teleportDistance;
                        enemy.y = player.y + Math.sin(angle) * teleportDistance;
                        enemy.behaviorTimer = 0;
                    } else {
                        moveX = unitX * enemy.speed;
                        moveY = unitY * enemy.speed;
                    }
                    break;
                    
                case '恶魔':
                    // 缓慢但致命的移动
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
                    
                // 兼容旧敌人类型
                default:
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
            }
        }
        
        // 保存移动方向用于特效
        if (moveX !== 0 || moveY !== 0) {
            enemy.lastDirection.x = moveX / enemy.speed;
            enemy.lastDirection.y = moveY / enemy.speed;
        }
        
        // 应用移动
        enemy.x += moveX;
        enemy.y += moveY;
        
        // 更新受伤闪烁计时器
        if (enemy.isHit > 0) {
            enemy.isHit--;
        }
    });
}

// 更新敌人特殊能力
function updateEnemySpecialAbilities(enemy) {
    if (!enemy.type.special) return;
    
    switch (enemy.type.special) {
        case 'regeneration':
            // 吸血鬼再生
            if (Math.random() < 0.01 && enemy.health < enemy.maxHealth) {
                enemy.health += 1;
                
                // 再生粒子效果
                if (typeof createParticles !== 'undefined') {
                    createParticles(
                        enemy.x + enemy.getWidth()/2,
                        enemy.y + enemy.getHeight()/2,
                        '#FF0080',
                        3
                    );
                }
            }
            break;
            
        case 'fire_aura':
            // 恶魔火焰光环
            if (!enemy.auraTimer) enemy.auraTimer = 0;
            enemy.auraTimer++;
            
            if (enemy.auraTimer % 60 === 0) {
                // 对附近区域造成伤害
                const auraRange = 80;
                const playerDistance = Math.sqrt(
                    Math.pow(player.x - enemy.x, 2) + 
                    Math.pow(player.y - enemy.y, 2)
                );
                
                if (playerDistance < auraRange && player.invulnerable === 0) {
                    player.health -= 5;
                    player.invulnerable = 30;
                    
                    // 播放受伤音效
                    if (typeof audioManager !== 'undefined') {
                        audioManager.playSound('playerHurt', 0.5);
                    }
                }
            }
            break;
            
        case 'phasing':
            // 幽灵相位能力（偶尔瞬移）
            if (!enemy.phaseTimer) enemy.phaseTimer = 0;
            enemy.phaseTimer++;
            
            if (enemy.phaseTimer > 300 && Math.random() < 0.02) {
                // 瞬移到玩家附近
                const angle = Math.random() * Math.PI * 2;
                const distance = 100 + Math.random() * 50;
                enemy.x = player.x + Math.cos(angle) * distance;
                enemy.y = player.y + Math.sin(angle) * distance;
                enemy.phaseTimer = 0;
                
                // 瞬移特效
                if (typeof createParticles !== 'undefined') {
                    createParticles(
                        enemy.x + enemy.getWidth()/2,
                        enemy.y + enemy.getHeight()/2,
                        '#E6E6FA',
                        8
                    );
                }
            }
            break;
    }
}

// 绘制敌人（多样化视觉系统）
function drawEnemies() {
    const time = Date.now() * 0.01;
    
    enemies.forEach((enemy, index) => {
        ctx.save();
        
        // 敌人类型特殊效果
        const enemyType = enemy.type;
        const isHit = enemy.isHit > 0 && enemy.isHit % 4 < 2;
        
        // 根据敌人类型添加特殊效果
        switch (enemyType.name) {
            case '幽灵':
                // 幽灵透明度变化
                ctx.globalAlpha = 0.7 + Math.sin(time + index * 0.5) * 0.3;
                ctx.shadowColor = '#E6E6FA';
                ctx.shadowBlur = 15;
                break;
            case '吸血鬼':
                // 吸血鬼红色光环
                const vampireGlow = 0.8 + Math.sin(time * 2 + index * 0.3) * 0.2;
                ctx.shadowColor = '#DC143C';
                ctx.shadowBlur = 12 * vampireGlow;
                break;
            case '恶魔':
                // 恶魔火焰光环
                const demonGlow = 0.6 + Math.sin(time * 3 + index * 0.4) * 0.4;
                ctx.shadowColor = '#FF4500';
                ctx.shadowBlur = 20 * demonGlow;
                break;
            case '狼人':
                // 狼人棕色光晕
                ctx.shadowColor = '#8B4513';
                ctx.shadowBlur = 8;
                break;
        }
        
        // 受伤闪烁效果
        if (isHit) {
            ctx.globalAlpha = 0.5;
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 20;
        }
        
        // 移动到敌人位置
        ctx.translate(enemy.x + enemy.getWidth()/2, enemy.y + enemy.getHeight()/2);
        
        // 敌人类型特殊动画
        switch (enemyType.name) {
            case '蝙蝠':
                // 蝙蝠振翅动画
                const flapAnimation = Math.sin(time * 12 + index) * 0.2;
                ctx.scale(1 + flapAnimation, 1 - flapAnimation * 0.5);
                break;
            case '幽灵':
                // 幽灵飘动
                const floatOffset = Math.sin(time * 2 + index * 0.5) * 3;
                ctx.translate(0, floatOffset);
                break;
            case '恶魔':
                // 恶魔缓慢旋转
                ctx.rotate(time * 0.3 + index);
                break;
            case '狼人':
                // 狼人快速移动时的拖影效果
                if (enemy.behaviorTimer < 30) {
                    const shake = Math.sin(time * 20) * 1;
                    ctx.translate(shake, 0);
                }
                break;
        }
        
        // 血量条（Boss和强力敌人显示）
        if (enemy.isBoss || enemyType.name === '恶魔' || enemyType.name === '吸血鬼' || enemyType.name === '狼人') {
            const healthPercentage = enemy.health / enemy.maxHealth;
            const barWidth = enemy.getWidth() + 10;
            const barHeight = 4;
            const barY = -enemy.getHeight()/2 - 15;
            
            // 血量条背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(-barWidth/2, barY, barWidth, barHeight);
            
            // 血量条填充
            const healthWidth = barWidth * healthPercentage;
            ctx.fillStyle = healthPercentage > 0.5 ? '#4CAF50' : healthPercentage > 0.25 ? '#FF9800' : '#F44336';
            ctx.fillRect(-barWidth/2, barY, healthWidth, barHeight);
        }
        
        // 绘制敌人主体
        if (assets.loaded && assets.enemy) {
            ctx.drawImage(assets.enemy, -enemy.getWidth()/2, -enemy.getHeight()/2);
        } else {
            // 备用绘制方案 - 绘制敌人图标和外形
            if (enemyType.icon) {
                // 绘制Unicode图标
                ctx.font = `${enemy.getWidth()}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = enemyType.color;
                ctx.fillText(enemyType.icon, 0, 0);
            } else {
                // 传统绘制方案
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, enemy.getWidth()/2);
                gradient.addColorStop(0, enemyType.color);
                gradient.addColorStop(0.7, enemyType.color);
                gradient.addColorStop(1, '#000000');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(-enemy.getWidth()/2, -enemy.getHeight()/2, enemy.getWidth(), enemy.getHeight());
                
                // 添加眼睛
                ctx.fillStyle = '#FFFF00';
                ctx.fillRect(-enemy.getWidth()/4, -enemy.getHeight()/4, 3, 3);
                ctx.fillRect(enemy.getWidth()/4 - 3, -enemy.getHeight()/4, 3, 3);
            }
            
            // Boss特殊装饰
            if (enemy.isBoss) {
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.strokeRect(-enemy.getWidth()/2 - 2, -enemy.getHeight()/2 - 2, 
                             enemy.getWidth() + 4, enemy.getHeight() + 4);
            }
        }
        
        ctx.restore();
    });
}