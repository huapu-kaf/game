// 输入处理系统

// 创建键盘状态跟踪对象
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

// 初始化输入系统（在游戏启动后调用）
function initInputSystem() {
    // 键盘事件监听
    document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    
    // 优先检查升级菜单状态
    if (typeof isUpgradeMenuOpen !== 'undefined' && isUpgradeMenuOpen) {
        // 升级选择菜单
        if (key === '1' && typeof selectUpgrade !== 'undefined') {
            selectUpgrade(0);
        } else if (key === '2' && typeof selectUpgrade !== 'undefined') {
            selectUpgrade(1);
        } else if (key === '3' && typeof selectUpgrade !== 'undefined') {
            selectUpgrade(2);
        }
    } else if (gameState === GameStates.CHARACTER_SELECT) {
        // 角色选择阶段
        if (key === '1') {
            if (typeof selectCharacter !== 'undefined') {
                selectCharacter('warrior');
            }
        } else if (key === '2') {
            if (typeof selectCharacter !== 'undefined') {
                selectCharacter('mage');
            }
        } else if (key === '3') {
            if (typeof selectCharacter !== 'undefined') {
                selectCharacter('ranger');
            }
        }
    } else if (gameState === GameStates.WEAPON_SELECT) {
        // 武器选择阶段
        if (key === KeyBindings.WEAPON_1) {
            selectedWeapon = 'missile';
            weapons.missile.level = 1;
            startGame();
        } else if (key === KeyBindings.WEAPON_2) {
            selectedWeapon = 'fireball';
            weapons.fireball.level = 1;
            startGame();
        } else if (key === KeyBindings.WEAPON_3) {
            selectedWeapon = 'frostbolt';
            weapons.frostbolt.level = 1;
            startGame();
        }
    } else if (gameState === GameStates.PLAYING) {
        // 游戏进行中
        if (key in keys) {
            keys[key] = true;
        } else if (key === KeyBindings.TOGGLE_MUSIC) {
            // 切换背景音乐
            audioManager.toggleMusic();
        } else if (key === KeyBindings.TOGGLE_SFX) {
            // 切换音效
            audioManager.toggleSfx();
        }
    } else if (gameState === GameStates.GAME_OVER) {
        // 游戏结束
        if (key === KeyBindings.RESTART) {
            restartGame();
        }
    }
    });

    document.addEventListener('keyup', (event) => {
        const key = event.key.toLowerCase();
        if (gameState === GameStates.PLAYING && key in keys) {
            keys[key] = false;
        }
    });
}