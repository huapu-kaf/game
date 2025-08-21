// 游戏配置和常量
const GameConfig = {
    // 画布设置
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 800,
    
    // 玩家设置
    PLAYER: {
        INITIAL_X: 600 - 15,  // 画布中心
        INITIAL_Y: 400 - 15,  // 画布中心
        SPEED: 7,
        WIDTH: 30,
        HEIGHT: 30,
        INITIAL_HEALTH: 100,
        INITIAL_LEVEL: 1,
        INITIAL_EXP: 0,
        INITIAL_EXP_TO_NEXT: 50
    },
    
    // 游戏机制
    GAMEPLAY: {
        ENEMY_SPAWN_INTERVAL: 1000,  // 敌人生成间隔（毫秒） - 更快节奏
        SHOOT_INTERVAL: 50,          // 射击检查间隔（毫秒）
        INVULNERABLE_TIME: 60,       // 无敌时间（帧）
        COMBO_TIMER: 180,            // 连击时间（帧）
        COMBO_EXP_MULTIPLIER: 1.5,   // 连击经验倍数
        EXPERIENCE_COLLECT_RANGE: 40,    // 增大拾取范围
        EXPERIENCE_FAST_COLLECT_RANGE: 80,
        EXPERIENCE_MAGNET_RANGE: 150,
        SCREEN_SHAKE_INTENSITY: 8,   // 屏幕震动强度
        ITEM_DROP_CHANCE: 0.05,      // 道具掉落概率
        ELITE_ENEMY_CHANCE: 0.02     // 精英敌人出现概率
    },
    
    // 音频设置
    AUDIO: {
        DEFAULT_MUSIC_VOLUME: 0.3,
        DEFAULT_SFX_VOLUME: 0.5,
        SOUND_FILES: {
            background: 'sounds/background.mp3',
            shoot: 'sounds/shoot.mp3',
            enemyDeath: 'sounds/enemy_death.mp3',
            playerHurt: 'sounds/player_hurt.mp3',
            levelUp: 'sounds/level_up.mp3',
            gemPickup: 'sounds/gem_pickup.mp3',
            gameOver: 'sounds/game_over.mp3'
        }
    },
    
    // UI配置
    UI: {
        HEALTH_BAR: { x: 15, y: 15, width: 250, height: 18 },
        EXP_BAR: { x: 15, y: 38, width: 250, height: 18 },
        RIGHT_INFO_X: 1000  // 右侧信息区域X坐标
    }
};

// 敌人类型定义 - 吸血鬼幸存者风格
const EnemyTypes = {
    SKELETON: { 
        name: '骷髅兵', 
        health: 12, 
        speed: 2.5, 
        size: 16, 
        color: '#F0F0F0', 
        exp: 10,
        probability: 0.4,
        icon: '💀'
    },
    ZOMBIE: { 
        name: '僵尸', 
        health: 22, 
        speed: 1.8, 
        size: 18, 
        color: '#90EE90', 
        exp: 15,
        probability: 0.25,
        icon: '🧟'
    },
    BAT: { 
        name: '蝙蝠', 
        health: 5, 
        speed: 4.5, 
        size: 12, 
        color: '#800080', 
        exp: 8,
        probability: 0.2,
        icon: '🦇'
    },
    GHOST: { 
        name: '幽灵', 
        health: 18, 
        speed: 3.0, 
        size: 20, 
        color: '#E6E6FA', 
        exp: 20,
        probability: 0.1,
        icon: '👻',
        special: 'phasing' // 特殊能力：相位
    },
    WEREWOLF: { 
        name: '狼人', 
        health: 50, 
        speed: 3.5, 
        size: 24, 
        color: '#8B4513', 
        exp: 40,
        probability: 0.03,
        icon: '🐺'
    },
    VAMPIRE: { 
        name: '吸血鬼', 
        health: 75, 
        speed: 2.8, 
        size: 22, 
        color: '#DC143C', 
        exp: 60,
        probability: 0.015,
        icon: '🧛',
        special: 'regeneration' // 特殊能力：再生
    },
    DEMON: { 
        name: '恶魔', 
        health: 120, 
        speed: 2.0, 
        size: 30, 
        color: '#8B0000', 
        exp: 100,
        probability: 0.005,
        icon: '👹',
        special: 'fire_aura' // 特殊能力：火焰光环
    },
    FLYING_EYE: {
        name: '飞行魔眼',
        health: 18,
        speed: 3.8,
        size: 16,
        color: '#FF69B4',
        exp: 25,
        probability: 0.08,
        icon: '👁️',
        special: 'flying' // 特殊能力：飞行，不受地面限制
    },
    ARCHER: {
        name: '骷髅弓箭手',
        health: 30,
        speed: 1.5,
        size: 18,
        color: '#DDD8B8',
        exp: 35,
        probability: 0.04,
        icon: '🏹',
        special: 'ranged_attack' // 特殊能力：远程攻击
    },
    SHAMAN: {
        name: '萨满',
        health: 38,
        speed: 2.0,
        size: 20,
        color: '#32CD32',
        exp: 50,
        probability: 0.02,
        icon: '🧙',
        special: 'summon' // 特殊能力：召唤小兵
    },
    
    // === 新增基础敌人 ===
    GOBLIN_WARRIOR: {
        name: '地精战士',
        health: 9,
        speed: 3.2,
        size: 14,
        color: '#8FBC8F',
        exp: 12,
        probability: 0.15,
        icon: '🗡️',
        special: 'pack_hunter' // 成群出现
    },
    SPIDER: {
        name: '毒蛛',
        health: 15,
        speed: 2.8,
        size: 16,
        color: '#2F4F4F',
        exp: 18,
        probability: 0.12,
        icon: '🕷️',
        special: 'web_shot' // 吐丝减速
    },
    FIRE_ELEMENTAL: {
        name: '火元素',
        health: 27,
        speed: 2.2,
        size: 20,
        color: '#FF4500',
        exp: 35,
        probability: 0.08,
        icon: '🔥',
        special: 'death_explosion' // 死亡爆炸
    },
    ICE_ELEMENTAL: {
        name: '冰元素',
        health: 30,
        speed: 1.8,
        size: 22,
        color: '#87CEEB',
        exp: 40,
        probability: 0.06,
        icon: '❄️',
        special: 'freeze_aura' // 冰冻光环
    },
    POISON_MUSHROOM: {
        name: '毒蘑菇',
        health: 18,
        speed: 1.0,
        size: 18,
        color: '#9ACD32',
        exp: 25,
        probability: 0.1,
        icon: '🍄',
        special: 'poison_cloud' // 毒雾
    },
    ROCK_GOLEM: {
        name: '岩石傀儡',
        health: 85,
        speed: 1.2,
        size: 28,
        color: '#696969',
        exp: 80,
        probability: 0.03,
        icon: '🗿',
        special: 'heavy_armor' // 重甲防护
    },
    
    // === 新增精英敌人 ===
    SHADOW_ASSASSIN: {
        name: '暗影刺客',
        health: 60,
        speed: 4.0,
        size: 20,
        color: '#483D8B',
        exp: 120,
        probability: 0.02,
        icon: '🥷',
        special: 'stealth_teleport', // 隐身瞬移
        isElite: true
    },
    GIANT_SPIDER: {
        name: '巨型蜘蛛',
        health: 120,
        speed: 2.0,
        size: 35,
        color: '#8B0000',
        exp: 150,
        probability: 0.015,
        icon: '🕸️',
        special: 'spawn_spiderlings', // 召唤小蜘蛛
        isElite: true
    },
    FLAME_DEMON: {
        name: '炎魔',
        health: 150,
        speed: 2.5,
        size: 32,
        color: '#DC143C',
        exp: 180,
        probability: 0.01,
        icon: '👿',
        special: 'fire_aura_elite', // 强化火焰光环
        isElite: true
    },
    ICE_WIZARD: {
        name: '冰霜巫师',
        health: 105,
        speed: 1.8,
        size: 26,
        color: '#4682B4',
        exp: 160,
        probability: 0.01,
        icon: '🧊',
        special: 'ice_barrage', // 冰弹幕
        isElite: true
    },
    
    // === 新增特殊敌人 ===
    PARASITE: {
        name: '寄生虫',
        health: 12,
        speed: 3.5,
        size: 12,
        color: '#FF69B4',
        exp: 20,
        probability: 0.08,
        icon: '🐛',
        special: 'split_on_death' // 死亡分裂
    },
    MIRROR_WRAITH: {
        name: '镜像怪',
        health: 68,
        speed: 2.8,
        size: 24,
        color: '#C0C0C0',
        exp: 100,
        probability: 0.01,
        icon: '👤',
        special: 'copy_attacks' // 复制攻击
    },
    VOID_WALKER: {
        name: '虚空行者',
        health: 45,
        speed: 3.0,
        size: 22,
        color: '#4B0082',
        exp: 90,
        probability: 0.02,
        icon: '🌀',
        special: 'dimension_shift' // 维度穿梭
    },
    
    // === BOSS级敌人 ===
    CORRUPTED_TREANT: {
        name: '腐化树精王',
        health: 3000,
        speed: 1.5,
        size: 80,
        color: '#228B22',
        exp: 500,
        probability: 0,
        icon: '🌳',
        special: 'boss_abilities',
        isBoss: true,
        bossType: 'treant'
    },
    VOID_LORD: {
        name: '虚空领主',
        health: 4000,
        speed: 2.0,
        size: 90,
        color: '#191970',
        exp: 800,
        probability: 0,
        icon: '👁️‍🗨️',
        special: 'boss_abilities',
        isBoss: true,
        bossType: 'void_lord'
    }
};

// 武器配置 - 根据敌人血量提升重新平衡
const WeaponConfig = {
    book: { 
        level: 0, 
        damage: 14  // 从10提升到14
    },
    fireball: { 
        level: 0, 
        damage: 42,  // 从30提升到42
        speed: 8, 
        cooldown: 0, 
        maxCooldown: 30 
    },
    missile: { 
        level: 0, 
        damage: 21,  // 从15提升到21
        speed: 13, 
        cooldown: 0, 
        maxCooldown: 15 
    },
    frostbolt: { 
        level: 0, 
        damage: 28,  // 从20提升到28
        speed: 10, 
        cooldown: 0, 
        maxCooldown: 20 
    },
    whip: { 
        level: 0, 
        damage: 35,  // 从25提升到35
        cooldown: 0, 
        maxCooldown: 40, 
        range: 80 
    },
    garlic: { 
        level: 0, 
        damage: 11,  // 从8提升到11
        range: 50, 
        frequency: 10 
    },
    cross: { 
        level: 0, 
        damage: 25,  // 从18提升到25
        speed: 12, 
        cooldown: 0, 
        maxCooldown: 35, 
        range: 200 
    },
    laser: {
        level: 0,
        damage: 35,  // 从25提升到35
        cooldown: 0,
        maxCooldown: 60,
        duration: 30,
        range: 400
    }
};

// BOSS系统配置
const BossConfig = {
    // BOSS触发条件 - 降低触发频率，增加遭遇率
    KILLS_PER_BOSS: 100,
    
    // BOSS战阶段
    BOSS_PHASES: {
        SKELETON_KING: {
            name: '巨型骷髅王',
            health: 2000,
            speed: 1.8,
            size: 70,
            color: '#F0F0F0',
            exp: 300,
            icon: '💀',
            phases: [
                {
                    healthThreshold: 1.0,
                    abilities: ['summon_skeletons', 'bone_spikes']
                },
                {
                    healthThreshold: 0.5,
                    abilities: ['death_nova', 'bone_prison']
                }
            ]
        },
        ELEMENTAL_TITAN: {
            name: '元素泰坦',
            health: 3000,
            speed: 1.5,
            size: 85,
            color: '#FF8C00',
            exp: 450,
            icon: '🌟',
            phases: [
                {
                    healthThreshold: 1.0,
                    abilities: ['elemental_orbs', 'element_shield']
                },
                {
                    healthThreshold: 0.6,
                    abilities: ['elemental_storm', 'meteor_rain']
                },
                {
                    healthThreshold: 0.2,
                    abilities: ['elemental_fury', 'final_explosion']
                }
            ]
        },
        SHADOW_DRAGON: {
            name: '暗影龙',
            health: 4000,
            speed: 2.2,
            size: 95,
            color: '#4B0082',
            exp: 600,
            icon: '🐉',
            phases: [
                {
                    healthThreshold: 1.0,
                    abilities: ['shadow_breath', 'wing_strike']
                },
                {
                    healthThreshold: 0.7,
                    abilities: ['shadow_clone', 'darkness_aura']
                },
                {
                    healthThreshold: 0.3,
                    abilities: ['final_breath', 'shadow_explosion']
                }
            ]
        },
        MECHANICAL_BEAST: {
            name: '机械巨兽',
            health: 5000,
            speed: 1.3,
            size: 100,
            color: '#696969',
            exp: 750,
            icon: '🤖',
            phases: [
                {
                    healthThreshold: 1.0,
                    abilities: ['laser_sweep', 'missile_barrage']
                },
                {
                    healthThreshold: 0.5,
                    abilities: ['overload_mode', 'energy_shield']
                },
                {
                    healthThreshold: 0.2,
                    abilities: ['self_destruct_sequence']
                }
            ]
        },
        VOID_SOVEREIGN: {
            name: '虚空君主',
            health: 6500,
            speed: 1.0,
            size: 120,
            color: '#191970',
            exp: 1000,
            icon: '👁️‍🗨️',
            phases: [
                {
                    healthThreshold: 1.0,
                    abilities: ['void_rifts', 'reality_distortion']
                },
                {
                    healthThreshold: 0.8,
                    abilities: ['time_warp', 'void_prison']
                },
                {
                    healthThreshold: 0.5,
                    abilities: ['dimensional_tear', 'void_storm']
                },
                {
                    healthThreshold: 0.2,
                    abilities: ['apocalypse', 'reality_collapse']
                }
            ]
        }
    },
    
    // BOSS能力配置
    BOSS_ABILITIES: {
        summon_skeletons: {
            name: '召唤骷髅',
            cooldown: 300, // 5秒
            count: 3,
            duration: 0
        },
        bone_spikes: {
            name: '骨刺突袭',
            cooldown: 180,
            damage: 30,
            range: 150
        },
        death_nova: {
            name: '死亡新星',
            cooldown: 480,
            damage: 50,
            range: 200
        },
        elemental_orbs: {
            name: '元素球',
            cooldown: 120,
            count: 5,
            damage: 25
        },
        shadow_breath: {
            name: '暗影吐息',
            cooldown: 240,
            damage: 40,
            range: 300,
            width: 60
        },
        laser_sweep: {
            name: '激光扫射',
            cooldown: 360,
            damage: 35,
            duration: 180
        },
        void_rifts: {
            name: '虚空裂缝',
            cooldown: 420,
            damage: 45,
            count: 3,
            duration: 300
        }
    }
};

// 角色类型定义
const CharacterTypes = {
    WARRIOR: {
        id: 'warrior',
        name: '战士',
        description: '近战专精的勇猛战士',
        icon: '⚔️',
        color: '#DC143C',
        // 属性修正
        healthMultiplier: 1.2,      // +20% 生命值
        speedMultiplier: 0.93,      // -7% 速度
        expMultiplier: 1.0,         // 标准经验
        // 特殊能力
        specialAbility: 'block',    // 格挡
        blockChance: 0.3,          // 30%格挡几率
        blockReduction: 0.5,       // 格挡减伤50%
        // 技能加成
        skills: {
            rage: {
                name: '狂暴',
                description: '生命值低于30%时攻击力+50%',
                trigger: 'lowHealth',
                threshold: 0.3,
                damageBonus: 1.5
            },
            armorMastery: {
                name: '护甲精通',
                description: '每升级获得额外2点最大生命值',
                trigger: 'levelUp',
                healthBonus: 2
            },
            meleeExpert: {
                name: '近战掌握',
                description: '鞭子武器伤害+25%',
                weaponType: 'whip',
                damageBonus: 1.25
            }
        }
    },
    MAGE: {
        id: 'mage',
        name: '法师',
        description: '掌控元素的魔法大师',
        icon: '🔮',
        color: '#4169E1',
        // 属性修正
        healthMultiplier: 0.8,      // -20% 生命值
        speedMultiplier: 1.07,      // +7% 速度
        expMultiplier: 1.3,         // +30% 经验获取
        // 特殊能力
        specialAbility: 'manaShield', // 法力护盾
        shieldAbsorption: 0.7,      // 吸收70%魔法伤害
        // 技能加成
        skills: {
            manaSurge: {
                name: '法力涌动',
                description: '每次施法有15%几率不消耗冷却',
                trigger: 'cast',
                chance: 0.15
            },
            elementalMastery: {
                name: '元素掌握',
                description: '火球和冰霜箭伤害+30%',
                weaponTypes: ['fireball', 'frostbolt'],
                damageBonus: 1.3
            },
            wisdom: {
                name: '智慧',
                description: '经验需求-10%，升级更快',
                expRequirement: 0.9
            }
        }
    },
    RANGER: {
        id: 'ranger',
        name: '游侠',
        description: '敏捷的远程射手',
        icon: '🏹',
        color: '#228B22',
        // 属性修正
        healthMultiplier: 1.0,      // 标准生命值
        speedMultiplier: 1.14,      // +14% 速度
        expMultiplier: 1.1,         // +10% 经验获取
        // 特殊能力
        specialAbility: 'dodge',    // 闪避
        dodgeChance: 0.2,          // 20%闪避几率
        // 技能加成
        skills: {
            eagleEye: {
                name: '鹰眼',
                description: '所有远程武器射程+25%',
                rangeBonus: 1.25
            },
            survivalInstinct: {
                name: '生存本能',
                description: '移动速度每5秒提升5%，最多+50%',
                trigger: 'time',
                interval: 300, // 5秒 * 60帧
                speedBonus: 0.05,
                maxStacks: 10
            },
            precisionShot: {
                name: '精准射击',
                description: '暴击率+10%',
                critBonus: 0.1
            }
        }
    }
};

// 游戏状态枚举
const GameStates = {
    CHARACTER_SELECT: 'characterSelect',
    WEAPON_SELECT: 'weaponSelect',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

// 道具类型定义
const ItemTypes = {
    HEALTH_POTION: {
        name: '生命药水',
        icon: '❤️',
        duration: 0,
        effect: 'heal',
        value: 50,
        color: '#FF0000'
    },
    DAMAGE_BOOST: {
        name: '力量之石',
        icon: '💪',
        duration: 600, // 10秒
        effect: 'damage_boost',
        value: 1.5,
        color: '#FFD700'
    },
    SPEED_BOOST: {
        name: '疾风护符',
        icon: '💨',
        duration: 480, // 8秒
        effect: 'speed_boost',
        value: 1.4,
        color: '#00FFFF'
    },
    SHIELD: {
        name: '魔法护盾',
        icon: '🛡️',
        duration: 300, // 5秒
        effect: 'shield',
        value: 3, // 可吸收3次攻击
        color: '#9932CC'
    },
    EXP_BOOST: {
        name: '智慧宝珠',
        icon: '💎',
        duration: 900, // 15秒
        effect: 'exp_boost',
        value: 2.0,
        color: '#00FF00'
    }
};

// 键盘按键配置
const KeyBindings = {
    MOVE_UP: 'w',
    MOVE_LEFT: 'a',
    MOVE_DOWN: 's',
    MOVE_RIGHT: 'd',
    TOGGLE_MUSIC: 'm',
    TOGGLE_SFX: 'n',
    RESTART: 'r',
    WEAPON_1: '1',
    WEAPON_2: '2',
    WEAPON_3: '3'
};