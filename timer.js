class Timer {
    canvas;
    ctx;

    radius;

    startTime = Date.now();
    scaleLength = 15 * 60 * 1000;

    mousedown;

    constructor(canvas, canvasSize) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.mousedown = false;
        this.radius = 150;

        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;

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

        this.render();
    }

    getETA() {
        return this.startTime + this.scaleLength;
    }

    getAngelByMillisecond(ms) {
        return (1.5 - 2 * (1 - this.getPercentByMilliseconds(ms))) * Math.PI;
    }

    getPercentByMilliseconds(ms) {
        return ms / (this.minutes * 60 * 1000);
    }

    render() {
        const ms = Date.now() - this.startTime;
        var minute = Math.ceil(this.minutes * (ms / this.scaleLength));

        // clear canvas

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();

        // draw scale

        /*
        for (var i = 0; i < ((this.minutes / 5) * this.elapsed); i++) {
            var scaleX = (this.size / 2) + (this.radius + 10) * Math.cos((-.5 - (i / (this.minutes / 5)) * 2) * Math.PI);
            var scaleY = (this.size / 2) + (this.radius + 10) * Math.sin((-.5 - (i / (this.minutes / 5)) * 2) * Math.PI);
            this.ctx.beginPath();
            this.ctx.arc(scaleX, scaleY, 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = '#000000';
            this.ctx.fill();
        }
        */

        /*
        var textX = (this.size / 2) + (this.radius + 35) * Math.cos((-.5 - (ms / this.timerLength) * 2) * Math.PI);
        var textY = 15 + (this.size / 2) + (this.radius + 35) * Math.sin((-.5 - (ms / this.timerLength) * 2) * Math.PI);

        this.ctx.beginPath();
        this.ctx.font = 'bold 30px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText(minute, textX, textY);
        */

        // draw disc

        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.arc(this.canvasSize / 2, this.canvasSize / 2, this.radius, 1.2 * Math.PI, this.getAngelByMillisecond(0));
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fill();
    };

    getAngelByTime(time) {
        return 2 * Math.PI;
    }

    getAngelByCoordinates(x, y) {
        var dx = x - this.canvas.width / 2;
        var dy = this.canvas.height / 2 - y;

        var alpha = Math.atan2(dx, dy);
        if (alpha < 0) {
            alpha += (2 * Math.PI);
        }

        return (alpha / Math.PI) - .5;
    }

    setTimeByCoordinates(x, y) {
        this.startTime = Date.now();
        this.scaleLength = this.getMsByCoordinates(x, y);
        // this.getPercentByMilliseconds(this.timerLength);

        // console.log(this.getAngelByMillisecond(this.timerLength));

        this.render();
    }
}