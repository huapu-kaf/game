// 武器和战斗系统

// 武器系统状态
const weapons = {
    book: { level: 0, damage: 10 },
    fireball: { level: 0, damage: 30, speed: 8, cooldown: 0, maxCooldown: 30 },
    missile: { level: 0, damage: 15, speed: 13, cooldown: 0, maxCooldown: 15 },
    frostbolt: { level: 0, damage: 20, speed: 10, cooldown: 0, maxCooldown: 20 },
    whip: { level: 0, damage: 25, cooldown: 0, maxCooldown: 40, range: 80 },
    garlic: { level: 0, damage: 8, range: 50, frequency: 10 },
    cross: { level: 0, damage: 18, speed: 12, cooldown: 0, maxCooldown: 35, range: 200 }
};

// 子弹数组
const bullets = [];

// 环绕圣书数组
const orbitingBooks = [];

// 鞭子攻击数组
const whipAttacks = [];

// 大蒜护盾效果
let garlicAura = { active: false, damage: 0, range: 0, frequency: 0, timer: 0 };

// 十字回旋镖数组
const crossBoomerangs = [];

// 射击函数
function shoot() {
    if (gameState !== GameStates.PLAYING) return;
    
    // 更新武器冷却
    for (let weaponName in weapons) {
        const weapon = weapons[weaponName];
        if (weapon.cooldown > 0) {
            weapon.cooldown--;
        }
    }
    
    // 自动武器系统 - 检查所有激活的武器
    for (let weaponName in weapons) {
        const weapon = weapons[weaponName];
        if (weapon.level > 0) {
            switch (weaponName) {
                case 'missile':
                case 'fireball':
                case 'frostbolt':
                    if (enemies.length > 0 && weapon.cooldown === 0) {
                        shootWeapon(weaponName);
                        weapon.cooldown = Math.floor(weapon.maxCooldown * (player.cooldownMultiplier || 1));
                    }
                    break;
                case 'whip':
                    if (weapon.cooldown === 0) {
                        activateWhip();
                        weapon.cooldown = Math.floor(weapon.maxCooldown * (player.cooldownMultiplier || 1));
                    }
                    break;
                case 'garlic':
                    updateGarlicAura();
                    break;
                case 'cross':
                    if (weapon.cooldown === 0) {
                        throwCross();
                        weapon.cooldown = Math.floor(weapon.maxCooldown * (player.cooldownMultiplier || 1));
                    }
                    break;
            }
        }
    }
}

// 具体武器射击函数
function shootWeapon(weaponType) {
    // 找到距离玩家最近的敌人
    let closestEnemy = enemies[0];
    let closestDistance = Infinity;
    
    enemies.forEach(enemy => {
        const dx = enemy.x + enemy.getWidth()/2 - (player.x + player.getWidth()/2);
        const dy = enemy.y + enemy.getHeight()/2 - (player.y + player.getHeight()/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestEnemy = enemy;
        }
    });
    
    // 计算方向
    const dx = closestEnemy.x + closestEnemy.getWidth()/2 - (player.x + player.getWidth()/2);
    const dy = closestEnemy.y + closestEnemy.getHeight()/2 - (player.y + player.getHeight()/2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const weapon = weapons[weaponType];
    
    // 创建不同类型的子弹
    const bullet = {
        x: player.x + player.getWidth()/2 - 4,
        y: player.y + player.getHeight()/2 - 4,
        speed: weapon.speed,
        dx: dx / distance,
        dy: dy / distance,
        damage: weapon.damage,
        type: weaponType,
        getWidth() { return 8; },
        getHeight() { return 8; }
    };
    
    bullets.push(bullet);
    
    // 播放射击音效
    audioManager.playSound('shoot', 0.7);
}

// 更新子弹位置
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        // 移动子弹
        bullet.x += bullet.dx * bullet.speed;
        bullet.y += bullet.dy * bullet.speed;
        
        // 移除屏幕外的子弹
        if (bullet.x < 0 || bullet.x > canvas.width || 
            bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(i, 1);
            continue;
        }
        
        // 检查子弹与敌人的碰撞
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (bullet.x < enemy.x + enemy.getWidth() &&
                bullet.x + bullet.getWidth() > enemy.x &&
                bullet.y < enemy.y + enemy.getHeight() &&
                bullet.y + bullet.getHeight() > enemy.y) {
                
                // 计算伤害（暴击系统）
                let damage = bullet.damage;
                
                // 应用道具伤害加成
                const damageMultiplier = typeof getEffectMultiplier !== 'undefined' ? getEffectMultiplier('damage_boost') : 1.0;
                damage = Math.floor(damage * damageMultiplier);
                
                // 应用角色伤害加成
                if (typeof getCharacterDamageBonus !== 'undefined') {
                    damage = Math.floor(damage * getCharacterDamageBonus(bullet.type));
                }
                
                // 计算暴击率（包含角色加成）
                let critRate = 0.15; // 基础暴击率15%
                if (typeof getCharacterCritBonus !== 'undefined') {
                    critRate += getCharacterCritBonus();
                }
                const isCritical = Math.random() < critRate;
                const isCombo = player.comboKills >= 5;
                
                if (isCritical) {
                    damage *= 2; // 暴击2倍伤害
                }
                
                if (isCombo) {
                    damage = Math.floor(damage * (1 + player.comboKills * 0.05)); // 连击伤害加成
                }
                
                enemy.health -= damage;
                enemy.isHit = 10; // 设置受伤闪烁
                
                // 更新伤害统计
                player.damageDealt += damage;
                player.totalDamage += damage;
                
                // 创建伤害数字（使用新的UI系统）
                if (typeof addDamageNumber !== 'undefined') {
                    addDamageNumber(
                        enemy.x + enemy.getWidth()/2,
                        enemy.y,
                        damage,
                        isCritical,
                        false
                    );
                } else {
                    // 备用方案
                    createDamageNumber(
                        enemy.x + enemy.getWidth()/2,
                        enemy.y,
                        damage,
                        isCritical,
                        isCombo
                    );
                }
                
                if (enemy.health <= 0) {
                    // 检查是否击败BOSS
                    if (enemy.isBoss && typeof onBossDefeated !== 'undefined') {
                        onBossDefeated();
                    }
                    // 检查是否击败BOSS
                    if (enemy.isBoss && typeof onBossDefeated !== 'undefined') {
                        onBossDefeated();
                    }
                    
                    // 调用新的击杀系统
                    if (typeof addKill !== 'undefined') {
                        addKill();
                    }
                    
                    // 连击系统
                    player.comboKills++;
                    player.comboTimer = GameConfig.GAMEPLAY.COMBO_TIMER;
                    
                    // 更新最高连击记录
                    if (player.comboKills > (player.maxCombo || 0)) {
                        player.maxCombo = player.comboKills;
                    }
                    
                    // 屏幕震动效果
                    if (typeof startScreenShake !== 'undefined') {
                        const shakeIntensity = isCritical ? 8 : 3;
                        startScreenShake(shakeIntensity, 10);
                    }
                    
                    // 创建血迹效果
                    if (typeof createBloodSplat !== 'undefined') {
                        createBloodSplat(enemy.x + enemy.getWidth()/2, enemy.y + enemy.getHeight()/2);
                    }
                    
                    // 道具掉落
                    if (typeof spawnRandomItem !== 'undefined') {
                        spawnRandomItem(enemy.x + enemy.getWidth()/2, enemy.y + enemy.getHeight()/2);
                    }
                    
                    // 创建经验宝石
                    const baseExp = enemy.type.exp || 20;
                    const comboMultiplier = 1 + Math.min(player.comboKills * 0.1, 2);
                    const expValue = Math.floor(baseExp * comboMultiplier);
                    
                    const gem = {
                        x: enemy.x + Math.random() * enemy.getWidth(),
                        y: enemy.y + Math.random() * enemy.getHeight(),
                        expValue: expValue,
                        lifespan: 600,
                        maxLifespan: 600
                    };
                    experienceGems.push(gem);
                    
                    // 移除敌人
                    enemies.splice(j, 1);
                    score += 10 * Math.ceil(comboMultiplier);
                }
                
                // 移除子弹
                bullets.splice(i, 1);
                break;
            }
        }
    }
}

// 更新环绕圣书
function updateOrbitingBooks() {
    orbitingBooks.forEach(book => {
        // 旋转圣书
        book.angle += 0.05;
        
        // 计算圣书位置
        book.x = player.x + player.getWidth()/2 + Math.cos(book.angle) * book.distance - 8;
        book.y = player.y + player.getHeight()/2 + Math.sin(book.angle) * book.distance - 8;
    });
    
    // 检查圣书与敌人的碰撞
    orbitingBooks.forEach(book => {
        enemies.forEach((enemy, enemyIndex) => {
            const dx = book.x + 8 - (enemy.x + enemy.getWidth()/2);
            const dy = book.y + 8 - (enemy.y + enemy.getHeight()/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 20) { // 碰撞检测
                // 计算伤害（暴击系统）
                let damage = weapons.book.damage;
                const isCritical = Math.random() < 0.15;
                const isCombo = player.comboKills >= 5;
                
                if (isCritical) {
                    damage *= 2;
                }
                
                if (isCombo) {
                    damage = Math.floor(damage * (1 + player.comboKills * 0.05));
                }
                
                enemy.health -= damage;
                enemy.isHit = 10;
                
                createDamageNumber(
                    enemy.x + enemy.getWidth()/2,
                    enemy.y,
                    damage,
                    isCritical,
                    isCombo
                );
                
                if (enemy.health <= 0) {
                    // 检查是否击败BOSS
                    if (enemy.isBoss && typeof onBossDefeated !== 'undefined') {
                        onBossDefeated();
                    }
                    audioManager.playSound('enemyDeath', 0.6);
                    player.comboKills++;
                    player.comboTimer = GameConfig.GAMEPLAY.COMBO_TIMER;
                    
                    // 创建经验宝石
                    const baseExp = enemy.type.exp || 20;
                    const comboMultiplier = 1 + Math.min(player.comboKills * 0.1, 2);
                    const expValue = Math.floor(baseExp * comboMultiplier);
                    
                    const gem = {
                        x: enemy.x + Math.random() * enemy.getWidth(),
                        y: enemy.y + Math.random() * enemy.getHeight(),
                        expValue: expValue,
                        lifespan: 600,
                        maxLifespan: 600
                    };
                    experienceGems.push(gem);
                    
                    enemies.splice(enemyIndex, 1);
                    score += 10 * Math.ceil(comboMultiplier);
                }
            }
        });
    });
}

// 绘制子弹
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.save();
        
        // 根据子弹类型绘制不同效果
        if (bullet.type === 'fireball') {
            // 火球效果
            ctx.shadowColor = '#FF4500';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#FF6B35';
        } else if (bullet.type === 'frostbolt') {
            // 冰霜箭效果
            ctx.shadowColor = '#87CEEB';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#87CEEB';
        } else {
            // 默认魔法飞弹
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 5;
            ctx.fillStyle = '#FFD700';
        }
        
        if (assets.loaded && assets.bullet) {
            ctx.drawImage(assets.bullet, bullet.x, bullet.y);
        } else {
            ctx.fillRect(bullet.x, bullet.y, bullet.getWidth(), bullet.getHeight());
        }
        
        ctx.restore();
    });
}

// 绘制环绕圣书
function drawOrbitingBooks() {
    orbitingBooks.forEach(book => {
        ctx.save();
        
        // 圣书光晕
        ctx.shadowColor = '#DDA0DD';
        ctx.shadowBlur = 15;
        
        // 旋转效果
        ctx.translate(book.x + 8, book.y + 8);
        ctx.rotate(book.angle * 2);
        
        // 绘制圣书
        ctx.fillStyle = '#DDA0DD';
        ctx.fillRect(-8, -8, 16, 16);
        
        // 圣书内部符文
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-4, -4, 8, 8);
        
        ctx.restore();
    });
}

// ========== 新武器系统 ==========

// 魔能鞭攻击
function activateWhip() {
    const weapon = weapons.whip;
    const whipAttack = {
        x: player.x + player.getWidth()/2,
        y: player.y + player.getHeight()/2,
        range: weapon.range || 80,
        damage: weapon.damage,
        duration: 15,
        angle: Math.random() * Math.PI * 2,
        sweep: Math.PI / 3, // 60度扫射角度
        hits: weapon.hits || 1,
        currentHit: 0
    };
    
    whipAttacks.push(whipAttack);
    
    if (typeof audioManager !== 'undefined') {
        audioManager.playSound('shoot', 0.4);
    }
}

// 更新鞭子攻击
function updateWhipAttacks() {
    for (let i = whipAttacks.length - 1; i >= 0; i--) {
        const whip = whipAttacks[i];
        whip.duration--;
        
        if (whip.currentHit < whip.hits) {
            // 检查攻击范围内的敌人
            enemies.forEach((enemy, enemyIndex) => {
                const dx = enemy.x + enemy.getWidth()/2 - whip.x;
                const dy = enemy.y + enemy.getHeight()/2 - whip.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                
                const angleDiff = Math.abs(angle - whip.angle);
                
                if (distance <= whip.range && angleDiff <= whip.sweep/2) {
                    // 计算伤害
                    let damage = Math.floor(whip.damage * (player.damageMultiplier || 1));
                    const isCritical = Math.random() < (weapons.whip.crit || 0);
                    
                    if (isCritical) {
                        damage *= 2;
                    }
                    
                    enemy.health -= damage;
                    enemy.isHit = 10;
                    whip.currentHit++;
                    
                    createDamageNumber(
                        enemy.x + enemy.getWidth()/2,
                        enemy.y,
                        damage,
                        isCritical,
                        false
                    );
                    
                    if (enemy.health <= 0) {
                    // 检查是否击败BOSS
                    if (enemy.isBoss && typeof onBossDefeated !== 'undefined') {
                        onBossDefeated();
                    }
                        handleEnemyDeath(enemy, enemyIndex);
                    }
                }
            });
        }
        
        if (whip.duration <= 0) {
            whipAttacks.splice(i, 1);
        }
    }
}

// 更新大蒜护盾
function updateGarlicAura() {
    const weapon = weapons.garlic;
    garlicAura.active = weapon.level > 0;
    garlicAura.damage = weapon.damage;
    garlicAura.range = weapon.range || 50;
    garlicAura.frequency = weapon.frequency || 10;
    
    if (garlicAura.active) {
        garlicAura.timer++;
        
        if (garlicAura.timer >= garlicAura.frequency) {
            garlicAura.timer = 0;
            
            // 伤害范围内的敌人
            enemies.forEach((enemy, enemyIndex) => {
                const dx = enemy.x + enemy.getWidth()/2 - (player.x + player.getWidth()/2);
                const dy = enemy.y + enemy.getHeight()/2 - (player.y + player.getHeight()/2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= garlicAura.range) {
                    let damage = Math.floor(garlicAura.damage * (player.damageMultiplier || 1));
                    
                    enemy.health -= damage;
                    enemy.isHit = 5;
                    
                    createDamageNumber(
                        enemy.x + enemy.getWidth()/2,
                        enemy.y,
                        damage,
                        false,
                        false
                    );
                    
                    if (enemy.health <= 0) {
                    // 检查是否击败BOSS
                    if (enemy.isBoss && typeof onBossDefeated !== 'undefined') {
                        onBossDefeated();
                    }
                        handleEnemyDeath(enemy, enemyIndex);
                    }
                }
            });
        }
    }
}

// 抛掷十字回旋镖
function throwCross() {
    const weapon = weapons.cross;
    const projectiles = weapon.projectiles || 1;
    
    for (let i = 0; i < projectiles; i++) {
        const angle = (Math.PI * 2 / projectiles) * i;
        const cross = {
            x: player.x + player.getWidth()/2,
            y: player.y + player.getHeight()/2,
            startX: player.x + player.getWidth()/2,
            startY: player.y + player.getHeight()/2,
            speed: weapon.speed || 12,
            damage: weapon.damage,
            range: weapon.range || 200,
            angle: angle,
            distance: 0,
            returning: false,
            pierce: weapon.pierce || 0,
            hitEnemies: []
        };
        
        crossBoomerangs.push(cross);
    }
    
    if (typeof audioManager !== 'undefined') {
        audioManager.playSound('shoot', 0.5);
    }
}

// 更新十字回旋镖
function updateCrossBoomerangs() {
    for (let i = crossBoomerangs.length - 1; i >= 0; i--) {
        const cross = crossBoomerangs[i];
        
        if (!cross.returning) {
            // 飞出阶段
            cross.distance += cross.speed;
            cross.x = cross.startX + Math.cos(cross.angle) * cross.distance;
            cross.y = cross.startY + Math.sin(cross.angle) * cross.distance;
            
            if (cross.distance >= cross.range) {
                cross.returning = true;
            }
        } else {
            // 返回阶段
            cross.distance -= cross.speed;
            cross.x = cross.startX + Math.cos(cross.angle) * cross.distance;
            cross.y = cross.startY + Math.sin(cross.angle) * cross.distance;
            
            if (cross.distance <= 0) {
                crossBoomerangs.splice(i, 1);
                continue;
            }
        }
        
        // 碰撞检测
        enemies.forEach((enemy, enemyIndex) => {
            if (cross.hitEnemies.includes(enemyIndex)) return;
            
            const dx = enemy.x + enemy.getWidth()/2 - cross.x;
            const dy = enemy.y + enemy.getHeight()/2 - cross.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= 15) {
                let damage = Math.floor(cross.damage * (player.damageMultiplier || 1));
                
                enemy.health -= damage;
                enemy.isHit = 10;
                cross.hitEnemies.push(enemyIndex);
                
                createDamageNumber(
                    enemy.x + enemy.getWidth()/2,
                    enemy.y,
                    damage,
                    false,
                    false
                );
                
                if (enemy.health <= 0) {
                    // 检查是否击败BOSS
                    if (enemy.isBoss && typeof onBossDefeated !== 'undefined') {
                        onBossDefeated();
                    }
                    handleEnemyDeath(enemy, enemyIndex);
                }
                
                // 穿透限制
                if (cross.hitEnemies.length > cross.pierce) {
                    if (!cross.returning) {
                        cross.returning = true;
                    }
                }
            }
        });
    }
}

// 处理敌人死亡（统一函数）
function handleEnemyDeath(enemy, enemyIndex) {
    if (typeof audioManager !== 'undefined') {
        audioManager.playSound('enemyDeath', 0.6);
    }
    
    player.comboKills++;
    player.comboTimer = GameConfig.GAMEPLAY.COMBO_TIMER;
    
    // 创建经验宝石
    const baseExp = enemy.type.exp || 20;
    const comboMultiplier = 1 + Math.min(player.comboKills * 0.1, 2);
    const expMultiplier = player.expMultiplier || 1;
    const expValue = Math.floor(baseExp * comboMultiplier * expMultiplier);
    
    const gem = {
        x: enemy.x + Math.random() * enemy.getWidth(),
        y: enemy.y + Math.random() * enemy.getHeight(),
        expValue: expValue,
        lifespan: 600,
        maxLifespan: 600
    };
    experienceGems.push(gem);
    
    enemies.splice(enemyIndex, 1);
    score += 10 * Math.ceil(comboMultiplier);
}

// 绘制新武器效果
function drawNewWeapons() {
    // 绘制鞭子攻击
    whipAttacks.forEach(whip => {
        ctx.save();
        ctx.translate(whip.x, whip.y);
        ctx.rotate(whip.angle);
        
        const alpha = whip.duration / 15;
        ctx.globalAlpha = alpha;
        
        // 绘制鞭子扫射区域
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, whip.range, -whip.sweep/2, whip.sweep/2);
        ctx.closePath();
        
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        
        ctx.restore();
    });
    
    // 绘制大蒜护盾
    if (garlicAura.active) {
        ctx.save();
        const pulseIntensity = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
        ctx.globalAlpha = pulseIntensity;
        
        ctx.beginPath();
        ctx.arc(
            player.x + player.getWidth()/2,
            player.y + player.getHeight()/2,
            garlicAura.range,
            0,
            Math.PI * 2
        );
        
        ctx.fillStyle = '#90EE90';
        ctx.fill();
        
        ctx.restore();
    }
    
    // 绘制十字回旋镖
    crossBoomerangs.forEach(cross => {
        ctx.save();
        ctx.translate(cross.x, cross.y);
        ctx.rotate(cross.distance * 0.1);
        
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(-8, -2, 16, 4);
        ctx.fillRect(-2, -8, 4, 16);
        
        ctx.restore();
    });
}

// 更新所有新武器
function updateNewWeapons() {
    updateWhipAttacks();
    updateCrossBoomerangs();
}