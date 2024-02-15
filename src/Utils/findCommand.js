"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommand = void 0;
function findCommand(obj, key, value) {
    let result;
    const recursiveSearch = (obj) => {
        var _a;
        if (!obj || typeof obj !== "object") {
            return;
        }
        if ((_a = obj[key]) === null || _a === void 0 ? void 0 : _a.includes(value)) {
            result = obj;
        }
        Object.keys(obj).forEach((k) => {
            recursiveSearch(obj[k]);
        });
    };
    recursiveSearch(obj);
    if (result) {
        return result;
    }
    const searchByName = obj[value];
    return searchByName ? searchByName : false;
}
exports.findCommand = findCommand;
