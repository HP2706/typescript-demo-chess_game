export function includesArray(candidates: [number, number][], target: [number, number]): boolean {
    return candidates.some(candidate => 
        candidate.length === target.length && 
        candidate.every((value, index) => value === target[index])
    );
}