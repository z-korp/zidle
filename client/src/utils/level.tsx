// xpLevelUtils.ts

// Constants
const MAX_LEVEL = 99;
const BASE_XP = 100;
const CURVE_FACTOR = 10; // Adjusts the steepness of the curve

// Function to calculate XP required for a given level
function xpForLevel(level: number): number {
    return Math.floor(BASE_XP + CURVE_FACTOR * (Math.pow(2, level) - 1));
}

// Function to get level from XP
export function getLevelFromXp(xp: number): number {
    if (xp < BASE_XP + CURVE_FACTOR) {
        return 0;
    }

    let level = 1;
    while (level < MAX_LEVEL && xp >= xpForLevel(level + 1)) {
        level += 1;
    }

    return level;
}

// Optional: Function to get XP required for next level
export function xpForNextLevel(currentXp: number): number {
    const currentLevel = getLevelFromXp(currentXp);
    return xpForLevel(currentLevel + 1);
}

// Optional: Function to get XP progress towards next level
export function xpProgressToNextLevel(currentXp: number): number {
    const currentLevel = getLevelFromXp(currentXp);
    const xpForCurrent = xpForLevel(currentLevel);
    const xpForNext = xpForLevel(currentLevel + 1);
    return (currentXp - xpForCurrent) / (xpForNext - xpForCurrent);
}