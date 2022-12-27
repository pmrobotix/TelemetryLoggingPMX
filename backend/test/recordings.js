const assert = require('assert');
const Recording = require('../src/model/Recording.js');

describe('Recording', function () {
    it('Add data', function () {
        const recording = new Recording(0, new Date());
        recording.recordIncrementalData(0, { a: 1, b: 2 });
        recording.recordIncrementalData(1, { a: 2, c: 3 });
        recording.recordIncrementalData(2, { a: 3, d: 4 });
        recording.recordIncrementalData(3, { a: 4, e: 5 });
        recording.recordIncrementalData(4, { a: 5, f: 6 });
        recording.recordIncrementalData(5, { a: 6, g: 7 });
        recording.recordIncrementalData(6, { a: 7, h: 8 });
        recording.recordIncrementalData(7, { a: 8, i: 9 });

        const latestData = recording.getLatestData();
        assert.deepStrictEqual(latestData, { a: 8, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9 });

        console.log(latestData);
    });

    it('GetDataAt', function () {
        const recording = new Recording(0, new Date());
        recording.recordIncrementalData(0, { a: 1, b: 2 });
        recording.recordIncrementalData(1, { a: 2, c: 3 });
        recording.recordIncrementalData(2, { a: 3, d: 4 });
        recording.recordIncrementalData(3, { a: 4, e: 5 });
        recording.recordIncrementalData(4, { a: 5, f: 6 });
        recording.recordIncrementalData(5, { a: 6, g: 7 });
        recording.recordIncrementalData(6, { a: 7, h: 8 });
        recording.recordIncrementalData(7, { a: 8, i: 9 });

        const latestData = recording.getDataAt(3);
        assert.deepStrictEqual(latestData, { a: 4, b: 2, c: 3, d: 4, e: 5 });

        console.log(latestData);
    });
});
