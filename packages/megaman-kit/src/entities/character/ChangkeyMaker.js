const {PointLight} = require('three');
const {AI, Entity} = require('@snakesilk/engine');
const {Glow} = require('@snakesilk/platform-traits');

class ChangkeyMaker extends Entity
{
    constructor() {
        super();
        this.ai = new AI(this);

        this.fire = false;
        this.fireCoolDown = 2;
        this.fireLoop = 0;
        this.fireWait = 0;
        this.flickerLoop = 0;
        this.flickerIntensity = .25;
        this.flickerDelay = .05;

        var light = new PointLight(0xff5400, 2, 256);
        light.position.z = 20;

        var glow = new Glow();
        glow.addLamp(light);

        /* Disable applyTrait since it is not compatible with XML apply of glow.
        this.applyTrait(glow);
        */
    }
    routeAnimation()
    {
        if (this.fireWait < 1) {
            return 'throw';
        }
        return 'idle';
    }

    updateAI(dt)
    {
        if (this.ai.findPlayer() && this.ai.target.position.distanceTo(this.position) < 300) {
            if (this.fireLoop === undefined) {
                this.fireLoop = 0;
            }
        }
        else {
            this.fireLoop = undefined;
        }
    }

    timeShift(dt)
    {
        this.updateAI(dt);

        if (this.fireLoop !== undefined) {
            this.fireLoop += dt;
            this.fireWait -= dt;
            if (this.fireWait <= 0) {
                //this.fire();
                this.fireWait = this.fireCoolDown;
            }
        }
        else {
            this.fireWait = Infinity;
        }

        super.timeShift.call(this, dt);

        this.flickerLoop += dt;
        if (this.flickerLoop > this.flickerDelay) {
            this.flickerLoop = 0;
            var lamps = this.glow.lamps;
            for (var i = 0, l = lamps.length; i !== l; ++i) {
                lamps[i].light.intensity = lamps[i].intensity + (this.flickerIntensity * Math.random());
            }
            this.flickerIntensity = -this.flickerIntensity;
        }
    }
}

module.exports = ChangkeyMaker;
