// Music Player v2 - macOS Dock Style with Auto-Hide
class MusicPlayer {
    constructor() {
        this.ytPlayer = null;
        this.ytReady = false;
        this.queue = [];
        this.currentIndex = -1;
        this.isPlaying = false;
        this.repeatMode = 0;
        this.volume = 80;
        this.isHidden = false;
        this.searchTimeout = null;
        this.progressInterval = null;
        
        this.init();
    }
    
    init() {
        // Prevent duplicate player creation
        if (document.getElementById('music-player')) {
            console.log('Music player already exists, skipping creation');
            return;
        }
        
        this.createPlayerHTML();
        this.bindEvents();
        this.loadFromStorage();
        
        this.loadYouTubeAPI().then(() => {
            this.initYouTubePlayer();
        }).catch(err => {
            console.warn('YouTube API failed:', err);
            if (this.elements.title) {
                this.elements.title.textContent = 'YouTube unavailable';
            }
        });
    }
    
    loadYouTubeAPI(retries = 3) {
        return new Promise((resolve, reject) => {
            if (window.YT && window.YT.Player) { resolve(); return; }
            
            const load = (attempt) => {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                tag.onerror = () => {
                    if (attempt > 0) {
                        console.warn(`YouTube API load failed, retrying... (${attempt} left)`);
                        setTimeout(() => load(attempt - 1), 1000);
                    } else {
                        reject(new Error('Failed to load YouTube API')); 
                    }
                };
                document.head.appendChild(tag);
            };
            
            window.onYouTubeIframeAPIReady = () => resolve();
            load(retries);
        });
    }
    
    initYouTubePlayer() {
        if (!window.YT?.Player) return;
        this.ytPlayer = new YT.Player('yt-player', {
            height: '1', width: '1',
            playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, rel: 0 },
            events: {
                onReady: () => { this.ytReady = true; },
                onStateChange: (e) => this.onYTStateChange(e),
                onError: (e) => this.onYTError(e)
            }
        });
    }
    
    createPlayerHTML() {
        const html = `
        <div id="yt-player-container" style="position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;">
            <div id="yt-player"></div>
        </div>
        
        <!-- Compact Search Popup -->
        <div class="mp-search-popup" id="mp-search-popup">
            <div class="mp-popup-header">
                <span>Search Music</span>
                <button class="mp-popup-close" id="mp-search-close"><i class="fa-solid fa-times"></i></button>
            </div>
            <div class="mp-popup-search">
                <input type="text" id="mp-search-input" placeholder="Search songs..." class="mp-search-field">
                <button id="mp-search-btn" class="mp-search-go"><i class="fa-solid fa-search"></i></button>
            </div>
            <div class="mp-popup-results" id="mp-results-list"></div>
        </div>
        
        <!-- Queue/Playlist Popup -->
        <div class="mp-queue-popup" id="mp-queue-popup">
            <div class="mp-popup-header">
                <span>Queue</span>
                <button class="mp-popup-close" id="mp-queue-close"><i class="fa-solid fa-times"></i></button>
            </div>
            <div class="mp-queue-content" id="mp-queue-content">
                <div class="mp-queue-empty" id="mp-queue-empty">
                    <i class="fa-solid fa-music"></i>
                    <p>No songs in queue</p>
                </div>
                <div id="mp-queue-list"></div>
            </div>
        </div>
        
        <!-- Hidden Tab (when player is minimized) -->
        <div class="mp-hidden-tab" id="mp-hidden-tab">
            <i class="fa-solid fa-music"></i>
            <span id="mp-tab-title">Music</span>
        </div>
        
        <!-- Main Player Bar -->
        <div class="music-player" id="music-player">
            <button class="mp-minimize-btn" id="mp-minimize" title="Hide Player">
                <i class="fa-solid fa-chevron-down"></i>
            </button>
            
            <img class="mp-album-art" id="mp-album-art" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231a1a1a' width='100' height='100'/%3E%3Ccircle fill='%23333' cx='50' cy='50' r='35'/%3E%3Ccircle fill='%231a1a1a' cx='50' cy='50' r='12'/%3E%3C/svg%3E" alt="">
            
            <div class="mp-info">
                <div class="mp-title" id="mp-title">No song playing</div>
                <div class="mp-artist" id="mp-artist">Search to add music</div>
            </div>
            
            <div class="mp-controls">
                <button class="mp-btn" id="mp-prev" title="Previous"><i class="fa-solid fa-backward-step"></i></button>
                <button class="mp-btn play-pause" id="mp-play-pause" title="Play"><i class="fa-solid fa-play"></i></button>
                <button class="mp-btn" id="mp-next" title="Next"><i class="fa-solid fa-forward-step"></i></button>
                <button class="mp-btn" id="mp-repeat" title="Repeat"><i class="fa-solid fa-repeat"></i></button>
            </div>
            
            <div class="mp-progress-section">
                <span class="mp-time" id="mp-current-time">0:00</span>
                <div class="mp-progress" id="mp-progress">
                    <div class="mp-progress-fill" id="mp-progress-fill"></div>
                </div>
                <span class="mp-time" id="mp-duration">0:00</span>
            </div>
            
            <div class="mp-volume">
                <button class="mp-btn" id="mp-mute"><i class="fa-solid fa-volume-high"></i></button>
                <input type="range" id="mp-volume" min="0" max="100" value="80">
            </div>
            
            <div class="mp-right-btns">
                <button class="mp-btn" id="mp-search-toggle" title="Search"><i class="fa-solid fa-search"></i></button>
                <button class="mp-btn" id="mp-queue-toggle" title="Queue"><i class="fa-solid fa-list"></i></button>
            </div>
        </div>`;
        
        const container = document.getElementById('music-container') || document.body;
        container.insertAdjacentHTML('beforeend', html);
        
        this.elements = {
            player: document.getElementById('music-player'),
            hiddenTab: document.getElementById('mp-hidden-tab'),
            tabTitle: document.getElementById('mp-tab-title'),
            albumArt: document.getElementById('mp-album-art'),
            title: document.getElementById('mp-title'),
            artist: document.getElementById('mp-artist'),
            playPause: document.getElementById('mp-play-pause'),
            prev: document.getElementById('mp-prev'),
            next: document.getElementById('mp-next'),
            repeat: document.getElementById('mp-repeat'),
            progress: document.getElementById('mp-progress'),
            progressFill: document.getElementById('mp-progress-fill'),
            currentTime: document.getElementById('mp-current-time'),
            duration: document.getElementById('mp-duration'),
            mute: document.getElementById('mp-mute'),
            volume: document.getElementById('mp-volume'),
            minimize: document.getElementById('mp-minimize'),
            searchToggle: document.getElementById('mp-search-toggle'),
            queueToggle: document.getElementById('mp-queue-toggle'),
            searchPopup: document.getElementById('mp-search-popup'),
            searchInput: document.getElementById('mp-search-input'),
            searchBtn: document.getElementById('mp-search-btn'),
            searchClose: document.getElementById('mp-search-close'),
            resultsList: document.getElementById('mp-results-list'),
            queuePopup: document.getElementById('mp-queue-popup'),
            queueClose: document.getElementById('mp-queue-close'),
            queueList: document.getElementById('mp-queue-list'),
            queueEmpty: document.getElementById('mp-queue-empty')
        };
        
        this.elements.player.style.display = 'flex';
        this.updateNavButtons();
    }
    
    bindEvents() {
        // Play controls
        this.elements.playPause.addEventListener('click', () => this.togglePlay());
        this.elements.prev.addEventListener('click', () => this.playPrev());
        this.elements.next.addEventListener('click', () => this.playNext());
        this.elements.repeat.addEventListener('click', () => this.toggleRepeat());
        
        // Progress
        this.elements.progress.addEventListener('click', (e) => this.seek(e));
        
        // Volume
        this.elements.volume.addEventListener('input', (e) => this.setVolume(parseInt(e.target.value)));
        this.elements.mute.addEventListener('click', () => this.toggleMute());
        
        // Minimize/Show
        this.elements.minimize.addEventListener('click', () => this.hidePlayer());
        this.elements.hiddenTab.addEventListener('click', () => this.showPlayer());
        this.elements.hiddenTab.addEventListener('mouseenter', () => this.showPlayer());
        
        // Search popup
        this.elements.searchToggle.addEventListener('click', () => this.toggleSearchPopup());
        this.elements.searchClose.addEventListener('click', () => this.closeSearchPopup());
        this.elements.searchBtn.addEventListener('click', () => this.search());
        this.elements.searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.search(); });
        
        // Queue popup
        this.elements.queueToggle.addEventListener('click', () => this.toggleQueuePopup());
        this.elements.queueClose.addEventListener('click', () => this.closeQueuePopup());
        
        // Close popups on outside click
        document.addEventListener('click', (e) => {
            if (!this.elements.searchPopup.contains(e.target) && !this.elements.searchToggle.contains(e.target)) {
                this.closeSearchPopup();
            }
            if (!this.elements.queuePopup.contains(e.target) && !this.elements.queueToggle.contains(e.target)) {
                this.closeQueuePopup();
            }
        });
    }
    
    // ===== Auto-hide Dock Behavior =====
    hidePlayer() {
        this.isHidden = true;
        this.elements.player.classList.add('hidden');
        this.elements.hiddenTab.classList.add('visible');
        this.closeSearchPopup();
        this.closeQueuePopup();
    }
    
    showPlayer() {
        this.isHidden = false;
        this.elements.player.classList.remove('hidden');
        this.elements.hiddenTab.classList.remove('visible');
    }
    
    // ===== Search with Easter Egg =====
    async search() {
        const query = this.elements.searchInput.value.trim();
        if (!query) return;
        
        this.elements.resultsList.innerHTML = '<div class="mp-loading"><i class="fa-solid fa-spinner fa-spin"></i> Searching...</div>';
        
        // Easter egg timer
        const easterEggTimer = setTimeout(() => {
            this.elements.resultsList.innerHTML = '<div class="mp-easter-egg">bru ur internet is slow tf its just a search 😭 not even the song</div>';
        }, 5000);
        
        try {
            const res = await fetch(`/api/music/search?q=${encodeURIComponent(query)}`);
            clearTimeout(easterEggTimer);
            const results = await res.json();
            
            if (results.length === 0) {
                this.elements.resultsList.innerHTML = '<div class="mp-no-results">No results found</div>';
                return;
            }
            this.renderSearchResults(results);
        } catch (err) {
            clearTimeout(easterEggTimer);
            this.elements.resultsList.innerHTML = '<div class="mp-error">Search failed</div>';
        }
    }
    
    renderSearchResults(results) {
        this.elements.resultsList.innerHTML = results.slice(0, 8).map(s => `
            <div class="mp-result-item" data-id="${s.videoId}" data-title="${this.esc(s.title)}" data-channel="${this.esc(s.channel)}" data-thumb="${s.thumbnail}" data-dur="${s.duration}">
                <img src="${s.thumbnail}" alt="">
                <div class="mp-result-info">
                    <span class="mp-result-title">${this.esc(s.title)}</span>
                    <span class="mp-result-channel">${this.esc(s.channel)}</span>
                </div>
                <span class="mp-result-duration">${s.duration}</span>
                <button class="mp-result-add"><i class="fa-solid fa-plus"></i></button>
            </div>
        `).join('');
        
        this.elements.resultsList.querySelectorAll('.mp-result-item').forEach(item => {
            item.querySelector('.mp-result-add').addEventListener('click', (e) => {
                e.stopPropagation();
                this.addToQueue({
                    videoId: item.dataset.id, title: item.dataset.title,
                    channel: item.dataset.channel, thumbnail: item.dataset.thumb, duration: item.dataset.dur
                });
            });
            item.addEventListener('click', () => {
                this.addToQueue({
                    videoId: item.dataset.id, title: item.dataset.title,
                    channel: item.dataset.channel, thumbnail: item.dataset.thumb, duration: item.dataset.dur
                });
                this.playFromQueue(this.queue.length - 1);
                this.closeSearchPopup();
            });
        });
    }
    
    esc(str) { return str.replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
    
    // ===== Popups =====
    toggleSearchPopup() {
        this.elements.searchPopup.classList.toggle('visible');
        this.closeQueuePopup();
        if (this.elements.searchPopup.classList.contains('visible')) {
            this.elements.searchInput.focus();
        }
    }
    closeSearchPopup() { this.elements.searchPopup.classList.remove('visible'); }
    
    toggleQueuePopup() {
        this.elements.queuePopup.classList.toggle('visible');
        this.closeSearchPopup();
        this.renderQueue();
    }
    closeQueuePopup() { this.elements.queuePopup.classList.remove('visible'); }
    
    // ===== Queue Management =====
    addToQueue(song) {
        this.queue.push(song);
        this.renderQueue();
        this.saveToStorage();
        this.updateNavButtons();
    }
    
    removeFromQueue(index) {
        if (index === this.currentIndex) {
            this.ytPlayer?.stopVideo();
            this.currentIndex = -1;
        } else if (index < this.currentIndex) {
            this.currentIndex--;
        }
        this.queue.splice(index, 1);
        this.renderQueue();
        this.saveToStorage();
        this.updateNavButtons();
    }
    
    renderQueue() {
        if (this.queue.length === 0) {
            this.elements.queueEmpty.style.display = 'block';
            this.elements.queueList.innerHTML = '';
            return;
        }
        this.elements.queueEmpty.style.display = 'none';
        this.elements.queueList.innerHTML = this.queue.map((s, i) => `
            <div class="mp-queue-item ${i === this.currentIndex ? 'playing' : ''}" data-index="${i}">
                <img src="${s.thumbnail}" alt="">
                <div class="mp-queue-info">
                    <span>${this.esc(s.title)}</span>
                    <small>${this.esc(s.channel)}</small>
                </div>
                <span class="mp-queue-dur">${s.duration}</span>
                <button class="mp-queue-remove"><i class="fa-solid fa-times"></i></button>
            </div>
        `).join('');
        
        this.elements.queueList.querySelectorAll('.mp-queue-item').forEach((item, i) => {
            item.addEventListener('click', () => this.playFromQueue(i));
            item.querySelector('.mp-queue-remove').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFromQueue(i);
            });
        });
    }
    
    // ===== Playback =====
    playFromQueue(index) {
        if (index < 0 || index >= this.queue.length) return;
        if (!this.ytReady || !this.ytPlayer?.loadVideoById) {
            this.elements.title.textContent = 'Loading player...';
            setTimeout(() => this.playFromQueue(index), 1000);
            return;
        }
        
        this.currentIndex = index;
        const song = this.queue[index];
        this.elements.title.textContent = song.title;
        this.elements.artist.textContent = song.channel;
        this.elements.albumArt.src = song.thumbnail;
        this.elements.tabTitle.textContent = song.title.substring(0, 20);
        
        this.ytPlayer.loadVideoById(song.videoId);
        this.ytPlayer.setVolume(this.volume);
        this.renderQueue();
        this.updateNavButtons();
        this.saveToStorage();
    }
    
    togglePlay() {
        if (this.currentIndex === -1 && this.queue.length > 0) {
            this.playFromQueue(0);
        } else if (this.isPlaying) {
            this.ytPlayer?.pauseVideo();
        } else {
            this.ytPlayer?.playVideo();
        }
    }
    
    playNext() {
        if (this.currentIndex < this.queue.length - 1) {
            this.playFromQueue(this.currentIndex + 1);
        } else if (this.repeatMode === 1) {
            this.playFromQueue(0);
        }
    }
    
    playPrev() {
        if (this.currentIndex > 0) {
            this.playFromQueue(this.currentIndex - 1);
        }
    }
    
    updateNavButtons() {
        const canPrev = this.currentIndex > 0;
        const canNext = this.currentIndex < this.queue.length - 1 || this.repeatMode === 1;
        this.elements.prev.style.opacity = canPrev ? '1' : '0.3';
        this.elements.prev.disabled = !canPrev;
        this.elements.next.style.opacity = canNext ? '1' : '0.3';
        this.elements.next.disabled = !canNext;
    }
    
    // ===== YouTube Events =====
    onYTStateChange(e) {
        if (e.data === YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            this.elements.playPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
            this.elements.albumArt.classList.add('spinning');
            this.startProgressUpdate();
            this.saveToStorage();
        } else if (e.data === YT.PlayerState.PAUSED) {
            this.isPlaying = false;
            this.elements.playPause.innerHTML = '<i class="fa-solid fa-play"></i>';
            this.elements.albumArt.classList.remove('spinning');
            this.stopProgressUpdate();
            this.saveToStorage();
        } else if (e.data === YT.PlayerState.ENDED) {
            this.onSongEnd();
        }
    }
    
    onYTError(e) {
        console.error('YT Error:', e.data);
        this.elements.title.textContent = 'Video unavailable';
    }
    
    onSongEnd() {
        this.stopProgressUpdate();
        if (this.repeatMode === 2) {
            this.ytPlayer.seekTo(0);
            this.ytPlayer.playVideo();
        } else {
            this.playNext();
        }
    }
    
    // ===== Progress =====
    startProgressUpdate() {
        this.stopProgressUpdate();
        this.progressInterval = setInterval(() => this.updateProgress(), 500);
    }
    
    stopProgressUpdate() {
        if (this.progressInterval) clearInterval(this.progressInterval);
    }
    
    updateProgress() {
        if (!this.ytPlayer?.getCurrentTime) return;
        try {
            const cur = this.ytPlayer.getCurrentTime() || 0;
            const dur = this.ytPlayer.getDuration() || 0;
            if (dur > 0) {
                this.elements.progressFill.style.width = `${(cur/dur)*100}%`;
                this.elements.currentTime.textContent = this.formatTime(cur);
                this.elements.duration.textContent = this.formatTime(dur);
            }
        } catch(e) {}
    }
    
    seek(e) {
        if (!this.ytPlayer?.getDuration) return;
        const rect = this.elements.progress.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        const dur = this.ytPlayer.getDuration() || 0;
        if (dur > 0) this.ytPlayer.seekTo(pct * dur, true);
    }
    
    formatTime(sec) {
        if (!isFinite(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }
    
    // ===== Volume =====
    setVolume(v) {
        this.volume = v;
        this.ytPlayer?.setVolume(v);
        this.elements.volume.value = v;
        this.updateVolumeIcon();
        this.saveToStorage();
    }
    
    toggleMute() {
        if (this.volume > 0) {
            this.prevVolume = this.volume;
            this.setVolume(0);
        } else {
            this.setVolume(this.prevVolume || 80);
        }
    }
    
    updateVolumeIcon() {
        const icon = this.elements.mute.querySelector('i');
        if (this.volume === 0) icon.className = 'fa-solid fa-volume-xmark';
        else if (this.volume < 50) icon.className = 'fa-solid fa-volume-low';
        else icon.className = 'fa-solid fa-volume-high';
    }
    
    toggleRepeat() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        const icon = this.elements.repeat.querySelector('i');
        if (this.repeatMode === 0) {
            icon.className = 'fa-solid fa-repeat';
            this.elements.repeat.classList.remove('active');
        } else if (this.repeatMode === 1) {
            icon.className = 'fa-solid fa-repeat';
            this.elements.repeat.classList.add('active');
        } else {
            icon.className = 'fa-solid fa-1';
            this.elements.repeat.classList.add('active');
        }
        this.updateNavButtons();
        this.saveToStorage();
    }
    
    // ===== Storage =====
    saveToStorage() {
        localStorage.setItem('gamoMusic', JSON.stringify({
            queue: this.queue, 
            volume: this.volume, 
            repeatMode: this.repeatMode,
            currentIndex: this.currentIndex,
            isPlaying: this.isPlaying
        }));
    }
    
    loadFromStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('gamoMusic'));
            if (data) {
                this.queue = data.queue || [];
                this.volume = data.volume ?? 80;
                this.repeatMode = data.repeatMode || 0;
                this.currentIndex = data.currentIndex ?? -1;
                const wasPlaying = data.isPlaying || false;
                
                this.elements.volume.value = this.volume;
                this.updateVolumeIcon();
                if (this.queue.length > 0) {
                    this.renderQueue();
                    // Auto-resume if was playing
                    if (this.currentIndex >= 0 && this.currentIndex < this.queue.length) {
                        // Wait for YouTube API, then resume
                        const checkAndPlay = () => {
                            if (this.ytReady && this.ytPlayer) {
                                this.playSong(this.currentIndex);
                                if (!wasPlaying) {
                                    // Pause immediately if wasn't playing
                                    setTimeout(() => this.togglePlay(), 500);
                                }
                            } else {
                                setTimeout(checkAndPlay, 200);
                            }
                        };
                        setTimeout(checkAndPlay, 500);
                    }
                }
                for (let i = 0; i < this.repeatMode; i++) this.toggleRepeat();
                this.repeatMode = 0;
            }
        } catch(e) { console.warn('Music storage load error:', e); }
    }
}

document.addEventListener('DOMContentLoaded', () => { window.gamoMusicPlayer = new MusicPlayer(); });
