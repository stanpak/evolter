/**
     * Calculates the fitness of the individual.
     * Non-Convex Unimodal Functions
     * (-2,2)
     * @param {*} i 
     * @returns 
     */
export const nonConvexUnimodal = {
    range: {
        min: -2,
        max: 2,
    },

    objective: (i) => {
        let y = -(x + Math.sin(x)) * Math.exp(-(Math.pow(x, 2)));
        return y;
    },
}
