import _ from 'lodash';

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
function difference(origObj, newObj) {
    // https://davidwells.io/snippets/get-difference-between-two-objects-javascript
    function changes(newObj, origObj) {
        let arrayIndexCounter = 0;
        return _.transform(newObj, function (result, value, key) {
            if (!_.isEqual(value, origObj[key])) {
                let resultKey = _.isArray(origObj) ? arrayIndexCounter++ : key;
                result[resultKey] = (_.isObject(value) && _.isObject(origObj[key])) ? changes(value, origObj[key]) : value;
            }
        })
    }
    return changes(newObj, origObj);
}

/**
 * Find intersection between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} intersection
 */
function intersection(origObj, newObj) {
    // https://stackoverflow.com/questions/52063018/intersection-of-two-deep-objects-in-javascript
    function common(object1, object2) {
        return Object.assign(...Object.keys(object1).map(k => {
            var temp;
            if (!(k in object2)) {
                return {};
            }
            if (object1[k] && _.isObject(object1[k]) &&
                object2[k] && _.isObject(object2[k])) {
                temp = common(object1[k], object2[k]);
                return Object.keys(temp).length ? { [k]: temp } : {};
            }
            if (object1[k] === object2[k]) {
                return { [k]: object1[k] };
            }
            return {};
        }));
    }
    return common(newObj, origObj);
}


/**
 * Remove from origObj the key that are present in obj
 * @param {object} origObj 
 * @param {object} obj 
 * @returns {object} origObj withtout the keys in obj
 */
function erase(origObj, obj) {
    // https://stackoverflow.com/questions/55700754/get-array-of-all-lodash-paths-of-object
    function getPaths(obj) {
        _.transform(obj, (acc, v, k) => {
            const keys = _.isObject(v) && !_.isEmpty(v) ? _.map(getPaths(v), sk => _.concat(k, ...sk)) : [[k]];
            acc.push(...keys);
        }, []);
    }

    const paths = getPaths(obj);
    return _.unset(origObj, paths);
}

const merge = _.merge;
const clone = _.clone;

export { difference, merge, intersection, erase, clone };
