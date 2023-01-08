// Recording.js
// Author Jonathan Péclat peclatj@bluewin.ch
// Date 03.07.2022

import { difference, merge, intersection, erase, clone } from './utils';

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

    #id;
    #records;
    #referenceRecordInterval;
    #onDurationChangedCallbacks

    constructor(id) {
        this.#id = id;
        this.#records = [];
        this.#referenceRecordInterval = 10;
        this.#onDurationChangedCallbacks = [];
    }

    recordReferenceData(timestamp, completeData) {
        this.#records.push(new ReferenceRecordFragment(timestamp, completeData));
        this.#onDurationChangedCallbacks.forEach((callback) => {callback(this.getDuration())})
    }

    recordIncrementalData(timestamp, incrementalData) {
        this.#records.push(new IncrementalRecordFragment(timestamp, incrementalData));
        this.#onDurationChangedCallbacks.forEach((callback) => {callback(this.getDuration())})
    }

    recordDataToErase(timestamp, dataToErase) {
        this.#records.push(new EraseRecordFragment(timestamp, dataToErase));
        this.#onDurationChangedCallbacks.forEach((callback) => {callback(this.getDuration())})
    }

    getDuration() {
        if(this.#records.length == 0) {
            return 0;
        }

        return this.#records[this.#records.length - 1].timestamp;
    }

    getCurrentData() {
        if(this.#records.length == 0) {
            return {};
        }
        return this.getDataAt(this.#records[this.#records.length - 1].timestamp);
    }

    getDataAt(timestamp) {
        if(this.#records.length == 0) {
            return {};
        }

        const recordFragments = this.#getRecordFragmentsAt(timestamp);

        console.log(JSON.stringify(recordFragments));

        let data = {};

        for (const recordFragment of recordFragments) {
            if (recordFragment instanceof ReferenceRecordFragment) {
                data = clone(recordFragment.completeData);
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
        const minTimestamp = this.#records[0].timestamp;
        const maxTimestamp = this.#records[this.#records.length - 1].timestamp;

        // Check timestamp is in range
        if (timestamp < minTimestamp) {
            timestamp = minTimestamp;
        } else if (timestamp > maxTimestamp) {
            timestamp = maxTimestamp;
        }

        // Perform dicotomic search
        let min = 0;
        let max = this.#records.length - 1;
        let mid = Math.floor((min + max) / 2);

        while (min < max) {
            console.log("min:" + min + " max:" + max + " mid:" + mid);
            if (this.#records[mid].timestamp <= timestamp) {
                min = mid + 1;
            } else {
                max = mid;
            }
            mid = Math.floor((min + max) / 2);
        }

        console.log("min:" + min + " max:" + max + " mid:" + mid);
        // TODO: Handle multiple record fragments with same timestamp

        return mid;
     }

    addOnDurationChanged(callback) {
        this.#onDurationChangedCallbacks.push(callback);
    }

    removeOnDurationChanged(callback) {
        const index = this.#onDurationChangedCallbacks.indexOf(callback);
        if (index > -1) {
            this.#onDurationChangedCallbacks.splice(index, 1);
        }
    }
}

export default Recording;
