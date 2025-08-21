// UI界面系统

// 绘制武器选择界面 - 吸血鬼幸存者风格
function drawWeaponSelect() {
    // 深色背景
    ctx.fillStyle = 'rgba(10, 10, 20, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 渐变装饰背景
    const bgGradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
    bgGradient.addColorStop(0, 'rgba(50, 20, 80, 0.3)');
    bgGradient.addColorStop(1, 'rgba(20, 10, 30, 0.8)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 标题
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('选择你的起始武器', canvas.width/2, 80);
    
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '16px Arial';
    ctx.fillText('按对应数字键选择武器', canvas.width/2, 110);

    // 武器选项 - 更丰富的选择
    const weaponOptions = [
        {
            key: '1',
            name: '魔法飞弹',
            description: '快速射击的基础法术，可升级为追踪导弹',
            stats: '伤害: 15 | 射速: 快 | 穿透: 无',
            color: '#FFD700',
            y: 150,
            icon: '✦'
        },
        {
            key: '2', 
            name: '火球术',
            description: '强力的火焰法术，爆炸范围攻击',
            stats: '伤害: 30 | 射速: 慢 | 范围: 大',
            color: '#FF4500',
            y: 220,
            icon: '🔥'
        },
        {
            key: '3',
            name: '冰霜箭',
            description: '冰系法术，减速并冰冻敌人',
            stats: '伤害: 20 | 射速: 中 | 特效: 减速',
            color: '#87CEEB',
            y: 290,
            icon: '❄'
        },
        {
            key: '4',
            name: '圣书环绕',
            description: '围绕玩家旋转的魔法书籍',
            stats: '伤害: 12 | 防御: 持续 | 特效: 环绕',
            color: '#9370DB',
            y: 360,
            icon: '📖'
        }
    ];
    
    weaponOptions.forEach((weapon, index) => {
        // 武器卡片
        const cardWidth = 500;
        const cardHeight = 50;
        const cardX = (canvas.width - cardWidth) / 2;
        
        // 悬停效果 (模拟)
        const isHovered = false; // 这里可以根据鼠标位置判断
        
        // 卡片背景
        ctx.fillStyle = isHovered ? 'rgba(60, 60, 100, 0.9)' : 'rgba(30, 30, 50, 0.8)';
        ctx.fillRect(cardX, weapon.y, cardWidth, cardHeight);
        
        // 卡片边框
        ctx.strokeStyle = weapon.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(cardX, weapon.y, cardWidth, cardHeight);
        
        // 按键显示
        ctx.fillStyle = weapon.color;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`[${weapon.key}]`, cardX + 35, weapon.y + 32);
        
        // 武器图标
        ctx.font = '24px Arial';
        ctx.fillText(weapon.icon, cardX + 80, weapon.y + 32);
        
        // 武器名称
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(weapon.name, cardX + 110, weapon.y + 22);
        
        // 武器描述
        ctx.fillStyle = '#CCCCCC';
        ctx.font = '12px Arial';
        ctx.fillText(weapon.description, cardX + 110, weapon.y + 38);
        
        // 武器属性
        ctx.fillStyle = weapon.color;
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(weapon.stats, cardX + cardWidth - 10, weapon.y + 30);
    });
    
    // 底部提示
    ctx.textAlign = 'center';
    ctx.fillStyle = '#90EE90';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('每种武器都有独特的升级路径和进化形态！', canvas.width/2, canvas.height - 40);
    
    ctx.fillStyle = '#FFFF00';
    ctx.font = '12px Arial';
    ctx.fillText('选择武器后，击败敌人获取经验升级！', canvas.width/2, canvas.height - 20);
}

// 伤害数字飘浮系统
let damageNumbers = [];

class DamageNumber {
    constructor(x, y, damage, isCrit = false, isHeal = false) {
        this.x = x;
        this.y = y;
        this.startY = y;
        this.damage = Math.round(damage);
        this.isCrit = isCrit;
        this.isHeal = isHeal;
        this.timer = 60; // 1秒
        this.alpha = 1;
        this.scale = isCrit ? 1.5 : 1.0;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -2;
    }
    
    update() {
        this.timer--;
        this.x += this.vx;
        this.y += this.vy;
        this.vy *= 0.98; // 减速
        this.alpha = this.timer / 60;
        this.scale *= 0.99;
        
        return this.timer > 0;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.textAlign = 'center';
        
        let color = '#FFF';
        let fontSize = 16 * this.scale;
        
        if (this.isHeal) {
            color = '#90EE90';
        } else if (this.isCrit) {
            color = '#FFD700';
            fontSize = 20 * this.scale;
        } else if (this.damage >= 50) {
            color = '#FF4500';
        } else if (this.damage >= 25) {
            color = '#FF8C00';
        }
        
        const text = this.isHeal ? `+${this.damage}` : `${this.damage}`;
        
        // 阴影
        drawTextWithStroke(text, this.x + 1, this.y + 1, 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.8)', `bold ${fontSize}px serif`);
        // 主文字
        drawTextWithStroke(text, this.x, this.y, color, '#000', `bold ${fontSize}px serif`);
        
        ctx.restore();
    }
}

// 添加伤害数字
function addDamageNumber(x, y, damage, isCrit = false, isHeal = false) {
    damageNumbers.push(new DamageNumber(x, y, damage, isCrit, isHeal));
}

// 更新所有伤害数字
function updateDamageNumbers() {
    damageNumbers = damageNumbers.filter(number => {
        if (number.update()) {
            number.draw();
            return true;
        }
        return false;
    });
}

// 经验条动画系统
let expBarAnimation = {
    currentExp: 0,
    targetExp: 0,
    animating: false,
    speed: 2
};

// 屏幕震动系统
let screenShake = {
    duration: 0,
    intensity: 0,
    x: 0,
    y: 0
};

function addScreenShake(duration, intensity) {
    screenShake.duration = Math.max(screenShake.duration, duration);
    screenShake.intensity = Math.max(screenShake.intensity, intensity);
}

function updateScreenShake() {
    if (screenShake.duration > 0) {
        screenShake.duration--;
        const shake = screenShake.intensity * (screenShake.duration / 60);
        screenShake.x = (Math.random() - 0.5) * shake;
        screenShake.y = (Math.random() - 0.5) * shake;
    } else {
        screenShake.x = 0;
        screenShake.y = 0;
    }
}

// 绘制武器选择界面 - 吸血鬼幸存者风格
function drawWeaponSelect() {
    // 深色背景
    ctx.fillStyle = 'rgba(10, 10, 20, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 渐变装饰背景
    const bgGradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
    bgGradient.addColorStop(0, 'rgba(50, 20, 80, 0.3)');
    bgGradient.addColorStop(1, 'rgba(20, 10, 30, 0.8)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 标题
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('选择你的起始武器', canvas.width/2, 80);
    
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '16px Arial';
    ctx.fillText('按对应数字键选择武器', canvas.width/2, 110);
    
    // 武器选项 - 更丰富的选择
    const weaponOptions = [
        {
            key: '1',
            name: '魔法飞弹',
            description: '快速射击的基础法术，可升级为追踪导弹',
            stats: '伤害: 15 | 射速: 快 | 穿透: 无',
            color: '#FFD700',
            y: 150,
            icon: '✦'
        },
        {
            key: '2', 
            name: '火球术',
            description: '强力的火焰法术，爆炸范围攻击',
            stats: '伤害: 30 | 射速: 慢 | 范围: 大',
            color: '#FF4500',
            y: 220,
            icon: '🔥'
        },
        {
            key: '3',
            name: '冰霜箭',
            description: '冰系法术，减速并冰冻敌人',
            stats: '伤害: 20 | 射速: 中 | 特效: 减速',
            color: '#87CEEB',
            y: 290,
            icon: '❄'
        },
        {
            key: '4',
            name: '圣书环绕',
            description: '围绕玩家旋转的魔法书籍',
            stats: '伤害: 12 | 防御: 持续 | 特效: 环绕',
            color: '#9370DB',
            y: 360,
            icon: '📖'
        }
    ];
    
    weaponOptions.forEach((weapon, index) => {
        // 武器卡片
        const cardWidth = 500;
        const cardHeight = 50;
        const cardX = (canvas.width - cardWidth) / 2;
        
        // 悬停效果 (模拟)
        const isHovered = false; // 这里可以根据鼠标位置判断
        
        // 卡片背景
        ctx.fillStyle = isHovered ? 'rgba(60, 60, 100, 0.9)' : 'rgba(30, 30, 50, 0.8)';
        ctx.fillRect(cardX, weapon.y, cardWidth, cardHeight);
        
        // 卡片边框
        ctx.strokeStyle = weapon.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(cardX, weapon.y, cardWidth, cardHeight);
        
        // 按键显示
        ctx.fillStyle = weapon.color;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`[${weapon.key}]`, cardX + 35, weapon.y + 32);
        
        // 武器图标
        ctx.font = '24px Arial';
        ctx.fillText(weapon.icon, cardX + 80, weapon.y + 32);
        
        // 武器名称
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(weapon.name, cardX + 110, weapon.y + 22);
        
        // 武器描述
        ctx.fillStyle = '#CCCCCC';
        ctx.font = '12px Arial';
        ctx.fillText(weapon.description, cardX + 110, weapon.y + 38);
        
        // 武器属性
        ctx.fillStyle = weapon.color;
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(weapon.stats, cardX + cardWidth - 10, weapon.y + 30);
    });
    
    // 底部提示
    ctx.textAlign = 'center';
    ctx.fillStyle = '#90EE90';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('每种武器都有独特的升级路径和进化形态！', canvas.width/2, canvas.height - 40);
    
    ctx.fillStyle = '#FFFF00';
    ctx.font = '12px Arial';
    ctx.fillText('选择武器后，击败敌人获取经验升级！', canvas.width/2, canvas.height - 20);
}

// 绘制UI和分数 - 吸血鬼幸存者风格
function drawUI() {
    // === 顶部信息栏 ===
    drawTopInfoBar();
    
    // === 右侧武器图标 ===
    drawWeaponIcons();
    
    // === 小地图区域 ===
    drawMiniMap();
    
    // === 时间和波次显示 ===
    drawTimeAndWave();
    
    // === 连击和击杀数显示 ===
    drawKillStats();
}

// 绘制武器图标栏
function drawWeaponIcons() {
    const iconSize = 40;
    const iconSpacing = 45;
    const startX = canvas.width - 60;
    const startY = 60;
    let iconIndex = 0;
    
    // 遍历所有激活的武器
    for (let weaponName in weapons) {
        const weapon = weapons[weaponName];
        if (weapon.level > 0) {
            const iconX = startX;
            const iconY = startY + iconIndex * iconSpacing;
            
            // 武器图标背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(iconX - iconSize/2, iconY - iconSize/2, iconSize, iconSize);
            
            // 武器图标边框
            ctx.strokeStyle = getWeaponColor(weaponName);
            ctx.lineWidth = 2;
            ctx.strokeRect(iconX - iconSize/2, iconY - iconSize/2, iconSize, iconSize);
            
            // 武器等级显示
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(weapon.level.toString(), iconX, iconY + 4);
            
            // 武器名称缩写
            const weaponShort = getWeaponShort(weaponName);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '10px Arial';
            ctx.fillText(weaponShort, iconX, iconY - 10);
            
            iconIndex++;
        }
    }
}

// 绘制时间和波次
function drawTimeAndWave() {
    // 时间显示
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(timeString, canvas.width / 2, 30);
    
    // 波次显示 (基于时间计算)
    const currentWave = Math.floor(gameTime / 30) + 1;
    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Wave ${currentWave}`, canvas.width / 2, 45);
}

// 绘制击杀统计
function drawKillStats() {
    // 总击杀数
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Kills: ${player.killCount || 0}`, canvas.width - 15, 30);
    
    // 连击数 (如果有)
    if (player.comboCount && player.comboCount > 1) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`Combo: x${player.comboCount}`, canvas.width - 15, 45);
    }
    
    // 成就统计
    if (typeof getUnlockedCount !== 'undefined' && typeof getTotalCount !== 'undefined') {
        ctx.fillStyle = '#90EE90';
        ctx.font = '10px Arial';
        ctx.fillText(`🏆 ${getUnlockedCount()}/${getTotalCount()}`, canvas.width - 60, 60);
    }
}

// 绘制小地图
function drawMiniMap() {
    const mapSize = 80;
    const mapX = canvas.width - mapSize - 15;
    const mapY = canvas.height - mapSize - 15;
    
    // 小地图背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(mapX, mapY, mapSize, mapSize);
    
    // 小地图边框
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(mapX, mapY, mapSize, mapSize);
    
    // 玩家位置
    const playerMapX = mapX + (player.x / canvas.width) * mapSize;
    const playerMapY = mapY + (player.y / canvas.height) * mapSize;
    
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(playerMapX, playerMapY, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 敌人位置
    ctx.fillStyle = '#FF0000';
    enemies.forEach(enemy => {
        const enemyMapX = mapX + (enemy.x / canvas.width) * mapSize;
        const enemyMapY = mapY + (enemy.y / canvas.height) * mapSize;
        
        ctx.beginPath();
        ctx.arc(enemyMapX, enemyMapY, 1, 0, Math.PI * 2);
        ctx.fill();
    });
}

// 获取武器颜色
function getWeaponColor(weaponName) {
    const colors = {
        missile: '#FFD700',
        fireball: '#FF4500',
        frostbolt: '#87CEEB',
        book: '#9370DB',
        whip: '#8B4513',
        garlic: '#32CD32',
        cross: '#FFFFFF'
    };
    return colors[weaponName] || '#FFFFFF';
}

// 获取武器名称缩写
function getWeaponShort(weaponName) {
    const shorts = {
        missile: 'MIS',
        fireball: 'FIR',
        frostbolt: 'ICE',
        book: 'BK',
        whip: 'WP',
        garlic: 'GAR',
        cross: 'CR'
    };
    return shorts[weaponName] || weaponName.toUpperCase().substring(0, 3);
}

// 绘制升级选择界面 - 吸血鬼幸存者风格
function drawUpgradeMenu() {
    if (!isUpgradeMenuOpen || !upgradeChoices || upgradeChoices.length === 0) {
        return;
    }
    
    // 半透明黑色背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 暂停提示
    ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.fillRect(0, 0, canvas.width, 60);
    
    // 标题
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL UP!', canvas.width / 2, 35);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.fillText('选择一个升级', canvas.width / 2, 55);
    
    // 升级选项卡片
    const cardWidth = 280;
    const cardHeight = 120;
    const cardSpacing = 20;
    const totalWidth = upgradeChoices.length * cardWidth + (upgradeChoices.length - 1) * cardSpacing;
    const startX = (canvas.width - totalWidth) / 2;
    const startY = 120;
    
    upgradeChoices.forEach((choice, index) => {
        const cardX = startX + index * (cardWidth + cardSpacing);
        const cardY = startY;
        
        // 卡片背景
        ctx.fillStyle = 'rgba(40, 40, 60, 0.9)';
        ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
        
        // 卡片边框
        ctx.strokeStyle = getUpgradeRarityColor(choice.rarity || 'common');
        ctx.lineWidth = 3;
        ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);
        
        // 按键提示
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`[${index + 1}]`, cardX + cardWidth / 2, cardY + 25);
        
        // 升级类型图标
        const icon = getUpgradeIcon(choice);
        ctx.font = '32px Arial';
        ctx.fillText(icon, cardX + 50, cardY + 65);
        
        // 升级名称
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        const nameText = choice.weaponName ? 
            WeaponUpgrades[choice.weaponName]?.name || choice.weaponName : 
            choice.name || '未知升级';
        ctx.fillText(nameText, cardX + 80, cardY + 45);
        
        // 升级描述
        ctx.fillStyle = '#CCCCCC';
        ctx.font = '12px Arial';
        const description = choice.description || '提升能力';
        wrapText(ctx, description, cardX + 80, cardY + 65, cardWidth - 90, 14);
        
        // 当前等级显示
        if (choice.weaponName && weapons[choice.weaponName]) {
            ctx.fillStyle = '#90EE90';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`Lv.${weapons[choice.weaponName].level} → ${weapons[choice.weaponName].level + 1}`, 
                        cardX + cardWidth - 10, cardY + cardHeight - 10);
        }
        
        // 稀有度装饰
        if (choice.rarity) {
            ctx.fillStyle = getUpgradeRarityColor(choice.rarity);
            ctx.fillRect(cardX, cardY, cardWidth, 3);
        }
    });
    
    // 底部提示
    ctx.fillStyle = '#AAAAAA';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('按对应数字键选择升级', canvas.width / 2, canvas.height - 30);
}

// 获取升级稀有度颜色
function getUpgradeRarityColor(rarity) {
    const colors = {
        common: '#FFFFFF',      // 白色 - 普通
        uncommon: '#1E90FF',    // 蓝色 - 罕见
        rare: '#9932CC',        // 紫色 - 稀有
        epic: '#FF8C00',        // 橙色 - 史诗
        legendary: '#FFD700'    // 金色 - 传说
    };
    return colors[rarity] || colors.common;
}

// 获取升级图标
function getUpgradeIcon(choice) {
    if (choice.weaponName) {
        const icons = {
            missile: '✦',
            fireball: '🔥',
            frostbolt: '❄️',
            book: '📖',
            whip: '🔗',
            garlic: '🧄',
            cross: '✚'
        };
        return icons[choice.weaponName] || '⚔️';
    }
    
    // 被动技能图标
    const passiveIcons = {
        health: '❤️',
        speed: '⚡',
        damage: '💪',
        exp: '⭐',
        pickup: '🧲',
        cooldown: '⏰'
    };
    
    return passiveIcons[choice.type] || '🎯';
}

// 文本换行函数
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
}

// 绘制游戏结束界面
function drawGameOver() {
    // 半透明黑色背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 标题
    ctx.fillStyle = '#FF4444';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, 120);
    
    // 统计信息面板
    const panelWidth = 400;
    const panelHeight = 300;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = 180;
    
    // 面板背景
    ctx.fillStyle = 'rgba(40, 40, 60, 0.9)';
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    
    // 面板边框
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
    
    // 统计数据
    const stats = [
        { label: '生存时间', value: formatTime(gameTime), icon: '⏱️' },
        { label: '击败敌人', value: player.killCount || 0, icon: '💀' },
        { label: '最高连击', value: player.maxCombo || 0, icon: '🔥' },
        { label: '达到等级', value: player.level || 1, icon: '⭐' },
        { label: '最终分数', value: score || 0, icon: '🏆' },
        { label: '解锁成就', value: `${getUnlockedCount ? getUnlockedCount() : 0}/${getTotalCount ? getTotalCount() : 0}`, icon: '🏅' }
    ];
    
    // 绘制统计信息
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    stats.forEach((stat, index) => {
        const y = panelY + 40 + index * 35;
        
        // 图标
        ctx.font = '20px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(stat.icon, panelX + 20, y);
        
        // 标签
        ctx.font = '16px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(stat.label, panelX + 60, y);
        
        // 数值
        ctx.fillStyle = '#00FF88';
        ctx.textAlign = 'right';
        ctx.fillText(stat.value.toString(), panelX + panelWidth - 20, y);
        ctx.textAlign = 'left';
    });
    
    // 操作提示
    ctx.textAlign = 'center';
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '14px Arial';
    ctx.fillText('按 R 键重新开始', canvas.width / 2, panelY + panelHeight + 40);
    
    // 最佳记录提示（如果创造了新记录）
    if (isNewRecord()) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 18px Arial';
        ctx.fillText('🎉 新记录！ 🎉', canvas.width / 2, panelY - 20);
    }
}

// 格式化时间显示
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 检查是否创造新记录
function isNewRecord() {
    // 这里可以实现本地存储的最佳记录比较
    // 简单起见，如果生存超过5分钟就算新记录
    return gameTime >= 300;
}

// 绘制顶部信息栏
function drawTopInfoBar() {
    const barHeight = 50;
    
    // 半透明黑色背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, barHeight);
    
    // 底部渐变边界
    const gradient = ctx.createLinearGradient(0, barHeight - 3, 0, barHeight);
    gradient.addColorStop(0, 'rgba(100, 100, 100, 0.8)');
    gradient.addColorStop(1, 'rgba(50, 50, 50, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, barHeight - 3, canvas.width, 3);
    
    // === 血量条区域 ===
    const healthBarX = 15;
    const healthBarY = 12;
    const healthBarWidth = 200;
    const healthBarHeight = 8;
    
    // 血量条背景
    ctx.fillStyle = 'rgba(50, 0, 0, 0.8)';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    // 血量条填充
    const healthPercentage = Math.max(0, player.health) / player.maxHealth;
    const healthWidth = healthBarWidth * healthPercentage;
    
    if (healthWidth > 0) {
        // 血量条颜色根据血量变化 - 更鲜艳的颜色
        if (healthPercentage > 0.6) {
            ctx.fillStyle = '#00FF00';  // 绿色
        } else if (healthPercentage > 0.3) {
            ctx.fillStyle = '#FFD700';  // 金色
        } else {
            ctx.fillStyle = '#FF0000';  // 红色
        }
        
        ctx.fillRect(healthBarX, healthBarY, healthWidth, healthBarHeight);
    }
    
    // 血量条边框
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    // 血量数值显示
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${Math.ceil(player.health)}/${player.maxHealth}`, healthBarX + healthBarWidth + 10, healthBarY + 10);
    
    // === 经验条区域 ===
    const expBarX = 15;
    const expBarY = 25;
    const expBarWidth = 200;
    const expBarHeight = 8;
    
    // 经验条背景
    ctx.fillStyle = 'rgba(0, 0, 50, 0.8)';
    ctx.fillRect(expBarX, expBarY, expBarWidth, expBarHeight);
    
    // 经验条填充
    const expPercentage = player.exp / player.expToNextLevel;
    const expWidth = expBarWidth * expPercentage;
    
    if (expWidth > 0) {
        // 经验条渐变 - 蓝色到紫色
        const expGradient = ctx.createLinearGradient(expBarX, expBarY, expBarX + expWidth, expBarY);
        expGradient.addColorStop(0, '#00BFFF');
        expGradient.addColorStop(1, '#8A2BE2');
        
        ctx.fillStyle = expGradient;
        ctx.fillRect(expBarX, expBarY, expWidth, expBarHeight);
    }
    
    // 经验条边框
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(expBarX, expBarY, expBarWidth, expBarHeight);
    
    // 等级显示
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Lv.${player.level}`, expBarX + expBarWidth + 10, expBarY + 12);
}
    
    // 右侧信息区域
    const rightInfoX = GameConfig.UI.RIGHT_INFO_X;
    
    // 时间显示
    const gameTime = Math.floor(Date.now() / 1000) - startTime;
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    drawTextWithStroke(`时间 ${minutes}:${seconds.toString().padStart(2, '0')}`, rightInfoX, expBarY + 15, '#FFF', '#000', '16px serif');
    
    // 音效状态显示
    const musicIcon = audioManager.musicEnabled ? '♪' : '🔇';
    const sfxIcon = audioManager.sfxEnabled ? '🔊' : '🔇';
    drawTextWithStroke(`音乐: ${musicIcon} (M键)`, rightInfoX, expBarY + 35, audioManager.musicEnabled ? '#90EE90' : '#FF6B6B', '#000', '12px serif');
    drawTextWithStroke(`音效: ${sfxIcon} (N键)`, rightInfoX, expBarY + 50, audioManager.sfxEnabled ? '#90EE90' : '#FF6B6B', '#000', '12px serif');
    
    // 武器信息
    if (weapons.book.level > 0) {
        drawTextWithStroke(`圣书 等级${weapons.book.level}`, rightInfoX, expBarY + 70, '#DDA0DD', '#000', '14px serif');
    }
    
    // 敌人数量
    drawTextWithStroke(`敌人: ${enemies.length}`, rightInfoX, expBarY + 85, '#FF6347', '#000', '14px serif');
    
    // 连击显示
    if (player.comboKills >= 2) {
        const comboColor = player.comboKills >= 15 ? '#FFD700' : player.comboKills >= 10 ? '#FF6347' : '#FF8C00';
        const comboText = `连击 x${player.comboKills}`;
        
        // 连击背景
        const comboWidth = 120;
        const comboHeight = 30;
        const comboX = (canvas.width - comboWidth) / 2;
        const comboY = 80;
        
        // 连击闪烁效果
        const comboIntensity = 0.8 + Math.sin(Date.now() * 0.01 * 8) * 0.2;
        
        ctx.fillStyle = `rgba(0, 0, 0, ${0.7 * comboIntensity})`;
        ctx.fillRect(comboX, comboY, comboWidth, comboHeight);
        
        drawDecorativeBorder(comboX, comboY, comboWidth, comboHeight, comboColor);
        
        ctx.textAlign = 'center';
        drawTextWithStroke(comboText, comboX + comboWidth/2, comboY + 20, comboColor, '#000', `bold ${16 + Math.min(player.comboKills, 10)}px serif`);
        
        // 连击倍数显示
        if (player.comboKills >= 5) {
            const multiplier = (1 + Math.min(player.comboKills * 0.1, 2)).toFixed(1);
            drawTextWithStroke(`EXP x${multiplier}`, comboX + comboWidth/2, comboY + 45, '#90EE90', '#000', '12px serif');
        }
        
        ctx.textAlign = 'left';
    }
    
    // 绘制伤害数字
    updateDamageNumbers();
    
    if (gameOver) {
        // 游戏结束界面背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 游戏结束统计面板
        const panelWidth = 450;
        const panelHeight = 350;
        const panelX = (canvas.width - panelWidth) / 2;
        const panelY = (canvas.height - panelHeight) / 2;
        
        // 统计面板背景
        drawStoneTexture(panelX, panelY, panelWidth, panelHeight);
        ctx.fillStyle = 'rgba(20, 20, 40, 0.9)';
        ctx.fillRect(panelX + 4, panelY + 4, panelWidth - 8, panelHeight - 8);
        drawDecorativeBorder(panelX, panelY, panelWidth, panelHeight, '#8B0000');
        
        // 游戏结束标题
        ctx.textAlign = 'center';
        drawTextWithStroke('游戏结束', canvas.width/2, panelY + 50, '#FF6B6B', '#000', 'bold 36px serif');
        
        // 统计信息
        let statY = panelY + 90;
        const statX = canvas.width/2;
        
        drawTextWithStroke(`最终分数: ${score}`, statX, statY, '#FFD700', '#000', 'bold 20px serif');
        statY += 25;
        
        // 游戏时间
        const gameTime = Math.floor(Date.now() / 1000) - startTime;
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        drawTextWithStroke(`生存时间: ${minutes}:${seconds.toString().padStart(2, '0')}`, statX, statY, '#87CEEB', '#000', '16px serif');
        statY += 22;
        
        // 击杀统计
        const totalKills = player.totalKills || 0;
        drawTextWithStroke(`总击杀数: ${totalKills}`, statX, statY, '#FF6347', '#000', '16px serif');
        statY += 22;
        
        // 最高等级
        drawTextWithStroke(`达到等级: ${player.level}`, statX, statY, '#DDA0DD', '#000', '16px serif');
        statY += 22;
        
        // 最高连击
        const maxCombo = player.maxCombo || player.comboKills || 0;
        drawTextWithStroke(`最高连击: ${maxCombo}`, statX, statY, '#FF8C00', '#000', '16px serif');
        statY += 22;
        
        // 武器等级总和
        let totalWeaponLevels = 0;
        Object.values(weapons).forEach(weapon => {
            if (weapon.level) totalWeaponLevels += weapon.level;
        });
        drawTextWithStroke(`武器等级总和: ${totalWeaponLevels}`, statX, statY, '#90EE90', '#000', '16px serif');
        statY += 30;
        
        // 重新开始提示
        ctx.save();
        ctx.globalAlpha = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;
        drawTextWithStroke('按 R 键重新开始', statX, statY, '#90EE90', '#000', 'bold 18px serif');
        ctx.restore();
        
        ctx.textAlign = 'left';
    }
    
    // 绘制升级选择界面
    if (typeof isUpgradeMenuOpen !== 'undefined' && isUpgradeMenuOpen) {
        drawUpgradeMenu();
    }

// 绘制升级选择菜单
function drawUpgradeMenu() {
    // 半透明黑色背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 主标题
    ctx.textAlign = 'center';
    drawTextWithStroke('升级选择', canvas.width/2, 80, '#FFD700', '#000', 'bold 36px serif');
    drawTextWithStroke('选择一个升级项', canvas.width/2, 115, '#FFF', '#000', '18px serif');
    
    if (typeof upgradeChoices !== 'undefined' && upgradeChoices.length > 0) {
        // 绘制三个升级选项
        const optionWidth = 220;
        const optionHeight = 160;
        const spacing = 40;
        const startX = (canvas.width - (optionWidth * 3 + spacing * 2)) / 2;
        const startY = 150;
        
        upgradeChoices.forEach((choice, index) => {
            const x = startX + index * (optionWidth + spacing);
            const y = startY;
            
            // 选项背景
            ctx.fillStyle = 'rgba(40, 40, 80, 0.9)';
            ctx.fillRect(x, y, optionWidth, optionHeight);
            
            // 装饰边框
            const borderColor = choice.type === 'weapon' ? '#FFD700' : '#87CEEB';
            drawDecorativeBorder(x, y, optionWidth, optionHeight, borderColor);
            
            // 选项编号
            ctx.textAlign = 'center';
            drawTextWithStroke(`[${index + 1}]`, x + optionWidth/2, y + 25, borderColor, '#000', 'bold 20px serif');
            
            // 图标
            drawTextWithStroke(choice.icon, x + optionWidth/2, y + 55, borderColor, '#000', 'bold 24px serif');
            
            // 标题
            const titleFontSize = choice.title.length > 12 ? '14px' : '16px';
            drawTextWithStroke(choice.title, x + optionWidth/2, y + 85, '#FFF', '#000', `bold ${titleFontSize} serif`);
            
            // 描述
            const words = choice.description.split(' ');
            let line1 = '', line2 = '';
            
            if (words.length <= 3) {
                line1 = choice.description;
            } else {
                const mid = Math.ceil(words.length / 2);
                line1 = words.slice(0, mid).join(' ');
                line2 = words.slice(mid).join(' ');
            }
            
            drawTextWithStroke(line1, x + optionWidth/2, y + 110, '#CCC', '#000', '12px serif');
            if (line2) {
                drawTextWithStroke(line2, x + optionWidth/2, y + 125, '#CCC', '#000', '12px serif');
            }
            
            // 按键提示
            drawTextWithStroke(`按 ${index + 1} 选择`, x + optionWidth/2, y + 150, '#90EE90', '#000', 'bold 12px serif');
        });
    }
    
    // 底部提示
    ctx.textAlign = 'center';
    drawTextWithStroke('按对应数字键选择升级', canvas.width/2, canvas.height - 30, '#FFF', '#000', '14px serif');
}