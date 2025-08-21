// 游戏配置和常量
const GameConfig = {
    // 画布设置
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // 玩家设置
    PLAYER: {
        INITIAL_X: 400 - 15,  // 画布中心
        INITIAL_Y: 300 - 15,  // 画布中心
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
        EXPERIENCE_COLLECT_RANGE: 40,    // 增大拾取范围
        EXPERIENCE_FAST_COLLECT_RANGE: 80,
        EXPERIENCE_MAGNET_RANGE: 150
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
        HEALTH_BAR: { x: 15, y: 15, width: 200, height: 15 },
        EXP_BAR: { x: 15, y: 35, width: 200, height: 15 },
        RIGHT_INFO_X: 600  // 右侧信息区域X坐标
    }
};

// 敌人类型定义 - 吸血鬼幸存者风格
const EnemyTypes = {
    SKELETON: { 
        name: '骷髅兵', 
        health: 8, 
        speed: 2.5, 
        size: 16, 
        color: '#F0F0F0', 
        exp: 10,
        probability: 0.4,
        icon: '💀'
    },
    ZOMBIE: { 
        name: '僵尸', 
        health: 15, 
        speed: 1.8, 
        size: 18, 
        color: '#90EE90', 
        exp: 15,
        probability: 0.25,
        icon: '🧟'
    },
    BAT: { 
        name: '蝙蝠', 
        health: 3, 
        speed: 4.5, 
        size: 12, 
        color: '#800080', 
        exp: 8,
        probability: 0.2,
        icon: '🦇'
    },
    GHOST: { 
        name: '幽灵', 
        health: 12, 
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
        health: 35, 
        speed: 3.5, 
        size: 24, 
        color: '#8B4513', 
        exp: 40,
        probability: 0.03,
        icon: '🐺'
    },
    VAMPIRE: { 
        name: '吸血鬼', 
        health: 50, 
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
        health: 80, 
        speed: 2.0, 
        size: 30, 
        color: '#8B0000', 
        exp: 100,
        probability: 0.005,
        icon: '👹',
        special: 'fire_aura' // 特殊能力：火焰光环
    }
};

// 武器配置
const WeaponConfig = {
    book: { 
        level: 0, 
        damage: 10 
    },
    fireball: { 
        level: 0, 
        damage: 30, 
        speed: 8, 
        cooldown: 0, 
        maxCooldown: 30 
    },
    missile: { 
        level: 0, 
        damage: 15, 
        speed: 13, 
        cooldown: 0, 
        maxCooldown: 15 
    },
    frostbolt: { 
        level: 0, 
        damage: 20, 
        speed: 10, 
        cooldown: 0, 
        maxCooldown: 20 
    },
    whip: { 
        level: 0, 
        damage: 25, 
        cooldown: 0, 
        maxCooldown: 40, 
        range: 80 
    },
    garlic: { 
        level: 0, 
        damage: 8, 
        range: 50, 
        frequency: 10 
    },
    cross: { 
        level: 0, 
        damage: 18, 
        speed: 12, 
        cooldown: 0, 
        maxCooldown: 35, 
        range: 200 
    },
    laser: {
        level: 0,
        damage: 25,
        cooldown: 0,
        maxCooldown: 60,
        duration: 30,
        range: 400
    }
};

// 游戏状态枚举
const GameStates = {
    WEAPON_SELECT: 'weaponSelect',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
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
    WEAPON_3: '3',
    WEAPON_4: '4'
};