"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includesArray = void 0;
function includesArray(candidates, target) {
    return candidates.some(candidate => candidate.length === target.length &&
        candidate.every((value, index) => value === target[index]));
}
exports.includesArray = includesArray;
