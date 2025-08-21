// 玩家系统

// 创建玩家对象
const player = {
    x: GameConfig.PLAYER.INITIAL_X,
    y: GameConfig.PLAYER.INITIAL_Y,
    speed: GameConfig.PLAYER.SPEED,
    level: GameConfig.PLAYER.INITIAL_LEVEL,
    exp: GameConfig.PLAYER.INITIAL_EXP,
    expToNextLevel: GameConfig.PLAYER.INITIAL_EXP_TO_NEXT,
    health: GameConfig.PLAYER.INITIAL_HEALTH,
    maxHealth: GameConfig.PLAYER.INITIAL_HEALTH,
    invulnerable: 0, // 无敌时间
    lastX: GameConfig.PLAYER.INITIAL_X,
    lastY: GameConfig.PLAYER.INITIAL_Y,
    velocityX: 0, // 移动速度向量
    velocityY: 0,
    movementTrail: [], // 移动轨迹
    actionGlow: 0, // 动作光晕强度
    comboKills: 0, // 连击数
    comboTimer: 0, // 连击计时器
    killCount: 0, // 总击杀数
    comboCount: 0, // 当前连击数
    lastKillTime: 0, // 上次击杀时间
    getWidth() { return assets.player ? assets.player.width : GameConfig.PLAYER.WIDTH; },
    getHeight() { return assets.player ? assets.player.height : GameConfig.PLAYER.HEIGHT; }
};

// 经验宝石数组
const experienceGems = [];

// 更新玩家位置函数
function updatePlayer() {
    // 记录上一帧位置
    player.lastX = player.x;
    player.lastY = player.y;
    
    let moved = false;
    let newX = player.x;
    let newY = player.y;
    
    // 获取道具效果
    const speedMultiplier = typeof getEffectMultiplier !== 'undefined' ? getEffectMultiplier('speed_boost') : 1.0;
    const currentSpeed = player.speed * speedMultiplier;
    
    // 检查键盘输入并移动玩家
    if (keys[KeyBindings.MOVE_UP]) {
        newY -= currentSpeed;
        moved = true;
    }
    if (keys[KeyBindings.MOVE_DOWN]) {
        newY += currentSpeed;
        moved = true;
    }
    if (keys[KeyBindings.MOVE_LEFT]) {
        newX -= currentSpeed;
        moved = true;
    }
    if (keys[KeyBindings.MOVE_RIGHT]) {
        newX += currentSpeed;
        moved = true;
    }
    
    // 更新速度向量（用于动画效果）
    player.velocityX = newX - player.x;
    player.velocityY = newY - player.y;
    
    // 应用移动
    player.x = newX;
    player.y = newY;
    
    // 增加动作光晕
    if (moved) {
        player.actionGlow = Math.min(player.actionGlow + 2, 20);
    } else {
        player.actionGlow = Math.max(player.actionGlow - 1, 0);
    }
    
    // 边界检测
    const width = player.getWidth();
    const height = player.getHeight();
    
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + width > canvas.width) {
        player.x = canvas.width - width;
    }
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.y + height > canvas.height) {
        player.y = canvas.height - height;
    }
    
    // 更新移动轨迹
    if (moved) {
        player.movementTrail.push({
            x: player.x + width/2,
            y: player.y + height/2,
            lifespan: 15,
            maxLifespan: 15
        });
    }
    
    // 更新轨迹生命周期
    for (let i = player.movementTrail.length - 1; i >= 0; i--) {
        player.movementTrail[i].lifespan--;
        if (player.movementTrail[i].lifespan <= 0) {
            player.movementTrail.splice(i, 1);
        }
    }
    
    // 检查是否应该升级
    if (player.exp >= player.expToNextLevel && player.expToNextLevel > 0) {
        console.log(`升级检查: exp=${player.exp}, expToNextLevel=${player.expToNextLevel}`);
        levelUp();
    }
    
    // 更新无敌时间
    if (player.invulnerable > 0) {
        player.invulnerable--;
    }
    
    // 更新连击计时器
    if (player.comboTimer > 0) {
        player.comboTimer--;
        if (player.comboTimer <= 0) {
            player.comboKills = 0;
        }
    }
    
    // 更新经验宝石（超强磁性收集）
    for (let i = experienceGems.length - 1; i >= 0; i--) {
        const gem = experienceGems[i];
        
        const dx = player.x + player.getWidth()/2 - (gem.x + 5);
        const dy = player.y + player.getHeight()/2 - (gem.y + 5);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const collectRange = GameConfig.GAMEPLAY.EXPERIENCE_COLLECT_RANGE;
        const fastCollectRange = GameConfig.GAMEPLAY.EXPERIENCE_FAST_COLLECT_RANGE;
        const magnetRange = GameConfig.GAMEPLAY.EXPERIENCE_MAGNET_RANGE;
        
        if (distance < collectRange) {
            // 直接收集
            let expGain = gem.expValue || 20;
            
            // 应用经验加成效果
            const expMultiplier = typeof getEffectMultiplier !== 'undefined' ? getEffectMultiplier('exp_boost') : 1.0;
            const comboMultiplier = player.comboKills > 0 ? GameConfig.GAMEPLAY.COMBO_EXP_MULTIPLIER : 1.0;
            
            // 应用角色经验加成
            let characterExpMultiplier = 1.0;
            if (typeof selectedCharacter !== 'undefined' && selectedCharacter) {
                characterExpMultiplier = selectedCharacter.expMultiplier;
            }
            
            expGain = Math.floor(expGain * expMultiplier * comboMultiplier * characterExpMultiplier);
            
            experienceGems.splice(i, 1);
            player.exp += expGain;
            
            // 播放拾取音效
            audioManager.playSound('gemPickup', 0.5);
            
            // 创建强化收集特效
            createParticles(gem.x + 5, gem.y + 5, '#00BFFF', 6);
            createParticles(player.x + player.getWidth()/2, player.y + player.getHeight()/2, '#FFD700', 3);
        } else if (distance < fastCollectRange) {
            // 快速吸引区域
            const attractionStrength = 3.5;
            const unitX = dx / distance;
            const unitY = dy / distance;
            
            gem.x += unitX * attractionStrength;
            gem.y += unitY * attractionStrength;
            
            // 快速移动轨迹特效
            createParticles(gem.x + 5, gem.y + 5, '#87CEEB', 1);
        } else if (distance < magnetRange) {
            // 普通磁性吸引
            const attractionStrength = 1.5 + (magnetRange - distance) / magnetRange;
            const unitX = dx / distance;
            const unitY = dy / distance;
            
            gem.x += unitX * attractionStrength;
            gem.y += unitY * attractionStrength;
        }
    }
}

// 升级函数
function levelUp() {
    console.log(`LEVEL UP 开始: 当前等级=${player.level}, 经验=${player.exp}, 需要经验=${player.expToNextLevel}`);
    player.level++;
    player.exp -= player.expToNextLevel;
    
    // 优化经验需求计算：降低增长率并加入等级因子
    let baseRequirement = Math.floor(player.expToNextLevel * 1.3 + player.level * 10);
    
    // 应用角色经验需求修正
    if (typeof getCharacterExpRequirement !== 'undefined') {
        player.expToNextLevel = getCharacterExpRequirement(baseRequirement);
    } else {
        player.expToNextLevel = baseRequirement;
    }
    
    // 升级奖励：恢复满血量
    player.health = player.maxHealth;
    
    console.log(`LEVEL UP! Current Level: ${player.level}, 血量已恢复！`);
    
    // 打开升级选择菜单
    console.log('检查升级菜单函数是否存在:', typeof openUpgradeMenu);
    if (typeof openUpgradeMenu !== 'undefined') {
        console.log('打开升级选择菜单');
        openUpgradeMenu();
    } else {
        console.error('升级菜单函数未定义！');
    }
    
    // 播放升级音效
    audioManager.playSound('levelUp', 0.9);
    
    // 触发升级特效
    if (typeof startScreenShake !== 'undefined') {
        startScreenShake(8, 20);
    }
    if (typeof triggerFullScreenEffect !== 'undefined') {
        triggerFullScreenEffect('levelUp', 100);
    }
    
    // 角色升级特殊处理
    if (typeof handleCharacterLevelUp !== 'undefined') {
        handleCharacterLevelUp();
    }
    
    // 创建升级粒子效果
    if (typeof createParticles !== 'undefined') {
        createParticles(
            player.x + player.getWidth()/2,
            player.y + player.getHeight()/2,
            '#FFD700',
            15,
            'magic'
        );
    }
    
    // 第一次升级时解锁圣书武器
    if (player.level === 2 && weapons.book.level === 0) {
        weapons.book.level = 1;
        
        // 创建第一本环绕圣书
        const book = {
            angle: 0,
            distance: 60
        };
        orbitingBooks.push(book);
        
        console.log('获得新武器：环绕圣书！');
    }
    
    // 如果玩家选择升级圣书（简化处理，每5级增加一本书）
    if (player.level % 5 === 0 && weapons.book.level > 0) {
        const book = {
            angle: (orbitingBooks.length * Math.PI * 2) / (orbitingBooks.length + 1),
            distance: 60
        };
        orbitingBooks.push(book);
        console.log(`圣书升级！现在有 ${orbitingBooks.length} 本圣书！`);
    }
}

// 绘制玩家函数（华丽动画特效）
function drawPlayer() {
    const time = Date.now() * 0.01;
    
    ctx.save();
    
    // 绘制移动轨迹
    player.movementTrail.forEach((trail, index) => {
        const alpha = trail.lifespan / trail.maxLifespan * 0.4;
        const size = (trail.lifespan / trail.maxLifespan) * 8;
        
        ctx.fillStyle = `rgba(135, 206, 235, ${alpha})`;
        ctx.fillRect(trail.x - size/2, trail.y - size/2, size, size);
    });
    
    // 无敌时闪烁效果 - 只有在真正无敌时才闪烁
    if (player.invulnerable > 0 && player.invulnerable % 8 < 4) {
        ctx.restore();
        return; // 跳过绘制实现闪烁
    }
    
    // 动作光晕效果
    if (player.actionGlow > 0) {
        const glowIntensity = player.actionGlow / 20;
        ctx.shadowColor = '#87CEEB';
        ctx.shadowBlur = 15 * glowIntensity;
        
        // 战斗光环
        const pulseScale = 1 + Math.sin(time * 4) * 0.1 * glowIntensity;
        ctx.translate(player.x + player.getWidth()/2, player.y + player.getHeight()/2);
        ctx.scale(pulseScale, pulseScale);
        ctx.translate(-player.getWidth()/2, -player.getHeight()/2);
    }
    
    // 连击光晕效果
    if (player.comboKills >= 5) {
        const comboGlow = Math.min(player.comboKills / 10, 1);
        const comboColor = player.comboKills >= 15 ? '#FFD700' : '#FF6347';
        
        ctx.shadowColor = comboColor;
        ctx.shadowBlur = 20 * comboGlow;
    }
    
    // 移动到玩家位置进行绘制（考虑之前的变换）
    if (player.actionGlow === 0) {
        // 如果没有动作光晕，需要手动移动到玩家位置
        ctx.translate(player.x, player.y);
    }
    
    // 绘制玩家主体
    if (assets.loaded && assets.player) {
        ctx.drawImage(assets.player, 0, 0);
    } else {
        // 备用绘制方案 - 增强版白色方块
        const gradient = ctx.createLinearGradient(0, 0, 0, 30);
        gradient.addColorStop(0, '#E6E6FA');
        gradient.addColorStop(0.5, '#FFFFFF');
        gradient.addColorStop(1, '#C0C0C0');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 30, 30);
        
        // 玩家装备徽记
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(8, 8, 14, 14);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(12, 12, 6, 6);
    }
    
    ctx.restore();
}

// 绘制经验宝石
function drawExperienceGems() {
    const time = Date.now() * 0.01;
    
    experienceGems.forEach((gem, index) => {
        ctx.save();
        
        // 脉动效果
        const pulseScale = 0.8 + Math.sin(time * 3 + index * 0.5) * 0.3;
        const glowIntensity = 0.6 + Math.sin(time * 2 + index * 0.3) * 0.4;
        
        // 外层光晕
        ctx.fillStyle = `rgba(0, 191, 255, ${0.3 * glowIntensity})`;
        ctx.fillRect(gem.x - 2, gem.y - 2, 14, 14);
        
        // 主宝石
        ctx.translate(gem.x + 5, gem.y + 5);
        ctx.scale(pulseScale, pulseScale);
        ctx.rotate((time + index) * 0.1);
        
        // 外层菱形
        ctx.fillStyle = '#00BFFF';
        ctx.fillRect(-5, -5, 10, 10);
        
        // 内层光芒
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(-3, -3, 6, 6);
        
        // 核心光点
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-1, -1, 2, 2);
        
        ctx.restore();
    });
}