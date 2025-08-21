// 工具函数和辅助功能

// 绘制石质纹理
function drawStoneTexture(x, y, width, height) {
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, '#6B6B6B');
    gradient.addColorStop(0.3, '#5A5A5A');
    gradient.addColorStop(0.7, '#4A4A4A');
    gradient.addColorStop(1, '#3A3A3A');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    
    // 添加噪点纹理
    for (let i = 0; i < width * height / 100; i++) {
        const px = x + Math.random() * width;
        const py = y + Math.random() * height;
        ctx.fillStyle = `rgba(${100 + Math.random() * 50}, ${100 + Math.random() * 50}, ${100 + Math.random() * 50}, 0.3)`;
        ctx.fillRect(px, py, 1, 1);
    }
}

// 绘制金属装饰边框
function drawMetallicBorder(x, y, width, height, color) {
    // 外边框阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x + 3, y + 3, width, height);
    
    // 主边框
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, '#8B7355');
    gradient.addColorStop(1, color);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, 4);
    ctx.fillRect(x, y + height - 4, width, 4);
    ctx.fillRect(x, y, 4, height);
    ctx.fillRect(x + width - 4, y, 4, height);
    
    // 角落装饰铆钉
    const rivetPositions = [
        [x - 2, y - 2], [x + width - 6, y - 2],
        [x - 2, y + height - 6], [x + width - 6, y + height - 6]
    ];
    
    rivetPositions.forEach(([rx, ry]) => {
        // 铆钉阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(rx + 1, ry + 1, 8, 8);
        
        // 铆钉主体
        const rivetGradient = ctx.createRadialGradient(rx + 4, ry + 4, 0, rx + 4, ry + 4, 4);
        rivetGradient.addColorStop(0, '#D4AF37');
        rivetGradient.addColorStop(0.7, '#B8860B');
        rivetGradient.addColorStop(1, '#8B6914');
        
        ctx.fillStyle = rivetGradient;
        ctx.fillRect(rx, ry, 8, 8);
        
        // 铆钉高光
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(rx + 1, ry + 1, 3, 3);
    });
}

// 绘制装饰性边框（增强版）
function drawDecorativeBorder(x, y, width, height, color) {
    drawMetallicBorder(x, y, width, height, color);
}

// 绘制文字带描边 - 优化中文显示
function drawTextWithStroke(text, x, y, fillColor, strokeColor, font) {
    // 优化中文字体设置
    const optimizedFont = font.replace('Arial', '"Microsoft YaHei", "SimHei", Arial')
                              .replace('serif', '"Microsoft YaHei", "SimSun", serif');
    ctx.font = optimizedFont;
    
    // 根据文字内容调整描边粗细
    const isChinese = /[\u4e00-\u9fa5]/.test(text);
    const strokeWidth = isChinese ? 2 : 3; // 中文使用更细的描边
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fillColor;
    ctx.fillText(text, x, y);
}

// 辅助函数：将十六进制颜色转为RGB
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

// 绘制动态背景（华丽环境动画）
function drawDynamicBackground() {
    const time = Date.now() * 0.001;
    
    // 魔法能量网格背景
    ctx.save();
    ctx.globalAlpha = 0.1;
    const gridSize = 50;
    const gridOffset = time * 20;
    
    ctx.strokeStyle = '#4169E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // 垂直线
    for (let x = (gridOffset % gridSize) - gridSize; x < canvas.width + gridSize; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    
    // 水平线
    for (let y = (gridOffset % gridSize) - gridSize; y < canvas.height + gridSize; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    
    ctx.stroke();
    ctx.restore();
    
    // 浮动魔法粒子
    for (let i = 0; i < 30; i++) {
        const x = (Math.sin(time * 0.3 + i * 0.8) * 0.4 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.2 + i * 0.6) * 0.4 + 0.5) * canvas.height;
        const alpha = 0.2 + Math.sin(time * 2 + i * 2) * 0.15;
        const size = 2 + Math.sin(time * 3 + i) * 1;
        
        // 不同颜色的魔法粒子
        const colors = ['#87CEEB', '#DDA0DD', '#F0E68C', '#98FB98'];
        const color = colors[i % colors.length];
        
        ctx.fillStyle = `rgba(${hexToRgb(color)}, ${alpha})`;
        ctx.fillRect(x - size/2, y - size/2, size, size);
        
        // 粒子周围的微光
        ctx.fillStyle = `rgba(${hexToRgb(color)}, ${alpha * 0.3})`;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
    }
    
    // 如果游戏进行中，添加战场氛围
    if (gameState === GameStates.PLAYING) {
        // 动态战场雾气
        const fogIntensity = 0.05 + Math.sin(time * 0.5) * 0.02;
        const fogGradient = ctx.createLinearGradient(0, canvas.height - 150, 0, canvas.height);
        fogGradient.addColorStop(0, `rgba(50, 50, 70, 0)`);
        fogGradient.addColorStop(0.7, `rgba(50, 50, 70, ${fogIntensity})`);
        fogGradient.addColorStop(1, `rgba(30, 30, 50, ${fogIntensity * 2})`);
        
        ctx.fillStyle = fogGradient;
        ctx.fillRect(0, canvas.height - 150, canvas.width, 150);
        
        // 能量波纹效果（基于玩家位置）
        if (player.actionGlow > 10) {
            ctx.save();
            ctx.globalAlpha = 0.1;
            
            const rippleRadius = (time * 100) % 200;
            const rippleGradient = ctx.createRadialGradient(
                player.x + player.getWidth()/2,
                player.y + player.getHeight()/2,
                0,
                player.x + player.getWidth()/2,
                player.y + player.getHeight()/2,
                rippleRadius
            );
            rippleGradient.addColorStop(0, 'rgba(135, 206, 235, 0)');
            rippleGradient.addColorStop(0.8, 'rgba(135, 206, 235, 0.3)');
            rippleGradient.addColorStop(1, 'rgba(135, 206, 235, 0)');
            
            ctx.fillStyle = rippleGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }
        
        // 连击时的能量风暴
        if (player.comboKills >= 10) {
            ctx.save();
            ctx.globalAlpha = 0.15;
            
            for (let i = 0; i < 8; i++) {
                const stormAngle = time * 4 + i * Math.PI / 4;
                const stormRadius = 100 + Math.sin(time * 3 + i) * 50;
                const stormX = player.x + player.getWidth()/2 + Math.cos(stormAngle) * stormRadius;
                const stormY = player.y + player.getHeight()/2 + Math.sin(stormAngle) * stormRadius;
                
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(stormX - 3, stormY - 3, 6, 6);
            }
            
            ctx.restore();
        }
    }
}