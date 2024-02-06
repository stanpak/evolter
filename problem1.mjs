// Very simple problem: a 1 dimensional function. 
// The domain is just the X and the goal is to find the highest point on the F(X) function.

import { mutateNumber } from "./mutation.mjs";

const problem = {
    /**
     * Defines the individual structure and limitations. 
     */
    define: () => {

    },

    /**
     * Creates new instance of the individual (randomized). Used only for initial population only.
     * @returns 
     */
    initiate: () => {
        return { x: Math.random() };
    },

    /**
     * Calculates the fitness of the individual.
     * Non-Convex Unimodal Functions
     * (-2,2)
     * @param {*} i 
     * @returns 
     */
    evaluate: (i) => {
        return -(i.x + Math.sin(i.x)) * Math.exp(-(Math.pow(i.x, 2)));
    },

    // Multimodal Function 1
    // (-6,7)
    evaluate2: (i) => {
        return Math.sin(i.x) + Math.sin((10.0 / 3.0) * i.x);
    },

    // Multimodal Function 2
    // (0,2)
    evaluate3: (i) => {
        return -(1.4 - 3.0 * i.x) * Math.sin(18.0 * i.x);
    },

    // Multimodal Function 3
    // (0,10)
    evaluate4: (i) => {
        return -i.x * Math.sin(i.x);
    },

    // Noisy Functions
    evaluate5: (i) => {
        return (x + Math.random(len(x)) * 0.3) ** 2.0;
    },


    mutate: (individuals) => {
        // Return new individual:
        return { x: mutateNumber(individuals[0], individuals[1]) };
    },
}

class Process {

    population = [];

    /**
     * The history of the whole process. it holds the list of iterations of the process with all of their statistics.
     */
    history = [];

    parameters = {
        popSize: 100,
    };

    initialize = () => {
        this.population = [];
        for (let p = 0; p < this.parameters.popSize; p++)
            this.population.push(this.problem.initiate());
    }

    evaluate = () => {
        for (let i of this.population)
            i._fitness = this.problem.evaluate(i);
    }

    select = () => {
        // Just select first best 30%
        let np = this.population.sort((a, b) => a._fitness < b._fitness);
        this.population = np.slice(0, this.population.length * .3);
    }

    terminate = () => {
        return this.history.length > 100;
    }

    recordHistory = () => {
        let h = {};

        h.avgFitness = 0;
        if (this.population.length !== 0) {
            for (let i of this.population)
                h.avgFitness += i._fitness;
            h.avgFitness /= this.population.length;
        }

        h.bestIndividual = null;
        this.population.forEach(e => {
            if (!h.bestIndividual || e._fitness > h.bestIndividual._fitness)
                h.bestIndividual = e;
        });

        this.history.push(h);

        console.log(h);
    }

    reproduce = () => {
        let np = [];
        for (let i = 0; i < this.parameters.popSize; i++) {

            // Select 2 individuals randomly from the pool...
            let individuals = [];
            let indiv = selectOne(this.population, individuals);
            individuals.push(indiv);

            indiv = selectOne(this.population, individuals);
            individuals.push(indiv);

            let newborn = problem.mutate(individuals);
            np.push(newborn);
        }

        this.population = np;

        function selectOne(population, individuals) {
            for (; ;) {
                let i = Math.round(Math.random() * (population.length - 1));
                let indiv = population[i];
                if (individuals.findIndex((a) => a == indiv) < 0)
                    return indiv;
            }
        }
    }

    evolve = () => {
        this.initialize();
        for (; ;) {
            // Evaluate individuals and select the most prospective for reproduction...
            this.evaluate();

            this.recordHistory();

            // Check the health of the population and if there is enogh progress to end the process
            if (this.terminate())
                break;

            // Then select the candidates for reproduction. The unfit candidates will be removed from the pool.
            this.select();

            // Reproduce the remaining individuals into a new population...
            this.reproduce();
        }
    }

}

let process = new Process();
process.problem = problem;
process.evolve();