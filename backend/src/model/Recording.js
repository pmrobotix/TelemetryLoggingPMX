// Recording.js
// Author Jonathan Péclat peclatj@bluewin.ch
// Date 03.07.2022

const { difference, merge, intersection, erase } = require('./utils');

class ReferenceRecordFragment {
    constructor(timestamp, completeData) {
        this.timestamp = timestamp;
        this.completeData = completeData;
    }
}

class IncrementalRecordFragment {
    constructor(timestamp, incrementalData) {
        this.timestamp = timestamp;
        this.incrementalData = incrementalData;
    }
}

class EraseRecordFragment {
    constructor(timestamp, dataToErase) {
        this.timestamp = timestamp;
        this.dataToErase = dataToErase;
    }
}

class Recording {

    #records;
    #currentData;
    #referenceRecordInterval;
    

    constructor(id, date) {
        this.id = id;
        this.date = date;
        this.#referenceRecordInterval = 10;
        this.#records = new Array();
        this.#records.push(new ReferenceRecordFragment(0, {}));
        this.#currentData = {};
    }

    recordIncrementalData(timestamp, data) {
        // TODO: If a IncrementalRecordFragment with the same timestamp exists, merge the data

        const incrementalData = difference(this.#currentData, data);
        this.#records.push(new IncrementalRecordFragment(timestamp, incrementalData));
        this.#currentData = merge(this.#currentData, incrementalData);

        // Add a reference record every X records
        if (this.#records.length % this.#referenceRecordInterval == 0) {
            this.#records.push(new ReferenceRecordFragment(timestamp, this.#currentData));
        }
    }

    recordDataToErase(timestamp, data) {
        // TODO: If a EraseRecordFragment with the same timestamp exists, merge the data

        const dataToErase = intersection(this.#currentData, data);
        this.#records.push(new EraseRecordFragment(timestamp, dataToErase));
        this.#currentData = erase(this.#currentData, dataToErase);

        // Add a reference record every X records
        if (this.#records.length % this.#referenceRecordInterval == 0) {
            this.#records.push(new ReferenceRecordFragment(timestamp, this.#currentData));
        }
    }

    getLatestData() {
        return this.#currentData;
    }

    getDataAt(timestamp) {
        const recordFragments = this.#getRecordFragmentsAt(timestamp);

        let data = {};
        
        for (const recordFragment of recordFragments) {
            if (recordFragment instanceof ReferenceRecordFragment) {
                data = recordFragment.completeData;
            }
            if (recordFragment instanceof IncrementalRecordFragment) {
                data = merge(data, recordFragment.incrementalData);
            }
            if (recordFragment instanceof EraseRecordFragment) {
                data = erase(data, recordFragment.dataToErase);
            }
        }

        return data;
    }

    #getRecordFragmentsAt(timestamp) {
        const index = this.#getIndexAt(timestamp);
        const lastReferenceRecord = Math.floor(index / this.#referenceRecordInterval);
        const numberOfIncrementalRecords = index - lastReferenceRecord;
        return this.#records.slice(lastReferenceRecord, lastReferenceRecord + numberOfIncrementalRecords + 1);
    }

    #getIndexAt(timestamp) {
        // Check timestamp is in range
        if (timestamp < this.#records[0].timestamp || timestamp > this.#records[this.#records.length - 1].timestamp) {
            return undefined;
        }

        // Perform dicotomic search
        let min = 0;
        let max = this.#records.length - 1;
        let mid = Math.floor((min + max) / 2);

        while (min < max) {
            if (this.#records[mid].timestamp < timestamp) {
                min = mid + 1;
            } else {
                max = mid;
            }
            mid = Math.floor((min + max) / 2);
        }

        // TODO: Handle multiple record fragments with same timestamp

        return mid;
    }
}

module.exports = Recording;