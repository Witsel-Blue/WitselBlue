export const redlightgreenlightSnippet = `
class Game {
    app;
    gameStarted = false;
    players = [];
    timer = 60;
    timerInterval = null;
    sounds = {};
    doll;

    constructor() {
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
        this.app.canvas.id = 'app-canvas';
        document.body.appendChild(this.app.canvas);

        this.createGameCover();
        await this.loadGameAssets();
        this.drawFinishLine();
    }

    createGameCover() {
        const cover = document.createElement('div');
        cover.id = 'game-cover';
        Object.assign(cover.style, {
            width: '360px',
            height: '640px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            cursor: 'pointer',
            zIndex: '1'
        });

        const startText = document.createElement('div');
        startText.id = 'start-text';
        startText.textContent = '화면을 클릭하여 게임 시작';
        Object.assign(startText.style, {
            color: 'white',
            fontSize: '28px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
        });
        cover.appendChild(startText);

        cover.addEventListener('click', () => {
            if (!this.gameStarted) {
                this.startGame();
                cover.style.display = 'none';
            }
        });

        document.body.appendChild(cover);
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
            if (playPromise) playPromise.catch( err => 
                console.log('Sound play failed:', err)
            );
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

        this.app.ticker.add(this.update.bind(this));
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
        const allEliminated = this.players.every(p => 
            p.state === 'eliminated'
        );
        const allFinished = this.players.every(p => 
            p.state === 'eliminated' || p.isFinished()
        );

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
            zIndex: '2'
        });
        cover.appendChild(endText);

        const resultText = document.createElement('div');
        resultText.textContent = '생존자: ';
        Object.assign(resultText.style, {
            position: 'absolute',
            top: '280px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
            zIndex: '2'
        });
        cover.appendChild(resultText);

        this.createResetButton(cover);
    }

    createResetButton(parent) {
        const button = document.createElement('button');
        button.textContent = '게임 다시 시작';
        Object.assign(button.style, {
            position: 'absolute',
            left: '50%',
            top: '350px',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            borderRadius: '16px',
            fontSize: '18px',
            cursor: 'pointer',
            zIndex: '2'
        });

        button.addEventListener('click', () => {
            button.remove();
            parent.querySelectorAll('div').forEach(div => {
                if (div.id !== 'start-text') div.remove();
            });
            this.resetGame();
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