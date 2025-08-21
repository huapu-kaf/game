// 道具系统

// 道具数组
const items = [];

// 玩家当前激活的效果
const playerEffects = {};

// 道具创建函数
function createItem(type, x, y) {
    const itemConfig = ItemTypes[type];
    if (!itemConfig) return null;
    
    const item = {
        type: type,
        x: x,
        y: y,
        config: itemConfig,
        lifetime: 1800, // 30秒后消失
        bobOffset: Math.random() * Math.PI * 2, // 漂浮动画偏移
        glowPhase: Math.random() * Math.PI * 2, // 发光动画相位
        collected: false
    };
    
    items.push(item);
    return item;
}

// 随机生成道具
function spawnRandomItem(x, y) {
    if (Math.random() > GameConfig.GAMEPLAY.ITEM_DROP_CHANCE) return;
    
    const itemTypes = Object.keys(ItemTypes);
    const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    createItem(randomType, x, y);
}

// 更新道具系统
function updateItems() {
    // 更新现有道具
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        
        // 生命周期检查
        item.lifetime--;
        if (item.lifetime <= 0) {
            items.splice(i, 1);
            continue;
        }
        
        // 检查与玩家的碰撞
        const dx = item.x - (player.x + GameConfig.PLAYER.WIDTH / 2);
        const dy = item.y - (player.y + GameConfig.PLAYER.HEIGHT / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 25 && !item.collected) {
            collectItem(item);
            item.collected = true;
            items.splice(i, 1);
        }
    }
    
    // 更新玩家效果
    updatePlayerEffects();
}

// 收集道具
function collectItem(item) {
    const config = item.config;
    
    switch (config.effect) {
        case 'heal':
            player.health = Math.min(player.maxHealth, player.health + config.value);
            break;
        case 'damage_boost':
        case 'speed_boost':
        case 'exp_boost':
        case 'shield':
            applyPlayerEffect(config.effect, config.value, config.duration);
            break;
    }
    
    // 播放收集音效
    if (audioManager) {
        audioManager.playSound('gemPickup'); // 使用现有的拾取音效
    }
    
    // 显示收集提示
    showItemCollectEffect(item.x, item.y, config.name);
}

// 应用玩家效果
function applyPlayerEffect(effectType, value, duration) {
    playerEffects[effectType] = {
        value: value,
        duration: duration,
        maxDuration: duration
    };
}

// 更新玩家效果
function updatePlayerEffects() {
    for (const effectType in playerEffects) {
        const effect = playerEffects[effectType];
        effect.duration--;
        
        if (effect.duration <= 0) {
            delete playerEffects[effectType];
        }
    }
}

// 获取效果倍数
function getEffectMultiplier(effectType) {
    return playerEffects[effectType] ? playerEffects[effectType].value : 1.0;
}

// 检查是否有护盾效果
function hasShield() {
    return playerEffects.shield && playerEffects.shield.value > 0;
}

// 消耗护盾
function consumeShield() {
    if (playerEffects.shield) {
        playerEffects.shield.value--;
        if (playerEffects.shield.value <= 0) {
            delete playerEffects.shield;
        }
        return true;
    }
    return false;
}

// 绘制道具
function drawItems() {
    const currentTime = frameCount * 0.1;
    
    items.forEach(item => {
        const config = item.config;
        
        // 漂浮动画
        const bobHeight = Math.sin(currentTime * 3 + item.bobOffset) * 3;
        const itemY = item.y + bobHeight;
        
        // 发光效果
        const glowIntensity = (Math.sin(currentTime * 4 + item.glowPhase) + 1) * 0.3 + 0.4;
        
        // 绘制发光光环
        const glowGradient = ctx.createRadialGradient(item.x, itemY, 0, item.x, itemY, 25);
        glowGradient.addColorStop(0, config.color + Math.floor(glowIntensity * 255).toString(16).padStart(2, '0'));
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(item.x - 25, itemY - 25, 50, 50);
        
        // 绘制道具背景圆
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.arc(item.x, itemY, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制道具边框
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(item.x, itemY, 12, 0, Math.PI * 2);
        ctx.stroke();
        
        // 绘制道具图标
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(config.icon, item.x, itemY);
        
        // 生命周期警告
        if (item.lifetime < 300) {
            const blinkAlpha = Math.sin(currentTime * 15) > 0 ? 0.8 : 0.3;
            ctx.fillStyle = `rgba(255, 0, 0, ${blinkAlpha})`;
            ctx.strokeStyle = `rgba(255, 0, 0, ${blinkAlpha})`;
            ctx.beginPath();
            ctx.arc(item.x, itemY, 15, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
}

// 显示道具收集效果
function showItemCollectEffect(x, y, itemName) {
    // 添加到伤害数字系统中显示
    const damageNumber = {
        x: x,
        y: y,
        text: `+${itemName}`,
        color: '#00FF00',
        life: 60,
        dy: -2,
        dx: 0,
        scale: 1.2,
        isItem: true
    };
    
    if (typeof damageNumbers !== 'undefined') {
        damageNumbers.push(damageNumber);
    }
}

// 绘制玩家效果状态
function drawPlayerEffectStatus() {
    const startX = GameConfig.UI.HEALTH_BAR.x;
    let currentY = GameConfig.UI.EXP_BAR.y + GameConfig.UI.EXP_BAR.height + 10;
    
    for (const effectType in playerEffects) {
        const effect = playerEffects[effectType];
        const config = Object.values(ItemTypes).find(item => item.effect === effectType);
        
        if (!config) continue;
        
        // 计算剩余时间百分比
        const timePercent = effect.duration / effect.maxDuration;
        
        // 绘制效果图标背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(startX, currentY, 30, 20);
        
        // 绘制时间条
        ctx.fillStyle = config.color;
        ctx.fillRect(startX + 32, currentY + 2, 60 * timePercent, 16);
        
        // 绘制边框
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(startX, currentY, 30, 20);
        ctx.strokeRect(startX + 32, currentY + 2, 60, 16);
        
        // 绘制图标
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(config.icon, startX + 15, currentY + 10);
        
        // 绘制剩余时间
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFFFFF';
        const remainingSeconds = Math.ceil(effect.duration / 60);
        ctx.fillText(`${remainingSeconds}s`, startX + 95, currentY + 11);
        
        currentY += 25;
    }
}