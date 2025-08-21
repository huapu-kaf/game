// UI界面系统

// 绘制角色选择界面 - 像素风格
function drawCharacterSelect() {
    // 深色像素化背景
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 像素化星空背景
    drawPixelStarfield();
    
    // 扫描线效果
    drawScanlines();
    
    // 主标题 - 像素字体效果
    drawPixelText('选择你的英雄', canvas.width/2, 80, 32, '#00FF88', true);
    drawPixelText('Choose Your Hero', canvas.width/2, 115, 14, '#666666', false);
    
    // 角色选项
    const characters = [
        { type: CharacterTypes.WARRIOR, key: '1', x: canvas.width/2 - 360 },
        { type: CharacterTypes.MAGE, key: '2', x: canvas.width/2 },
        { type: CharacterTypes.RANGER, key: '3', x: canvas.width/2 + 360 }
    ];
    
    characters.forEach((char, index) => {
        drawCharacterCard(char.type, char.key, char.x, 200, index);
    });
    
    // 底部提示
    drawPixelText('按对应数字键选择角色', canvas.width/2, canvas.height - 80, 16, '#CCCCCC', false);
    drawPixelText('Press number key to select character', canvas.width/2, canvas.height - 55, 12, '#666666', false);
}

// 绘制角色卡片 - 像素风格
function drawCharacterCard(character, key, centerX, centerY, index) {
    const cardWidth = 300;
    const cardHeight = 400;
    const cardX = centerX - cardWidth/2;
    const cardY = centerY - cardHeight/2;
    
    // 动画效果
    const time = Date.now() * 0.003;
    const hoverOffset = Math.sin(time + index * 2) * 2;
    const finalY = cardY + hoverOffset;
    
    // 卡片外发光效果
    drawPixelGlow(centerX, centerY + hoverOffset, cardWidth + 20, cardHeight + 20, character.color, 0.3);
    
    // 主卡片背景
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(cardX, finalY, cardWidth, cardHeight);
    
    // 像素化边框
    drawPixelBorder(cardX, finalY, cardWidth, cardHeight, character.color, 4);
    
    // 角色图标区域
    const iconAreaY = finalY + 20;
    const iconAreaHeight = 120;
    
    // 图标背景
    ctx.fillStyle = character.color + '22';
    ctx.fillRect(cardX + 20, iconAreaY, cardWidth - 40, iconAreaHeight);
    
    // 角色图标 - 大号像素风格
    ctx.font = '64px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = character.color;
    ctx.fillText(character.icon, centerX, iconAreaY + iconAreaHeight/2);
    
    // 按键提示
    const keyY = finalY + 15;
    drawPixelText(`[${key}]`, cardX + 30, keyY, 20, character.color, true);
    
    // 角色名称
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 24px monospace';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeText(character.name, centerX, finalY + 160);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(character.name, centerX, finalY + 160);
    
    // 角色描述 - 限制在卡片内
    ctx.textAlign = 'center';
    ctx.font = '12px monospace';
    ctx.fillStyle = '#CCCCCC';
    const descriptionY = finalY + 190;
    const maxDescriptionWidth = cardWidth - 40;
    
    // 自动换行描述文本
    const words = character.description.split('');
    let line = '';
    let lineY = descriptionY;
    const lineHeight = 15;
    
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i];
        const testWidth = ctx.measureText(testLine).width;
        
        if (testWidth > maxDescriptionWidth && i > 0) {
            ctx.fillText(line, centerX, lineY);
            line = words[i];
            lineY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, centerX, lineY);
    
    // 属性显示
    const statsY = finalY + 230;
    drawCharacterStats(character, cardX + 20, statsY, cardWidth - 40);
    
    // 技能预览 - 向上调整位置
    const skillsY = finalY + 300;
    drawCharacterSkills(character, cardX + 20, skillsY, cardWidth - 40);
}

// 绘制角色属性
function drawCharacterStats(character, x, y, width) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const stats = [
        { 
            name: '生命值', 
            value: Math.floor(GameConfig.PLAYER.INITIAL_HEALTH * character.healthMultiplier),
            color: '#FF6B6B',
            icon: '❤'
        },
        { 
            name: '速度', 
            value: Math.floor(GameConfig.PLAYER.SPEED * character.speedMultiplier),
            color: '#4ECDC4',
            icon: '⚡'
        },
        { 
            name: '经验', 
            value: `${Math.floor(character.expMultiplier * 100)}%`,
            color: '#45B7D1',
            icon: '⭐'
        }
    ];
    
    stats.forEach((stat, index) => {
        const statY = y + index * 25;
        
        // 图标
        ctx.font = '12px Arial';
        ctx.fillStyle = stat.color;
        ctx.fillText(stat.icon, x, statY);
        
        // 属性名
        drawPixelText(stat.name, x + 20, statY, 12, '#CCCCCC', false);
        
        // 属性值
        drawPixelText(stat.value.toString(), x + width - 50, statY, 12, stat.color, false);
    });
}

// 绘制角色技能预览
function drawCharacterSkills(character, x, y, width) {
    const skills = Object.values(character.skills);
    
    if (skills.length > 0) {
        // 计算居中位置
        const centerX = x + width / 2;
        
        // 技能标题 - 居中且字体更大
        ctx.textAlign = 'center';
        drawPixelText('特殊技能:', centerX, y, 14, '#FFD700', true);
        
        let currentY = y + 20;
        const lineHeight = 15;
        const maxCharsPerLine = Math.floor(width / 8); // 调整字符数以适应更大字体
        
        // 显示所有技能，但限制在卡片空间内
        skills.slice(0, 2).forEach((skill, index) => {
            // 技能名称 - 居中且字体更大
            ctx.textAlign = 'center';
            drawPixelText(`${index + 1}. ${skill.name}`, centerX, currentY, 13, '#FFFFFF', true);
            currentY += lineHeight;
            
            // 技能描述 - 居中显示且字体更大
            const description = skill.description;
            const words = description.split('');
            let line = '';
            let charCount = 0;
            
            for (let i = 0; i < words.length; i++) {
                if (charCount >= maxCharsPerLine && words[i] !== ' ') {
                    // 换行
                    if (line.trim()) {
                        ctx.textAlign = 'center';
                        drawPixelText(line.trim(), centerX, currentY, 11, '#CCCCCC', false);
                        currentY += lineHeight - 2;
                        line = '';
                        charCount = 0;
                    }
                }
                line += words[i];
                charCount++;
            }
            
            // 绘制最后一行
            if (line.trim()) {
                ctx.textAlign = 'center';
                drawPixelText(line.trim(), centerX, currentY, 11, '#CCCCCC', false);
                currentY += lineHeight + 3;
            }
        });
        
        // 如果还有更多技能，显示提示 - 居中
        if (skills.length > 2) {
            ctx.textAlign = 'center';
            drawPixelText(`+${skills.length - 2}个更多技能...`, centerX, currentY, 10, '#888888', false);
        }
    }
}

// 像素字体渲染函数
function drawPixelText(text, x, y, size, color, bold = false) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // 像素字体效果
    const pixelFont = bold ? `bold ${size}px monospace` : `${size}px monospace`;
    ctx.font = pixelFont;
    
    // 像素描边效果
    if (bold) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, size / 16);
        ctx.strokeText(text, x, y);
    }
    
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

// 像素化边框
function drawPixelBorder(x, y, width, height, color, thickness) {
    ctx.fillStyle = color;
    
    // 上边
    ctx.fillRect(x, y, width, thickness);
    // 下边
    ctx.fillRect(x, y + height - thickness, width, thickness);
    // 左边
    ctx.fillRect(x, y, thickness, height);
    // 右边
    ctx.fillRect(x + width - thickness, y, thickness, height);
    
    // 角落装饰
    ctx.fillRect(x - thickness, y - thickness, thickness * 3, thickness * 3);
    ctx.fillRect(x + width - thickness * 2, y - thickness, thickness * 3, thickness * 3);
    ctx.fillRect(x - thickness, y + height - thickness * 2, thickness * 3, thickness * 3);
    ctx.fillRect(x + width - thickness * 2, y + height - thickness * 2, thickness * 3, thickness * 3);
}

// 像素化发光效果
function drawPixelGlow(x, y, width, height, color, alpha) {
    const glowSize = 8;
    
    for (let i = 0; i < glowSize; i++) {
        const currentAlpha = alpha * (1 - i / glowSize);
        ctx.fillStyle = color + Math.floor(currentAlpha * 255).toString(16).padStart(2, '0');
        ctx.fillRect(x - width/2 - i, y - height/2 - i, width + i * 2, height + i * 2);
    }
}

// 像素化星空背景
function drawPixelStarfield() {
    const time = Date.now() * 0.0001;
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const x = (Math.sin(i * 12.345 + time) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(i * 23.456 + time * 0.7) * 0.5 + 0.5) * canvas.height;
        const brightness = Math.sin(i * 34.567 + time * 3) * 0.5 + 0.5;
        const size = Math.floor(brightness * 3) + 1;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.8})`;
        ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
    }
}

// 扫描线效果
function drawScanlines() {
    ctx.fillStyle = 'rgba(0, 255, 136, 0.05)';
    for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 1);
    }
    for (let y = 2; y < canvas.height; y += 4) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, y, canvas.width, 1);
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
        // 确保对象有update方法（是DamageNumber实例）
        if (number && typeof number.update === 'function') {
            if (number.update()) {
                return true;
            }
            return false;
        } else {
            // 移除无效的对象
            console.warn('发现无效的伤害数字对象，已移除:', number);
            return false;
        }
    });
}

// 绘制伤害数字（被main.js调用）
function drawDamageNumbers() {
    damageNumbers.forEach(number => {
        if (number && typeof number.draw === 'function') {
            number.draw();
        }
    });
}

// 经验条动画系统
let expBarAnimation = {
    currentExp: 0,
    targetExp: 0,
    animating: false,
    speed: 2
};

// 屏幕震动系统已在effects.js中定义

// 绘制角色状态UI
function drawCharacterStatusUI() {
    if (!selectedCharacter) return;
    
    const statusX = 15;
    const statusY = GameConfig.UI.EXP_BAR.y + GameConfig.UI.EXP_BAR.height + 120; // 在道具效果下方
    
    // 角色信息背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(statusX, statusY, 200, 80);
    
    // 边框
    ctx.strokeStyle = selectedCharacter.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(statusX, statusY, 200, 80);
    
    // 角色图标
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = selectedCharacter.color;
    ctx.fillText(selectedCharacter.icon, statusX + 10, statusY + 10);
    
    // 角色名称
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(selectedCharacter.name, statusX + 40, statusY + 10);
    
    // 获取角色状态信息
    const statusInfo = getCharacterStatusInfo ? getCharacterStatusInfo() : null;
    if (statusInfo && statusInfo.abilities.length > 0) {
        let abilityY = statusY + 35;
        
        statusInfo.abilities.forEach(ability => {
            // 技能名称
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = ability.active ? '#00FF00' : '#CCCCCC';
            ctx.fillText(ability.name, statusX + 10, abilityY);
            
            // 技能描述
            ctx.font = '10px Arial';
            ctx.fillStyle = '#AAAAAA';
            ctx.fillText(ability.description, statusX + 10, abilityY + 15);
            
            abilityY += 30;
        });
    } else {
        // 显示角色被动效果
        ctx.font = '10px Arial';
        ctx.fillStyle = '#CCCCCC';
        ctx.fillText('被动技能已激活', statusX + 10, statusY + 40);
        
        // 显示特殊能力
        let abilityText = '';
        switch (selectedCharacter.specialAbility) {
            case 'block':
                abilityText = `格挡 ${Math.floor(selectedCharacter.blockChance * 100)}%`;
                break;
            case 'dodge':
                abilityText = `闪避 ${Math.floor(selectedCharacter.dodgeChance * 100)}%`;
                break;
            case 'manaShield':
                abilityText = `法力护盾 ${Math.floor(selectedCharacter.shieldAbsorption * 100)}%`;
                break;
        }
        ctx.fillText(abilityText, statusX + 10, statusY + 55);
    }
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
    const currentGameTime = typeof gameTime !== 'undefined' ? gameTime : 0;
    const minutes = Math.floor(currentGameTime / 60);
    const seconds = currentGameTime % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(timeString, canvas.width / 2, 30);
    
    // 波次显示 (基于时间计算)
    const currentWave = Math.floor(currentGameTime / 30) + 1;
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

// 绘制升级选择界面 - 魔法主题优化版
function drawUpgradeMenu() {
    if (!isUpgradeMenuOpen || !upgradeChoices || upgradeChoices.length === 0) {
        return;
    }
    
    const time = Date.now() * 0.001;
    
    // === 深度魔法背景 ===
    drawUpgradeMenuBackground(time);
    
    // === 标题区域 ===
    drawUpgradeMenuTitle(time);
    
    // === 升级选项卡片 ===
    drawUpgradeCards(time);
    
    // === 底部提示 ===
    drawUpgradeMenuFooter();
}

// 绘制升级菜单魔法背景
function drawUpgradeMenuBackground(time) {
    // 深色渐变背景
    const bgGradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)/1.5
    );
    bgGradient.addColorStop(0, 'rgba(20, 10, 40, 0.95)');
    bgGradient.addColorStop(0.5, 'rgba(10, 5, 25, 0.98)');
    bgGradient.addColorStop(1, 'rgba(5, 0, 15, 1)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 动态魔法粒子
    ctx.save();
    for (let i = 0; i < 40; i++) {
        const particleTime = time + i * 0.5;
        const x = (Math.sin(particleTime * 0.3 + i * 1.2) * 0.4 + 0.5) * canvas.width;
        const y = (Math.cos(particleTime * 0.2 + i * 0.8) * 0.4 + 0.5) * canvas.height;
        const alpha = 0.1 + Math.sin(particleTime * 2 + i * 2) * 0.08;
        const size = 1.5 + Math.sin(particleTime * 3 + i) * 0.8;
        
        // 不同颜色的魔法粒子
        const colors = ['#9370DB', '#4169E1', '#FFD700', '#87CEEB'];
        const color = colors[i % colors.length];
        
        ctx.fillStyle = `rgba(${hexToRgb(color)}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 粒子光晕
        ctx.fillStyle = `rgba(${hexToRgb(color)}, ${alpha * 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
    
    // 魔法能量波纹
    ctx.save();
    ctx.globalAlpha = 0.1;
    const rippleRadius = (time * 60) % 300;
    const innerRadius = Math.max(0, rippleRadius - 50);  // 确保内半径不为负数
    const rippleGradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, innerRadius,
        canvas.width/2, canvas.height/2, rippleRadius
    );
    rippleGradient.addColorStop(0, 'rgba(147, 112, 219, 0)');
    rippleGradient.addColorStop(0.5, 'rgba(147, 112, 219, 0.6)');
    rippleGradient.addColorStop(1, 'rgba(147, 112, 219, 0)');
    ctx.fillStyle = rippleGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// 绘制升级菜单标题
function drawUpgradeMenuTitle(time) {
    // 标题背景装饰
    const titleY = 50;
    const titleBg = ctx.createLinearGradient(0, 10, 0, titleY + 30);
    titleBg.addColorStop(0, 'rgba(30, 20, 60, 0.2)');
    titleBg.addColorStop(0.5, 'rgba(50, 30, 80, 0.6)');
    titleBg.addColorStop(1, 'rgba(30, 20, 60, 0.2)');
    ctx.fillStyle = titleBg;
    ctx.fillRect(0, 10, canvas.width, titleY + 20);
    
    // 魔法阵装饰（背景）
    drawMagicCircleDecoration(canvas.width / 2, 35, 80, time);
    
    // 主标题带动画效果
    const titleScale = 1 + Math.sin(time * 2) * 0.05;
    ctx.save();
    ctx.translate(canvas.width / 2, 35);
    ctx.scale(titleScale, titleScale);
    
    // 标题光晕
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 20;
    drawTextWithStroke('✨ LEVEL UP! ✨', 0, 0, '#FFD700', '#8B0000', 'bold 32px serif');
    ctx.shadowBlur = 0;
    ctx.restore();
    
    // 副标题
    ctx.textAlign = 'center';
    drawTextWithStroke('选择你的力量进化路径', canvas.width / 2, titleY + 15, '#FFFFFF', '#000', 'bold 16px serif');
    
    // 左右装饰符文
    drawRuneDecoration(50, 35, time, 'left');
    drawRuneDecoration(canvas.width - 50, 35, time, 'right');
}

// 绘制升级卡片
function drawUpgradeCards(time) {
    if (!upgradeChoices || upgradeChoices.length === 0) return;
    
    // 响应式卡片参数 - 根据选项数量动态调整
    const optionCount = upgradeChoices.length;
    let cardWidth, cardSpacing;
    
    // 根据选项数量动态计算最佳尺寸
    const availableWidth = canvas.width - 40; // 留出边距
    if (optionCount <= 2) {
        cardWidth = Math.min(300, (availableWidth - 20) / 2);
        cardSpacing = 20;
    } else if (optionCount === 3) {
        cardWidth = Math.min(240, (availableWidth - 40) / 3);
        cardSpacing = 20;
    } else {
        cardWidth = Math.min(180, (availableWidth - (optionCount - 1) * 15) / optionCount);
        cardSpacing = 15;
    }
    
    const cardHeight = 160;
    const totalWidth = optionCount * cardWidth + (optionCount - 1) * cardSpacing;
    const startX = (canvas.width - totalWidth) / 2;
    const startY = 100;
    
    upgradeChoices.forEach((choice, index) => {
        const cardX = startX + index * (cardWidth + cardSpacing);
        const cardY = startY;
        const rarity = choice.rarity || 'common';
        
        // 卡片悬浮动画
        const floatOffset = Math.sin(time * 2 + index * 0.5) * 3;
        const currentCardY = cardY + floatOffset;
        
        // 绘制卡片主体
        drawUpgradeCard(cardX, currentCardY, cardWidth, cardHeight, choice, index, rarity, time);
    });
}

// 绘制单个升级卡片
function drawUpgradeCard(x, y, width, height, choice, index, rarity, time) {
    ctx.save();
    
    // === 稀有度光环效果 ===
    drawCardAura(x, y, width, height, rarity, time);
    
    // === 卡片阴影 ===
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(x + 5, y + 5, width, height);
    
    // === 卡片背景 ===
    drawCardBackground(x, y, width, height, rarity);
    
    // === 装饰性边框 ===
    drawDecorativeBorder(x, y, width, height, getUpgradeRarityColor(rarity));
    
    // === 按键提示区域 ===
    drawCardKeyPrompt(x, y, width, choice, index, rarity);
    
    // === 图标区域 ===
    drawCardIcon(x, y, choice, rarity, time, width);
    
    // === 文字信息区域 ===
    drawCardInfo(x, y, width, height, choice, rarity);
    
    // === 等级进度显示 ===
    drawCardLevelProgress(x, y, width, height, choice);
    
    // === 魔法装饰元素 ===
    drawEnhancedCardDecorations(x, y, width, height, rarity, time);
    
    ctx.restore();
}

// 绘制卡片光环
function drawCardAura(x, y, width, height, rarity, time) {
    const auraSize = 15;
    const intensity = 0.3 + Math.sin(time * 3) * 0.15;
    
    // 根据稀有度设置光环颜色和效果
    let auraColor, auraIntensity;
    switch(rarity) {
        case 'legendary':
            auraColor = '#FFD700';
            auraIntensity = intensity * 1.5;
            // 传说级额外粒子效果
            for (let i = 0; i < 8; i++) {
                const angle = (time * 2 + i * Math.PI / 4);
                const px = x + width/2 + Math.cos(angle) * (width/2 + 20);
                const py = y + height/2 + Math.sin(angle) * (height/2 + 20);
                ctx.fillStyle = `rgba(255, 215, 0, ${intensity * 0.6})`;
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        case 'epic':
            auraColor = '#FF8C00';
            auraIntensity = intensity * 1.2;
            break;
        case 'rare':
            auraColor = '#9932CC';
            auraIntensity = intensity;
            break;
        case 'uncommon':
            auraColor = '#1E90FF';
            auraIntensity = intensity * 0.8;
            break;
        default:
            auraColor = '#FFFFFF';
            auraIntensity = intensity * 0.5;
    }
    
    // 绘制光环
    const auraGradient = ctx.createRadialGradient(
        x + width/2, y + height/2, width/2,
        x + width/2, y + height/2, width/2 + auraSize
    );
    auraGradient.addColorStop(0, `rgba(${hexToRgb(auraColor)}, 0)`);
    auraGradient.addColorStop(0.7, `rgba(${hexToRgb(auraColor)}, ${auraIntensity * 0.3})`);
    auraGradient.addColorStop(1, `rgba(${hexToRgb(auraColor)}, 0)`);
    
    ctx.fillStyle = auraGradient;
    ctx.fillRect(x - auraSize, y - auraSize, width + auraSize * 2, height + auraSize * 2);
}

// 绘制卡片背景
function drawCardBackground(x, y, width, height, rarity) {
    // 石质纹理背景
    drawStoneTexture(x, y, width, height);
    
    // 魔法能量覆盖层
    const energyGradient = ctx.createLinearGradient(x, y, x, y + height);
    energyGradient.addColorStop(0, 'rgba(30, 20, 50, 0.85)');
    energyGradient.addColorStop(0.5, 'rgba(20, 15, 35, 0.9)');
    energyGradient.addColorStop(1, 'rgba(10, 5, 20, 0.95)');
    
    ctx.fillStyle = energyGradient;
    ctx.fillRect(x, y, width, height);
    
    // 稀有度特殊背景效果
    if (rarity === 'legendary') {
        const goldGradient = ctx.createRadialGradient(
            x + width/2, y + height/2, 0,
            x + width/2, y + height/2, width/2
        );
        goldGradient.addColorStop(0, 'rgba(255, 215, 0, 0.1)');
        goldGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = goldGradient;
        ctx.fillRect(x, y, width, height);
    }
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

// 绘制按键提示区域
function drawCardKeyPrompt(x, y, width, choice, index, rarity) {
    const keyBgSize = 30;
    const keyX = x + width/2 - keyBgSize/2;
    const keyY = y + 15;
    
    // 按键背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(keyX - 2, keyY - 2, keyBgSize + 4, keyBgSize + 4);
    
    const rarityColor = getUpgradeRarityColor(rarity);
    const keyGradient = ctx.createLinearGradient(keyX, keyY, keyX, keyY + keyBgSize);
    keyGradient.addColorStop(0, rarityColor);
    keyGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    ctx.fillStyle = keyGradient;
    ctx.fillRect(keyX, keyY, keyBgSize, keyBgSize);
    
    // 按键边框
    ctx.strokeStyle = rarityColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(keyX, keyY, keyBgSize, keyBgSize);
    
    // 按键数字
    ctx.textAlign = 'center';
    drawTextWithStroke(`${index + 1}`, keyX + keyBgSize/2, keyY + keyBgSize/2 + 6, '#FFFFFF', '#000', 'bold 18px serif');
}

// 绘制卡片图标
function drawCardIcon(x, y, choice, rarity, time, cardWidth) {
    const iconSize = Math.min(50, cardWidth * 0.2); // 根据卡片宽度调整图标大小
    const iconX = x + 15;
    const iconY = y + 70;
    
    // 图标背景光晕
    const iconIntensity = 0.4 + Math.sin(time * 4) * 0.2;
    const iconGradient = ctx.createRadialGradient(
        iconX + iconSize/2, iconY + iconSize/2, 0,
        iconX + iconSize/2, iconY + iconSize/2, iconSize/2 + 10
    );
    const rarityColor = getUpgradeRarityColor(rarity);
    iconGradient.addColorStop(0, `rgba(${hexToRgb(rarityColor)}, ${iconIntensity})`);
    iconGradient.addColorStop(1, `rgba(${hexToRgb(rarityColor)}, 0)`);
    ctx.fillStyle = iconGradient;
    ctx.fillRect(iconX - 10, iconY - 10, iconSize + 20, iconSize + 20);
    
    // 图标主体
    const icon = getUpgradeIcon(choice);
    ctx.textAlign = 'center';
    
    // 图标阴影
    drawTextWithStroke(icon, iconX + iconSize/2 + 2, iconY + iconSize/2 + 8, 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.8)', `${iconSize}px serif`);
    // 图标主体
    drawTextWithStroke(icon, iconX + iconSize/2, iconY + iconSize/2 + 6, rarityColor, '#000', `${iconSize}px serif`);
    
    // 传说级图标额外光效
    if (rarity === 'legendary') {
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;
        drawTextWithStroke(icon, iconX + iconSize/2, iconY + iconSize/2 + 6, '#FFD700', '#8B0000', `${iconSize}px serif`);
        ctx.shadowBlur = 0;
    }
}

// 绘制卡片信息
function drawCardInfo(x, y, width, height, choice, rarity) {
    // 根据卡片宽度动态调整信息区域位置
    const iconWidth = 75; // 图标区域预留宽度
    const infoX = x + Math.min(iconWidth, width * 0.35);
    const infoStartY = y + 50;
    const rarityColor = getUpgradeRarityColor(rarity);
    
    // 升级名称
    ctx.textAlign = 'left';
    let nameText;
    if (choice.weaponName) {
        // 武器升级
        nameText = (typeof WeaponUpgrades !== 'undefined' && WeaponUpgrades[choice.weaponName]?.name) || getWeaponChineseName(choice.weaponName);
    } else {
        // 被动技能升级
        nameText = choice.name || getPassiveChineseName(choice.type) || '未知升级';
    }
    
    // 根据卡片宽度和文字长度动态调整字体大小
    let fontSize = width < 200 ? 14 : (nameText.length > 12 ? 16 : 18);
    const nameFont = `bold ${fontSize}px serif`;
    drawTextWithStroke(nameText, infoX, infoStartY, '#FFFFFF', '#000', nameFont);
    
    // 升级描述
    const description = choice.description || '提升战斗能力';
    const maxLineWidth = width - infoX + x - 15; // 动态计算最大行宽
    
    // 智能文字换行 - 优化中文支持，根据卡片宽度调整字体
    const descFontSize = width < 200 ? 12 : 14;
    ctx.font = `${descFontSize}px "Microsoft YaHei", "SimSun", serif`;
    let lines = [];
    let currentLine = '';
    
    // 检测是否包含中文
    const hasChinese = /[\u4e00-\u9fa5]/.test(description);
    
    if (hasChinese) {
        // 中文按字符分割，更精确的换行
        for (let i = 0; i < description.length; i++) {
            const char = description[i];
            const testLine = currentLine + char;
            const testWidth = ctx.measureText(testLine).width;
            
            if (testWidth > maxLineWidth && currentLine) {
                lines.push(currentLine);
                currentLine = char;
            } else {
                currentLine = testLine;
            }
        }
    } else {
        // 英文按单词分割
        const words = description.split(' ');
        for (let word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const testWidth = ctx.measureText(testLine).width;
            
            if (testWidth > maxLineWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
    }
    if (currentLine) lines.push(currentLine);
    
    // 绘制描述文本
    const lineHeight = descFontSize + 2;
    lines.slice(0, 3).forEach((line, index) => {
        drawTextWithStroke(line, infoX, infoStartY + 25 + index * lineHeight, '#CCCCCC', '#000', `${descFontSize}px serif`);
    });
    
    // 稀有度标识
    drawTextWithStroke(`[${getRarityName(rarity)}]`, infoX, infoStartY + 90, rarityColor, '#000', 'bold 12px serif');
}

// 绘制等级进度
function drawCardLevelProgress(x, y, width, height, choice) {
    if (!choice.weaponName || typeof weapons === 'undefined' || !weapons[choice.weaponName]) return;
    
    const weapon = weapons[choice.weaponName];
    const progressWidth = Math.min(70, width * 0.3);
    const progressX = x + width - progressWidth - 5;
    const progressY = y + height - 25;
    
    // 等级进度背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(progressX, progressY, progressWidth, 15);
    
    // 等级文字 - 根据宽度调整字体大小
    const fontSize = width < 200 ? 8 : 10;
    ctx.textAlign = 'center';
    drawTextWithStroke(`Lv.${weapon.level} → ${weapon.level + 1}`, 
                      progressX + progressWidth/2, progressY + 11, '#90EE90', '#000', `bold ${fontSize}px serif`);
}

// 绘制底部提示
function drawUpgradeMenuFooter() {
    // 底部装饰条
    const footerY = canvas.height - 50;
    const footerGradient = ctx.createLinearGradient(0, footerY, 0, canvas.height);
    footerGradient.addColorStop(0, 'rgba(50, 30, 80, 0.3)');
    footerGradient.addColorStop(1, 'rgba(20, 10, 40, 0.8)');
    ctx.fillStyle = footerGradient;
    ctx.fillRect(0, footerY, canvas.width, 50);
    
    // 提示文字
    ctx.textAlign = 'center';
    drawTextWithStroke('⌨️ 按对应数字键选择升级 ⌨️', canvas.width / 2, footerY + 25, '#AAAAAA', '#000', 'bold 14px serif');
}

// 获取稀有度中文名称
function getRarityName(rarity) {
    const names = {
        common: '普通',
        uncommon: '罕见',
        rare: '稀有',
        epic: '史诗',
        legendary: '传说'
    };
    return names[rarity] || '普通';
}

// 获取武器中文名称
function getWeaponChineseName(weaponKey) {
    const names = {
        missile: '魔法飞弹',
        fireball: '火球术',
        frostbolt: '冰霜箭',
        book: '圣书环绕',
        whip: '魔能鞭',
        garlic: '大蒜护盾',
        cross: '十字回旋镖'
    };
    return names[weaponKey] || weaponKey;
}

// 获取被动技能中文名称
function getPassiveChineseName(passiveType) {
    const names = {
        health: '生命强化',
        speed: '移动强化', 
        damage: '伤害强化',
        experience: '经验强化',
        exp: '经验强化',
        pickup: '拾取强化',
        cooldown: '冷却强化',
        armor: '防御强化',
        regeneration: '生命回复',
        luck: '幸运强化',
        magnetism: '磁力强化'
    };
    return names[passiveType] || passiveType;
}

// 获取升级图标
function getUpgradeIcon(choice) {
    if (choice.weaponName) {
        // 使用升级系统中的武器图标
        return typeof getWeaponIcon !== 'undefined' ? getWeaponIcon(choice.weaponName) : getWeaponIconFallback(choice.weaponName);
    }
    
    // 被动技能图标
    if (choice.passiveType) {
        return typeof getPassiveIcon !== 'undefined' ? getPassiveIcon(choice.passiveType) : getPassiveIconFallback(choice.passiveType);
    }
    
    // 通用图标映射
    const typeIcons = {
        weapon: '⚔️',
        passive: '✨',
        health: '💖',
        speed: '💨', 
        damage: '💪',
        experience: '🌟',
        exp: '🌟',
        pickup: '🧲',
        cooldown: '⏰'
    };
    
    return typeIcons[choice.type] || '🎯';
}

// 武器图标回退方案
function getWeaponIconFallback(weaponName) {
    const icons = {
        missile: '✦',
        fireball: '🔥',
        frostbolt: '❄️',
        book: '📖',
        whip: '⚡',
        garlic: '🛡️',
        cross: '🌟'
    };
    return icons[weaponName] || '⚔️';
}

// 被动技能图标回退方案  
function getPassiveIconFallback(passiveType) {
    const icons = {
        health: '💖',
        speed: '💨',
        damage: '💪',
        experience: '🌟',
        pickup: '🧲',
        cooldown: '⏰',
        regen: '🔄',
        armor: '🛡️'
    };
    return icons[passiveType] || '✨';
}

// 绘制魔法阵装饰
function drawMagicCircleDecoration(centerX, centerY, radius, time) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.translate(centerX, centerY);
    ctx.rotate(time * 0.5);
    
    // 外环
    ctx.strokeStyle = '#9370DB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // 内环
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    
    // 魔法符号
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * radius * 0.5, Math.sin(angle) * radius * 0.5);
        ctx.lineTo(Math.cos(angle) * radius * 0.9, Math.sin(angle) * radius * 0.9);
        ctx.stroke();
        
        // 小装饰点
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * radius * 0.8, Math.sin(angle) * radius * 0.8, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

// 绘制符文装饰
function drawRuneDecoration(x, y, time, side) {
    ctx.save();
    ctx.translate(x, y);
    
    // 符文动画
    const runeScale = 0.8 + Math.sin(time * 3) * 0.2;
    const runeRotation = time * (side === 'left' ? 1 : -1);
    ctx.scale(runeScale, runeScale);
    ctx.rotate(runeRotation);
    
    // 符文符号
    ctx.strokeStyle = '#87CEEB';
    ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
    ctx.lineWidth = 2;
    
    // 简单的符文图形
    ctx.beginPath();
    ctx.moveTo(-15, -15);
    ctx.lineTo(15, -15);
    ctx.lineTo(0, 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 内部装饰
    ctx.beginPath();
    ctx.moveTo(-8, -5);
    ctx.lineTo(8, -5);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
}

// 增强版卡片绘制 - 添加魔法装饰
function drawEnhancedCardDecorations(x, y, width, height, rarity, time) {
    // 角落符文装饰
    const cornerSize = 12;
    const corners = [
        [x + cornerSize, y + cornerSize],
        [x + width - cornerSize, y + cornerSize],
        [x + cornerSize, y + height - cornerSize],
        [x + width - cornerSize, y + height - cornerSize]
    ];
    
    const rarityColor = getUpgradeRarityColor(rarity);
    
    corners.forEach((corner, index) => {
        ctx.save();
        ctx.translate(corner[0], corner[1]);
        ctx.rotate(time + index * Math.PI / 2);
        
        ctx.strokeStyle = rarityColor;
        ctx.fillStyle = `rgba(${hexToRgb(rarityColor)}, 0.2)`;
        ctx.lineWidth = 1;
        
        // 小魔法符号
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(0, -6);
        ctx.lineTo(6, 0);
        ctx.lineTo(0, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    });
    
    // 传说级卡片特殊装饰
    if (rarity === 'legendary') {
        // 环绕光球
        for (let i = 0; i < 6; i++) {
            const angle = time * 2 + i * Math.PI / 3;
            const orbX = x + width/2 + Math.cos(angle) * (width/2 + 30);
            const orbY = y + height/2 + Math.sin(angle) * (height/2 + 30);
            
            ctx.fillStyle = `rgba(255, 215, 0, ${0.4 + Math.sin(time * 4 + i) * 0.3})`;
            ctx.beginPath();
            ctx.arc(orbX, orbY, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
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
        { label: '生存时间', value: formatTime(typeof gameTime !== 'undefined' ? gameTime : 0), icon: '⏱️' },
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
    const currentGameTime = typeof gameTime !== 'undefined' ? gameTime : 0;
    return currentGameTime >= 300;
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
    
    // 右侧信息区域
    const rightInfoX = GameConfig.UI.RIGHT_INFO_X;
    
    // 时间显示
    const currentStartTime = typeof startTime !== 'undefined' ? startTime : Math.floor(Date.now() / 1000);
    const currentGameTime = Math.floor(Date.now() / 1000) - currentStartTime;
    const minutes = Math.floor(currentGameTime / 60);
    const seconds = currentGameTime % 60;
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
        const currentStartTime = typeof startTime !== 'undefined' ? startTime : Math.floor(Date.now() / 1000);
        const localGameTime = Math.floor(Date.now() / 1000) - currentStartTime;
        const minutes = Math.floor(localGameTime / 60);
        const seconds = localGameTime % 60;
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
}

// === BOSS UI系统和像素风格增强 ===

// 绘制BOSS血量条
function drawBossHealthBar() {
    if (!activeBoss) return;
    
    const bossHpBarWidth = canvas.width - 100;
    const bossHpBarHeight = 20;
    const bossHpBarX = 50;
    const bossHpBarY = 60;
    
    // BOSS血量条背景 - 像素化设计
    drawPixelFrame(bossHpBarX - 5, bossHpBarY - 5, bossHpBarWidth + 10, bossHpBarHeight + 10, '#8B0000', 3);
    ctx.fillStyle = 'rgba(139, 0, 0, 0.8)';
    ctx.fillRect(bossHpBarX, bossHpBarY, bossHpBarWidth, bossHpBarHeight);
    
    // BOSS血量条填充
    const healthPercentage = activeBoss.health / activeBoss.maxHealth;
    const healthWidth = bossHpBarWidth * healthPercentage;
    
    // 血量渐变效果
    const healthGradient = ctx.createLinearGradient(bossHpBarX, bossHpBarY, bossHpBarX + healthWidth, bossHpBarY);
    if (healthPercentage > 0.6) {
        healthGradient.addColorStop(0, '#FF6B6B');
        healthGradient.addColorStop(1, '#FF4500');
    } else if (healthPercentage > 0.3) {
        healthGradient.addColorStop(0, '#FF8C00');
        healthGradient.addColorStop(1, '#FF4500');
    } else {
        healthGradient.addColorStop(0, '#DC143C');
        healthGradient.addColorStop(1, '#8B0000');
    }
    
    ctx.fillStyle = healthGradient;
    ctx.fillRect(bossHpBarX, bossHpBarY, healthWidth, bossHpBarHeight);
    
    // 像素化边框
    drawPixelBorder(bossHpBarX, bossHpBarY, bossHpBarWidth, bossHpBarHeight, '#FFD700', 2);
    
    // BOSS名称和血量文字
    const bossName = activeBoss.type.name;
    const healthText = `${Math.ceil(activeBoss.health)} / ${activeBoss.maxHealth}`;
    
    // BOSS图标
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = activeBoss.type.color;
    ctx.fillText(activeBoss.type.icon, bossHpBarX - 35, bossHpBarY + bossHpBarHeight/2);
    
    // BOSS名称 - 像素字体
    drawPixelText(bossName, bossHpBarX + 10, bossHpBarY - 25, 18, '#FFD700', true);
    
    // 血量数值
    drawPixelText(healthText, bossHpBarX + bossHpBarWidth - 10, bossHpBarY + bossHpBarHeight/2 + 6, 12, '#FFFFFF', false);
    ctx.textAlign = 'right';
    
    // BOSS阶段指示器
    if (activeBoss.phases && activeBoss.phases.length > 1) {
        const phaseText = `阶段 ${activeBoss.currentPhase + 1}/${activeBoss.phases.length}`;
        drawPixelText(phaseText, bossHpBarX + bossHpBarWidth/2, bossHpBarY + bossHpBarHeight + 20, 14, '#FFFF00', true);
        ctx.textAlign = 'center';
    }
}

// 绘制BOSS警告
function drawBossWarning() {
    if (!bossWarningActive) return;
    
    const warningAlpha = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
    
    // 全屏红色警告背景
    ctx.fillStyle = `rgba(255, 0, 0, ${warningAlpha * 0.2})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 警告边框
    const borderWidth = 10;
    ctx.fillStyle = `rgba(255, 0, 0, ${warningAlpha})`;
    ctx.fillRect(0, 0, canvas.width, borderWidth);
    ctx.fillRect(0, canvas.height - borderWidth, canvas.width, borderWidth);
    ctx.fillRect(0, 0, borderWidth, canvas.height);
    ctx.fillRect(canvas.width - borderWidth, 0, borderWidth, canvas.height);
    
    // 警告文字
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const warningScale = 1 + Math.sin(Date.now() * 0.02) * 0.1;
    const warningY = canvas.height / 2;
    
    // 警告主文字
    drawPixelText('⚠️ 警告 ⚠️', canvas.width/2, warningY - 40, 48 * warningScale, '#FFFF00', true);
    drawPixelText('强大的敌人即将出现！', canvas.width/2, warningY, 32 * warningScale, '#FF4500', true);
    drawPixelText('WARNING! BOSS INCOMING!', canvas.width/2, warningY + 40, 24 * warningScale, '#FFD700', false);
    
    // 倒计时
    const timeLeft = Math.ceil(bossWarningTimer / 60);
    drawPixelText(`${timeLeft}`, canvas.width/2, warningY + 80, 36 * warningScale, '#FFFFFF', true);
}

// 绘制击杀计数器
function drawKillCounter() {
    const counterX = canvas.width - 250;
    const counterY = 100;
    const counterWidth = 200;
    const counterHeight = 40;
    
    // 计数器背景
    drawPixelFrame(counterX, counterY, counterWidth, counterHeight, '#4169E1', 3);
    ctx.fillStyle = 'rgba(25, 25, 112, 0.9)';
    ctx.fillRect(counterX + 3, counterY + 3, counterWidth - 6, counterHeight - 6);
    
    // 击杀数显示
    const currentKills = typeof bossKillCount !== 'undefined' ? bossKillCount : 0;
    const requiredKills = typeof BossConfig !== 'undefined' ? BossConfig.KILLS_PER_BOSS : 150;
    const killText = `${currentKills} / ${requiredKills}`;
    
    // 骷髅图标
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('💀', counterX + 10, counterY + counterHeight/2);
    
    // 击杀计数文字
    drawPixelText(killText, counterX + 40, counterY + counterHeight/2 + 3, 16, '#FFFFFF', true);
    
    // 进度条
    const progressBarX = counterX + 110;
    const progressBarY = counterY + 15;
    const progressBarWidth = 80;
    const progressBarHeight = 10;
    
    // 进度条背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
    
    // 进度条填充
    const progress = currentKills / requiredKills;
    const progressWidth = progressBarWidth * Math.min(progress, 1);
    
    const progressGradient = ctx.createLinearGradient(progressBarX, progressBarY, progressBarX + progressWidth, progressBarY);
    progressGradient.addColorStop(0, '#00FF00');
    progressGradient.addColorStop(0.5, '#FFFF00');
    progressGradient.addColorStop(1, '#FF4500');
    
    ctx.fillStyle = progressGradient;
    ctx.fillRect(progressBarX, progressBarY, progressWidth, progressBarHeight);
    
    // 进度条边框
    drawPixelBorder(progressBarX, progressBarY, progressBarWidth, progressBarHeight, '#FFFFFF', 1);
    
    // 即将触发BOSS的提示
    if (progress >= 0.9) {
        const pulseAlpha = Math.sin(Date.now() * 0.02) * 0.5 + 0.5;
        drawPixelText('BOSS即将出现!', counterX + counterWidth/2, counterY + counterHeight + 15, 12, `rgba(255, 255, 0, ${pulseAlpha})`, true);
        ctx.textAlign = 'center';
    }
}

// 像素化辅助函数
function drawPixelFrame(x, y, width, height, color, thickness) {
    ctx.fillStyle = color;
    
    // 绘制像素化外框
    for (let i = 0; i < thickness; i++) {
        // 上下边
        ctx.fillRect(x - i, y - i, width + i * 2, 1);
        ctx.fillRect(x - i, y + height + i - 1, width + i * 2, 1);
        
        // 左右边
        ctx.fillRect(x - i, y - i, 1, height + i * 2);
        ctx.fillRect(x + width + i - 1, y - i, 1, height + i * 2);
    }
}

// 像素化文字渲染函数（重写以支持更多效果）
function drawPixelTextEnhanced(text, x, y, size, color, bold = false, shadow = false, glow = false) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const pixelFont = bold ? `bold ${size}px "Courier New", monospace` : `${size}px "Courier New", monospace`;
    ctx.font = pixelFont;
    
    if (glow) {
        // 发光效果
        ctx.shadowColor = color;
        ctx.shadowBlur = size / 4;
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
        }
        ctx.shadowBlur = 0;
    }
    
    if (shadow) {
        // 阴影效果
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillText(text, x + 2, y + 2);
    }
    
    // 主文字
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

// 绘制像素化伤害数字
function drawPixelDamageNumbers() {
    damageNumbers.forEach(damageNum => {
        if (damageNum && typeof damageNum.draw === 'function') {
            // 使用像素字体渲染伤害数字
            ctx.save();
            ctx.globalAlpha = damageNum.alpha;
            
            let color = '#FFFFFF';
            let size = 14 * damageNum.scale;
            
            if (damageNum.isHeal) {
                color = '#00FF88';
            } else if (damageNum.isCrit) {
                color = '#FFD700';
                size = 18 * damageNum.scale;
            } else if (damageNum.damage >= 100) {
                color = '#FF4500';
            } else if (damageNum.damage >= 50) {
                color = '#FF8C00';
            }
            
            const pixelFont = `bold ${size}px "Courier New", monospace`;
            ctx.font = pixelFont;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // 像素化阴影
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fillText(damageNum.isHeal ? `+${damageNum.damage}` : `${damageNum.damage}`, 
                        damageNum.x + 1, damageNum.y + 1);
            
            // 主文字
            ctx.fillStyle = color;
            ctx.fillText(damageNum.isHeal ? `+${damageNum.damage}` : `${damageNum.damage}`, 
                        damageNum.x, damageNum.y);
            
            ctx.restore();
        }
    });
}

// 绘制像素化小地图
function drawPixelMiniMap() {
    const mapSize = 100;
    const mapX = canvas.width - mapSize - 15;
    const mapY = canvas.height - mapSize - 15;
    const pixelSize = 2; // 像素化效果大小
    
    // 小地图像素化背景
    ctx.fillStyle = 'rgba(0, 20, 40, 0.9)';
    ctx.fillRect(mapX, mapY, mapSize, mapSize);
    
    // 像素化边框
    drawPixelBorder(mapX, mapY, mapSize, mapSize, '#00FFFF', 2);
    
    // 网格线
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < mapSize; i += 10) {
        ctx.beginPath();
        ctx.moveTo(mapX + i, mapY);
        ctx.lineTo(mapX + i, mapY + mapSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(mapX, mapY + i);
        ctx.lineTo(mapX + mapSize, mapY + i);
        ctx.stroke();
    }
    
    // 玩家位置 - 像素化
    const playerMapX = mapX + (player.x / canvas.width) * mapSize;
    const playerMapY = mapY + (player.y / canvas.height) * mapSize;
    
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(Math.floor(playerMapX / pixelSize) * pixelSize, 
                Math.floor(playerMapY / pixelSize) * pixelSize, 
                pixelSize * 2, pixelSize * 2);
    
    // 敌人位置 - 像素化
    enemies.forEach(enemy => {
        const enemyMapX = mapX + (enemy.x / canvas.width) * mapSize;
        const enemyMapY = mapY + (enemy.y / canvas.height) * mapSize;
        
        if (enemy.isBoss) {
            // BOSS显示为更大的像素点
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(Math.floor(enemyMapX / pixelSize) * pixelSize, 
                        Math.floor(enemyMapY / pixelSize) * pixelSize, 
                        pixelSize * 3, pixelSize * 3);
        } else {
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(Math.floor(enemyMapX / pixelSize) * pixelSize, 
                        Math.floor(enemyMapY / pixelSize) * pixelSize, 
                        pixelSize, pixelSize);
        }
    });
}

// 更新UI绘制函数以包含新元素
function drawEnhancedUI() {
    // 原有UI元素
    drawTopInfoBar();
    drawWeaponIcons();
    drawTimeAndWave();
    drawKillStats();
    
    // 新增UI元素
    drawKillCounter();
    drawBossWarning();
    drawBossHealthBar();
    drawPixelMiniMap();
}

// 文件结束 - 确保所有函数正确闭合