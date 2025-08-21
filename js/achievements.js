// 成就系统 - 吸血鬼幸存者风格

// 成就数据
const achievements = {
    firstKill: {
        id: 'firstKill',
        name: '初次杀戮',
        description: '击败第一个敌人',
        icon: '🎯',
        unlocked: false,
        condition: () => player.killCount >= 1
    },
    killStreak10: {
        id: 'killStreak10',
        name: '连环杀手',
        description: '达成10连击',
        icon: '🔥',
        unlocked: false,
        condition: () => player.comboCount >= 10
    },
    killStreak25: {
        id: 'killStreak25',
        name: '杀戮机器',
        description: '达成25连击',
        icon: '⚡',
        unlocked: false,
        condition: () => player.comboCount >= 25
    },
    survive1min: {
        id: 'survive1min',
        name: '幸存者',
        description: '生存1分钟',
        icon: '⏱️',
        unlocked: false,
        condition: () => gameTime >= 60
    },
    survive5min: {
        id: 'survive5min',
        name: '老兵',
        description: '生存5分钟',
        icon: '🎖️',
        unlocked: false,
        condition: () => gameTime >= 300
    },
    survive10min: {
        id: 'survive10min',
        name: '传奇战士',
        description: '生存10分钟',
        icon: '👑',
        unlocked: false,
        condition: () => gameTime >= 600
    },
    kill100: {
        id: 'kill100',
        name: '屠夫',
        description: '击败100个敌人',
        icon: '💀',
        unlocked: false,
        condition: () => player.killCount >= 100
    },
    kill500: {
        id: 'kill500',
        name: '死神',
        description: '击败500个敌人',
        icon: '☠️',
        unlocked: false,
        condition: () => player.killCount >= 500
    },
    levelUp5: {
        id: 'levelUp5',
        name: '成长',
        description: '达到5级',
        icon: '📈',
        unlocked: false,
        condition: () => player.level >= 5
    },
    levelUp10: {
        id: 'levelUp10',
        name: '精英',
        description: '达到10级',
        icon: '⭐',
        unlocked: false,
        condition: () => player.level >= 10
    },
    weaponMaster: {
        id: 'weaponMaster',
        name: '武器大师',
        description: '同时拥有3种武器',
        icon: '⚔️',
        unlocked: false,
        condition: () => {
            let activeWeapons = 0;
            for (let weapon in weapons) {
                if (weapons[weapon].level > 0) activeWeapons++;
            }
            return activeWeapons >= 3;
        }
    },
    perfectHealth: {
        id: 'perfectHealth',
        name: '完美状态',
        description: '在满血状态下生存3分钟',
        icon: '💚',
        unlocked: false,
        condition: () => player.health === player.maxHealth && gameTime >= 180
    }
};

// 成就通知队列
let achievementNotifications = [];

// 检查成就
function checkAchievements() {
    for (let achievementId in achievements) {
        const achievement = achievements[achievementId];
        
        if (!achievement.unlocked && achievement.condition()) {
            unlockAchievement(achievement);
        }
    }
}

// 解锁成就
function unlockAchievement(achievement) {
    achievement.unlocked = true;
    
    // 添加通知
    achievementNotifications.push({
        achievement: achievement,
        time: Date.now(),
        duration: 3000, // 3秒显示时间
        y: -100 // 起始位置（屏幕外）
    });
    
    // 播放成就音效
    if (typeof audioManager !== 'undefined') {
        audioManager.playSound('levelUp', 1.0);
    }
    
    console.log(`🏆 成就解锁: ${achievement.name} - ${achievement.description}`);
    
    // 创建庆祝粒子效果
    if (typeof createParticles !== 'undefined') {
        createParticles(
            canvas.width / 2,
            canvas.height / 2,
            '#FFD700',
            15
        );
    }
}

// 更新成就通知动画
function updateAchievementNotifications() {
    const currentTime = Date.now();
    
    for (let i = achievementNotifications.length - 1; i >= 0; i--) {
        const notification = achievementNotifications[i];
        const elapsed = currentTime - notification.time;
        
        if (elapsed > notification.duration) {
            achievementNotifications.splice(i, 1);
            continue;
        }
        
        // 动画逻辑
        if (elapsed < 500) {
            // 滑入动画
            notification.y = lerp(-100, 20, elapsed / 500);
        } else if (elapsed > notification.duration - 500) {
            // 滑出动画
            const fadeOut = (elapsed - (notification.duration - 500)) / 500;
            notification.y = lerp(20, -100, fadeOut);
        } else {
            // 停留在屏幕上
            notification.y = 20;
        }
    }
}

// 绘制成就通知
function drawAchievementNotifications() {
    achievementNotifications.forEach(notification => {
        const achievement = notification.achievement;
        
        // 通知背景
        const width = 300;
        const height = 60;
        const x = canvas.width - width - 20;
        const y = notification.y;
        
        // 背景渐变
        const bgGradient = ctx.createLinearGradient(x, y, x + width, y);
        bgGradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
        bgGradient.addColorStop(1, 'rgba(255, 140, 0, 0.9)');
        
        ctx.fillStyle = bgGradient;
        ctx.fillRect(x, y, width, height);
        
        // 边框
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // 图标
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(achievement.icon, x + 30, y + 35);
        
        // 文字
        ctx.textAlign = 'left';
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('成就解锁!', x + 55, y + 20);
        
        ctx.font = 'bold 12px Arial';
        ctx.fillText(achievement.name, x + 55, y + 35);
        
        ctx.font = '10px Arial';
        ctx.fillStyle = '#333333';
        ctx.fillText(achievement.description, x + 55, y + 50);
    });
}

// 获取已解锁成就数量
function getUnlockedCount() {
    let count = 0;
    for (let achievementId in achievements) {
        if (achievements[achievementId].unlocked) count++;
    }
    return count;
}

// 获取总成就数量
function getTotalCount() {
    return Object.keys(achievements).length;
}

// 重置成就系统
function resetAchievements() {
    for (let achievementId in achievements) {
        achievements[achievementId].unlocked = false;
    }
    achievementNotifications = [];
}

// 线性插值函数
function lerp(start, end, t) {
    return start + (end - start) * Math.max(0, Math.min(1, t));
}