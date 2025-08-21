// 音频管理系统
class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = GameConfig.AUDIO.DEFAULT_MUSIC_VOLUME;
        this.sfxVolume = GameConfig.AUDIO.DEFAULT_SFX_VOLUME;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.currentMusic = null;
        this.loadSounds();
    }
    
    loadSounds() {
        const soundFiles = GameConfig.AUDIO.SOUND_FILES;
        
        for (let [name, path] of Object.entries(soundFiles)) {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.volume = name === 'background' ? this.musicVolume : this.sfxVolume;
            audio.loop = name === 'background';
            
            // 处理加载错误，避免缺少音频文件时中断游戏
            audio.onerror = () => {
                console.log(`音频文件加载失败: ${path}`);
                this.sounds[name] = null;
            };
            
            audio.oncanplaythrough = () => {
                console.log(`音频文件加载成功: ${path}`);
            };
            
            audio.src = path;
            this.sounds[name] = audio;
        }
    }
    
    playSound(name, volume = 1.0) {
        if (!this.sfxEnabled || !this.sounds[name]) return;
        
        try {
            const sound = this.sounds[name].cloneNode();
            sound.volume = this.sfxVolume * volume;
            sound.play().catch(e => console.log(`播放音效失败: ${name}`));
        } catch (e) {
            console.log(`音效播放错误: ${name}`);
        }
    }
    
    playMusic(name) {
        if (!this.musicEnabled || !this.sounds[name]) return;
        
        // 停止当前音乐
        this.stopMusic();
        
        try {
            this.currentMusic = this.sounds[name];
            this.currentMusic.volume = this.musicVolume;
            this.currentMusic.currentTime = 0;
            this.currentMusic.play().catch(e => console.log(`播放背景音乐失败: ${name}`));
        } catch (e) {
            console.log(`背景音乐播放错误: ${name}`);
        }
    }
    
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume;
        }
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopMusic();
        } else if (typeof gameState !== 'undefined' && gameState === GameStates.PLAYING) {
            this.playMusic('background');
        }
    }
    
    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
    }
}

// AudioManager 类定义完成