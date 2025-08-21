// 升级选择系统

// 升级选择状态
let upgradeChoices = [];
let isUpgradeMenuOpen = false;

// 武器升级配置
const WeaponUpgrades = {
    missile: {
        name: '魔法飞弹',
        maxLevel: 8,
        upgrades: [
            { level: 1, description: '伤害 +3', effect: 'damage', value: 3 },
            { level: 2, description: '射速 +20%', effect: 'cooldown', value: 0.8 },
            { level: 3, description: '伤害 +5', effect: 'damage', value: 5 },
            { level: 4, description: '弹丸数量 +1', effect: 'projectiles', value: 1 },
            { level: 5, description: '射速 +25%', effect: 'cooldown', value: 0.75 },
            { level: 6, description: '伤害 +8', effect: 'damage', value: 8 },
            { level: 7, description: '穿透 +1', effect: 'pierce', value: 1 },
            { level: 8, description: '进化: 追踪导弹', effect: 'evolve', value: 'homing_missile' }
        ]
    },
    fireball: {
        name: '火球术',
        maxLevel: 8,
        upgrades: [
            { level: 1, description: '伤害 +10', effect: 'damage', value: 10 },
            { level: 2, description: '爆炸范围 +30%', effect: 'area', value: 1.3 },
            { level: 3, description: '伤害 +15', effect: 'damage', value: 15 },
            { level: 4, description: '射速 +30%', effect: 'cooldown', value: 0.7 },
            { level: 5, description: '燃烧伤害', effect: 'burn', value: 5 },
            { level: 6, description: '爆炸范围 +50%', effect: 'area', value: 1.5 },
            { level: 7, description: '伤害 +20', effect: 'damage', value: 20 },
            { level: 8, description: '进化: 火焰风暴', effect: 'evolve', value: 'firestorm' }
        ]
    },
    frostbolt: {
        name: '冰霜箭',
        maxLevel: 8,
        upgrades: [
            { level: 1, description: '伤害 +5', effect: 'damage', value: 5 },
            { level: 2, description: '减速效果 +30%', effect: 'slow', value: 1.3 },
            { level: 3, description: '伤害 +8', effect: 'damage', value: 8 },
            { level: 4, description: '冰冻几率 25%', effect: 'freeze', value: 0.25 },
            { level: 5, description: '射速 +25%', effect: 'cooldown', value: 0.75 },
            { level: 6, description: '穿透 +2', effect: 'pierce', value: 2 },
            { level: 7, description: '伤害 +12', effect: 'damage', value: 12 },
            { level: 8, description: '进化: 冰霜新星', effect: 'evolve', value: 'frost_nova' }
        ]
    },
    whip: {
        name: '魔能鞭',
        maxLevel: 8,
        upgrades: [
            { level: 1, description: '基础横扫攻击', effect: 'unlock', value: true },
            { level: 2, description: '伤害 +8', effect: 'damage', value: 8 },
            { level: 3, description: '攻击范围 +40%', effect: 'range', value: 1.4 },
            { level: 4, description: '攻击速度 +30%', effect: 'cooldown', value: 0.7 },
            { level: 5, description: '伤害 +12', effect: 'damage', value: 12 },
            { level: 6, description: '鞭击数 +1', effect: 'hits', value: 1 },
            { level: 7, description: '暴击率 +20%', effect: 'crit', value: 0.2 },
            { level: 8, description: '进化: 雷电鞭', effect: 'evolve', value: 'lightning_whip' }
        ]
    },
    garlic: {
        name: '大蒜护盾',
        maxLevel: 8,
        upgrades: [
            { level: 1, description: '护体光环', effect: 'unlock', value: true },
            { level: 2, description: '伤害 +3', effect: 'damage', value: 3 },
            { level: 3, description: '范围 +25%', effect: 'range', value: 1.25 },
            { level: 4, description: '伤害频率 +50%', effect: 'frequency', value: 1.5 },
            { level: 5, description: '伤害 +5', effect: 'damage', value: 5 },
            { level: 6, description: '范围 +35%', effect: 'range', value: 1.35 },
            { level: 7, description: '反弹伤害', effect: 'reflect', value: 0.5 },
            { level: 8, description: '进化: 圣光护盾', effect: 'evolve', value: 'holy_shield' }
        ]
    },
    cross: {
        name: '回旋十字',
        maxLevel: 8,
        upgrades: [
            { level: 1, description: '回旋镖攻击', effect: 'unlock', value: true },
            { level: 2, description: '伤害 +6', effect: 'damage', value: 6 },
            { level: 3, description: '飞行速度 +30%', effect: 'speed', value: 1.3 },
            { level: 4, description: '十字数量 +1', effect: 'projectiles', value: 1 },
            { level: 5, description: '伤害 +10', effect: 'damage', value: 10 },
            { level: 6, description: '飞行距离 +40%', effect: 'range', value: 1.4 },
            { level: 7, description: '穿透 +3', effect: 'pierce', value: 3 },
            { level: 8, description: '进化: 圣光十字', effect: 'evolve', value: 'holy_cross' }
        ]
    }
};

// 被动技能配置
const PassiveUpgrades = {
    health: {
        name: '生命强化',
        maxLevel: 5,
        upgrades: [
            { level: 1, description: '最大生命值 +20', effect: 'maxHealth', value: 20 },
            { level: 2, description: '最大生命值 +25', effect: 'maxHealth', value: 25 },
            { level: 3, description: '最大生命值 +30', effect: 'maxHealth', value: 30 },
            { level: 4, description: '最大生命值 +35', effect: 'maxHealth', value: 35 },
            { level: 5, description: '最大生命值 +50', effect: 'maxHealth', value: 50 }
        ]
    },
    speed: {
        name: '移动强化',
        maxLevel: 5,
        upgrades: [
            { level: 1, description: '移动速度 +15%', effect: 'speed', value: 1.15 },
            { level: 2, description: '移动速度 +20%', effect: 'speed', value: 1.2 },
            { level: 3, description: '移动速度 +25%', effect: 'speed', value: 1.25 },
            { level: 4, description: '移动速度 +30%', effect: 'speed', value: 1.3 },
            { level: 5, description: '移动速度 +40%', effect: 'speed', value: 1.4 }
        ]
    },
    damage: {
        name: '伤害强化',
        maxLevel: 5,
        upgrades: [
            { level: 1, description: '所有伤害 +15%', effect: 'globalDamage', value: 1.15 },
            { level: 2, description: '所有伤害 +20%', effect: 'globalDamage', value: 1.2 },
            { level: 3, description: '所有伤害 +25%', effect: 'globalDamage', value: 1.25 },
            { level: 4, description: '所有伤害 +30%', effect: 'globalDamage', value: 1.3 },
            { level: 5, description: '所有伤害 +40%', effect: 'globalDamage', value: 1.4 }
        ]
    },
    experience: {
        name: '经验强化',
        maxLevel: 5,
        upgrades: [
            { level: 1, description: '经验获取 +20%', effect: 'expMultiplier', value: 1.2 },
            { level: 2, description: '经验获取 +30%', effect: 'expMultiplier', value: 1.3 },
            { level: 3, description: '经验获取 +40%', effect: 'expMultiplier', value: 1.4 },
            { level: 4, description: '经验获取 +50%', effect: 'expMultiplier', value: 1.5 },
            { level: 5, description: '经验获取 +75%', effect: 'expMultiplier', value: 1.75 }
        ]
    },
    pickup: {
        name: '拾取强化',
        maxLevel: 3,
        upgrades: [
            { level: 1, description: '拾取范围 +50%', effect: 'pickupRange', value: 1.5 },
            { level: 2, description: '拾取范围 +75%', effect: 'pickupRange', value: 1.75 },
            { level: 3, description: '拾取范围 +100%', effect: 'pickupRange', value: 2.0 }
        ]
    },
    luck: {
        name: '幸运',
        maxLevel: 5,
        upgrades: [
            { level: 1, description: '暴击率 +5%', effect: 'critRate', value: 0.05 },
            { level: 2, description: '暴击率 +8%', effect: 'critRate', value: 0.08 },
            { level: 3, description: '暴击率 +12%', effect: 'critRate', value: 0.12 },
            { level: 4, description: '暴击率 +16%', effect: 'critRate', value: 0.16 },
            { level: 5, description: '暴击率 +25%', effect: 'critRate', value: 0.25 }
        ]
    },
    armor: {
        name: '护甲',
        maxLevel: 5,
        upgrades: [
            { level: 1, description: '伤害减免 5%', effect: 'damageReduction', value: 0.05 },
            { level: 2, description: '伤害减免 8%', effect: 'damageReduction', value: 0.08 },
            { level: 3, description: '伤害减免 12%', effect: 'damageReduction', value: 0.12 },
            { level: 4, description: '伤害减免 16%', effect: 'damageReduction', value: 0.16 },
            { level: 5, description: '伤害减免 25%', effect: 'damageReduction', value: 0.25 }
        ]
    },
    regen: {
        name: '生命恢复',
        maxLevel: 3,
        upgrades: [
            { level: 1, description: '每秒10秒恢复 1 生命值', effect: 'healthRegen', value: 1 },
            { level: 2, description: '每秒7秒恢复 1 生命值', effect: 'healthRegen', value: 2 },
            { level: 3, description: '每秒5秒恢复 1 生命值', effect: 'healthRegen', value: 3 }
        ]
    },
    cooldown: {
        name: '冷却缩减',
        maxLevel: 5,
        upgrades: [
            { level: 1, description: '所有武器冷却 -10%', effect: 'globalCooldown', value: 0.9 },
            { level: 2, description: '所有武器冷却 -15%', effect: 'globalCooldown', value: 0.85 },
            { level: 3, description: '所有武器冷却 -20%', effect: 'globalCooldown', value: 0.8 },
            { level: 4, description: '所有武器冷却 -25%', effect: 'globalCooldown', value: 0.75 },
            { level: 5, description: '所有武器冷却 -35%', effect: 'globalCooldown', value: 0.65 }
        ]
    },
    cooldown: {
        name: '冷却缩减',
        maxLevel: 5,
        upgrades: [
            { level: 1, description: '所有冷却 -10%', effect: 'globalCooldown', value: 0.9 },
            { level: 2, description: '所有冷却 -15%', effect: 'globalCooldown', value: 0.85 },
            { level: 3, description: '所有冷却 -20%', effect: 'globalCooldown', value: 0.8 },
            { level: 4, description: '所有冷却 -25%', effect: 'globalCooldown', value: 0.75 },
            { level: 5, description: '所有冷却 -35%', effect: 'globalCooldown', value: 0.65 }
        ]
    }
};

// 玩家被动技能状态
const playerPassives = {
    health: 0,
    speed: 0,
    damage: 0,
    experience: 0,
    pickup: 0,
    cooldown: 0
};

// 生成升级选项
function generateUpgradeChoices() {
    const choices = [];
    const availableWeapons = [];
    const availablePassives = [];
    
    // 收集可升级的武器
    for (let weaponName in weapons) {
        if (weapons[weaponName].level > 0 && weapons[weaponName].level < WeaponUpgrades[weaponName]?.maxLevel) {
            availableWeapons.push(weaponName);
        }
    }
    
    // 收集未解锁的武器
    const unlockedWeapons = [];
    for (let weaponName in WeaponUpgrades) {
        if (weapons[weaponName].level === 0 && weaponName !== 'book') {
            unlockedWeapons.push(weaponName);
        }
    }
    
    // 收集可升级的被动技能
    for (let passiveName in PassiveUpgrades) {
        if (playerPassives[passiveName] < PassiveUpgrades[passiveName].maxLevel) {
            availablePassives.push(passiveName);
        }
    }
    
    // 智能选择算法：确保有多样性
    if (availableWeapons.length > 0 && choices.length < 3) {
        // 优先升级现有武器
        const weaponName = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
        const weaponConfig = WeaponUpgrades[weaponName];
        const currentLevel = weapons[weaponName].level;
        const upgrade = weaponConfig.upgrades[currentLevel];
        
        choices.push({
            type: 'weapon',
            name: weaponName,
            title: `${weaponConfig.name} Lv.${currentLevel + 1}`,
            description: upgrade.description,
            icon: getWeaponIcon(weaponName),
            effect: upgrade.effect,
            value: upgrade.value
        });
    }
    
    if (unlockedWeapons.length > 0 && choices.length < 3 && Math.random() < 0.4) {
        // 有几率解锁新武器
        const weaponName = unlockedWeapons[Math.floor(Math.random() * unlockedWeapons.length)];
        const weaponConfig = WeaponUpgrades[weaponName];
        const upgrade = weaponConfig.upgrades[0];
        
        choices.push({
            type: 'weapon',
            name: weaponName,
            title: `解锁: ${weaponConfig.name}`,
            description: upgrade.description,
            icon: getWeaponIcon(weaponName),
            effect: upgrade.effect,
            value: upgrade.value
        });
    }
    
    // 填充被动技能选项
    while (choices.length < 3 && availablePassives.length > 0) {
        const passiveName = availablePassives.splice(Math.floor(Math.random() * availablePassives.length), 1)[0];
        const passiveConfig = PassiveUpgrades[passiveName];
        const currentLevel = playerPassives[passiveName];
        const upgrade = passiveConfig.upgrades[currentLevel];
        
        choices.push({
            type: 'passive',
            name: passiveName,
            title: `${passiveConfig.name} Lv.${currentLevel + 1}`,
            description: upgrade.description,
            icon: getPassiveIcon(passiveName),
            effect: upgrade.effect,
            value: upgrade.value
        });
    }
    
    return choices;
}

// 获取武器图标
function getWeaponIcon(weaponName) {
    const icons = {
        missile: '🚀',
        fireball: '🔥', 
        frostbolt: '❄️',
        whip: '🔗',
        garlic: '🧄',
        cross: '✝️'
    };
    return icons[weaponName] || '⚔️';
}

// 获取被动技能图标
function getPassiveIcon(passiveName) {
    const icons = {
        health: '❤️',
        speed: '💨',
        damage: '⚡',
        experience: '📚',
        pickup: '🧲',
        cooldown: '⏰'
    };
    return icons[passiveName] || '✨';
}

// 应用升级选择
function applyUpgrade(choice) {
    if (choice.type === 'weapon') {
        applyWeaponUpgrade(choice);
    } else if (choice.type === 'passive') {
        applyPassiveUpgrade(choice);
    }
    
    console.log(`应用升级: ${choice.title} - ${choice.description}`);
}

// 应用武器升级
function applyWeaponUpgrade(choice) {
    const weaponName = choice.name;
    const weapon = weapons[weaponName];
    
    if (choice.effect === 'unlock') {
        weapon.level = 1;
        weapon.damage = weapon.damage || WeaponConfig[weaponName]?.damage || 20;
        weapon.maxCooldown = weapon.maxCooldown || WeaponConfig[weaponName]?.maxCooldown || 30;
        weapon.cooldown = 0;
    } else {
        weapon.level++;
        
        switch (choice.effect) {
            case 'damage':
                weapon.damage += choice.value;
                break;
            case 'cooldown':
                weapon.maxCooldown = Math.max(3, Math.floor(weapon.maxCooldown * choice.value));
                break;
            case 'projectiles':
                weapon.projectiles = (weapon.projectiles || 1) + choice.value;
                break;
            case 'pierce':
                weapon.pierce = (weapon.pierce || 0) + choice.value;
                break;
            case 'area':
                weapon.area = (weapon.area || 1) * choice.value;
                break;
            case 'evolve':
                // 武器进化逻辑
                evolveWeapon(weaponName, choice.value);
                break;
        }
    }
}

// 应用被动技能升级
function applyPassiveUpgrade(choice) {
    const passiveName = choice.name;
    playerPassives[passiveName]++;
    
    switch (choice.effect) {
        case 'maxHealth':
            player.maxHealth += choice.value;
            player.health += choice.value; // 同时恢复血量
            break;
        case 'speed':
            player.baseSpeed = player.baseSpeed || GameConfig.PLAYER.SPEED;
            player.speed = Math.floor(player.baseSpeed * choice.value);
            break;
        case 'globalDamage':
            player.damageMultiplier = (player.damageMultiplier || 1) * choice.value;
            break;
        case 'expMultiplier':
            player.expMultiplier = (player.expMultiplier || 1) * choice.value;
            break;
        case 'pickupRange':
            player.pickupRange = (player.pickupRange || 1) * choice.value;
            break;
        case 'globalCooldown':
            player.cooldownMultiplier = (player.cooldownMultiplier || 1) * choice.value;
            break;
    }
}

// 武器进化
function evolveWeapon(weaponName, evolutionName) {
    console.log(`武器进化: ${weaponName} -> ${evolutionName}`);
    // 进化逻辑将在后续版本实现
    weapons[weaponName].evolved = true;
    weapons[weaponName].evolutionName = evolutionName;
}

// 打开升级菜单
function openUpgradeMenu() {
    console.log('openUpgradeMenu 函数被调用');
    isUpgradeMenuOpen = true;
    upgradeChoices = generateUpgradeChoices();
    console.log('升级菜单已打开，选项数量:', upgradeChoices.length);
    console.log('升级选项:', upgradeChoices);
    console.log('isUpgradeMenuOpen 状态:', isUpgradeMenuOpen);
}

// 关闭升级菜单
function closeUpgradeMenu() {
    isUpgradeMenuOpen = false;
    upgradeChoices = [];
}

// 选择升级
function selectUpgrade(index) {
    console.log('selectUpgrade 被调用，索引:', index);
    console.log('upgradeChoices 长度:', upgradeChoices.length);
    console.log('当前选项:', upgradeChoices);
    
    if (index >= 0 && index < upgradeChoices.length) {
        const choice = upgradeChoices[index];
        console.log('选择的升级:', choice);
        applyUpgrade(choice);
        closeUpgradeMenu();
        
        // 播放升级音效
        if (typeof audioManager !== 'undefined') {
            audioManager.playSound('levelUp', 0.9);
        }
        
        return true;
    } else {
        console.error('无效的升级选择索引:', index);
    }
    return false;
}

// 重置升级系统
function resetUpgradeSystem() {
    // 重置被动技能
    for (let passive in playerPassives) {
        playerPassives[passive] = 0;
    }
    
    // 重置玩家属性
    player.damageMultiplier = 1;
    player.expMultiplier = 1;
    player.pickupRange = 1;
    player.cooldownMultiplier = 1;
    player.baseSpeed = GameConfig.PLAYER.SPEED;
    player.speed = GameConfig.PLAYER.SPEED;
    
    closeUpgradeMenu();
}