// 敌人系统

// 敌人数组
const enemies = [];

// 生成敌人函数（多样化）
function spawnEnemy() {
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
    
    // 根据等级调整敌人类型概率
    const levelBonus = Math.min(player.level / 10, 1);
    let enemyType;
    
    const random = Math.random();
    if (random < EnemyTypes.FAST.probability * (1 + levelBonus)) {
        enemyType = EnemyTypes.FAST;
    } else if (random < (EnemyTypes.FAST.probability + EnemyTypes.NORMAL.probability) * (1 + levelBonus * 0.5)) {
        enemyType = EnemyTypes.NORMAL;
    } else if (random < 0.95) {
        enemyType = EnemyTypes.TANK;
    } else {
        enemyType = EnemyTypes.ELITE;
    }
    
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
            
            // 根据敌人类型实现不同AI行为
            switch(enemy.type.name) {
                case '快速小怪':
                    // 直线冲刺
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
                    
                case '普通敌人':
                    // 标准追击
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
                    
                case '坦克巨怪':
                    // 缓慢但稳定的移动
                    moveX = unitX * enemy.speed;
                    moveY = unitY * enemy.speed;
                    break;
                    
                case '精英怪物':
                    // 智能移动：偶尔改变方向
                    enemy.behaviorTimer++;
                    if (enemy.behaviorTimer > 60 || Math.random() < 0.05) {
                        enemy.lastDirection.x = unitX + (Math.random() - 0.5) * 0.8;
                        enemy.lastDirection.y = unitY + (Math.random() - 0.5) * 0.8;
                        enemy.behaviorTimer = 0;
                    }
                    
                    // 归一化方向向量
                    const dirLength = Math.sqrt(enemy.lastDirection.x * enemy.lastDirection.x + enemy.lastDirection.y * enemy.lastDirection.y);
                    if (dirLength > 0) {
                        moveX = (enemy.lastDirection.x / dirLength) * enemy.speed;
                        moveY = (enemy.lastDirection.y / dirLength) * enemy.speed;
                    }
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

// 绘制敌人（多样化视觉系统）
function drawEnemies() {
    const time = Date.now() * 0.01;
    
    enemies.forEach((enemy, index) => {
        ctx.save();
        
        // 敌人类型特殊效果
        const enemyType = enemy.type;
        const isHit = enemy.isHit > 0 && enemy.isHit % 4 < 2;
        
        // 根据敌人类型添加光晕效果
        if (enemyType.name === '精英怪物') {
            // 精英怪物金色光环
            const glowIntensity = 0.8 + Math.sin(time + index * 0.5) * 0.3;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15 * glowIntensity;
        } else if (enemyType.name === '坦克巨怪') {
            // 坦克巨怪红色威慑光环
            const glowIntensity = 0.6 + Math.sin(time * 2 + index * 0.3) * 0.2;
            ctx.shadowColor = '#8B0000';
            ctx.shadowBlur = 10 * glowIntensity;
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
        if (enemyType.name === '快速小怪') {
            // 快速振动
            const vibration = Math.sin(time * 8) * 2;
            ctx.translate(vibration, 0);
        } else if (enemyType.name === '精英怪物') {
            // 缓慢旋转
            ctx.rotate(time * 0.5);
        }
        
        // 血量条（精英和坦克怪物显示）
        if (enemyType.name === '精英怪物' || enemyType.name === '坦克巨怪') {
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
            // 备用绘制方案 - 根据类型使用不同颜色
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
        
        ctx.restore();
    });
}