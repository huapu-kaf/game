// 特效系统 - 粒子、屏幕震动、伤害数字、全屏特效

// 粒子系统
const particles = [];

// 屏幕震动
let screenShake = {
    intensity: 0,
    duration: 0
};

// 伤害数字系统
const damageNumbers = [];

// 全屏特效系统
let fullScreenEffects = {
    levelUpFlash: 0,
    comboFlash: 0,
    criticalSlowMotion: 0
};

// 创建粒子效果
function createParticles(x, y, color, count = 5) {
    for (let i = 0; i < count; i++) {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            lifespan: 30,
            maxLifespan: 30,
            color: color,
            size: Math.random() * 3 + 2
        };
        particles.push(particle);
    }
}

// 更新粒子
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // 更新粒子位置
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.lifespan--;
        
        // 重力效果
        particle.vy += 0.1;
        
        // 摩擦力
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        
        // 移除过期粒子
        if (particle.lifespan <= 0) {
            particles.splice(i, 1);
        }
    }
}

// 绘制粒子
function drawParticles() {
    particles.forEach(particle => {
        const alpha = particle.lifespan / particle.maxLifespan;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
        ctx.restore();
    });
}

// 触发屏幕震动
function triggerScreenShake(intensity, duration) {
    screenShake.intensity = intensity;
    screenShake.duration = duration;
}

// 更新屏幕震动
function updateScreenShake() {
    if (screenShake.duration > 0) {
        screenShake.duration--;
        if (screenShake.duration <= 0) {
            screenShake.intensity = 0;
        }
    }
}

// 创建伤害数字
function createDamageNumber(x, y, damage, isCritical = false, isCombo = false) {
    const damageNumber = {
        x: x,
        y: y,
        damage: damage,
        isCritical: isCritical,
        isCombo: isCombo,
        lifespan: 60,
        maxLifespan: 60,
        velocityY: -2 - Math.random() * 2,
        velocityX: (Math.random() - 0.5) * 2,
        scale: isCritical ? 1.5 : 1,
        alpha: 1
    };
    
    damageNumbers.push(damageNumber);
    
    // 暴击特效
    if (isCritical) {
        createParticles(x, y, '#FFD700', 8);
        triggerScreenShake(5, 12);
        triggerFullScreenEffect('critical', 20);
    }
    
    // 连击特效
    if (isCombo) {
        createParticles(x, y, '#FF6347', 6);
    }
}

// 更新伤害数字
function updateDamageNumbers() {
    for (let i = damageNumbers.length - 1; i >= 0; i--) {
        const dmgNum = damageNumbers[i];
        
        // 更新位置
        dmgNum.x += dmgNum.velocityX;
        dmgNum.y += dmgNum.velocityY;
        dmgNum.velocityY += 0.1; // 重力
        dmgNum.lifespan--;
        
        // 更新透明度和缩放
        dmgNum.alpha = dmgNum.lifespan / dmgNum.maxLifespan;
        dmgNum.scale = dmgNum.isCritical ? 
            (1.5 + Math.sin(dmgNum.lifespan * 0.3) * 0.2) : 
            (1 + Math.sin(dmgNum.lifespan * 0.2) * 0.1);
        
        // 移除过期的伤害数字
        if (dmgNum.lifespan <= 0) {
            damageNumbers.splice(i, 1);
        }
    }
}

// 绘制伤害数字
function drawDamageNumbers() {
    damageNumbers.forEach(dmgNum => {
        ctx.save();
        
        // 设置透明度
        ctx.globalAlpha = dmgNum.alpha;
        
        // 移动到伤害数字位置
        ctx.translate(dmgNum.x, dmgNum.y);
        ctx.scale(dmgNum.scale, dmgNum.scale);
        
        // 确定颜色和字体
        let color = '#FFFFFF';
        let font = 'bold 16px serif';
        let strokeColor = '#000000';
        
        if (dmgNum.isCritical) {
            color = '#FFD700';
            font = 'bold 24px serif';
            strokeColor = '#8B0000';
            
            // 暴击闪烁效果
            if (dmgNum.lifespan > 40) {
                color = '#FFFF00';
            }
        } else if (dmgNum.isCombo) {
            color = '#FF6347';
            font = 'bold 18px serif';
            strokeColor = '#8B0000';
        }
        
        // 绘制伤害数字
        ctx.font = font;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.strokeText(dmgNum.damage.toString(), 0, 0);
        ctx.fillStyle = color;
        ctx.fillText(dmgNum.damage.toString(), 0, 0);
        
        ctx.restore();
    });
}

// 触发全屏特效
function triggerFullScreenEffect(effectType, intensity = 100) {
    switch(effectType) {
        case 'levelUp':
            fullScreenEffects.levelUpFlash = intensity;
            break;
        case 'combo':
            fullScreenEffects.comboFlash = intensity;
            break;
        case 'critical':
            fullScreenEffects.criticalSlowMotion = intensity;
            break;
    }
}

// 更新全屏特效
function updateFullScreenEffects() {
    // 升级闪光衰减
    if (fullScreenEffects.levelUpFlash > 0) {
        fullScreenEffects.levelUpFlash -= 2;
    }
    
    // 连击闪光衰减
    if (fullScreenEffects.comboFlash > 0) {
        fullScreenEffects.comboFlash -= 3;
    }
    
    // 暴击慢动作衰减
    if (fullScreenEffects.criticalSlowMotion > 0) {
        fullScreenEffects.criticalSlowMotion--;
    }
}

// 绘制全屏特效
function drawFullScreenEffects() {
    // 升级金色闪光
    if (fullScreenEffects.levelUpFlash > 0) {
        const alpha = fullScreenEffects.levelUpFlash / 100;
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.3})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 升级光环效果
        const pulseRadius = (100 - fullScreenEffects.levelUpFlash) * 8;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(255, 215, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
    
    // 连击红色闪光
    if (fullScreenEffects.comboFlash > 0) {
        const alpha = fullScreenEffects.comboFlash / 60;
        ctx.fillStyle = `rgba(255, 99, 71, ${alpha * 0.2})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // 暴击慢动作效果（紫色边缘）
    if (fullScreenEffects.criticalSlowMotion > 0) {
        const alpha = fullScreenEffects.criticalSlowMotion / 20;
        
        // 屏幕边缘紫色光晕
        const edgeGradient = ctx.createRadialGradient(
            canvas.width/2, canvas.height/2, canvas.width/3,
            canvas.width/2, canvas.height/2, canvas.width/2
        );
        edgeGradient.addColorStop(0, 'rgba(138, 43, 226, 0)');
        edgeGradient.addColorStop(0.8, 'rgba(138, 43, 226, 0)');
        edgeGradient.addColorStop(1, `rgba(138, 43, 226, ${alpha * 0.4})`);
        
        ctx.fillStyle = edgeGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}