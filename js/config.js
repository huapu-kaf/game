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
        ENEMY_SPAWN_INTERVAL: 2000,  // 敌人生成间隔（毫秒）
        SHOOT_INTERVAL: 50,          // 射击检查间隔（毫秒）
        INVULNERABLE_TIME: 60,       // 无敌时间（帧）
        COMBO_TIMER: 180,            // 连击时间（帧）
        EXPERIENCE_COLLECT_RANGE: 30,
        EXPERIENCE_FAST_COLLECT_RANGE: 60,
        EXPERIENCE_MAGNET_RANGE: 120
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

// 敌人类型定义
const EnemyTypes = {
    FAST: { 
        name: '快速小怪', 
        health: 8, 
        speed: 3.5, 
        size: 15, 
        color: '#FF6B6B', 
        exp: 15,
        probability: 0.5
    },
    NORMAL: { 
        name: '普通敌人', 
        health: 15, 
        speed: 2, 
        size: 20, 
        color: '#DC143C', 
        exp: 20,
        probability: 0.3
    },
    TANK: { 
        name: '坦克巨怪', 
        health: 40, 
        speed: 1.2, 
        size: 30, 
        color: '#8B0000', 
        exp: 50,
        probability: 0.15
    },
    ELITE: { 
        name: '精英怪物', 
        health: 25, 
        speed: 2.5, 
        size: 25, 
        color: '#FF4500', 
        exp: 80,
        probability: 0.05
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
    WEAPON_3: '3'
};