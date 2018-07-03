const { Vector2 } = require('three');

class UVCoords extends Array
{
    constructor(offset, size, txSize)
    {
        super();

        const x = offset.x;
        const y = offset.y;
        const w = size.x;
        const h = size.y;
        const totalW = txSize.x;
        const totalH = txSize.y;

        const uvs = [
            new Vector2(x / totalW, (totalH - y) / totalH),
            new Vector2(x / totalW, (totalH - (y + h)) / totalH),
            new Vector2((x + w) / totalW, (totalH - (y + h)) / totalH),
            new Vector2((x + w) / totalW, (totalH - y) / totalH),
        ];

        this.push([uvs[0], uvs[1], uvs[3]],
                  [uvs[1], uvs[2], uvs[3]]);
    }
}

module.exports = UVCoords;