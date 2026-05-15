export const redlightgreenlightSnippet = `
class Game {
    app;
    gameStarted = false;
    players = [];
    timer = 60;
    timerInterval = null;
    sounds = {};
    doll;
    _updateRegistered = false;
    container;

    constructor() {
        this.update = this.update.bind(this);
        this.init();
    }

    async init() {
        this.app = new Application();
        await this.app.init({
            width: 360,
            height: 640,
            backgroundColor: 0x5C5581,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        this.container = document.createElement('div');
        this.container.id = 'game-container';
        Object.assign(this.container.style, {
            width: '360px',
            height: '640px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(1)',
            transformOrigin: '50% 50%',
        });
        document.body.appendChild(this.container);

        this.app.canvas.id = 'app-canvas';
        this.app.canvas.style.width = '360px';
        this.app.canvas.style.height = '640px';
        this.app.canvas.style.display = 'block';
        this.container.appendChild(this.app.canvas);

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.createGameCover();

        await this.loadGameAssets();
        this.drawFinishLine();
    }

    resizeCanvas() {
        const maxWidth = 360;
        const scale = window.innerWidth >= maxWidth ? 1 : window.innerWidth / maxWidth;

        this.container.style.transform = 'translate(-50%, -50%) scale(scale)';
    }

    createGameCover() {
        const cover = document.createElement('div');
        cover.id = 'game-cover';
        Object.assign(cover.style, {
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: '0',
            top: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: '10',
            display: 'block'
        });

        const startText = document.createElement('div');
        startText.id = 'start-text';
        startText.textContent = '게임을 시작하려면 버튼을 누르세요';
        Object.assign(startText.style, {
            color: 'white',
            fontSize: '24px',
            position: 'absolute',
            left: '50%',
            top: '45%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: '11'
        });
        cover.appendChild(startText);

        this.createStartOrResetButton(cover, true);

        this.container.appendChild(cover);
    }

    async loadGameAssets() {
        await Assets.load([dollSprite, playerSprite]);
        this.sounds = {
            voice: new Audio(voiceMp3),
            gun: new Audio(gunMp3)
        };
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.5;
            sound.load();
        });
    }

    playSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            const playPromise = sound.play();
            if (playPromise) playPromise.catch(err => console.log('Sound play failed:', err));
        }
    }

    drawFinishLine() {
        const graphics = new Graphics();
        graphics.moveTo(0, 165);
        graphics.lineTo(360, 165);
        graphics.stroke({ color: '#FFFFFF', width: 4, alpha: 1 });
        this.app.stage.addChild(graphics);
    }

    startGame() {
        this.gameStarted = true;

        this.doll = new Doll(this);
        this.app.stage.addChild(this.doll);

        for (let i = 0; i < 5; i++) {
            const player = new Player(i, this);
            this.players.push(player);
            this.app.stage.addChild(player);
        }

        if (!this._updateRegistered) {
            this.app.ticker.add(this.update);
            this._updateRegistered = true;
        }

        this.startTimer();
    }

    update(delta) {
        if (!this.gameStarted) return;

        this.doll.update(delta);
        for (const player of this.players) {
            player.update(delta);
            if (this.doll.isWatching() && player.state === 'running') {
                player.setState('eliminated');
            }
            if (player.isFinished() && player.state !== 'eliminated') {
                player.setState('idle');
            }
        }

        this.checkGameEnd();
    }

    startTimer() {
        const timerText = new Text({
            text: this.timer.toString(),
            style: { fontFamily: 'Arial', fontSize: 32, fill: 0xFFFFFF }
        });
        timerText.position.set(300, 30);
        this.app.stage.addChild(timerText);

        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.timer--;
            timerText.text = this.timer.toString();

            if (this.timer <= 0) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
                this.endGame();
            }
        }, 1000);
    }

    checkGameEnd() {
        const allEliminated = this.players.every(p => p.state === 'eliminated');
        const allFinished = this.players.every(p => p.state === 'eliminated' || p.isFinished());

        if (allEliminated || allFinished || this.timer <= 0) {
            this.endGame();
        }
    }

    endGame() {
        this.gameStarted = false;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        const cover = document.getElementById('game-cover');
        if (!cover) return;

        cover.style.display = 'block';

        const startText = document.getElementById('start-text');
        if (startText) startText.style.display = 'none';

        const survivors = this.players.filter(p => p.isFinished()).length;

        const endText = document.createElement('div');
        endText.textContent = '게임 종료!';
        Object.assign(endText.style, {
            position: 'absolute',
            top: '240px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '32px',
            textAlign: 'center',
            zIndex: '11'
        });
        cover.appendChild(endText);

        const resultText = document.createElement('div');
        resultText.textContent = '생존자: survivors명';
        Object.assign(resultText.style, {
            position: 'absolute',
            top: '280px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
            zIndex: '11'
        });
        cover.appendChild(resultText);

        this.createStartOrResetButton(cover, false);
    }

    createStartOrResetButton(parent, isFirst = false) {
        const button = document.createElement('button');
        button.textContent = isFirst ? '게임 시작' : '게임 다시 시작';
        Object.assign(button.style, {
            position: 'absolute',
            left: '50%',
            top: '350px',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            borderRadius: '16px',
            fontSize: '18px',
            cursor: 'pointer',
            zIndex: '12'
        });

        button.addEventListener('click', () => {
            button.remove();
            parent.querySelectorAll('div').forEach(div => {
                if (div.id !== 'start-text') div.remove();
            });

            if (!isFirst) {
                this.resetGame(); 
            }

            this.startGame();
            parent.style.display = 'none';
        });

        parent.appendChild(button);
    }

    resetGame() {
        this.players.forEach(p => this.app.stage.removeChild(p));
        this.players = [];

        if (this.doll) this.app.stage.removeChild(this.doll);
        this.doll = null;

        this.timer = 60;

        this.app.stage.children
            .filter(child => child instanceof Text)
            .forEach(text => this.app.stage.removeChild(text));

        this.gameStarted = false;

        const cover = document.getElementById('game-cover');
        if (cover) {
            cover.style.display = 'block';
            const startText = document.getElementById('start-text');
            if (startText) startText.style.display = 'block';
        }
    }
}

new Game();
`;