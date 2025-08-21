// 特效系统 - 粒子、屏幕震动、伤害数字、全屏特效

// 粒子系统
const particles = [];

// 屏幕震动系统
let screenShake = {
    x: 0,
    y: 0,
    intensity: 0,
    duration: 0
};

// 伤害数字系统 (在ui.js中声明)

// 全屏特效系统
let fullScreenEffects = {
    levelUpFlash: 0,
    comboFlash: 0,
    criticalSlowMotion: 0,
    bossWarning: 0,
    bloodEffect: 0
};

// 血迹系统
const bloodSplats = [];

// 背景动态元素
const backgroundElements = {
    floatingRunes: [],
    energyWaves: [],
    meteorShower: 0
};

// 屏幕震动函数
function startScreenShake(intensity, duration) {
    screenShake.intensity = Math.max(screenShake.intensity, intensity);
    screenShake.duration = Math.max(screenShake.duration, duration);
}

// 更新屏幕震动
function updateScreenShake() {
    if (screenShake.duration > 0) {
        screenShake.x = (Math.random() - 0.5) * screenShake.intensity;
        screenShake.y = (Math.random() - 0.5) * screenShake.intensity;
        screenShake.duration--;
        screenShake.intensity *= 0.95; // 逐渐减弱
    } else {
        screenShake.x = 0;
        screenShake.y = 0;
        screenShake.intensity = 0;
    }
}

// 创建血迹效果
function createBloodSplat(x, y, size = 1) {
    const bloodSplat = {
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        size: (Math.random() * 0.5 + 0.5) * size,
        opacity: 0.8,
        lifetime: 600 + Math.random() * 300 // 10-15秒
    };
    bloodSplats.push(bloodSplat);
    
    // 限制血迹数量
    if (bloodSplats.length > 100) {
        bloodSplats.shift();
    }
}

// 更新血迹
function updateBloodSplats() {
    for (let i = bloodSplats.length - 1; i >= 0; i--) {
        const splat = bloodSplats[i];
        splat.lifetime--;
        
        // 逐渐淡化
        if (splat.lifetime < 180) {
            splat.opacity = (splat.lifetime / 180) * 0.8;
        }
        
        if (splat.lifetime <= 0) {
            bloodSplats.splice(i, 1);
        }
    }
}

// 创建增强粒子效果
function createParticles(x, y, color, count = 5, type = 'normal') {
    for (let i = 0; i < count; i++) {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            lifespan: 30 + Math.random() * 20,
            maxLifespan: 30 + Math.random() * 20,
            color: color,
            size: Math.random() * 3 + 2,
            type: type,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.3
        };
        
        // 不同类型的粒子有不同属性
        switch (type) {
            case 'explosion':
                particle.vx = (Math.random() - 0.5) * 8;
                particle.vy = (Math.random() - 0.5) * 8;
                particle.size = Math.random() * 5 + 3;
                break;
            case 'magic':
                particle.vy -= Math.random() * 2;
                particle.size = Math.random() * 4 + 1;
                break;
            case 'blood':
                particle.vy += Math.random() * 2;
                particle.vx *= 0.5;
                break;
        }
        
        particles.push(particle);
    }
}

// 创建浮动符文
function createFloatingRune() {
    if (backgroundElements.floatingRunes.length < 8) {
        const rune = {
            x: Math.random() * canvas.width,
            y: canvas.height + 50,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -0.3 - Math.random() * 0.2,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            opacity: 0.3 + Math.random() * 0.2,
            size: 15 + Math.random() * 10,
            rune: ['⚡', '❄', '🔥', '💫', '⭐', '🌟'][Math.floor(Math.random() * 6)]
        };
        backgroundElements.floatingRunes.push(rune);
    }
}

// 更新背景元素
function updateBackgroundElements() {
    // 更新浮动符文
    for (let i = backgroundElements.floatingRunes.length - 1; i >= 0; i--) {
        const rune = backgroundElements.floatingRunes[i];
        rune.x += rune.vx;
        rune.y += rune.vy;
        rune.rotation += rune.rotationSpeed;
        
        // 移除屏幕外的符文
        if (rune.y < -50) {
            backgroundElements.floatingRunes.splice(i, 1);
        }
    }
    
    // 随机生成符文
    if (Math.random() < 0.01) {
        createFloatingRune();
    }
}

// 绘制血迹
function drawBloodSplats() {
    bloodSplats.forEach(splat => {
        ctx.globalAlpha = splat.opacity;
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.arc(splat.x, splat.y, splat.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制不规则血迹
        ctx.fillStyle = '#A0001A';
        for (let i = 0; i < 3; i++) {
            const offsetX = (Math.random() - 0.5) * splat.size * 4;
            const offsetY = (Math.random() - 0.5) * splat.size * 4;
            ctx.beginPath();
            ctx.arc(splat.x + offsetX, splat.y + offsetY, splat.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    });
}

// 绘制背景元素
function drawBackgroundElements() {
    // 绘制浮动符文
    backgroundElements.floatingRunes.forEach(rune => {
        ctx.save();
        ctx.globalAlpha = rune.opacity;
        ctx.translate(rune.x, rune.y);
        ctx.rotate(rune.rotation);
        ctx.font = `${rune.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#4A5FFF';
        ctx.fillText(rune.rune, 0, 0);
        ctx.restore();
    });
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
        
        // 根据粒子类型绘制不同效果
        switch (particle.type) {
            case 'explosion':
                // 爆炸粒子 - 圆形渐变
                const explosionGradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size
                );
                explosionGradient.addColorStop(0, particle.color);
                explosionGradient.addColorStop(1, 'transparent');
                ctx.fillStyle = explosionGradient;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'magic':
                // 魔法粒子 - 星形
                ctx.fillStyle = particle.color;
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                particle.rotation += particle.rotationSpeed;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI) / 5;
                    const radius = particle.size * (i % 2 === 0 ? 1 : 0.5);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'blood':
                // 血液粒子 - 不规则形状
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.ellipse(particle.x, particle.y, particle.size, particle.size * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            default:
                // 默认粒子 - 方形
                ctx.fillStyle = particle.color;
                ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
                break;
        }
        
        ctx.restore();
    });
}

// 更新全屏特效
function updateFullScreenEffects() {
    // 减少特效计时器
    for (const effect in fullScreenEffects) {
        if (fullScreenEffects[effect] > 0) {
            fullScreenEffects[effect]--;
        }
    }
}

// 绘制全屏特效
function drawFullScreenEffects() {
    // 升级闪光效果
    if (fullScreenEffects.levelUpFlash > 0) {
        const alpha = fullScreenEffects.levelUpFlash / 30;
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.3})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // 连击闪光效果
    if (fullScreenEffects.comboFlash > 0) {
        const alpha = fullScreenEffects.comboFlash / 20;
        ctx.fillStyle = `rgba(255, 100, 100, ${alpha * 0.2})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // BOSS警告效果
    if (fullScreenEffects.bossWarning > 0) {
        const intensity = Math.sin(fullScreenEffects.bossWarning * 0.3) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 0, 0, ${intensity * 0.1})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 警告边框
        ctx.strokeStyle = `rgba(255, 0, 0, ${intensity})`;
        ctx.lineWidth = 8;
        ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    }
    
    // 血液效果
    if (fullScreenEffects.bloodEffect > 0) {
        const alpha = fullScreenEffects.bloodEffect / 60;
        const redGradient = ctx.createRadialGradient(
            canvas.width/2, canvas.height/2, 0,
            canvas.width/2, canvas.height/2, canvas.width/2
        );
        redGradient.addColorStop(0, 'transparent');
        redGradient.addColorStop(0.8, `rgba(139, 0, 0, ${alpha * 0.3})`);
        redGradient.addColorStop(1, `rgba(139, 0, 0, ${alpha * 0.6})`);
        ctx.fillStyle = redGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// 触发特效
function triggerLevelUpFlash() {
    fullScreenEffects.levelUpFlash = 30;
}

function triggerComboFlash() {
    fullScreenEffects.comboFlash = 20;
}

function triggerBossWarning() {
    fullScreenEffects.bossWarning = 180; // 3秒警告
}

function triggerBloodEffect() {
    fullScreenEffects.bloodEffect = 60;
}

// 更新屏幕震动
function updateScreenShake() {
    if (screenShake.duration > 0) {
        screenShake.x = (Math.random() - 0.5) * screenShake.intensity;
        screenShake.y = (Math.random() - 0.5) * screenShake.intensity;
        screenShake.duration--;
        screenShake.intensity *= 0.95; // 逐渐减弱
    } else {
        screenShake.x = 0;
        screenShake.y = 0;
        screenShake.intensity = 0;
    }
}

// 创建伤害数字 - 使用ui.js中的DamageNumber类
function createDamageNumber(x, y, damage, isCritical = false, isCombo = false) {
    // 使用ui.js中的addDamageNumber函数
    if (typeof addDamageNumber !== 'undefined') {
        addDamageNumber(x, y, damage, isCritical, false);
    }
    
    // 暴击特效
    if (isCritical) {
        createParticles(x, y, '#FFD700', 8);
        startScreenShake(5, 12);
        triggerFullScreenEffect('critical', 20);
    }
    
    // 连击特效
    if (isCombo) {
        createParticles(x, y, '#FF6347', 6);
    }
}

// 更新特效伤害数字（已废弃，使用ui.js中的系统）
function updateEffectDamageNumbers() {
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

// 绘制特效伤害数字（已废弃，使用ui.js中的系统）
function drawEffectDamageNumbers() {
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