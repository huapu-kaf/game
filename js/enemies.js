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
        health: 1200, // 大幅提升血量
        speed: 0.8,
        size: 60,
        color: '#8B0000',
        exp: 300,
        damage: 20,
        abilities: ['charge', 'spawn_minions']
    },
    ELEMENTAL: {
        name: '元素领主',
        health: 800, // 大幅提升血量
        speed: 1.2,
        size: 45,
        color: '#4B0082',
        exp: 250,
        damage: 15,
        abilities: ['teleport', 'magic_missiles']
    },
    SWARM_QUEEN: {
        name: '虫群女王',
        health: 1000, // 大幅提升血量
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
        health: randomBossType.health * (1 + currentWave * 0.15), // BOSS随波次变强 - 增加递增幅度
        maxHealth: randomBossType.health * (1 + currentWave * 0.15),
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

// === BOSS战系统变量 ===
let bossKillCount = 0; // 用于触发BOSS的击杀数
let currentBossIndex = 0; // 当前BOSS索引
let activeBoss = null; // 当前活跃的BOSS
let bossPhase = 0; // BOSS当前阶段
let bossWarningActive = false; // BOSS警告是否激活
let bossWarningTimer = 0; // BOSS警告计时器

// BOSS类型数组
const BOSS_SEQUENCE = [
    'SKELETON_KING',
    'ELEMENTAL_TITAN', 
    'SHADOW_DRAGON',
    'MECHANICAL_BEAST',
    'VOID_SOVEREIGN'
];

// 生成敌人函数（波次系统）
function spawnEnemy() {
    // BOSS战期间不生成普通敌人
    if (window.bossActive || bossActive) {
        return; // 直接返回，不生成敌人
    }
    
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
    
    // 检查是否生成精英敌人
    if (Math.random() < GameConfig.GAMEPLAY.ELITE_ENEMY_CHANCE) {
        return createEliteEnemy();
    }
    
    // 基础敌人概率（前3分钟）
    if (totalGameTime < 180) {
        const random = Math.random();
        if (random < 0.3) return EnemyTypes.SKELETON;
        if (random < 0.5) return EnemyTypes.ZOMBIE;
        if (random < 0.65) return EnemyTypes.GOBLIN_WARRIOR;
        if (random < 0.8) return EnemyTypes.BAT;
        if (random < 0.9) return EnemyTypes.SPIDER;
        if (random < 0.95) return EnemyTypes.FLYING_EYE;
        return EnemyTypes.POISON_MUSHROOM;
    }
    
    // 早期敌人（3-6分钟）
    if (totalGameTime < 360) {
        const random = Math.random();
        if (random < 0.2) return EnemyTypes.SKELETON;
        if (random < 0.35) return EnemyTypes.ZOMBIE;
        if (random < 0.5) return EnemyTypes.GOBLIN_WARRIOR;
        if (random < 0.6) return EnemyTypes.BAT;
        if (random < 0.7) return EnemyTypes.SPIDER;
        if (random < 0.8) return EnemyTypes.FLYING_EYE;
        if (random < 0.85) return EnemyTypes.GHOST;
        if (random < 0.9) return EnemyTypes.FIRE_ELEMENTAL;
        if (random < 0.95) return EnemyTypes.ICE_ELEMENTAL;
        return EnemyTypes.ARCHER;
    }
    
    // 中期敌人（6-12分钟）
    if (totalGameTime < 720) {
        const random = Math.random();
        if (random < 0.1) return EnemyTypes.SKELETON;
        if (random < 0.2) return EnemyTypes.ZOMBIE;
        if (random < 0.3) return EnemyTypes.GOBLIN_WARRIOR;
        if (random < 0.4) return EnemyTypes.SPIDER;
        if (random < 0.5) return EnemyTypes.FIRE_ELEMENTAL;
        if (random < 0.6) return EnemyTypes.ICE_ELEMENTAL;
        if (random < 0.7) return EnemyTypes.GHOST;
        if (random < 0.78) return EnemyTypes.ARCHER;
        if (random < 0.85) return EnemyTypes.ROCK_GOLEM;
        if (random < 0.9) return EnemyTypes.PARASITE;
        if (random < 0.95) return EnemyTypes.WEREWOLF;
        return EnemyTypes.SHAMAN;
    }
    
    // 后期敌人（12分钟后）
    const random = Math.random();
    if (random < 0.08) return EnemyTypes.SKELETON;
    if (random < 0.15) return EnemyTypes.ZOMBIE;
    if (random < 0.22) return EnemyTypes.FIRE_ELEMENTAL;
    if (random < 0.29) return EnemyTypes.ICE_ELEMENTAL;
    if (random < 0.36) return EnemyTypes.ROCK_GOLEM;
    if (random < 0.43) return EnemyTypes.GHOST;
    if (random < 0.5) return EnemyTypes.ARCHER;
    if (random < 0.57) return EnemyTypes.SHAMAN;
    if (random < 0.64) return EnemyTypes.PARASITE;
    if (random < 0.71) return EnemyTypes.WEREWOLF;
    if (random < 0.78) return EnemyTypes.VAMPIRE;
    if (random < 0.84) return EnemyTypes.VOID_WALKER;
    if (random < 0.9) return EnemyTypes.DEMON;
    if (random < 0.95) return EnemyTypes.MIRROR_WRAITH;
    return EnemyTypes.SHADOW_ASSASSIN;
}

// 创建精英敌人
function createEliteEnemy() {
    // 先检查是否生成真正的精英敌人
    if (Math.random() < 0.3) {
        const eliteTypes = [EnemyTypes.SHADOW_ASSASSIN, EnemyTypes.GIANT_SPIDER, EnemyTypes.FLAME_DEMON, EnemyTypes.ICE_WIZARD];
        return eliteTypes[Math.floor(Math.random() * eliteTypes.length)];
    }
    
    // 否则创建增强版普通敌人
    const baseTypes = [
        EnemyTypes.SKELETON, EnemyTypes.ZOMBIE, EnemyTypes.GHOST, EnemyTypes.WEREWOLF,
        EnemyTypes.GOBLIN_WARRIOR, EnemyTypes.SPIDER, EnemyTypes.FIRE_ELEMENTAL, EnemyTypes.ICE_ELEMENTAL
    ];
    const baseType = baseTypes[Math.floor(Math.random() * baseTypes.length)];
    
    // 创建精英版本 - 提升血量倍数以增加挑战性
    const eliteType = {
        ...baseType,
        name: '精英' + baseType.name,
        health: Math.floor(baseType.health * 3.5), // 从2.5倍提升到3.5倍
        speed: baseType.speed * 1.3,
        size: baseType.size * 1.2,
        exp: baseType.exp * 3,
        color: '#FFD700', // 金色
        isElite: true,
        special: baseType.special || 'elite_aura'
    };
    
    return eliteType;
}

// 萨满召唤小兵
function spawnMinionAt(x, y, fromBoss = false) {
    // 如果是BOSS召唤，则不受限制
    if (!fromBoss) {
        // BOSS战期间，限制萨满召唤小兵的数量（但不完全禁止，保持技能特色）
        if (window.bossActive || bossActive) {
            // BOSS战期间萨满召唤能力减半
            if (Math.random() < 0.5) {
                return; // 50%概率不召唤
            }
        }
    }
    
    const minionType = {
        name: '骷髅小兵',
        health: 5,
        speed: 3.0,
        size: 12,
        color: '#CCCCCC',
        exp: 5,
        icon: '💀',
        isMinion: true
    };
    
    // 在萨满周围随机位置生成2-3个小兵
    const minionCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < minionCount; i++) {
        const angle = (Math.PI * 2 * i) / minionCount;
        const spawnRadius = 30 + Math.random() * 20;
        const minionX = x + Math.cos(angle) * spawnRadius;
        const minionY = y + Math.sin(angle) * spawnRadius;
        
        const minion = {
            x: minionX,
            y: minionY,
            type: minionType,
            speed: minionType.speed * (0.8 + Math.random() * 0.4),
            health: minionType.health,
            maxHealth: minionType.health,
            isHit: 0,
            lastDirection: { x: 0, y: 0 },
            behaviorTimer: 0,
            lifetime: 600, // 10秒后自动消失
            getWidth() { return minionType.size; },
            getHeight() { return minionType.size; }
        };
        
        enemies.push(minion);
        
        // 创建召唤特效
        if (typeof createParticles !== 'undefined') {
            createParticles(minionX, minionY, '#32CD32', 10, 'magic');
        }
    }
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
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
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
            updateNewEnemyAbilities(enemy);
            
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
                    
                case '飞行魔眼':
                    // 飞行移动：无视地形，圆形轨迹
                    const circleRadius = 100;
                    const circleTime = Date.now() * 0.005;
                    const targetX = player.x + Math.cos(circleTime + enemy.x * 0.01) * circleRadius;
                    const targetY = player.y + Math.sin(circleTime + enemy.x * 0.01) * circleRadius;
                    const circleDx = targetX - enemy.x;
                    const circleDy = targetY - enemy.y;
                    const circleDistance = Math.sqrt(circleDx * circleDx + circleDy * circleDy);
                    if (circleDistance > 0) {
                        moveX = (circleDx / circleDistance) * enemy.speed;
                        moveY = (circleDy / circleDistance) * enemy.speed;
                    }
                    break;
                    
                case '骷髅弓箭手':
                    // 远程攻击：保持距离
                    if (distance > 150) {
                        moveX = unitX * enemy.speed;
                        moveY = unitY * enemy.speed;
                    } else if (distance < 120) {
                        // 后退
                        moveX = -unitX * enemy.speed * 0.8;
                        moveY = -unitY * enemy.speed * 0.8;
                    } else {
                        // 保持距离，侧向移动
                        moveX = -unitY * enemy.speed * 0.5;
                        moveY = unitX * enemy.speed * 0.5;
                    }
                    break;
                    
                case '萨满':
                    // 召唤者：召唤小兵后后退
                    enemy.behaviorTimer = enemy.behaviorTimer || 0;
                    enemy.summonCooldown = enemy.summonCooldown || 0;
                    enemy.behaviorTimer++;
                    enemy.summonCooldown--;
                    
                    if (enemy.summonCooldown <= 0 && distance < 200) {
                        // 召唤小兵
                        if (Math.random() < 0.02) {
                            spawnMinionAt(enemy.x, enemy.y);
                            enemy.summonCooldown = 180; // 3秒冷却
                        }
                    }
                    
                    if (distance > 180) {
                        moveX = unitX * enemy.speed * 0.7;
                        moveY = unitY * enemy.speed * 0.7;
                    } else {
                        // 后退
                        moveX = -unitX * enemy.speed;
                        moveY = -unitY * enemy.speed;
                    }
                    break;
                
                // === 新增敌人AI行为 ===
                case '地精战士':
                    // 成群冲锋，相互靠拢
                    let packBonus = 1.0;
                    enemies.forEach(otherEnemy => {
                        if (otherEnemy !== enemy && otherEnemy.type.name === '地精战士') {
                            const packDistance = Math.sqrt(
                                Math.pow(otherEnemy.x - enemy.x, 2) + 
                                Math.pow(otherEnemy.y - enemy.y, 2)
                            );
                            if (packDistance < 60) packBonus += 0.2;
                        }
                    });
                    moveX = unitX * enemy.speed * packBonus;
                    moveY = unitY * enemy.speed * packBonus;
                    break;
                    
                case '毒蛛':
                    // 蜘蛛式移动，偶尔停下吐丝
                    enemy.webCooldown = enemy.webCooldown || 0;
                    enemy.webCooldown--;
                    
                    if (enemy.webCooldown <= 0 && distance < 100 && Math.random() < 0.03) {
                        // 吐丝攻击
                        enemy.webCooldown = 120; // 2秒冷却
                        // TODO: 实现吐丝减速效果
                    }
                    
                    // 侧向爬行
                    const spiderAngle = Math.atan2(dy, dx) + Math.sin(Date.now() * 0.01) * 0.5;
                    moveX = Math.cos(spiderAngle) * enemy.speed;
                    moveY = Math.sin(spiderAngle) * enemy.speed;
                    break;
                    
                case '火元素':
                    // 火元素：直接追击，死亡时爆炸
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
                    
                case '冰元素':
                    // 冰元素：缓慢移动，冰冻光环
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
                    
                case '毒蘑菇':
                    // 毒蘑菇：非常慢，释放毒雾
                    enemy.poisonTimer = enemy.poisonTimer || 0;
                    enemy.poisonTimer++;
                    
                    // 极慢移动
                    moveX = unitX * enemy.speed * 0.7;
                    moveY = unitY * enemy.speed * 0.7;
                    break;
                    
                case '岩石傀儡':
                    // 岩石傀儡：缓慢但坚定
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
                    
                case '暗影刺客':
                    // 暗影刺客：隐身瞬移攻击
                    enemy.stealthTimer = enemy.stealthTimer || 0;
                    enemy.stealthTimer++;
                    
                    if (enemy.stealthTimer > 180 && Math.random() < 0.08) {
                        // 瞬移到玩家背后
                        const teleportAngle = Math.atan2(dy, dx) + Math.PI;
                        const teleportDistance = 40 + Math.random() * 20;
                        enemy.x = player.x + Math.cos(teleportAngle) * teleportDistance;
                        enemy.y = player.y + Math.sin(teleportAngle) * teleportDistance;
                        enemy.stealthTimer = 0;
                        enemy.alpha = 0.3; // 隐身效果
                    } else {
                        moveX = unitX * enemy.speed;
                        moveY = unitY * enemy.speed;
                    }
                    break;
                    
                case '巨型蜘蛛':
                    // 巨型蜘蛛：召唤小蜘蛛
                    enemy.spawnTimer = enemy.spawnTimer || 0;
                    enemy.spawnTimer++;
                    
                    if (enemy.spawnTimer > 240 && Math.random() < 0.05) {
                        // 召唤小蜘蛛
                        spawnSpiderling(enemy.x, enemy.y);
                        enemy.spawnTimer = 0;
                    }
                    
                    if (distance > 120) {
                        moveX = unitX * enemy.speed;
                        moveY = unitY * enemy.speed;
                    } else {
                        // 保持距离
                        moveX = -unitX * enemy.speed * 0.5;
                        moveY = -unitY * enemy.speed * 0.5;
                    }
                    break;
                    
                case '炎魔':
                case '冰霜巫师':
                    // 精英法师：保持距离，施放法术
                    if (distance > 150) {
                        moveX = unitX * enemy.speed * 0.8;
                        moveY = unitY * enemy.speed * 0.8;
                    } else if (distance < 100) {
                        moveX = -unitX * enemy.speed;
                        moveY = -unitY * enemy.speed;
                    } else {
                        // 侧向移动
                        moveX = -unitY * enemy.speed * 0.6;
                        moveY = unitX * enemy.speed * 0.6;
                    }
                    break;
                    
                case '寄生虫':
                    // 寄生虫：快速直接攻击
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
                    
                case '镜像怪':
                    // 镜像怪：模拟玩家移动
                    enemy.mirrorTimer = enemy.mirrorTimer || 0;
                    enemy.mirrorTimer++;
                    
                    if (enemy.mirrorTimer < 60) {
                        // 模拟玩家移动
                        moveX = -unitX * enemy.speed * 0.8;
                        moveY = -unitY * enemy.speed * 0.8;
                    } else if (enemy.mirrorTimer < 120) {
                        // 直接攻击
                        moveX = unitX * enemy.speed * 1.2;
                        moveY = unitY * enemy.speed * 1.2;
                    } else {
                        enemy.mirrorTimer = 0;
                    }
                    break;
                    
                case '虚空行者':
                    // 虚空行者：维度穿梭
                    enemy.phaseTimer = enemy.phaseTimer || 0;
                    enemy.phaseTimer++;
                    
                    if (enemy.phaseTimer > 150 && Math.random() < 0.06) {
                        // 随机传送
                        enemy.x = Math.random() * canvas.width;
                        enemy.y = Math.random() * canvas.height;
                        enemy.phaseTimer = 0;
                    } else {
                        moveX = unitX * enemy.speed;
                        moveY = unitY * enemy.speed;
                    }
                    break;
                
                // 兼容旧敌人类型和精英敌人
                default:
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
            }
        }
        
        // 保存移动方向用于特效 - 添加防御性检查
        if (moveX !== 0 || moveY !== 0) {
            // 确保lastDirection对象存在
            if (!enemy.lastDirection) {
                enemy.lastDirection = { x: 0, y: 0 };
            }
            
            // 防止除零错误
            if (enemy.speed && enemy.speed > 0) {
                enemy.lastDirection.x = moveX / enemy.speed;
                enemy.lastDirection.y = moveY / enemy.speed;
            }
        }
        
        // 应用移动
        enemy.x += moveX;
        enemy.y += moveY;
        
        // 更新受伤闪烁计时器
        if (enemy.isHit > 0) {
            enemy.isHit--;
        }
        
        // 处理小兵的生命周期
        if (enemy.type.isMinion && enemy.lifetime) {
            enemy.lifetime--;
            if (enemy.lifetime <= 0) {
                // 小兵消失特效
                if (typeof createParticles !== 'undefined') {
                    createParticles(enemy.x + enemy.getWidth()/2, enemy.y + enemy.getHeight()/2, '#CCCCCC', 5, 'magic');
                }
                enemies.splice(i, 1);
                continue;
            }
        }
    }
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
                    // 检查护盾效果
                    if (typeof hasShield !== 'undefined' && hasShield()) {
                        if (typeof consumeShield !== 'undefined') {
                            consumeShield();
                        }
                        // 护盾吸收伤害
                        if (typeof createParticles !== 'undefined') {
                            createParticles(player.x + player.getWidth()/2, player.y + player.getHeight()/2, '#9932CC', 5, 'magic');
                        }
                    } else {
                        player.health -= 5;
                    }
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

// 绘制敌人（使用新的像素精灵渲染系统）
function drawEnemies() {
    const time = Date.now();
    
    enemies.forEach((enemy, index) => {
        // 血量条（Boss和精英敌人显示）
        if (enemy.isBoss || enemy.type.isElite || 
            ['恶魔', '吸血鬼', '狼人', '暗影刺客', '巨型蜘蛛', '炎魔', '冰霜巫师'].includes(enemy.type.name)) {
            
            const healthPercentage = enemy.health / enemy.maxHealth;
            const barWidth = enemy.getWidth() + 10;
            const barHeight = 4;
            const barX = enemy.x + enemy.getWidth()/2 - barWidth/2;
            const barY = enemy.y - 12;
            
            // 血量条背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // 血量条填充
            const healthWidth = barWidth * healthPercentage;
            ctx.fillStyle = healthPercentage > 0.7 ? '#4CAF50' : 
                            healthPercentage > 0.4 ? '#FF9800' : 
                            healthPercentage > 0.15 ? '#FF5722' : '#F44336';
            ctx.fillRect(barX, barY, healthWidth, barHeight);
            
            // BOSS额外装饰
            if (enemy.isBoss) {
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 1;
                ctx.strokeRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
            }
        }
        
        // 使用新的精灵渲染系统
        if (typeof spriteRenderer !== 'undefined') {
            spriteRenderer.renderEnemy(ctx, enemy, time);
        } else {
            // 回退到传统渲染方案
            const enemyType = enemy.type;
            const isHit = enemy.isHit > 0 && enemy.isHit % 4 < 2;
            
            ctx.save();
            
            if (isHit) {
                ctx.globalAlpha = 0.5;
                ctx.shadowColor = '#FFFFFF';
                ctx.shadowBlur = 20;
            }
            
            if (enemyType.icon) {
                ctx.font = `${enemy.getWidth()}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = enemyType.color;
                ctx.fillText(enemyType.icon, 
                    enemy.x + enemy.getWidth()/2, 
                    enemy.y + enemy.getHeight()/2
                );
            } else {
                const gradient = ctx.createRadialGradient(
                    enemy.x + enemy.getWidth()/2, 
                    enemy.y + enemy.getHeight()/2, 
                    0,
                    enemy.x + enemy.getWidth()/2, 
                    enemy.y + enemy.getHeight()/2, 
                    enemy.getWidth()/2
                );
                gradient.addColorStop(0, enemyType.color);
                gradient.addColorStop(0.7, enemyType.color);
                gradient.addColorStop(1, '#000000');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(enemy.x, enemy.y, enemy.getWidth(), enemy.getHeight());
            }
            
            // Boss装饰
            if (enemy.isBoss) {
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.strokeRect(enemy.x - 2, enemy.y - 2, enemy.getWidth() + 4, enemy.getHeight() + 4);
            }
            
            ctx.restore();
        }
    });
}

// === 新增敌人辅助函数 ===

// BOSS专用召唤函数 - 不受BOSS战模式限制
function spawnBossMinion(x, y, minionType = 'skeleton') {
    let minionConfig;
    
    switch(minionType) {
        case 'skeleton':
            minionConfig = {
                name: 'BOSS召唤骷髅',
                health: 8, // 比普通骷髅稍强
                speed: 3.0,
                size: 12,
                color: '#FFD700', // 金色，表示是BOSS召唤
                exp: 8,
                icon: '💀',
                isMinion: true,
                isBossMinion: true // 标记为BOSS召唤物
            };
            break;
        case 'spider':
            minionConfig = {
                name: 'BOSS召唤蜘蛛',
                health: 5,
                speed: 4.0,
                size: 10,
                color: '#FFD700',
                exp: 6,
                icon: '🕸️',
                isMinion: true,
                isBossMinion: true
            };
            break;
        default:
            minionConfig = {
                name: 'BOSS召唤物',
                health: 6,
                speed: 3.5,
                size: 12,
                color: '#FFD700',
                exp: 7,
                icon: '👹',
                isMinion: true,
                isBossMinion: true
            };
    }
    
    // 创建召唤物
    const minionCount = 2 + Math.floor(Math.random() * 2); // 2-3个
    for (let i = 0; i < minionCount; i++) {
        const angle = (Math.PI * 2 * i) / minionCount;
        const spawnRadius = 30 + Math.random() * 20;
        const minionX = x + Math.cos(angle) * spawnRadius;
        const minionY = y + Math.sin(angle) * spawnRadius;
        
        const minion = {
            x: minionX,
            y: minionY,
            type: minionConfig,
            speed: minionConfig.speed * (0.8 + Math.random() * 0.4),
            health: minionConfig.health,
            maxHealth: minionConfig.health,
            isHit: 0,
            lastDirection: { x: 0, y: 0 },
            behaviorTimer: 0,
            lifetime: 900, // 15秒后自动消失
            getWidth() { return minionConfig.size; },
            getHeight() { return minionConfig.size; }
        };
        
        enemies.push(minion);
        
        // 创建召唤特效
        if (typeof createParticles !== 'undefined') {
            createParticles(minionX, minionY, '#FFD700', 12, 'boss_summon');
        }
    }
    
    console.log(`🔥 BOSS召唤了${minionCount}个${minionConfig.name}！`);
}

// 生成小蜘蛛
function spawnSpiderling(x, y) {
    // BOSS战期间，限制巨型蜘蛛召唤小蜘蛛的数量
    if (window.bossActive || bossActive) {
        // BOSS战期间召唤能力减弱
        if (Math.random() < 0.6) {
            return; // 60%概率不召唤
        }
    }
    
    const spiderlingType = {
        name: '小蜘蛛',
        health: 3,
        speed: 4.0,
        size: 8,
        color: '#8B0000',
        exp: 5,
        icon: '🕸️',
        isMinion: true
    };
    
    // 在巨型蜘蛛周围生成2-3个小蜘蛛
    const spiderlingCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < spiderlingCount; i++) {
        const angle = (Math.PI * 2 * i) / spiderlingCount;
        const spawnRadius = 25 + Math.random() * 15;
        const spiderlingX = x + Math.cos(angle) * spawnRadius;
        const spiderlingY = y + Math.sin(angle) * spawnRadius;
        
        const spiderling = {
            x: spiderlingX,
            y: spiderlingY,
            type: spiderlingType,
            speed: spiderlingType.speed * (0.9 + Math.random() * 0.2),
            health: spiderlingType.health,
            maxHealth: spiderlingType.health,
            isHit: 0,
            lastDirection: { x: 0, y: 0 }, // 确保一致性
            behaviorTimer: 0,
            lifetime: 900, // 15秒后自动消失
            getWidth() { return spiderlingType.size; },
            getHeight() { return spiderlingType.size; }
        };
        
        enemies.push(spiderling);
        
        // 创建召唤特效
        if (typeof createParticles !== 'undefined') {
            createParticles(spiderlingX, spiderlingY, '#8B0000', 8, 'magic');
        }
    }
}

// 新增特殊能力处理
function updateNewEnemyAbilities(enemy) {
    if (!enemy.type.special) return;
    
    switch (enemy.type.special) {
        case 'death_explosion':
            // 火元素死亡爆炸在子弹碰撞检测中处理
            break;
            
        case 'freeze_aura':
            // 冰元素冰冻光环
            if (!enemy.freezeTimer) enemy.freezeTimer = 0;
            enemy.freezeTimer++;
            
            if (enemy.freezeTimer % 120 === 0) {
                const freezeRange = 60;
                const playerDistance = Math.sqrt(
                    Math.pow(player.x - enemy.x, 2) + 
                    Math.pow(player.y - enemy.y, 2)
                );
                
                if (playerDistance < freezeRange) {
                    // 玩家减速效果
                    if (typeof applySlowEffect !== 'undefined') {
                        applySlowEffect(0.5, 180); // 50%减速3秒
                    }
                }
            }
            break;
            
        case 'poison_cloud':
            // 毒蘑菇毒雾
            if (!enemy.poisonCloudTimer) enemy.poisonCloudTimer = 0;
            enemy.poisonCloudTimer++;
            
            if (enemy.poisonCloudTimer % 180 === 0) {
                // 创建毒雾粒子效果
                if (typeof createParticles !== 'undefined') {
                    createParticles(
                        enemy.x + enemy.getWidth()/2,
                        enemy.y + enemy.getHeight()/2,
                        '#9ACD32',
                        12,
                        'poison'
                    );
                }
                
                // 毒雾伤害
                const poisonRange = 80;
                const playerDistance = Math.sqrt(
                    Math.pow(player.x - enemy.x, 2) + 
                    Math.pow(player.y - enemy.y, 2)
                );
                
                if (playerDistance < poisonRange && player.invulnerable === 0) {
                    player.health -= 3;
                    player.invulnerable = 30;
                }
            }
            break;
            
        case 'heavy_armor':
            // 岩石傀儡重甲：减少受到的伤害在武器碰撞检测中处理
            break;
            
        case 'split_on_death':
            // 寄生虫死亡分裂在死亡处理中实现
            break;
            
        case 'stealth_teleport':
            // 暗影刺客隐身已在AI中实现
            // 这里处理隐身视觉效果
            if (enemy.alpha && enemy.alpha < 1) {
                enemy.alpha = Math.min(enemy.alpha + 0.02, 1.0);
            }
            break;
            
        case 'spawn_spiderlings':
            // 巨型蜘蛛召唤已在AI中实现
            break;
            
        case 'fire_aura_elite':
            // 炎魔强化火焰光环
            if (!enemy.eliteAuraTimer) enemy.eliteAuraTimer = 0;
            enemy.eliteAuraTimer++;
            
            if (enemy.eliteAuraTimer % 45 === 0) {
                const auraRange = 100;
                const playerDistance = Math.sqrt(
                    Math.pow(player.x - enemy.x, 2) + 
                    Math.pow(player.y - enemy.y, 2)
                );
                
                if (playerDistance < auraRange && player.invulnerable === 0) {
                    player.health -= 8;
                    player.invulnerable = 45;
                    
                    // 创建火焰特效
                    if (typeof createParticles !== 'undefined') {
                        createParticles(player.x + player.getWidth()/2, player.y + player.getHeight()/2, '#FF4500', 10, 'fire');
                    }
                }
            }
            break;
            
        case 'ice_barrage':
            // 冰霜巫师冰弹幕
            if (!enemy.barrageTimer) enemy.barrageTimer = 0;
            enemy.barrageTimer++;
            
            if (enemy.barrageTimer > 240 && Math.random() < 0.03) {
                // 发射冰弹幕
                createIceBarrage(enemy.x + enemy.getWidth()/2, enemy.y + enemy.getHeight()/2);
                enemy.barrageTimer = 0;
            }
            break;
    }
}

// 创建冰弹幕
function createIceBarrage(x, y) {
    const barrageCount = 8;
    for (let i = 0; i < barrageCount; i++) {
        const angle = (Math.PI * 2 * i) / barrageCount;
        const iceProjectile = {
            x: x,
            y: y,
            vx: Math.cos(angle) * 4,
            vy: Math.sin(angle) * 4,
            damage: 15,
            lifetime: 120,
            type: 'ice_shard'
        };
        
        // 添加到敌人投射物数组（需要在其他地方定义）
        if (typeof enemyProjectiles !== 'undefined') {
            enemyProjectiles.push(iceProjectile);
        }
    }
}

// === BOSS战系统核心函数 ===

// 检查是否应该触发BOSS战
function checkBossSpawn() {
    if (bossWarningActive || activeBoss) return;
    
    if (bossKillCount >= BossConfig.KILLS_PER_BOSS) {
        startBossWarning();
    }
}

// 开始BOSS警告
function startBossWarning() {
    bossWarningActive = true;
    bossWarningTimer = 180; // 3秒警告时间
    
    // 清除屏幕上的普通敌人
    clearRegularEnemies();
    
    console.log('BOSS警告：强大的敌人即将出现！');
    
    // 播放警告音效
    if (typeof audioManager !== 'undefined') {
        audioManager.playSound('enemyDeath', 1.5); // 暂用现有音效
    }
}

// 清除普通敌人
function clearRegularEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (!enemy.isBoss) {
            // 创建消失特效
            if (typeof createParticles !== 'undefined') {
                createParticles(
                    enemy.x + enemy.getWidth()/2,
                    enemy.y + enemy.getHeight()/2,
                    enemy.type.color,
                    8,
                    'disappear'
                );
            }
            enemies.splice(i, 1);
        }
    }
}

// 生成BOSS
function spawnNewBoss() {
    if (currentBossIndex >= BOSS_SEQUENCE.length) {
        // 所有BOSS都被击败，循环生成更强的BOSS
        currentBossIndex = 0;
    }
    
    const bossType = BOSS_SEQUENCE[currentBossIndex];
    const bossConfig = BossConfig.BOSS_PHASES[bossType];
    
    // BOSS配置验证和错误恢复
    if (!bossConfig) {
        console.error(`❌ BOSS配置未找到: ${bossType}`);
        console.log('📋 可用的BOSS类型:', Object.keys(BossConfig.BOSS_PHASES));
        
        // 错误恢复：使用第一个可用的BOSS配置
        const fallbackBossType = Object.keys(BossConfig.BOSS_PHASES)[0];
        if (fallbackBossType) {
            console.warn(`🔄 使用备用BOSS: ${fallbackBossType}`);
            const fallbackConfig = BossConfig.BOSS_PHASES[fallbackBossType];
            return spawnFallbackBoss(fallbackConfig, fallbackBossType, cycleMultiplier);
        } else {
            console.error('💥 无法找到任何BOSS配置，取消BOSS生成');
            bossWarningActive = false;
            return;
        }
    }
    
    // 验证BOSS配置完整性
    const requiredProps = ['name', 'health', 'speed', 'size', 'color', 'exp', 'icon', 'phases'];
    const missingProps = requiredProps.filter(prop => !bossConfig.hasOwnProperty(prop));
    
    if (missingProps.length > 0) {
        console.error(`❌ BOSS配置不完整，缺少属性: ${missingProps.join(', ')}`);
        
        // 使用默认值填补缺失属性
        const defaultBossConfig = {
            name: '未知BOSS',
            health: 800,
            speed: 1.5,
            size: 70,
            color: '#FF0000',
            exp: 300,
            icon: '👹',
            phases: [
                {
                    healthThreshold: 1.0,
                    abilities: ['summon_skeletons']
                }
            ]
        };
        
        // 合并配置
        Object.assign(bossConfig, defaultBossConfig, bossConfig);
        console.warn('🔧 已使用默认值修复BOSS配置');
    }
    
    // 根据循环次数增强BOSS - 提升递增幅度以增加挑战性
    const cycleMultiplier = 1 + Math.floor(currentBossIndex / BOSS_SEQUENCE.length) * 0.75;
    
    // 从屏幕边缘随机位置生成BOSS
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
        case 0: // 上边
            x = Math.random() * canvas.width;
            y = -bossConfig.size;
            break;
        case 1: // 右边
            x = canvas.width + bossConfig.size;
            y = Math.random() * canvas.height;
            break;
        case 2: // 下边
            x = Math.random() * canvas.width;
            y = canvas.height + bossConfig.size;
            break;
        case 3: // 左边
            x = -bossConfig.size;
            y = Math.random() * canvas.height;
            break;
    }
    
    activeBoss = {
        x: x,
        y: y,
        type: {
            name: bossConfig.name,
            health: bossConfig.health * cycleMultiplier,
            speed: bossConfig.speed,
            size: bossConfig.size,
            color: bossConfig.color,
            exp: bossConfig.exp * cycleMultiplier,
            icon: bossConfig.icon,
            special: 'boss_abilities'
        },
        speed: bossConfig.speed,
        health: bossConfig.health * cycleMultiplier,
        maxHealth: bossConfig.health * cycleMultiplier,
        isHit: 0,
        isBoss: true,
        bossType: bossType,
        phases: bossConfig.phases,
        currentPhase: 0,
        abilities: [...bossConfig.phases[0].abilities],
        abilityCooldowns: {},
        lastAbilityTime: Date.now(),
        behaviorTimer: 0,
        lastDirection: { x: 0, y: 0 }, // 修复：添加缺失的lastDirection属性
        getWidth() { return this.type.size; },
        getHeight() { return this.type.size; }
    };
    
    // 初始化能力冷却
    activeBoss.abilities.forEach(ability => {
        activeBoss.abilityCooldowns[ability] = 0;
    });
    
    enemies.push(activeBoss);
    window.bossActive = true;
    bossActive = true; // 确保本地变量也被设置
    bossPhase = 0;
    
    console.log(`🔥 BOSS战开始: ${bossConfig.name} (等级 ${Math.floor(currentBossIndex / BOSS_SEQUENCE.length) + 1})`);
    console.log('⚔️ 进入BOSS专属战斗模式，普通敌人生成已暂停！');
    
    // 创建强烈的屏幕震动
    if (typeof startScreenShake !== 'undefined') {
        startScreenShake(20, 120); // 强烈震动2秒
    }
    
    // 播放BOSS出现音效
    if (typeof audioManager !== 'undefined') {
        audioManager.playSound('enemyDeath', 2.0);
    }
}

// 更新BOSS行为
function updateBossAI(boss) {
    if (!boss || !boss.isBoss) return;
    
    // 检查阶段转换
    checkBossPhaseTransition(boss);
    
    // 执行BOSS能力
    executeBossAbilities(boss);
    
    // BOSS特殊移动AI
    updateBossMovement(boss);
}

// 检查BOSS阶段转换
function checkBossPhaseTransition(boss) {
    const healthPercentage = boss.health / boss.maxHealth;
    const phases = boss.phases;
    
    for (let i = phases.length - 1; i >= 0; i--) {
        const phase = phases[i];
        if (healthPercentage <= phase.healthThreshold && boss.currentPhase < i) {
            // 进入新阶段
            boss.currentPhase = i;
            boss.abilities = [...phase.abilities];
            
            console.log(`${boss.type.name} 进入阶段 ${i + 1}!`);
            
            // 阶段转换特效
            if (typeof createParticles !== 'undefined') {
                createParticles(
                    boss.x + boss.getWidth()/2,
                    boss.y + boss.getHeight()/2,
                    boss.type.color,
                    20,
                    'boss_phase'
                );
            }
            
            // 屏幕震动
            if (typeof startScreenShake !== 'undefined') {
                startScreenShake(15, 60);
            }
            break;
        }
    }
}

// 执行BOSS能力
function executeBossAbilities(boss) {
    if (!boss || !boss.abilities || !Array.isArray(boss.abilities)) {
        console.warn('⚠️ BOSS能力数组无效，跳过能力执行');
        return;
    }
    
    const currentTime = Date.now();
    
    boss.abilities.forEach(abilityName => {
        try {
            const ability = BossConfig.BOSS_ABILITIES[abilityName];
            if (!ability) {
                console.warn(`⚠️ BOSS能力未找到: ${abilityName}`);
                return;
            }
            
            // 检查冷却时间
            const lastUsed = boss.abilityCooldowns[abilityName] || 0;
            if (currentTime - lastUsed < ability.cooldown * 16.67) return; // 转换为毫秒
            
            // 执行能力
            if (Math.random() < 0.02) { // 2%概率每帧
                executeBossAbility(boss, abilityName, ability);
                boss.abilityCooldowns[abilityName] = currentTime;
            }
        } catch (error) {
            console.error(`💥 BOSS能力执行错误 [${abilityName}]:`, error);
        }
    });
}

// 执行具体的BOSS能力
function executeBossAbility(boss, abilityName, ability) {
    const playerX = player.x + player.getWidth()/2;
    const playerY = player.y + player.getHeight()/2;
    const bossX = boss.x + boss.getWidth()/2;
    const bossY = boss.y + boss.getHeight()/2;
    
    console.log(`${boss.type.name} 使用技能: ${ability.name}`);
    
    switch(abilityName) {
        case 'summon_skeletons':
            // 召唤骷髅小兵 - BOSS技能，不受BOSS战模式限制
            for (let i = 0; i < ability.count; i++) {
                const angle = (Math.PI * 2 * i) / ability.count;
                const distance = 80 + Math.random() * 40;
                const skeletonX = bossX + Math.cos(angle) * distance;
                const skeletonY = bossY + Math.sin(angle) * distance;
                
                spawnBossMinion(skeletonX, skeletonY, 'skeleton');
            }
            break;
            
        case 'bone_spikes':
            // 骨刺突袭 - 创建追踪玩家的骨刺
            createBoneSpike(playerX, playerY, ability.damage);
            break;
            
        case 'death_nova':
            // 死亡新星 - 环形伤害
            createDeathNova(bossX, bossY, ability.damage, ability.range);
            break;
            
        case 'elemental_orbs':
            // 元素球攻击
            for (let i = 0; i < ability.count; i++) {
                const angle = (Math.PI * 2 * i) / ability.count + Date.now() * 0.001;
                createElementalOrb(bossX, bossY, angle, ability.damage);
            }
            break;
            
        case 'shadow_breath':
            // 暗影吐息
            const breathAngle = Math.atan2(playerY - bossY, playerX - bossX);
            createShadowBreath(bossX, bossY, breathAngle, ability.damage, ability.range, ability.width);
            break;
            
        case 'laser_sweep':
            // 激光扫射
            createLaserSweep(bossX, bossY, ability.damage, ability.duration);
            break;
            
        case 'void_rifts':
            // 虚空裂缝
            for (let i = 0; i < ability.count; i++) {
                const riftX = Math.random() * canvas.width;
                const riftY = Math.random() * canvas.height;
                createVoidRift(riftX, riftY, ability.damage, ability.duration);
            }
            break;
    }
    
    // 创建能力使用特效
    if (typeof createParticles !== 'undefined') {
        createParticles(bossX, bossY, boss.type.color, 15, 'boss_ability');
    }
}

// BOSS移动AI
function updateBossMovement(boss) {
    const dx = player.x + player.getWidth()/2 - (boss.x + boss.getWidth()/2);
    const dy = player.y + player.getHeight()/2 - (boss.y + boss.getHeight()/2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
        const unitX = dx / distance;
        const unitY = dy / distance;
        
        // 根据BOSS类型实现不同的移动模式
        switch(boss.bossType) {
            case 'SKELETON_KING':
                // 缓慢追击，保持中等距离
                if (distance > 200) {
                    boss.x += unitX * boss.speed;
                    boss.y += unitY * boss.speed;
                } else if (distance < 120) {
                    boss.x -= unitX * boss.speed * 0.5;
                    boss.y -= unitY * boss.speed * 0.5;
                }
                break;
                
            case 'ELEMENTAL_TITAN':
                // 圆形移动模式
                boss.behaviorTimer = boss.behaviorTimer || 0;
                boss.behaviorTimer++;
                const orbitRadius = 150;
                const orbitSpeed = 0.02;
                const targetX = player.x + Math.cos(boss.behaviorTimer * orbitSpeed) * orbitRadius;
                const targetY = player.y + Math.sin(boss.behaviorTimer * orbitSpeed) * orbitRadius;
                
                boss.x += (targetX - boss.x) * 0.02;
                boss.y += (targetY - boss.y) * 0.02;
                break;
                
            case 'SHADOW_DRAGON':
                // 快速冲刺攻击
                boss.dashTimer = boss.dashTimer || 0;
                boss.dashTimer++;
                
                if (boss.dashTimer % 180 < 60) {
                    // 冲刺阶段
                    boss.x += unitX * boss.speed * 2;
                    boss.y += unitY * boss.speed * 2;
                } else {
                    // 悬停阶段
                    boss.x += unitX * boss.speed * 0.3;
                    boss.y += unitY * boss.speed * 0.3;
                }
                break;
                
            case 'MECHANICAL_BEAST':
                // 直线追击，偶尔停下蓄力
                boss.chargeTimer = boss.chargeTimer || 0;
                boss.chargeTimer++;
                
                if (boss.chargeTimer % 240 < 180) {
                    boss.x += unitX * boss.speed;
                    boss.y += unitY * boss.speed;
                }
                // 60帧停止蓄力
                break;
                
            case 'VOID_SOVEREIGN':
                // 传送移动
                boss.teleportTimer = boss.teleportTimer || 0;
                boss.teleportTimer++;
                
                if (boss.teleportTimer > 300 && Math.random() < 0.05) {
                    // 传送到随机位置
                    boss.x = Math.random() * canvas.width;
                    boss.y = Math.random() * canvas.height;
                    boss.teleportTimer = 0;
                    
                    // 传送特效
                    if (typeof createParticles !== 'undefined') {
                        createParticles(boss.x + boss.getWidth()/2, boss.y + boss.getHeight()/2, '#191970', 15, 'teleport');
                    }
                } else {
                    // 缓慢移动
                    boss.x += unitX * boss.speed * 0.5;
                    boss.y += unitY * boss.speed * 0.5;
                }
                break;
        }
    }
}

// BOSS死亡处理
function onBossDefeated() {
    if (!activeBoss) return;
    
    console.log(`${activeBoss.type.name} 被击败！`);
    
    // 重置BOSS相关变量
    activeBoss = null;
    window.bossActive = false;
    bossActive = false; // 确保本地变量也被重置
    bossKillCount = 0; // 重置击杀计数
    currentBossIndex++;
    
    // 恢复普通敌人生成的提示
    console.log('🎉 BOSS战结束，普通敌人生成已恢复！');
    
    // 创建胜利特效
    if (typeof createParticles !== 'undefined') {
        for (let i = 0; i < 30; i++) {
            createParticles(
                canvas.width/2 + (Math.random() - 0.5) * 200,
                canvas.height/2 + (Math.random() - 0.5) * 200,
                '#FFD700',
                1,
                'victory'
            );
        }
    }
    
    // 强烈屏幕震动
    if (typeof startScreenShake !== 'undefined') {
        startScreenShake(25, 180); // 3秒震动
    }
    
    // 播放胜利音效
    if (typeof audioManager !== 'undefined') {
        audioManager.playSound('levelUp', 1.5);
    }
}

// 备用BOSS生成函数
function spawnFallbackBoss(bossConfig, bossType, cycleMultiplier) {
    console.log('🛡️ 生成备用BOSS:', bossConfig.name);
    
    // 使用与主BOSS生成相同的逻辑，但使用备用配置
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
        case 0: x = Math.random() * canvas.width; y = -bossConfig.size; break;
        case 1: x = canvas.width + bossConfig.size; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = canvas.height + bossConfig.size; break;
        case 3: x = -bossConfig.size; y = Math.random() * canvas.height; break;
    }
    
    activeBoss = {
        x: x, y: y,
        type: {
            name: bossConfig.name,
            health: bossConfig.health * cycleMultiplier,
            speed: bossConfig.speed,
            size: bossConfig.size,
            color: bossConfig.color,
            exp: bossConfig.exp * cycleMultiplier,
            icon: bossConfig.icon,
            special: 'boss_abilities'
        },
        speed: bossConfig.speed,
        health: bossConfig.health * cycleMultiplier,
        maxHealth: bossConfig.health * cycleMultiplier,
        isHit: 0, isBoss: true, bossType: bossType,
        phases: bossConfig.phases, currentPhase: 0,
        abilities: [...bossConfig.phases[0].abilities],
        abilityCooldowns: {}, lastAbilityTime: Date.now(),
        behaviorTimer: 0, lastDirection: { x: 0, y: 0 },
        getWidth() { return this.type.size; },
        getHeight() { return this.type.size; }
    };
    
    // 初始化能力冷却
    activeBoss.abilities.forEach(ability => {
        activeBoss.abilityCooldowns[ability] = 0;
    });
    
    enemies.push(activeBoss);
    window.bossActive = true;
    bossActive = true; // 确保本地变量也被设置
    console.log(`✅ 备用BOSS生成成功: ${bossConfig.name}`);
    console.log('⚔️ 进入BOSS专属战斗模式，普通敌人生成已暂停！');
}

// 更新BOSS警告系统
function updateBossWarning() {
    if (!bossWarningActive) return;
    
    bossWarningTimer--;
    if (bossWarningTimer <= 0) {
        bossWarningActive = false;
        
        try {
            spawnNewBoss();
        } catch (error) {
            console.error('💥 BOSS生成失败:', error);
            console.log('🔄 尝试重置BOSS系统...');
            
            // 错误恢复
            bossKillCount = Math.max(0, bossKillCount - 50); // 减少击杀计数，稍后重试
            bossWarningActive = false;
            activeBoss = null;
            
            console.log('✅ BOSS系统已重置，将在下次击杀里程碑时重试');
        }
    }
}

// === 精灵渲染系统已移至 sprite-renderer.js ===
// 所有像素精灵数据和渲染逻辑现在位于独立的模块中

// === BOSS系统诊断和测试函数 ===

// 系统诊断函数
function diagnoseBossSystem() {
    console.group('🔍 BOSS系统诊断报告');
    
    // 检查变量状态
    console.log('📊 系统状态:');
    console.log('  - 击杀计数:', typeof bossKillCount !== 'undefined' ? bossKillCount : 'undefined');
    console.log('  - 当前BOSS索引:', currentBossIndex);
    console.log('  - 活跃BOSS:', activeBoss ? activeBoss.type.name : 'None');
    console.log('  - BOSS警告激活:', bossWarningActive);
    console.log('  - 警告计时器:', bossWarningTimer);
    
    // 检查配置完整性
    console.log('🔧 配置检查:');
    console.log('  - BOSS序列长度:', BOSS_SEQUENCE.length);
    console.log('  - 可用BOSS配置:', Object.keys(BossConfig.BOSS_PHASES).length);
    
    // 验证每个BOSS配置
    Object.entries(BossConfig.BOSS_PHASES).forEach(([bossType, config]) => {
        const requiredProps = ['name', 'health', 'speed', 'size', 'color', 'exp', 'icon', 'phases'];
        const missingProps = requiredProps.filter(prop => !config.hasOwnProperty(prop));
        
        if (missingProps.length > 0) {
            console.warn(`  ⚠️ ${bossType} 缺少属性:`, missingProps);
        } else {
            console.log(`  ✅ ${bossType} 配置完整`);
        }
    });
    
    // 敌人数组状态
    console.log('👹 敌人状态:');
    console.log('  - 敌人总数:', enemies.length);
    const bossCount = enemies.filter(e => e.isBoss).length;
    console.log('  - BOSS数量:', bossCount);
    
    console.groupEnd();
    
    return {
        bossKillCount: typeof bossKillCount !== 'undefined' ? bossKillCount : 0,
        activeBoss: !!activeBoss,
        configValid: Object.keys(BossConfig.BOSS_PHASES).length > 0,
        enemyCount: enemies.length
    };
}

// 强制触发BOSS（测试用）
function forceTriggerBoss() {
    console.log('🚀 强制触发BOSS（测试模式）');
    bossKillCount = BossConfig.KILLS_PER_BOSS;
    startBossWarning();
}

// 重置BOSS系统
function resetBossSystem() {
    console.log('🔄 重置BOSS系统');
    activeBoss = null;
    window.bossActive = false;
    bossActive = false; // 确保本地变量也被重置
    bossKillCount = 0;
    currentBossIndex = 0;
    bossWarningActive = false;
    bossWarningTimer = 0;
    
    // 清除现有BOSS
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].isBoss) {
            enemies.splice(i, 1);
        }
    }
    
    console.log('✅ BOSS系统已重置');
}

// 将诊断函数暴露给全局，方便控制台调用
if (typeof window !== 'undefined') {
    window.diagnoseBossSystem = diagnoseBossSystem;
    window.forceTriggerBoss = forceTriggerBoss;
    window.resetBossSystem = resetBossSystem;
}

