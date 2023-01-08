// Recording.js
// Author Jonathan Péclat peclatj@bluewin.ch
// Date 03.07.2022

// import file system module
import { difference, merge, intersection, erase } from "./utils.js";

const recordings = new Map();

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
    #date;
    #records;
    #currentData;
    #referenceRecordInterval;
    #onNewRecordFragmentCallbacks;

    constructor(id) {
        this.#id = id;
        this.#date = new Date();
        this.#referenceRecordInterval = 10;
        this.#records = new Array();
        this.#records.push(new ReferenceRecordFragment(0, {}));
        this.#currentData = {};
        this.#onNewRecordFragmentCallbacks = new Array();

        recordings.set(id, this);
    }

    getId() {
        return this.#id;
    }

    recordIncrementalData(timestamp, data) {
        // TODO: If a IncrementalRecordFragment with the same timestamp exists, merge the data
        // TODO: If the incrementalData is empty, do not create a new record

        // Compute the difference between the current data and the new data
        // and merge the new data into the current data
        const incrementalData = difference(this.#currentData, data);
        this.#currentData = merge(this.#currentData, incrementalData);

        const recordFragment = new IncrementalRecordFragment(timestamp, incrementalData);
        this.#onNewRecordFragmentCallbacks.forEach(callback => callback(recordFragment));
        this.#records.push(recordFragment);
        
        this.#createReferenceFragment();
    }

    recordDataToErase(timestamp, data) {
        // TODO: If a EraseRecordFragment with the same timestamp exists, merge the data
        // TODO: If the dataToErase is empty, do not create a new record

        const dataToErase = intersection(this.#currentData, data);
        this.#currentData = erase(this.#currentData, dataToErase);
        
        const recordFragment = new EraseRecordFragment(timestamp, dataToErase);
        this.#onNewRecordFragmentCallbacks.forEach(callback => callback(recordFragment));
        this.#records.push(recordFragment);
        
        this.#createReferenceFragment();
    }

    #createReferenceFragment() {
        // Add a reference record every X records
        if (this.#records.length % this.#referenceRecordInterval == 0) {
            const timestamp = this.#records[this.#records.length - 1].timestamp;
            const recordFragment = new ReferenceRecordFragment(timestamp, this.#currentData);
            this.#onNewRecordFragmentCallbacks.forEach(callback => callback(recordFragment));
            this.#records.push(recordFragment);
        }
    }

    getRecordFragments() {
        return this.#records;
    }

    addOnNewRecordFragment(callback) {
        this.#onNewRecordFragmentCallbacks.push(callback);
    }

    removeOnNewRecordFragment(callback) {
        const index = this.#onNewRecordFragmentCallbacks.indexOf(callback);
        if (index > -1) {
            this.#onNewRecordFragmentCallbacks.splice(index, 1);
        }
    }
}

const sampleRecording1 = new Recording("sample1");
sampleRecording1.recordIncrementalData(   1000, { position: {x: 0.0, y: 0.1}, motors: {left: 0.0, right: 0.0} });
sampleRecording1.recordIncrementalData(   2000, { position: {x: 0.1, y: 0.2}, motors: {left: 0.1, right: 0.1} });
sampleRecording1.recordIncrementalData(   3000, { position: {x: 0.2, y: 0.3}, motors: {left: 0.2, right: 0.2} });
sampleRecording1.recordIncrementalData(   4000, { position: {x: 0.3, y: 0.4}, motors: {left: 0.3, right: 0.3} });
sampleRecording1.recordIncrementalData(   5000, { position: {x: 0.4, y: 0.5}, motors: {left: 0.4, right: 0.4} });
sampleRecording1.recordIncrementalData(   6000, { position: {x: 0.5, y: 0.6}, motors: {left: 0.5, right: 0.5} });
sampleRecording1.recordIncrementalData(   7000, { position: {x: 0.6, y: 0.0}, motors: {left: 0.6, right: 0.6} });
sampleRecording1.recordIncrementalData(   8000, { position: {x: 0.7, y: 0.0}, motors: {left: 0.7, right: 0.7} });
sampleRecording1.recordIncrementalData(   9000, { position: {x: 0.8, y: 0.0}, motors: {left: 0.8, right: 0.8} });
sampleRecording1.recordIncrementalData(  10000, { position: {x: 0.9, y: 0.0}, motors: {left: 0.9, right: 0.9} });


recordings.set(sampleRecording1.id, sampleRecording1);


export { Recording, recordings };