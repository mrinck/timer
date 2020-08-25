class Timer {
    canvas;
    ctx;

    radius = 150;

    startTime = Date.now();
    scaleLength = 60 * 60 * 1000;
    timerLength = this.scaleLength;

    mousedown = false;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.canvas.addEventListener('mousemove', e => {
            if (this.mousedown) {
                this.setTimeByCoordinates(e.offsetX, e.offsetY);
            }
        });

        this.canvas.addEventListener('mousedown', e => {
            this.mousedown = true;
            this.setTimeByCoordinates(e.offsetX, e.offsetY);
        });

        document.addEventListener('mouseup', () => {
            this.mousedown = false;
        });

        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });

        setInterval(() => {
            if (!this.mousedown) {
                this.render();
            }
        }, 33);

        this.resizeCanvas()
        this.render();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setTimeByCoordinates(x, y) {
        this.startTime = Date.now();
        this.timerLength = this.getMinuteByTime(this.getTimeByCoordinates(x, y)) * 60 * 1000;
        this.render();
    }

    getAngelByCoordinates(x, y) {
        var dx = x - this.canvas.width / 2;
        var dy = this.canvas.height / 2 - y;

        var alpha = Math.atan2(dx, dy);
        if (alpha < 0) {
            alpha += (2 * Math.PI);
        }

        return alpha - (.5 * Math.PI);
    }

    getTimeByCoordinates(x, y) {
        const alpha = this.getAngelByCoordinates(x, y);
        const normalAlpha = alpha + (.5 * Math.PI);
        const scalePercentage = 1 - (normalAlpha / (2 * Math.PI));
        return this.scaleLength * scalePercentage;
    }

    getAngelByMilliseconds(ms) {
        const scalePercentage = ms / this.scaleLength;
        const normalAlpha = (2 * Math.PI) - (2 * Math.PI * scalePercentage);
        const alpha = normalAlpha - .5 * Math.PI;
        return alpha;
    }

    getMinuteByTime(time) {
        return Math.ceil(time / (1000 * 60));
    }

    getCoordinatesByRadiusAndAngel(radius, angel) {
        return {
            x: (this.canvas.width / 2) + radius * Math.cos(angel),
            y: (this.canvas.height / 2) + radius * Math.sin(angel)
        };
    }

    getTimeLeft() {
        return this.startTime + this.timerLength - Date.now();
    }

    render() {
        const timeLeft = this.getTimeLeft();

        // clear canvas

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (timeLeft <= 0) {
            this.ctx.beginPath();
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // draw scale

        /*
        const minutes = 1 + this.getMinuteByTime(this.timerLength);

        for (let i = 0; i < minutes / 5; i++) {
            const angel = this.getAngelByMilliseconds(i * 1000 * 60 * 5);
            const scaleCoordinates = this.getCoordinatesByRadiusAndAngel(this.radius + 10, angel);

            this.ctx.beginPath();
            this.ctx.arc(scaleCoordinates.x, scaleCoordinates.y, 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = '#000000';
            this.ctx.fill();
        }
        */

        // draw text

        const textCoordinates = this.getCoordinatesByRadiusAndAngel(this.radius + 30, this.getAngelByMilliseconds(this.timerLength));

        this.ctx.beginPath();
        this.ctx.font = '20px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText(this.getMinuteByTime(this.timerLength), textCoordinates.x, textCoordinates.y + 9);

        // draw disc

        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, this.getAngelByMilliseconds(this.timerLength), this.getAngelByMilliseconds(0));
        this.ctx.fillStyle = '#fee';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, this.getAngelByMilliseconds(timeLeft), this.getAngelByMilliseconds(0));
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fill();

        const endLineCoordinates = this.getCoordinatesByRadiusAndAngel(this.radius + 15, this.getAngelByMilliseconds(0));
        const startLineCoordinates = this.getCoordinatesByRadiusAndAngel(this.radius + 15, this.getAngelByMilliseconds(this.timerLength));

        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.lineTo(startLineCoordinates.x, startLineCoordinates.y);
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.lineTo(endLineCoordinates.x, endLineCoordinates.y);
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();
    }
}