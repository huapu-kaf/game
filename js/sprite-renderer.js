// 像素精灵渲染系统
// 包含敌人精灵数据定义和渲染器

// === 敌人像素精灵数据定义 ===
const EnemySprites = {
    // 基础敌人精灵
    SKELETON: {
        type: 'pixel_pattern',
        size: { w: 8, h: 8 },
        colors: { primary: '#F0F0F0', eyes: '#FF0000', shadow: '#CCCCCC', bone: '#E0E0E0' },
        pattern: [
            '  ████  ',
            ' █••█  █',
            ' ████  █',
            '  ██   █',
            ' █████ █',
            ' █ █ █ █',
            '██ █ ███',
            '██   ███'
        ],
        animations: {
            idle: [0],
            walk: [0, 1],
            death: [2, 3, 4]
        },
        effects: ['glow_eyes'],
        frameRate: 300
    },
    
    ZOMBIE: {
        type: 'pixel_pattern',
        size: { w: 9, h: 9 },
        colors: { skin: '#90EE90', blood: '#8B0000', eyes: '#FFFF00', clothes: '#4B0082' },
        pattern: [
            '  █████  ',
            ' █••█••█ ',
            ' ███▼███ ',
            '  █████  ',
            ' ███████ ',
            '██  █  ██',
            '██ ███ ██',
            '██     ██',
            '███   ███'
        ],
        animations: {
            idle: [0],
            walk: [0, 1],
            death: [2, 3]
        },
        effects: ['blood_drip'],
        frameRate: 400
    },
    
    BAT: {
        type: 'pixel_pattern',
        size: { w: 8, h: 6 },
        colors: { body: '#800080', wing: '#4B0082', eyes: '#FF69B4' },
        pattern: [
            '█  ██  █',
            '████████',
            ' █••••█ ',
            ' ██████ ',
            '  ████  ',
            '   ██   '
        ],
        animations: {
            idle: [0, 1, 2],
            walk: [0, 1, 2],
            attack: [3]
        },
        effects: ['wing_flap'],
        frameRate: 100
    },
    
    GHOST: {
        type: 'pixel_pattern',
        size: { w: 10, h: 10 },
        colors: { body: '#E6E6FA', eyes: '#4169E1', aura: '#DDA0DD' },
        pattern: [
            '  ██████  ',
            ' ████████ ',
            '██████████',
            '██••██••██',
            '██████████',
            '██████████',
            '██████████',
            '████  ████',
            '██      ██',
            '██  ██  ██'
        ],
        animations: {
            idle: [0, 1, 2],
            walk: [0, 1, 2],
            death: [3, 4]
        },
        effects: ['phase_glow', 'float_animation'],
        frameRate: 250
    },
    
    WEREWOLF: {
        type: 'pixel_pattern',
        size: { w: 12, h: 12 },
        colors: { fur: '#8B4513', claws: '#FFFFFF', eyes: '#FF4500', fangs: '#F0F0F0' },
        pattern: [
            '   ██████   ',
            '  ████████  ',
            ' ██••██••██ ',
            ' ████▲▲████ ',
            '████████████',
            '████████████',
            '████████████',
            ' ██████████ ',
            '  ██  ██  ██',
            ' ██    ██  ██',
            '██      ████',
            '██      ████'
        ],
        animations: {
            idle: [0],
            walk: [0, 1],
            attack: [2, 3],
            dash: [4]
        },
        effects: ['feral_aura'],
        frameRate: 200
    },
    
    VAMPIRE: {
        type: 'pixel_pattern',
        size: { w: 10, h: 12 },
        colors: { skin: '#FFE4E1', cape: '#8B0000', eyes: '#DC143C', fangs: '#FFFFFF' },
        pattern: [
            '██████████',
            '██ ████ ██',
            '█••████••█',
            '██▲████▲██',
            '██████████',
            '██████████',
            '██████████',
            ' ████████ ',
            '  ██████  ',
            '   ████   ',
            '   █  █   ',
            '  ██  ██  '
        ],
        animations: {
            idle: [0, 1],
            walk: [0, 1],
            teleport: [2, 3, 4],
            attack: [5]
        },
        effects: ['blood_aura', 'teleport_trail'],
        frameRate: 300
    },
    
    DEMON: {
        type: 'pixel_pattern',
        size: { w: 15, h: 15 },
        colors: { skin: '#8B0000', horns: '#2F4F4F', fire: '#FF4500', eyes: '#FFFF00' },
        pattern: [
            '   ▲█████▲   ',
            '  ███████████  ',
            ' █████████████ ',
            '███••█████••███',
            '███████████████',
            '███████████████',
            '███████████████',
            '███████████████',
            ' █████████████ ',
            '  ███████████  ',
            '   █████████   ',
            '    ███████    ',
            '   ██  █  ██   ',
            '  ██    ██  ██ ',
            ' ██      ████  '
        ],
        animations: {
            idle: [0, 1],
            walk: [0, 1],
            cast: [2, 3],
            rage: [4]
        },
        effects: ['flame_aura', 'horn_glow'],
        frameRate: 250
    },
    
    GOBLIN_WARRIOR: {
        type: 'pixel_pattern',
        size: { w: 6, h: 6 },
        colors: { skin: '#8FBC8F', weapon: '#C0C0C0', eyes: '#FFFF00', armor: '#696969' },
        pattern: [
            ' ████ ',
            '█••██▲',
            '██████',
            ' ████ ',
            ' █  █ ',
            '██  ██'
        ],
        animations: {
            idle: [0],
            walk: [0, 1],
            attack: [2]
        },
        effects: ['weapon_flash', 'pack_glow'],
        frameRate: 180
    },
    
    SPIDER: {
        type: 'pixel_pattern',
        size: { w: 10, h: 6 },
        colors: { body: '#2F4F4F', legs: '#1C1C1C', eyes: '#FF6347' },
        pattern: [
            '█ ████ █',
            '████████',
            '█••██••█',
            '████████',
            '█ ████ █',
            '█      █'
        ],
        animations: {
            idle: [0],
            walk: [0, 1, 2],
            attack: [3]
        },
        effects: ['leg_crawl'],
        frameRate: 160
    },
    
    FLYING_EYE: {
        type: 'pixel_pattern',
        size: { w: 8, h: 8 },
        colors: { eye: '#FF69B4', pupil: '#000000', iris: '#4169E1', veins: '#DC143C' },
        pattern: [
            '  ████  ',
            ' ██████ ',
            '████████',
            '██•██•██',
            '████████',
            '████████',
            ' ██████ ',
            '  ████  '
        ],
        animations: {
            idle: [0, 1, 2],
            walk: [0, 1, 2],
            blink: [3],
            attack: [4]
        },
        effects: ['eye_glow', 'float_bob'],
        frameRate: 150
    },
    
    ARCHER: {
        type: 'pixel_pattern',
        size: { w: 8, h: 10 },
        colors: { bone: '#F0F0F0', bow: '#8B4513', arrow: '#CD853F', eyes: '#FF0000' },
        pattern: [
            ' ██████ ',
            '██••████',
            '████████',
            ' ██████ ',
            '████████',
            '█████▲██',
            '█ ██ █ █',
            '██ █ ███',
            '██   ███',
            '██   ███'
        ],
        animations: {
            idle: [0],
            walk: [0, 1],
            aim: [2],
            shoot: [3]
        },
        effects: ['bow_glow'],
        frameRate: 250
    },
    
    SHAMAN: {
        type: 'pixel_pattern',
        size: { w: 10, h: 12 },
        colors: { robe: '#32CD32', staff: '#8B4513', magic: '#9370DB', eyes: '#FFFF00' },
        pattern: [
            '    ██    ',
            '   ████   ',
            '  ██••██  ',
            '  ██████  ',
            ' ████████ ',
            '██████████',
            '██████████',
            '██████████',
            ' ████████ ',
            '  ██████  ',
            '   █  █   ',
            '  ██  ██  '
        ],
        animations: {
            idle: [0, 1],
            walk: [0, 1],
            cast: [2, 3, 4],
            summon: [5, 6]
        },
        effects: ['magic_aura', 'staff_glow'],
        frameRate: 300
    },
    
    POISON_MUSHROOM: {
        type: 'pixel_pattern',
        size: { w: 9, h: 8 },
        colors: { cap: '#9ACD32', stem: '#FFFFFF', spots: '#FF0000', spores: '#ADFF2F' },
        pattern: [
            '  █████  ',
            ' ███▼███ ',
            '█████████',
            '█████████',
            '  █████  ',
            '  █████  ',
            '  █████  ',
            '  █████  '
        ],
        animations: {
            idle: [0, 1],
            spore: [2, 3]
        },
        effects: ['poison_spores'],
        frameRate: 400
    },
    
    ROCK_GOLEM: {
        type: 'pixel_pattern',
        size: { w: 14, h: 14 },
        colors: { rock: '#696969', crystal: '#4169E1', moss: '#228B22', eyes: '#00FFFF' },
        pattern: [
            '  ██████████  ',
            ' ████████████ ',
            '████••████••██',
            '██████████████',
            '██████████████',
            '██████████████',
            '██████████████',
            '██████████████',
            '██████████████',
            ' ████████████ ',
            '  ██████████  ',
            '   ████████   ',
            '   ██  ██    ',
            '  ████████   '
        ],
        animations: {
            idle: [0],
            walk: [0, 1],
            pound: [2]
        },
        effects: ['rock_dust', 'crystal_glow'],
        frameRate: 500
    },
    
    FIRE_ELEMENTAL: {
        type: 'particle_sprite',
        size: { w: 12, h: 12 },
        colors: { core: '#FF4500', outer: '#FF6347', particles: '#FFA500' },
        corePattern: [
            '  ████  ',
            ' ██████ ',
            '████████',
            '████████',
            '████████',
            '████████',
            ' ██████ ',
            '  ████  '
        ],
        animations: {
            idle: [0, 1, 2],
            attack: [3, 4]
        },
        effects: ['fire_particles', 'heat_distortion'],
        frameRate: 120
    },
    
    ICE_ELEMENTAL: {
        type: 'crystal_sprite',
        size: { w: 12, h: 12 },
        colors: { crystal: '#87CEEB', glow: '#B0E0E6', frost: '#F0F8FF' },
        pattern: [
            '   ██   ',
            '  ████  ',
            ' ██████ ',
            '████████',
            ' ██████ ',
            '  ████  ',
            '   ██   ',
            '        '
        ],
        animations: {
            idle: [0, 1],
            attack: [2]
        },
        effects: ['frost_aura', 'crystal_sparkle'],
        frameRate: 200
    },
    
    // 精英敌人精灵
    SHADOW_ASSASSIN: {
        type: 'pixel_pattern',
        size: { w: 10, h: 12 },
        colors: { shadow: '#483D8B', blade: '#C0C0C0', eyes: '#9400D3', cloak: '#191970' },
        pattern: [
            '  ██████  ',
            ' ████████ ',
            '██••████••',
            '██████████',
            '██████████',
            '████▲▲████',
            '██████████',
            ' ████████ ',
            '  ██████  ',
            '   ████   ',
            '   █  █   ',
            '  ██  ██  '
        ],
        animations: {
            idle: [0, 1],
            walk: [0, 1],
            stealth: [2, 3],
            attack: [4, 5],
            teleport: [6, 7, 8]
        },
        effects: ['shadow_trail', 'blade_gleam', 'stealth_shimmer'],
        frameRate: 150,
        isElite: true
    },
    
    GIANT_SPIDER: {
        type: 'pixel_pattern',
        size: { w: 18, h: 12 },
        colors: { body: '#8B0000', legs: '#2F4F4F', eyes: '#FF6347', fangs: '#FFFFFF' },
        pattern: [
            '██ ██████████ ██',
            '████████████████',
            '████████████████',
            '███••████••█████',
            '████▲████▲██████',
            '████████████████',
            '████████████████',
            '████████████████',
            '██ ████████ ████',
            '█  ████████  ███',
            '   ████████   ██',
            '   ████████     '
        ],
        animations: {
            idle: [0],
            walk: [0, 1, 2],
            spawn: [3, 4],
            attack: [5]
        },
        effects: ['web_shimmer', 'multi_eyes', 'leg_crawl_large'],
        frameRate: 180,
        isElite: true
    },
    
    FLAME_DEMON: {
        type: 'particle_sprite',
        size: { w: 16, h: 18 },
        colors: { 
            core: '#DC143C', 
            flame: '#FF4500', 
            heat: '#FFA500', 
            horns: '#2F4F4F',
            eyes: '#FFFF00'
        },
        corePattern: [
            '   ▲████▲   ',
            '  ██████████  ',
            ' ████████████ ',
            '███••████••███',
            '██████████████',
            '██████████████',
            '██████████████',
            '██████████████',
            '██████████████',
            '██████████████',
            ' ████████████ ',
            '  ██████████  ',
            '   ████████   ',
            '    ██████    ',
            '   ██    ██   ',
            '  ██      ██  ',
            ' ██        ██ ',
            '██          ██'
        ],
        animations: {
            idle: [0, 1, 2],
            walk: [0, 1],
            cast: [3, 4, 5],
            rage: [6, 7]
        },
        effects: ['elite_fire_aura', 'horn_spark', 'flame_crown'],
        frameRate: 120,
        isElite: true
    },
    
    ICE_WIZARD: {
        type: 'crystal_sprite',
        size: { w: 13, h: 16 },
        colors: { 
            robe: '#4682B4', 
            crystal: '#87CEEB', 
            ice: '#B0E0E6', 
            staff: '#E0E0E0',
            eyes: '#00FFFF'
        },
        pattern: [
            '     ██     ',
            '    ████    ',
            '   ██••██   ',
            '   ██████   ',
            '  ████████  ',
            ' ██████████ ',
            '████████████',
            '████████████',
            '████████████',
            '████████████',
            ' ██████████ ',
            '  ████████  ',
            '   ██████   ',
            '   ██  ██   ',
            '  ████████  ',
            ' ██      ██ '
        ],
        animations: {
            idle: [0, 1],
            walk: [0, 1],
            cast: [2, 3, 4],
            ultimate: [5, 6, 7]
        },
        effects: ['ice_crown', 'staff_crystal', 'frost_emanation'],
        frameRate: 200,
        isElite: true
    },
    
    PARASITE: {
        type: 'pixel_pattern',
        size: { w: 6, h: 4 },
        colors: { body: '#FF69B4', segments: '#DC143C', eyes: '#000000' },
        pattern: [
            '██████',
            '█•██•█',
            '██████',
            '██████'
        ],
        animations: {
            idle: [0, 1],
            walk: [0, 1, 2],
            split: [3, 4, 5]
        },
        effects: ['segment_pulse'],
        frameRate: 100
    },
    
    MIRROR_WRAITH: {
        type: 'pixel_pattern',
        size: { w: 12, h: 14 },
        colors: { body: '#C0C0C0', mirror: '#E6E6FA', reflection: '#DCDCDC', eyes: '#4169E1' },
        pattern: [
            '  ████████  ',
            ' ██████████ ',
            '████••██████',
            '████████████',
            '████████████',
            '████████████',
            '████████████',
            '████████████',
            ' ██████████ ',
            '  ████████  ',
            '   ██████   ',
            '   ██  ██   ',
            '  ██    ██  ',
            ' ██      ██ '
        ],
        animations: {
            idle: [0, 1, 2],
            walk: [0, 1],
            mirror: [3, 4],
            attack: [5]
        },
        effects: ['mirror_shine', 'reflection_trail'],
        frameRate: 200
    },
    
    VOID_WALKER: {
        type: 'pixel_pattern',
        size: { w: 11, h: 13 },
        colors: { void: '#4B0082', energy: '#9400D3', eyes: '#8A2BE2', cracks: '#DDA0DD' },
        pattern: [
            '   █████   ',
            '  ███████  ',
            ' █████████ ',
            '███••█••███',
            '███████████',
            '███████████',
            '███████████',
            '███████████',
            '███████████',
            ' █████████ ',
            '  ███████  ',
            '   █████   ',
            '   ██ ██   '
        ],
        animations: {
            idle: [0, 1],
            walk: [0, 1],
            phase: [2, 3, 4],
            teleport: [5, 6, 7]
        },
        effects: ['void_energy', 'reality_distortion'],
        frameRate: 180
    },
    
    // BOSS精灵数据
    SKELETON_KING: {
        type: 'boss_sprite',
        size: { w: 32, h: 32 },
        colors: { bone: '#F0F0F0', crown: '#FFD700', eyes: '#FF0000', cracks: '#8B0000' },
        layers: [
            'base_skull',    // 基础头骨
            'crown',         // 王冠
            'eyes',          // 发光眼睛
            'cracks'         // 血量低时的裂纹
        ],
        animations: {
            idle: [0, 1],
            summon: [2, 3, 4],
            attack: [5, 6],
            hurt: [7]
        },
        effects: ['royal_aura', 'bone_fragments'],
        phases: {
            healthy: { colors: 'normal', effects: ['royal_aura'] },
            damaged: { colors: 'cracked', effects: ['royal_aura', 'bone_fragments'] }
        },
        frameRate: 300
    },
    
    ELEMENTAL_TITAN: {
        type: 'boss_sprite',
        size: { w: 40, h: 40 },
        colors: { 
            core: '#FF69B4', 
            fire: '#FF4500', 
            ice: '#87CEEB', 
            poison: '#9ACD32',
            lightning: '#FFFF00'
        },
        layers: [
            'energy_core',
            'elemental_orbs',
            'energy_field',
            'power_ring'
        ],
        animations: {
            idle: [0, 1, 2],
            cast_fire: [3, 4],
            cast_ice: [5, 6],
            ultimate: [7, 8, 9]
        },
        effects: ['element_rotation', 'power_pulse'],
        frameRate: 250
    },
    
    SHADOW_DRAGON: {
        type: 'boss_sprite',
        size: { w: 48, h: 36 },
        colors: { 
            scales: '#4B0082', 
            shadow: '#191970', 
            eyes: '#9400D3', 
            breath: '#8A2BE2',
            wings: '#483D8B'
        },
        layers: [
            'dragon_body',
            'wings',
            'eyes',
            'shadow_aura'
        ],
        animations: {
            idle: [0, 1],
            fly: [2, 3, 4],
            breath: [5, 6],
            dive: [7, 8]
        },
        effects: ['shadow_trail', 'wing_beat', 'darkness_aura'],
        frameRate: 200
    },
    
    MECHANICAL_BEAST: {
        type: 'boss_sprite',
        size: { w: 50, h: 38 },
        colors: { 
            metal: '#696969', 
            energy: '#00FFFF', 
            laser: '#FF0000', 
            spark: '#FFFF00',
            core: '#4169E1'
        },
        layers: [
            'chassis',
            'weapons',
            'energy_core',
            'exhaust'
        ],
        animations: {
            idle: [0, 1],
            move: [2, 3],
            charge: [4, 5],
            overload: [6, 7, 8]
        },
        effects: ['mech_glow', 'exhaust_smoke', 'spark_shower'],
        frameRate: 180
    },
    
    VOID_SOVEREIGN: {
        type: 'boss_sprite',
        size: { w: 60, h: 60 },
        colors: { 
            void: '#191970', 
            energy: '#9400D3', 
            portal: '#8A2BE2', 
            reality: '#DDA0DD',
            eye: '#E6E6FA'
        },
        layers: [
            'void_body',
            'energy_tentacles',
            'reality_cracks',
            'dimensional_eye'
        ],
        animations: {
            idle: [0, 1, 2],
            cast: [3, 4, 5],
            rift: [6, 7, 8],
            ultimate: [9, 10, 11, 12]
        },
        effects: ['reality_distort', 'void_portal', 'dimension_tear'],
        frameRate: 220
    }
};

// === 像素精灵渲染器类 ===
class PixelSpriteRenderer {
    constructor() {
        this.spriteCache = new Map();
        this.animationFrames = new Map();
        this.animationTimers = new Map();
        this.canvasCache = new Map(); // 离屏canvas缓存
        this.frameTime = Date.now();
    }
    
    // 获取或创建离屏canvas缓存
    getCachedCanvas(cacheKey, width, height, drawFunction) {
        if (!this.canvasCache.has(cacheKey)) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            drawFunction(ctx);
            this.canvasCache.set(cacheKey, canvas);
        }
        return this.canvasCache.get(cacheKey);
    }
    
    // 获取当前动画帧
    getCurrentAnimationFrame(enemy, animationType) {
        const enemyId = enemy.type.name + '_' + (enemy.isElite ? 'elite' : 'normal');
        const animKey = enemyId + '_' + animationType;
        
        if (!this.animationTimers.has(animKey)) {
            this.animationTimers.set(animKey, { frame: 0, lastUpdate: Date.now() });
        }
        
        const animData = this.animationTimers.get(animKey);
        const sprite = this.getSpriteForEnemy(enemy);
        
        if (sprite && sprite.animations && sprite.animations[animationType]) {
            const frames = sprite.animations[animationType];
            const now = Date.now();
            const frameRate = sprite.frameRate || 200; // 默认200ms每帧
            
            if (now - animData.lastUpdate > frameRate) {
                animData.frame = (animData.frame + 1) % frames.length;
                animData.lastUpdate = now;
            }
            
            return frames[animData.frame];
        }
        
        return 0;
    }
    
    // 根据敌人获取对应的精灵数据
    getSpriteForEnemy(enemy) {
        const enemyType = enemy.type.name;
        let spriteKey = null;
        
        // 映射敌人名称到精灵键
        switch (enemyType) {
            case '骷髅兵': spriteKey = 'SKELETON'; break;
            case '地精战士': spriteKey = 'GOBLIN_WARRIOR'; break;
            case '毒蛛': spriteKey = 'SPIDER'; break;
            case '火元素': spriteKey = 'FIRE_ELEMENTAL'; break;
            case '冰元素': spriteKey = 'ICE_ELEMENTAL'; break;
            case '僵尸': spriteKey = 'ZOMBIE'; break;
            case '蝙蝠': spriteKey = 'BAT'; break;
            case '幽灵': spriteKey = 'GHOST'; break;
            case '狼人': spriteKey = 'WEREWOLF'; break;
            case '吸血鬼': spriteKey = 'VAMPIRE'; break;
            case '恶魔': spriteKey = 'DEMON'; break;
            case '飞行魔眼': spriteKey = 'FLYING_EYE'; break;
            case '骷髅弓箭手': spriteKey = 'ARCHER'; break;
            case '萨满': spriteKey = 'SHAMAN'; break;
            case '毒蘑菇': spriteKey = 'POISON_MUSHROOM'; break;
            case '岩石傀儡': spriteKey = 'ROCK_GOLEM'; break;
            case '暗影刺客': spriteKey = 'SHADOW_ASSASSIN'; break;
            case '巨型蜘蛛': spriteKey = 'GIANT_SPIDER'; break;
            case '炎魔': spriteKey = 'FLAME_DEMON'; break;
            case '冰霜巫师': spriteKey = 'ICE_WIZARD'; break;
            case '寄生虫': spriteKey = 'PARASITE'; break;
            case '镜像怪': spriteKey = 'MIRROR_WRAITH'; break;
            case '虚空行者': spriteKey = 'VOID_WALKER'; break;
            // BOSS
            case '巨型骷髅王': spriteKey = 'SKELETON_KING'; break;
            case '元素泰坦': spriteKey = 'ELEMENTAL_TITAN'; break;
            case '暗影龙': spriteKey = 'SHADOW_DRAGON'; break;
            case '机械巨兽': spriteKey = 'MECHANICAL_BEAST'; break;
            case '虚空君主': spriteKey = 'VOID_SOVEREIGN'; break;
            default:
                return null;
        }
        
        return EnemySprites[spriteKey] || null;
    }
    
    // 主要渲染方法 - 自动选择渲染类型
    renderEnemy(ctx, enemy, time) {
        const sprite = this.getSpriteForEnemy(enemy);
        if (!sprite) {
            // 如果没有精灵数据，回退到原始渲染
            this.renderFallback(ctx, enemy);
            return;
        }
        
        // 根据敌人状态选择动画类型
        let animationType = 'idle';
        if (enemy.behaviorTimer !== undefined && enemy.behaviorTimer < 30) {
            animationType = 'attack';
        } else if (enemy.lastDirection && (Math.abs(enemy.lastDirection.x) > 0.1 || Math.abs(enemy.lastDirection.y) > 0.1)) {
            animationType = 'walk';
        }
        
        // 渲染精灵效果（光环、状态等）
        this.renderSpriteEffects(ctx, sprite, enemy, time, animationType);
        
        // 根据精灵类型选择渲染方法
        switch (sprite.type) {
            case 'pixel_pattern':
                this.renderPixelPatternEnemy(ctx, sprite, enemy, animationType);
                break;
            case 'particle_sprite':
                this.renderParticleSprite(ctx, sprite, enemy, time);
                break;
            case 'crystal_sprite':
                this.renderCrystalSprite(ctx, sprite, enemy, time);
                break;
            case 'boss_sprite':
                this.renderBossSprite(ctx, sprite, enemy, time);
                break;
            default:
                this.renderFallback(ctx, enemy);
        }
        
        // 渲染状态指示器
        this.renderStatusIndicators(ctx, enemy, time);
    }
    
    // 渲染像素图案敌人（改进版）
    renderPixelPatternEnemy(ctx, sprite, enemy, animationType) {
        const x = enemy.x + enemy.getWidth() / 2;
        const y = enemy.y + enemy.getHeight() / 2;
        const scale = enemy.getWidth() / sprite.size.w;
        
        // 检查是否为精英
        const isElite = enemy.type.isElite || enemy.isElite;
        
        // 精英敌人特效
        if (isElite) {
            this.renderEliteEffects(ctx, x, y, enemy.getWidth(), Date.now());
        }
        
        // 渲染主体
        this.renderPixelPattern(ctx, sprite, x, y, scale);
        
        // 精英敌人额外装饰
        if (isElite) {
            this.renderEliteBorder(ctx, x, y, enemy.getWidth(), scale);
        }
    }
    
    // 渲染像素图案
    renderPixelPattern(ctx, sprite, x, y, scale = 1) {
        const { pattern, colors, size } = sprite;
        const pixelSize = 2 * scale; // 每个像素的渲染大小
        
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                const char = pattern[row][col];
                let color = null;
                
                switch (char) {
                    case '█': color = colors.primary || colors.skin || colors.body || colors.bone || colors.rock; break;
                    case '•': color = colors.eyes; break;
                    case '▲': color = colors.weapon || colors.claws || colors.fangs || colors.horns; break;
                    case '▼': color = colors.shadow || colors.blood || colors.spots; break;
                    case ' ': continue; // 透明像素
                }
                
                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(
                        x - (size.w * pixelSize) / 2 + col * pixelSize,
                        y - (size.h * pixelSize) / 2 + row * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }
    }
    
    // 渲染精英效果
    renderEliteEffects(ctx, x, y, size, time) {
        const radius = size / 2 + Math.sin(time * 0.003) * 3;
        
        // 金色光环
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.lineDashOffset = time * 0.01;
        ctx.beginPath();
        ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        
        // 能量粒子
        const particleCount = 4;
        for (let i = 0; i < particleCount; i++) {
            const angle = (time * 0.002 + i * (Math.PI * 2) / particleCount);
            const px = x + Math.cos(angle) * (radius + 10);
            const py = y + Math.sin(angle) * (radius + 10);
            
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(px, py, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 渲染精英边框
    renderEliteBorder(ctx, x, y, size, scale) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = Math.max(1, scale);
        ctx.strokeRect(
            x - size / 2 - 2,
            y - size / 2 - 2,
            size + 4,
            size + 4
        );
    }
    
    // 渲染粒子精灵（火元素等）
    renderParticleSprite(ctx, sprite, enemy, time) {
        const { size, colors, corePattern } = sprite;
        const x = enemy.x + enemy.getWidth() / 2;
        const y = enemy.y + enemy.getHeight() / 2;
        const scale = enemy.getWidth() / size.w;
        
        // 渲染核心
        this.renderPixelPattern(ctx, {
            pattern: corePattern,
            colors: { primary: colors.core },
            size: size
        }, x, y, scale);
        
        // 渲染环绕粒子
        const particleCount = 8;
        const radius = enemy.getWidth() / 2 + 5;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (time * 0.05 + i * (Math.PI * 2) / particleCount);
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            ctx.fillStyle = colors.particles;
            ctx.fillRect(px - 1, py - 1, 2, 2);
        }
    }
    
    // 渲染水晶精灵（冰元素等）
    renderCrystalSprite(ctx, sprite, enemy, time) {
        const x = enemy.x + enemy.getWidth() / 2;
        const y = enemy.y + enemy.getHeight() / 2;
        const { colors, pattern, size } = sprite;
        const scale = enemy.getWidth() / size.w;
        
        // 主体水晶
        this.renderPixelPattern(ctx, sprite, x, y, scale);
        
        // 冰霜光环效果
        const glowRadius = enemy.getWidth() / 2 + Math.sin(time * 0.03) * 3;
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = colors.glow;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    
    // 渲染BOSS精灵
    renderBossSprite(ctx, sprite, boss, time) {
        const x = boss.x + boss.getWidth() / 2;
        const y = boss.y + boss.getHeight() / 2;
        const { size, colors, layers } = sprite;
        const scale = boss.getWidth() / size.w;
        
        // 根据BOSS血量选择阶段
        const healthPercent = boss.health / boss.maxHealth;
        const currentPhase = healthPercent > 0.5 ? 'healthy' : 'damaged';
        const phaseData = sprite.phases && sprite.phases[currentPhase];
        
        // 渲染各个层级
        if (layers) {
            layers.forEach(layer => {
                this.renderBossLayer(ctx, sprite, layer, x, y, scale, colors, phaseData, time);
            });
        }
        
        // 特殊效果
        this.renderBossEffects(ctx, sprite, boss, x, y, time);
    }
    
    // 渲染BOSS层级
    renderBossLayer(ctx, sprite, layerName, x, y, scale, colors, phaseData, time) {
        switch (layerName) {
            case 'base_skull':
                this.renderSkullBase(ctx, x, y, scale, colors, phaseData);
                break;
            case 'crown':
                this.renderCrown(ctx, x, y, scale, colors.crown, time);
                break;
            case 'eyes':
                this.renderGlowingEyes(ctx, x, y, scale, colors.eyes, time);
                break;
            case 'cracks':
                if (phaseData && phaseData.colors === 'cracked') {
                    this.renderCracks(ctx, x, y, scale, colors.cracks);
                }
                break;
            case 'energy_core':
                this.renderEnergyCore(ctx, x, y, scale, colors.core, time);
                break;
            case 'elemental_orbs':
                this.renderElementalOrbs(ctx, x, y, scale, colors, time);
                break;
            // 添加更多BOSS层级渲染...
        }
    }
    
    // 渲染头骨基础
    renderSkullBase(ctx, x, y, scale, colors, phaseData) {
        const pixelSize = 2 * scale;
        const skullPattern = [
            '  ██████████████████  ',
            ' ████████████████████ ',
            '██████████████████████',
            '██████████████████████',
            '██████████████████████',
            '██████████████████████',
            '██████████████████████',
            '██████████████████████',
            ' ████████████████████ ',
            '  ██████████████████  ',
            '   ████████████████   ',
            '    ██████████████    ',
            '     ████████████     ',
            '      ██████████      ',
            '       ████████       ',
            '        ██████        '
        ];
        
        const color = phaseData && phaseData.colors === 'cracked' ? '#E0E0E0' : colors.bone;
        
        for (let row = 0; row < skullPattern.length; row++) {
            for (let col = 0; col < skullPattern[row].length; col++) {
                if (skullPattern[row][col] === '█') {
                    ctx.fillStyle = color;
                    ctx.fillRect(
                        x - (skullPattern[0].length * pixelSize) / 2 + col * pixelSize,
                        y - (skullPattern.length * pixelSize) / 2 + row * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }
    }
    
    // 渲染王冠
    renderCrown(ctx, x, y, scale, crownColor, time) {
        const pixelSize = 2 * scale;
        const crownPattern = [
            ' ▲ ▲ ▲ ▲ ▲ ',
            '█████████████',
            '█████████████',
            ' ███████████ '
        ];
        
        // 王冠发光效果
        const glowIntensity = Math.sin(time * 0.02) * 0.3 + 0.7;
        ctx.save();
        ctx.shadowColor = crownColor;
        ctx.shadowBlur = 8 * glowIntensity;
        
        for (let row = 0; row < crownPattern.length; row++) {
            for (let col = 0; col < crownPattern[row].length; col++) {
                const char = crownPattern[row][col];
                if (char === '█' || char === '▲') {
                    ctx.fillStyle = crownColor;
                    ctx.fillRect(
                        x - (crownPattern[0].length * pixelSize) / 2 + col * pixelSize,
                        y - (16 * pixelSize) - (crownPattern.length * pixelSize) / 2 + row * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }
        ctx.restore();
    }
    
    // 渲染发光眼睛
    renderGlowingEyes(ctx, x, y, scale, eyeColor, time) {
        const pixelSize = 2 * scale;
        const glowIntensity = Math.sin(time * 0.08) * 0.4 + 0.6;
        
        ctx.save();
        ctx.shadowColor = eyeColor;
        ctx.shadowBlur = 12 * glowIntensity;
        ctx.fillStyle = eyeColor;
        
        // 左眼
        ctx.fillRect(x - 8 * pixelSize, y - 2 * pixelSize, 3 * pixelSize, 3 * pixelSize);
        // 右眼
        ctx.fillRect(x + 5 * pixelSize, y - 2 * pixelSize, 3 * pixelSize, 3 * pixelSize);
        
        ctx.restore();
    }
    
    // 渲染裂纹
    renderCracks(ctx, x, y, scale, crackColor) {
        const pixelSize = 2 * scale;
        ctx.strokeStyle = crackColor;
        ctx.lineWidth = pixelSize;
        
        // 绘制裂纹线条
        ctx.beginPath();
        ctx.moveTo(x - 10 * pixelSize, y - 5 * pixelSize);
        ctx.lineTo(x - 5 * pixelSize, y + 3 * pixelSize);
        ctx.moveTo(x + 8 * pixelSize, y - 8 * pixelSize);
        ctx.lineTo(x + 3 * pixelSize, y - 2 * pixelSize);
        ctx.stroke();
    }
    
    // 渲染能量核心
    renderEnergyCore(ctx, x, y, scale, coreColor, time) {
        const pulseSize = Math.sin(time * 0.01) * 5 + 15;
        
        ctx.save();
        ctx.globalAlpha = 0.8;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseSize * scale);
        gradient.addColorStop(0, coreColor);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // 渲染元素球
    renderElementalOrbs(ctx, x, y, scale, colors, time) {
        const orbCount = 4;
        const radius = 30 * scale;
        const elements = ['fire', 'ice', 'poison', 'lightning'];
        
        for (let i = 0; i < orbCount; i++) {
            const angle = (time * 0.01 + i * (Math.PI * 2) / orbCount);
            const orbX = x + Math.cos(angle) * radius;
            const orbY = y + Math.sin(angle) * radius;
            
            ctx.fillStyle = colors[elements[i]];
            ctx.beginPath();
            ctx.arc(orbX, orbY, 4 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 渲染BOSS特效
    renderBossEffects(ctx, sprite, boss, x, y, time) {
        if (sprite.effects) {
            sprite.effects.forEach(effectName => {
                switch (effectName) {
                    case 'royal_aura':
                        this.renderRoyalAura(ctx, x, y, boss.getWidth(), time);
                        break;
                    case 'bone_fragments':
                        this.renderBoneFragments(ctx, x, y, time);
                        break;
                    case 'element_rotation':
                        this.renderElementRotation(ctx, x, y, boss.getWidth(), time);
                        break;
                    case 'power_pulse':
                        this.renderPowerPulse(ctx, x, y, boss.getWidth(), time);
                        break;
                }
            });
        }
    }
    
    // 渲染皇家光环
    renderRoyalAura(ctx, x, y, size, time) {
        const radius = size / 2 + Math.sin(time * 0.02) * 5;
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = time * 0.1;
        ctx.beginPath();
        ctx.arc(x, y, radius + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    
    // 渲染骨头碎片
    renderBoneFragments(ctx, x, y, time) {
        const fragmentCount = 6;
        ctx.fillStyle = '#F0F0F0';
        
        for (let i = 0; i < fragmentCount; i++) {
            const angle = time * 0.03 + i * (Math.PI * 2) / fragmentCount;
            const radius = 30 + Math.sin(time * 0.02 + i) * 10;
            const fx = x + Math.cos(angle) * radius;
            const fy = y + Math.sin(angle) * radius;
            
            ctx.fillRect(fx - 1, fy - 1, 2, 2);
        }
    }
    
    // 渲染元素旋转
    renderElementRotation(ctx, x, y, size, time) {
        const orbCount = 4;
        const radius = size / 2 + 15;
        const colors = ['#FF4500', '#87CEEB', '#9ACD32', '#FFFF00'];
        
        for (let i = 0; i < orbCount; i++) {
            const angle = (time * 0.005 + i * (Math.PI * 2) / orbCount);
            const orbX = x + Math.cos(angle) * radius;
            const orbY = y + Math.sin(angle) * radius;
            
            ctx.save();
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.arc(orbX, orbY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // 渲染能量脉冲
    renderPowerPulse(ctx, x, y, size, time) {
        const pulseRadius = (Math.sin(time * 0.008) + 1) * size / 4 + size / 3;
        
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    
    // 渲染精灵效果
    renderSpriteEffects(ctx, sprite, enemy, time, animationType) {
        if (!sprite.effects) return;
        
        const x = enemy.x + enemy.getWidth() / 2;
        const y = enemy.y + enemy.getHeight() / 2;
        
        sprite.effects.forEach(effectName => {
            switch (effectName) {
                case 'glow_eyes':
                    this.renderGlowingEyesEffect(ctx, x, y, time);
                    break;
                case 'weapon_flash':
                    if (animationType === 'attack') {
                        this.renderWeaponFlash(ctx, x, y, enemy.getWidth());
                    }
                    break;
                case 'leg_crawl':
                    this.renderCrawlingEffect(ctx, x, y, time);
                    break;
                case 'fire_particles':
                    this.renderFireParticles(ctx, x, y, time);
                    break;
                case 'heat_distortion':
                    this.renderHeatDistortion(ctx, x, y, enemy.getWidth(), time);
                    break;
                case 'frost_aura':
                    this.renderFrostAura(ctx, x, y, enemy.getWidth(), time);
                    break;
                case 'crystal_sparkle':
                    this.renderCrystalSparkle(ctx, x, y, time);
                    break;
            }
        });
    }
    
    // 各种特效渲染方法
    renderGlowingEyesEffect(ctx, x, y, time) {
        const intensity = Math.sin(time * 0.005) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#FF0000';
        // 简化的眼睛效果
        ctx.fillRect(x - 6, y - 3, 2, 2);
        ctx.fillRect(x + 4, y - 3, 2, 2);
        ctx.restore();
    }
    
    renderWeaponFlash(ctx, x, y, size) {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + size/2 - 2, y - 2, 8, 4);
        ctx.restore();
    }
    
    renderCrawlingEffect(ctx, x, y, time) {
        // 蜘蛛腿部移动效果
        const legOffset = Math.sin(time * 0.01) * 2;
        ctx.strokeStyle = '#1C1C1C';
        ctx.lineWidth = 1;
        
        // 简化的腿部动画
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2 / 3);
            const legX = x + Math.cos(angle) * 8;
            const legY = y + Math.sin(angle) * 8 + legOffset;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(legX, legY);
            ctx.stroke();
        }
    }
    
    renderFireParticles(ctx, x, y, time) {
        const particleCount = 6;
        for (let i = 0; i < particleCount; i++) {
            const angle = (time * 0.01 + i * (Math.PI * 2) / particleCount);
            const radius = 15 + Math.sin(time * 0.02 + i) * 5;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            ctx.fillStyle = i % 2 === 0 ? '#FF4500' : '#FFA500';
            ctx.fillRect(px - 1, py - 1, 2, 2);
        }
    }
    
    renderHeatDistortion(ctx, x, y, size, time) {
        // 热变形效果（简化版）
        ctx.save();
        ctx.globalAlpha = 0.2;
        const distortion = Math.sin(time * 0.01) * 2;
        ctx.translate(distortion, 0);
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size/2 + 5);
        gradient.addColorStop(0, 'rgba(255, 100, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size/2 + 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    renderFrostAura(ctx, x, y, size, time) {
        const radius = size / 2 + Math.sin(time * 0.003) * 2;
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // 冰晶效果
        for (let i = 0; i < 6; i++) {
            const angle = (time * 0.001 + i * (Math.PI * 2) / 6);
            const px = x + Math.cos(angle) * (radius + 8);
            const py = y + Math.sin(angle) * (radius + 8);
            
            ctx.fillStyle = '#B0E0E6';
            ctx.fillRect(px - 1, py - 1, 2, 2);
        }
        ctx.restore();
    }
    
    renderCrystalSparkle(ctx, x, y, time) {
        for (let i = 0; i < 4; i++) {
            const sparkleTime = time * 0.005 + i * 0.5;
            const intensity = Math.sin(sparkleTime) * 0.5 + 0.5;
            
            if (intensity > 0.7) {
                const angle = i * (Math.PI * 2) / 4;
                const px = x + Math.cos(angle) * 12;
                const py = y + Math.sin(angle) * 12;
                
                ctx.save();
                ctx.globalAlpha = intensity;
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(px - 1, py - 1, 2, 2);
                ctx.restore();
            }
        }
    }
    
    // 渲染状态指示器
    renderStatusIndicators(ctx, enemy, time) {
        const x = enemy.x + enemy.getWidth() / 2;
        const y = enemy.y - 5;
        
        let iconX = x - 8;
        
        // 检查各种状态
        if (enemy.frozen) {
            this.renderStatusIcon(ctx, iconX, y, '❄️', '#87CEEB');
            iconX += 12;
        }
        
        if (enemy.burning) {
            this.renderStatusIcon(ctx, iconX, y, '🔥', '#FF4500');
            iconX += 12;
        }
        
        if (enemy.poisoned) {
            this.renderStatusIcon(ctx, iconX, y, '☣️', '#9ACD32');
            iconX += 12;
        }
        
        if (enemy.stunned) {
            this.renderStatusIcon(ctx, iconX, y, '💫', '#FFD700');
            iconX += 12;
        }
    }
    
    // 渲染状态图标
    renderStatusIcon(ctx, x, y, icon, color) {
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 图标阴影
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 3;
        ctx.fillText(icon, x, y);
        ctx.restore();
    }
    
    // 回退渲染（原始方法）
    renderFallback(ctx, enemy) {
        const enemyType = enemy.type;
        const isHit = enemy.isHit > 0 && enemy.isHit % 4 < 2;
        
        ctx.save();
        
        if (isHit) {
            ctx.globalAlpha = 0.5;
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 20;
        }
        
        if (enemyType.icon) {
            ctx.font = `${enemy.getWidth()}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = enemyType.color;
            ctx.fillText(enemyType.icon, 
                enemy.x + enemy.getWidth()/2, 
                enemy.y + enemy.getHeight()/2
            );
        } else {
            const gradient = ctx.createRadialGradient(
                enemy.x + enemy.getWidth()/2, 
                enemy.y + enemy.getHeight()/2, 
                0,
                enemy.x + enemy.getWidth()/2, 
                enemy.y + enemy.getHeight()/2, 
                enemy.getWidth()/2
            );
            gradient.addColorStop(0, enemyType.color);
            gradient.addColorStop(0.7, enemyType.color);
            gradient.addColorStop(1, '#000000');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(enemy.x, enemy.y, enemy.getWidth(), enemy.getHeight());
        }
        
        ctx.restore();
    }
    
    // 清理缓存
    clearCache() {
        this.spriteCache.clear();
        this.animationTimers.clear();
        this.canvasCache.clear();
    }
}

// 全局精灵渲染器实例
const spriteRenderer = new PixelSpriteRenderer();