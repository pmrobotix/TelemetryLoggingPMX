// Stream.js
// Author Jonathan Péclat peclatj@bluewin.ch
// Date 07.01.2023

class Stream {

    #user;
    #recording;
    #newRecordFragmentCallback;

    constructor(user, recording) {
        this.#user = user;
        this.#recording = recording;

        this.#newRecordFragmentCallback = (fragment) => {
            this.#sendRecordFragment(fragment);
        };
    }

    start() {
        // Automatically send new record fragments to the user
        this.#recording.addOnNewRecordFragment(this.#newRecordFragmentCallback);

        // Send all existing record fragments to the user
        this.#recording.getRecordFragments().forEach(this.#newRecordFragmentCallback);
    }

    stop() {
        this.#recording.removeOnNewRecordFragment(this.#newRecordFragmentCallback);
    }

    #sendRecordFragment(fragment) {
        const message = {
            type: "recordFragment",
            content: fragment
        };

        this.#user.send(message);
    }
}

export { Stream };
