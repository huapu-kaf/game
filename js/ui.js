// UI界面系统

// 绘制武器选择界面
function drawWeaponSelect() {
    // 背景
    ctx.fillStyle = 'rgba(20, 20, 60, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 标题
    ctx.textAlign = 'center';
    drawTextWithStroke('选择你的起始武器', canvas.width/2, 100, '#FFD700', '#000', 'bold 36px serif');
    drawTextWithStroke('按对应数字键选择武器', canvas.width/2, 140, '#FFF', '#000', '18px serif');
    
    // 武器选项
    const weaponOptions = [
        {
            key: '1',
            name: '魔法飞弹',
            description: '快速射击，伤害适中',
            stats: '伤害: 15 | 速度: 快',
            color: '#FFD700',
            y: 200
        },
        {
            key: '2', 
            name: '火球术',
            description: '高伤害，射击较慢',
            stats: '伤害: 30 | 速度: 慢',
            color: '#FF4500',
            y: 280
        },
        {
            key: '3',
            name: '冰霜箭',
            description: '中等伤害，减速敌人',
            stats: '伤害: 20 | 速度: 中等',
            color: '#87CEEB',
            y: 360
        }
    ];
    
    weaponOptions.forEach(weapon => {
        // 武器面板
        const panelWidth = 600;
        const panelHeight = 60;
        const panelX = (canvas.width - panelWidth) / 2;
        
        // 面板背景
        ctx.fillStyle = 'rgba(40, 40, 80, 0.8)';
        ctx.fillRect(panelX, weapon.y, panelWidth, panelHeight);
        
        // 装饰边框
        drawDecorativeBorder(panelX, weapon.y, panelWidth, panelHeight, weapon.color);
        
        // 武器信息
        ctx.textAlign = 'left';
        drawTextWithStroke(`[${weapon.key}]`, panelX + 20, weapon.y + 25, weapon.color, '#000', 'bold 24px serif');
        drawTextWithStroke(weapon.name, panelX + 80, weapon.y + 25, weapon.color, '#000', 'bold 20px serif');
        drawTextWithStroke(weapon.description, panelX + 80, weapon.y + 45, '#FFF', '#000', '14px serif');
        drawTextWithStroke(weapon.stats, panelX + 400, weapon.y + 35, '#CCC', '#000', '12px serif');
    });
    
    // 底部提示
    ctx.textAlign = 'center';
    drawTextWithStroke('每种武器都有独特的升级路径！', canvas.width/2, canvas.height - 50, '#90EE90', '#000', '16px serif');
}

// 绘制UI和分数
function drawUI() {
    // 绘制主UI面板背景
    const panelX = 5, panelY = 5, panelWidth = canvas.width - 10, panelHeight = 70;
    
    // 石质纹理背景
    drawStoneTexture(panelX + 4, panelY + 4, panelWidth - 8, panelHeight - 8);
    
    // 半透明覆盖层
    ctx.fillStyle = 'rgba(20, 20, 40, 0.7)';
    ctx.fillRect(panelX + 4, panelY + 4, panelWidth - 8, panelHeight - 8);
    
    // 装饰边框
    drawDecorativeBorder(panelX, panelY, panelWidth, panelHeight, '#8B4513');
    
    // === 血量条区域 ===
    const healthBarX = GameConfig.UI.HEALTH_BAR.x;
    const healthBarY = GameConfig.UI.HEALTH_BAR.y;
    const healthBarWidth = GameConfig.UI.HEALTH_BAR.width;
    const healthBarHeight = GameConfig.UI.HEALTH_BAR.height;
    
    // 血量条石质背景
    drawStoneTexture(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    // 血量条内部凹陷
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(healthBarX + 2, healthBarY + 2, healthBarWidth - 4, healthBarHeight - 4);
    
    // 血量条填充
    const healthPercentage = Math.max(0, player.health) / player.maxHealth;
    const healthWidth = (healthBarWidth - 4) * healthPercentage;
    
    if (healthWidth > 0) {
        // 血量条颜色根据血量变化
        let healthGradient = ctx.createLinearGradient(healthBarX + 2, healthBarY + 2, healthBarX + 2, healthBarY + healthBarHeight - 2);
        
        if (healthPercentage > 0.6) {
            healthGradient.addColorStop(0, '#4CAF50');
            healthGradient.addColorStop(1, '#2E7D32');
        } else if (healthPercentage > 0.3) {
            healthGradient.addColorStop(0, '#FF9800');
            healthGradient.addColorStop(1, '#E65100');
        } else {
            healthGradient.addColorStop(0, '#F44336');
            healthGradient.addColorStop(1, '#B71C1C');
        }
        
        ctx.fillStyle = healthGradient;
        ctx.fillRect(healthBarX + 2, healthBarY + 2, healthWidth, healthBarHeight - 4);
        
        // 血量条光泽
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(healthBarX + 2, healthBarY + 2, healthWidth, 2);
    }
    
    // 血量条装饰边框
    drawDecorativeBorder(healthBarX, healthBarY, healthBarWidth, healthBarHeight, '#8B0000');
    
    // === 经验条区域 ===
    const expBarX = GameConfig.UI.EXP_BAR.x;
    const expBarY = GameConfig.UI.EXP_BAR.y;
    const expBarWidth = GameConfig.UI.EXP_BAR.width;
    const expBarHeight = GameConfig.UI.EXP_BAR.height;
    
    // 经验条石质背景
    drawStoneTexture(expBarX, expBarY, expBarWidth, expBarHeight);
    
    // 经验条内部凹陷
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(expBarX + 2, expBarY + 2, expBarWidth - 4, expBarHeight - 4);
    
    // 经验条填充
    const expPercentage = player.exp / player.expToNextLevel;
    const expWidth = (expBarWidth - 4) * expPercentage;
    
    if (expWidth > 0) {
        // 经验条渐变
        const expGradient = ctx.createLinearGradient(expBarX + 2, expBarY + 2, expBarX + 2, expBarY + expBarHeight - 2);
        expGradient.addColorStop(0, '#2196F3');
        expGradient.addColorStop(0.5, '#1976D2');
        expGradient.addColorStop(1, '#0D47A1');
        
        ctx.fillStyle = expGradient;
        ctx.fillRect(expBarX + 2, expBarY + 2, expWidth, expBarHeight - 4);
        
        // 经验条光泽
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(expBarX + 2, expBarY + 2, expWidth, 2);
    }
    
    // 经验条装饰边框
    drawDecorativeBorder(expBarX, expBarY, expBarWidth, expBarHeight, '#8B4513');
    
    // === 文字信息 ===
    ctx.textAlign = 'left';
    
    // 等级显示
    drawTextWithStroke(`等级 ${player.level}`, expBarX + expBarWidth + 20, expBarY + 12, '#FFD700', '#000', 'bold 16px serif');
    
    // 经验显示
    drawTextWithStroke(`${player.exp}/${player.expToNextLevel}`, expBarX + 15, expBarY + 12, '#FFF', '#000', '12px serif');
    
    // 分数显示
    drawTextWithStroke(`分数: ${score}`, expBarX, expBarY + 30, '#87CEEB', '#000', 'bold 14px serif');
    
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
    
    if (gameOver) {
        // 游戏结束界面背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 游戏结束面板
        const gameOverPanelWidth = 400;
        const gameOverPanelHeight = 300;
        const gameOverX = (canvas.width - gameOverPanelWidth) / 2;
        const gameOverY = (canvas.height - gameOverPanelHeight) / 2;
        
        // 面板背景
        ctx.fillStyle = 'rgba(40, 20, 60, 0.95)';
        ctx.fillRect(gameOverX, gameOverY, gameOverPanelWidth, gameOverPanelHeight);
        
        // 装饰边框
        drawDecorativeBorder(gameOverX, gameOverY, gameOverPanelWidth, gameOverPanelHeight, '#8B4513');
        
        // 游戏结束文字
        ctx.textAlign = 'center';
        drawTextWithStroke('游戏结束', canvas.width/2, gameOverY + 80, '#FF4500', '#000', 'bold 48px serif');
        drawTextWithStroke(`最终等级: ${player.level}`, canvas.width/2, gameOverY + 140, '#FFD700', '#000', 'bold 24px serif');
        drawTextWithStroke(`最终分数: ${score}`, canvas.width/2, gameOverY + 180, '#87CEEB', '#000', 'bold 24px serif');
        drawTextWithStroke(`生存时间: ${minutes}:${seconds.toString().padStart(2, '0')}`, canvas.width/2, gameOverY + 220, '#FFF', '#000', 'bold 20px serif');
        drawTextWithStroke('按 R 键重新开始', canvas.width/2, gameOverY + 260, '#90EE90', '#000', 'bold 18px serif');
        ctx.textAlign = 'left';
    }
    
    // 绘制升级选择界面
    if (typeof isUpgradeMenuOpen !== 'undefined' && isUpgradeMenuOpen) {
        drawUpgradeMenu();
    }
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