// 角色系统核心

// 当前选中的角色
let selectedCharacter = null;

// 角色状态数据
const characterState = {
    survivalStacks: 0,      // 游侠生存本能叠层
    lastSurvivalTime: 0,    // 游侠生存本能上次触发时间
    rageDamageBonus: 1.0,   // 战士狂暴伤害加成
    manaSurgeActive: false, // 法师法力涌动是否激活
};

// 选择角色
function selectCharacter(characterId) {
    const characterType = Object.values(CharacterTypes).find(char => char.id === characterId);
    if (characterType) {
        selectedCharacter = characterType;
        console.log(`选择角色: ${selectedCharacter.name}`);
        
        // 应用角色属性到玩家
        applyCharacterToPlayer();
        
        // 切换到武器选择界面
        gameState = GameStates.WEAPON_SELECT;
    }
}

// 应用角色属性到玩家对象
function applyCharacterToPlayer() {
    if (!selectedCharacter) return;
    
    // 重置玩家状态
    player.x = GameConfig.PLAYER.INITIAL_X;
    player.y = GameConfig.PLAYER.INITIAL_Y;
    player.level = GameConfig.PLAYER.INITIAL_LEVEL;
    player.exp = GameConfig.PLAYER.INITIAL_EXP;
    player.expToNextLevel = GameConfig.PLAYER.INITIAL_EXP_TO_NEXT;
    
    // 应用角色属性修正
    player.maxHealth = Math.floor(GameConfig.PLAYER.INITIAL_HEALTH * selectedCharacter.healthMultiplier);
    player.health = player.maxHealth;
    player.speed = GameConfig.PLAYER.SPEED * selectedCharacter.speedMultiplier;
    
    // 存储角色信息到玩家对象
    player.character = selectedCharacter;
    player.baseSpeed = player.speed; // 保存基础速度用于技能加成计算
    
    // 初始化角色专属状态
    initializeCharacterState();
}

// 初始化角色专属状态
function initializeCharacterState() {
    characterState.survivalStacks = 0;
    characterState.lastSurvivalTime = 0;
    characterState.rageDamageBonus = 1.0;
    characterState.manaSurgeActive = false;
}

// 更新角色技能和能力
function updateCharacterAbilities() {
    if (!selectedCharacter || gameState !== GameStates.PLAYING) return;
    
    switch (selectedCharacter.id) {
        case 'warrior':
            updateWarriorAbilities();
            break;
        case 'mage':
            updateMageAbilities();
            break;
        case 'ranger':
            updateRangerAbilities();
            break;
    }
}

// 战士技能更新
function updateWarriorAbilities() {
    // 狂暴技能：生命值低于30%时攻击力+50%
    const healthPercent = player.health / player.maxHealth;
    const rageSkill = selectedCharacter.skills.rage;
    
    if (healthPercent <= rageSkill.threshold) {
        characterState.rageDamageBonus = rageSkill.damageBonus;
        // 添加视觉效果
        if (Math.random() < 0.1) {
            if (typeof createParticles !== 'undefined') {
                createParticles(
                    player.x + player.getWidth()/2,
                    player.y + player.getHeight()/2,
                    '#FF0000',
                    3,
                    'explosion'
                );
            }
        }
    } else {
        characterState.rageDamageBonus = 1.0;
    }
}

// 法师技能更新
function updateMageAbilities() {
    // 法力涌动在武器系统中处理
    // 这里处理其他被动效果
    
    // 智慧技能：经验需求减少（在升级时处理）
}

// 游侠技能更新
function updateRangerAbilities() {
    // 生存本能：每5秒增加5%移动速度，最多+50%
    const survivalSkill = selectedCharacter.skills.survivalInstinct;
    const currentTime = frameCount;
    
    if (currentTime - characterState.lastSurvivalTime >= survivalSkill.interval) {
        if (characterState.survivalStacks < survivalSkill.maxStacks) {
            characterState.survivalStacks++;
            characterState.lastSurvivalTime = currentTime;
            
            // 更新玩家速度
            const speedBonus = 1 + (characterState.survivalStacks * survivalSkill.speedBonus);
            player.speed = player.baseSpeed * speedBonus;
            
            // 视觉反馈
            if (typeof createParticles !== 'undefined') {
                createParticles(
                    player.x + player.getWidth()/2,
                    player.y + player.getHeight()/2,
                    '#228B22',
                    5,
                    'magic'
                );
            }
        }
    }
}

// 获取角色伤害加成
function getCharacterDamageBonus(weaponType = null) {
    if (!selectedCharacter) return 1.0;
    
    let bonus = 1.0;
    
    switch (selectedCharacter.id) {
        case 'warrior':
            // 狂暴加成
            bonus *= characterState.rageDamageBonus;
            
            // 近战掌握
            if (weaponType === 'whip') {
                bonus *= selectedCharacter.skills.meleeExpert.damageBonus;
            }
            break;
            
        case 'mage':
            // 元素掌握
            const elementalSkill = selectedCharacter.skills.elementalMastery;
            if (elementalSkill.weaponTypes.includes(weaponType)) {
                bonus *= elementalSkill.damageBonus;
            }
            break;
            
        case 'ranger':
            // 游侠没有直接伤害加成，但有其他加成
            break;
    }
    
    return bonus;
}

// 获取角色暴击率加成
function getCharacterCritBonus() {
    if (!selectedCharacter) return 0;
    
    switch (selectedCharacter.id) {
        case 'ranger':
            return selectedCharacter.skills.precisionShot.critBonus;
        default:
            return 0;
    }
}

// 获取角色射程加成
function getCharacterRangeBonus() {
    if (!selectedCharacter) return 1.0;
    
    switch (selectedCharacter.id) {
        case 'ranger':
            return selectedCharacter.skills.eagleEye.rangeBonus;
        default:
            return 1.0;
    }
}

// 获取角色经验需求修正
function getCharacterExpRequirement(baseRequirement) {
    if (!selectedCharacter) return baseRequirement;
    
    switch (selectedCharacter.id) {
        case 'mage':
            const wisdomSkill = selectedCharacter.skills.wisdom;
            return Math.floor(baseRequirement * wisdomSkill.expRequirement);
        default:
            return baseRequirement;
    }
}

// 处理角色特殊能力（伤害接受时）
function handleCharacterDamageReduction(damage) {
    if (!selectedCharacter) return damage;
    
    let finalDamage = damage;
    
    switch (selectedCharacter.specialAbility) {
        case 'block':
            // 战士格挡
            if (Math.random() < selectedCharacter.blockChance) {
                finalDamage *= selectedCharacter.blockReduction;
                // 格挡特效
                if (typeof createParticles !== 'undefined') {
                    createParticles(
                        player.x + player.getWidth()/2,
                        player.y + player.getHeight()/2,
                        '#DC143C',
                        8,
                        'explosion'
                    );
                }
                console.log('格挡成功！');
            }
            break;
            
        case 'dodge':
            // 游侠闪避
            if (Math.random() < selectedCharacter.dodgeChance) {
                finalDamage = 0;
                // 闪避特效
                if (typeof createParticles !== 'undefined') {
                    createParticles(
                        player.x + player.getWidth()/2,
                        player.y + player.getHeight()/2,
                        '#228B22',
                        10,
                        'magic'
                    );
                }
                console.log('闪避成功！');
            }
            break;
            
        case 'manaShield':
            // 法师法力护盾（对魔法伤害有效）
            const absorption = selectedCharacter.shieldAbsorption;
            finalDamage *= (1 - absorption);
            // 护盾特效
            if (typeof createParticles !== 'undefined') {
                createParticles(
                    player.x + player.getWidth()/2,
                    player.y + player.getHeight()/2,
                    '#4169E1',
                    6,
                    'magic'
                );
            }
            break;
    }
    
    return Math.max(0, Math.floor(finalDamage));
}

// 角色升级时的额外处理
function handleCharacterLevelUp() {
    if (!selectedCharacter) return;
    
    switch (selectedCharacter.id) {
        case 'warrior':
            // 护甲精通：每升级获得额外2点最大生命值
            const armorSkill = selectedCharacter.skills.armorMastery;
            player.maxHealth += armorSkill.healthBonus;
            player.health += armorSkill.healthBonus; // 同时回复生命值
            console.log(`护甲精通：最大生命值+${armorSkill.healthBonus}`);
            break;
    }
}

// 处理法师法力涌动技能
function handleManaSurge() {
    if (!selectedCharacter || selectedCharacter.id !== 'mage') return false;
    
    const surgeSkill = selectedCharacter.skills.manaSurge;
    if (Math.random() < surgeSkill.chance) {
        console.log('法力涌动触发！');
        // 特效
        if (typeof createParticles !== 'undefined') {
            createParticles(
                player.x + player.getWidth()/2,
                player.y + player.getHeight()/2,
                '#4169E1',
                12,
                'magic'
            );
        }
        return true; // 表示不消耗冷却
    }
    return false;
}

// 获取角色信息用于UI显示
function getCharacterStatusInfo() {
    if (!selectedCharacter) return null;
    
    const info = {
        name: selectedCharacter.name,
        icon: selectedCharacter.icon,
        color: selectedCharacter.color,
        abilities: []
    };
    
    // 添加当前激活的能力状态
    switch (selectedCharacter.id) {
        case 'warrior':
            if (characterState.rageDamageBonus > 1.0) {
                info.abilities.push({
                    name: '狂暴',
                    active: true,
                    description: `攻击力 +${Math.floor((characterState.rageDamageBonus - 1) * 100)}%`
                });
            }
            break;
            
        case 'ranger':
            if (characterState.survivalStacks > 0) {
                const speedBonus = characterState.survivalStacks * selectedCharacter.skills.survivalInstinct.speedBonus;
                info.abilities.push({
                    name: '生存本能',
                    active: true,
                    description: `速度 +${Math.floor(speedBonus * 100)}% (${characterState.survivalStacks}/10)`
                });
            }
            break;
    }
    
    return info;
}