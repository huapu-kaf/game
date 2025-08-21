// 资源管理系统
const assets = {
    player: null,
    enemy: null,
    bullet: null,
    loaded: false
};

// 创建程序化精灵（如果没有图片文件的话）
function createProgrammaticSprites() {
    // 创建玩家精灵 - 蓝色骑士
    const playerCanvas = document.createElement('canvas');
    playerCanvas.width = GameConfig.PLAYER.WIDTH;
    playerCanvas.height = GameConfig.PLAYER.HEIGHT;
    const playerCtx = playerCanvas.getContext('2d');
    
    // 绘制玩家 - 盔甲骑士风格
    playerCtx.fillStyle = '#4A90E2';
    playerCtx.fillRect(8, 5, 14, 20); // 身体
    playerCtx.fillStyle = '#2E5C8A';
    playerCtx.fillRect(10, 2, 10, 8); // 头盔
    playerCtx.fillStyle = '#FFD700';
    playerCtx.fillRect(12, 4, 6, 2); // 面罩
    playerCtx.fillStyle = '#8B4513';
    playerCtx.fillRect(5, 12, 20, 3); // 腰带
    assets.player = playerCanvas;
    
    // 创建敌人精灵 - 红色恶魔
    const enemyCanvas = document.createElement('canvas');
    enemyCanvas.width = 20;
    enemyCanvas.height = 20;
    const enemyCtx = enemyCanvas.getContext('2d');
    
    // 绘制敌人 - 恶魔风格
    enemyCtx.fillStyle = '#DC143C';
    enemyCtx.fillRect(6, 6, 8, 10); // 身体
    enemyCtx.fillStyle = '#8B0000';
    enemyCtx.fillRect(7, 3, 6, 6); // 头部
    enemyCtx.fillStyle = '#FF4500';
    enemyCtx.fillRect(4, 1, 3, 4); // 左角
    enemyCtx.fillRect(13, 1, 3, 4); // 右角
    enemyCtx.fillStyle = '#FFFF00';
    enemyCtx.fillRect(8, 5, 1, 1); // 左眼
    enemyCtx.fillRect(11, 5, 1, 1); // 右眼
    assets.enemy = enemyCanvas;
    
    // 创建子弹精灵 - 金色飞刀
    const bulletCanvas = document.createElement('canvas');
    bulletCanvas.width = 8;
    bulletCanvas.height = 8;
    const bulletCtx = bulletCanvas.getContext('2d');
    
    // 绘制子弹 - 飞刀风格
    bulletCtx.fillStyle = '#FFD700';
    bulletCtx.fillRect(2, 1, 4, 6); // 刀身
    bulletCtx.fillStyle = '#8B4513';
    bulletCtx.fillRect(3, 6, 2, 1); // 刀柄
    assets.bullet = bulletCanvas;
    
    assets.loaded = true;
}

// 加载资源函数
function loadAssets() {
    // 尝试加载真实图片，如果失败则使用程序化精灵
    let loadCount = 0;
    const totalAssets = 3;
    
    function checkAllLoaded() {
        loadCount++;
        if (loadCount === totalAssets) {
            assets.loaded = true;
            console.log('所有资源加载完成！');
        }
    }
    
    // 尝试加载玩家图片
    const playerImg = new Image();
    playerImg.onload = () => {
        assets.player = playerImg;
        checkAllLoaded();
    };
    playerImg.onerror = () => {
        console.log('未找到 player.png，使用程序化精灵');
        checkAllLoaded();
    };
    playerImg.src = 'player.png';
    
    // 尝试加载敌人图片
    const enemyImg = new Image();
    enemyImg.onload = () => {
        assets.enemy = enemyImg;
        checkAllLoaded();
    };
    enemyImg.onerror = () => {
        console.log('未找到 enemy.png，使用程序化精灵');
        checkAllLoaded();
    };
    enemyImg.src = 'enemy.png';
    
    // 尝试加载子弹图片
    const bulletImg = new Image();
    bulletImg.onload = () => {
        assets.bullet = bulletImg;
        checkAllLoaded();
    };
    bulletImg.onerror = () => {
        console.log('未找到 bullet.png，使用程序化精灵');
        checkAllLoaded();
    };
    bulletImg.src = 'bullet.png';
    
    // 如果图片加载失败，立即创建程序化精灵
    setTimeout(() => {
        if (!assets.loaded) {
            console.log('使用程序化精灵替代图片');
            createProgrammaticSprites();
        }
    }, 500); // 给图片0.5秒加载时间
    
    // 立即创建程序化精灵作为后备
    createProgrammaticSprites();
}