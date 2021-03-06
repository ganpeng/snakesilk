const {AI, Entity} = require('@snakesilk/engine');

function applyRatio(ratio, start, end) {
    return start + (end - start) * ratio;
}

function findRatio(pos, low, high) {
    return (pos - low) / (high - low);
}

function clamp(value, min, max) {
    if (value > max) {
        return max;
    } else if (value < min) {
        return min;
    } else {
        return value;
    }
}

class Shotman extends Entity
{
    constructor() {
        super();
        this.ai = new AI(this);

        this.coolDown = .8;
        this.waitForShot = 0;
        this.target = null;

        this.timeAIUpdated = null;

        this.RAD = Math.PI/180;

        this.far = 200;
        this.near = 0;
        this.aimFar = 160;
        this.aimNear = 92;
        this.aimingAngle = this.aimFar;
        this.aimingSpeed = 50;
        this.shootingAngle = this.aimingAngle;
    }

    fire()
    {
        return false;
        /*if (this.waitForShot > 0) {
            return;
        }

        var projectile = new Engine.objects.projectiles.EnemyPlasma();
        projectile.physics.enabled = true;

        var kX = Math.cos(this.RAD * this.shootingAngle);
        var kY = Math.sin(this.RAD * this.shootingAngle);

        projectile.setEmitter(this, new THREE.Vector2(kX, kY));

        var originXOffset = 16 * kX;
        var originYOffset = kY;

        var origin = new THREE.Vector3(
            this.model.position.x + originXOffset,
            this.model.position.y + originYOffset,
            0);

        projectile.setOrigin(origin);

        projectile.inertia.x = projectile.speed * kX;
        projectile.inertia.y = projectile.speed * kY;
        this.world.addObject(projectile);
        this.waitForShot = this.coolDown;
        return true;
        */
    }

    updateAI()
    {
        if (Math.abs(this.time - this.timeAIUpdated) > 2) {
            var target = this.ai.findPlayer();
            if (target) {
                var distanceRatio = findRatio(target.position.x,
                    target.position.x - this.far,
                    target.position.x - this.near);

                distanceRatio = clamp(distanceRatio, 0, 1);
                this.aimingAngle = applyRatio(distanceRatio, this.aimFar, this.aimNear);
                this.timeAIUpdated = this.time;
            }
        }
    }

    routeAnimation()
    {
        if (this.shootingAngle > 145) {
            return 'deg0';
        }
        else if (this.shootingAngle > 115) {
            return 'deg22';
        }
        else {
            return 'deg45';
        }
    }

    timeShift(dt)
    {
        this.waitForShot -= dt;

        if (this.waitForShot <= 0) {
            this.weapon.fire();
            this.waitForShot = this.coolDown;
        }

        this.updateAI(dt);
        var aimingDiff = this.aimingAngle - this.shootingAngle;
        this.shootingAngle += clamp(aimingDiff, -this.aimingSpeed, this.aimingSpeed) * dt;
        var kX = Math.cos(this.RAD * this.shootingAngle);
        var kY = Math.sin(this.RAD * this.shootingAngle);
        this.aim.set(kX, kY);

        this.animators[0].enabled = Math.abs(this.shootingAngle - this.aimingAngle) > 2;

        super.timeShift(dt);
    }
}

module.exports = Shotman;
