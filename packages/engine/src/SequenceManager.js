const SyncPromise = require('./SyncPromise');

class SequenceManager
{
    constructor(host)
    {
        this._host = host;
        this._sequences = Object.create(null);
    }
    addSequence(id, sequence)
    {
        if (this._sequences[id]) {
            throw new Error(`Sequence id '${id}' already defined`);
        }
        this._sequences[id] = sequence;
    }
    getSequence(id)
    {
        if (!this._sequences[id]) {
            throw new Error(`Sequence id '${id}' not defined`);
        }
        return this._sequences[id];
    }
    playSequence(id)
    {
        const sequence = this.getSequence(id);
        const steps = [];

        const next = () => {
            if (steps.length) {
                const tasks = steps.shift().map(action => {
                    return action.call(this._host);
                });

                return SyncPromise.all(tasks).then(() => {
                    return next();
                });
            }
        };

        sequence.forEach(step => {
            const actions = [];
            step.forEach(action => {
                actions.push(action);
            });
            steps.push(actions);
        });

        return next();
    }
}

module.exports = SequenceManager;
