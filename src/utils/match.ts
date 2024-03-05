type Modes = "auton" | "teleop" | "endgame"

type Match = {
    state: Modes,
    started: boolean,
    time: number,
    score: number,
    amplified: boolean
}

