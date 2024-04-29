function magicSquareSolver(populationSize, generations) {
  const magicSum = 369; // Adjust for different magic square sizes (n * (n^2 + 1) / 2)
  const squareSize = 9; // Adjust for different magic square sizes
  const eliteSize = Math.floor(populationSize * 0.3); // Adjust elitism percentage

  // Function to evaluate the fitness of a magic square (lower is better)
  function evaluateFitness(square) {
    let fitness = 0;
    // Check rows and columns
    for (let i = 0; i < squareSize; i++) {
      let rowSum = 0;
      let colSum = 0;
      for (let j = 0; j < squareSize; j++) {
        rowSum += square[i * squareSize + j];
        colSum += square[j * squareSize + i];
      }

      fitness += Math.abs(rowSum - magicSum) + Math.abs(colSum - magicSum);
    }

    // Check diagonals
    let temp = 0;
    for (let i = 0; i < squareSize * squareSize; i += squareSize + 1) {
      temp += square[i];
    }
    // console.log(fitness);

    fitness += Math.abs(temp - magicSum);

    let temp1 = 0;

    for (
      let i = 8;
      i < squareSize * squareSize - squareSize + 1;
      i += squareSize - 1
    ) {
      temp1 += square[i];
      // console.log(temp1);
    }

    // console.log("----");
    // console.log(temp1 - magicSum);
    fitness += Math.abs(temp - magicSum) + Math.abs(temp1 - magicSum);

    return fitness;
  }
  let square1 = [
    74, 26, 28, 30, 4, 53, 55, 57, 42, 50, 75, 18, 20, 3, 63, 65, 43, 32, 48,
    60, 76, 14, 2, 69, 44, 22, 34, 46, 58, 66, 77, 1, 45, 16, 24, 36, 12, 11,
    10, 9, 41, 73, 72, 71, 70, 35, 23, 15, 37, 81, 5, 67, 59, 47, 33, 21, 38,
    68, 80, 13, 6, 61, 49, 31, 39, 64, 62, 79, 19, 17, 7, 51, 40, 56, 54, 52,
    78, 29, 27, 25, 8,
  ];
  console.log(evaluateFitness(square1));
  console.log("========================");
  function generateRandomSquare() {
    const square = new Array(squareSize * squareSize).fill(0);
    let shuffleCount = Math.floor(
      (Math.random() * squareSize * squareSize) / 2
    );
    for (let i = 0; i < squareSize * squareSize; i++) {
      square[i] = i + 1;
    }
    for (let i = 0; i < shuffleCount; i++) {
      let index1 = Math.floor(Math.random() * squareSize * squareSize);
      let index2 = Math.floor(Math.random() * squareSize * squareSize);
      if (index1 !== index2) {
        [square[index1], square[index2]] = [square[index2], square[index1]];
      }
    }
    return square;
  }
  // Function to generate a valid magic square (ensures all numbers are used once)
  function generateValidSquare() {
    const numbers = [];
    for (let i = 1; i <= squareSize * squareSize; i++) {
      numbers.push(i);
    }
    const square = new Array(squareSize * squareSize).fill(0);

    // Use a recursive helper function to construct a valid magic square
    function constructSquare(row, col) {
      if (row === squareSize) {
        return true; // Base case: reached bottom row
      }

      // Try all possible placements for the current cell
      for (let i = 0; i < squareSize * squareSize; i++) {
        if (numbers[i] !== 0) {
          const nextRow = col === squareSize - 1 ? row + 1 : row;
          const nextCol = col === squareSize - 1 ? 0 : col + 1;

          // Check if the number can be placed in the current cell
          if (isValidPlacement(square, row, col, numbers[i])) {
            square[row * squareSize + col] = numbers[i];
            // console.log(numbers)
            numbers[i] = 0; // Mark the number as used

            if (constructSquare(nextRow, nextCol)) {
              return true; // Success!
            }

            square[row * squareSize + col] = 0; // Backtrack if placement doesn't lead to a solution
            numbers[i] = i + 1; // Restore the number for retrying
          }
        }
      }
      return false; // No valid placement found for the current cell
    }

    constructSquare(0, 0);

    return square;
  }

  // Function to check if a number can be placed in a square cell
  function isValidPlacement(square, row, col, num) {
    // Check row and column
    for (let i = 0; i < squareSize; i++) {
      if (
        square[row * squareSize + i] === num ||
        square[i * squareSize + col] === num
      ) {
        return false;
      }
    }
    // Check diagonals
    const diag1Start = row < col ? 0 : row - col;
    const diag2Start =
      row + col >= squareSize ? squareSize - 1 - (row + col) : 0;
    for (let i = diag1Start; i < squareSize; i++) {
      if (
        square[i * squareSize + (col - i)] === num ||
        square[i * squareSize + (col + i)] === num
      ) {
        return false;
      }
    }
    return true;
  }


  function crossover(parent1, parent2) {
    const n = parent1.length;
    const child1 = new Array(n).fill(0);
    const child2 = new Array(n).fill(0);

    const startPos = Math.floor(Math.random() * n);
    const endPos = Math.floor(Math.random() * n);

    for (let i = startPos; i <= endPos; i++) {
      child1[i] = parent1[i];
      child2[i] = parent2[i];
    }

    for (let i = 0; i < n; i++) {
      if (i < startPos || i > endPos) {
        let value1 = parent1[i];
        let value2 = parent2[i];

        while (child1.includes(value2)) {
          value2 = parent1[parent2.indexOf(value2)];
        }
        child1[i] = value2;

        while (child2.includes(value1)) {
          value1 = parent2[parent1.indexOf(value1)];
        }
        child2[i] = value1;
      }
    }

    return [child1, child2];
  }

  // Function to mutate a square with a given mutation rate
  function mutate(square, mutationRate) {
    for (let i = 0; i < squareSize * squareSize; i++) {
      if (Math.random() < mutationRate) {
        const swapIndex = Math.floor(Math.random() * squareSize * squareSize);
        const temp = square[i];
        square[i] = square[swapIndex];
        square[swapIndex] = temp;
      }
    }
    return square;
  }

  function evolvePopulation(population) {
    const newPopulation = [];

    // Elitism: Select the best individuals to carry over
    population.sort((a, b) => evaluateFitness(a) - evaluateFitness(b)); // Sort by fitness (ascending)
    for (let i = 0; i < eliteSize; i++) {
      newPopulation.push(population[i]);
    }

    // Selection and crossover for remaining population
    for (let i = eliteSize; i < populationSize; i += 2) {
      const competitors = [];
      for (let j = 0; j < population.length; j++) {
        competitors.push(
          population[Math.floor(Math.random() * population.length)]
        );
      }
      let fittest1 = competitors[0];
      let fittest2 = competitors[1];
      for (let j = 2; j < competitors.length; j++) {
        if (evaluateFitness(competitors[j]) < evaluateFitness(fittest1)) {
          fittest2 = fittest1;
          fittest1 = competitors[j];
        } else if (
          evaluateFitness(competitors[j]) < evaluateFitness(fittest2)
        ) {
          fittest2 = competitors[j];
        }
      }
      const [child1, child2] = crossover(fittest1, fittest2);
      newPopulation.push(child1);
      newPopulation.push(child2);
      //  console.log(child1,     child2)
    }

    // Apply mutation to offspring
    for (let i = eliteSize; i < populationSize; i++) {
      newPopulation[i] = mutate(newPopulation[i], 0.04); // Adjust mutation rate
    }

    return newPopulation;
  }

  // Initialize population with valid magic squares
  let population = [];
  for (let i = 0; i < populationSize; i++) {
    population.push(generateRandomSquare());
  }

  // console.log(population);
  // Main loop for evolution
  for (let generation = 0; generation < generations; generation++) {
    population = evolvePopulation(population);
    evaluateFitness(bestFit(population));
    console.log(`generation ${generation} best fit : ${bestFit(population)}`);
    // if (evaluateFitness(bestFit(population)) == 1) {
    //   console.log(bestFit(population));
    // }
  }

  // Return the best magic square found
  let bestSquare = population[0];
  let bestFitness = evaluateFitness(bestSquare);
  for (let i = 1; i < population.length; i++) {
    const fitness = evaluateFitness(population[i]);
    if (fitness < bestFitness) {
      bestSquare = population[i];
      bestFitness = fitness;
    }
  }
  function bestFit(population) {
    let bestSquare = population[0];
    let bestFitness = evaluateFitness(bestSquare);
    for (let i = 1; i < population.length; i++) {
      const fitness = evaluateFitness(population[i]);
      if (fitness < bestFitness) {
        bestSquare = population[i];
        bestFitness = fitness;
      }
    }
    return bestFitness;
  }
  return bestSquare;
}
// Example usage:
const magicSquare = magicSquareSolver(500, 10000); // Adjust population size and generations

let square = Array.from({ length: 9 }, () => Array.from({ length: 9 }));
square[0][0] = magicSquare[1];
magicSquare.length;
for (let index = 0; index < magicSquare.length; index++) {
  square[parseInt(index / 9)][index % 9] = magicSquare[index];
}
console.table(square);

// 74,26,28,30,4,53,55,57,42,
// 50,75,18,20,3,63,65,43,32,
// 48,60,76,14,2,69,44,22,34,
// 46,58,66,77,1,45,16,24,36,
// 12,11,10,9,41,73,72,71,70,
// 35,23,15,37,81,5,67,59,47,
// 33,21,38,68,80,13,6,61,49,
// 31,39,64,62,79,19,17,7,51,
// 40,56,54,52,78,29,27,25,8

















































  // function crossover(parent1, parent2) {
  //   const squareSize = parent1.length;
  //   crossoverPoint = Math.floor(Math.random() * (squareSize - 2));

  //   const child1 = new Array(squareSize).fill(0);
  //   const child2 = new Array(squareSize).fill(0);

  //   for (let i = 0; i <= crossoverPoint; i++) {
  //     child1[i] = parent1[i];
  //     child2[i] = parent1[i];
  //   }

  //   let indexChild1 = crossoverPoint + 1;
  //   let indexChild2 = squareSize - 1;
  //   for (let i = crossoverPoint + 1; i < squareSize; i++) {
  //     let foundDuplicate = false;
  //     // Check for duplicates throughout child1 (0 to squareSize-1)
  //     for (let j = 0; j < squareSize; j++) {
  //       if (child1[j] === parent2[i]) {
  //         foundDuplicate = true;
  //         break;
  //       }
  //     }
  //     if (!foundDuplicate) {
  //       child1[indexChild1] = parent2[i];
  //     } else {
  //       i++; // Skip to next element in parent2 if duplicate found
  //     }
  //     child2[indexChild2] = parent1[i];

  //     indexChild1 = (indexChild1 + 1) % squareSize;
  //     indexChild2 = (indexChild2 - 1 + squareSize) % squareSize;
  //   }

  //   return [child1, child2];
  // }

  // function crossover(parent1, parent2) {
  //   const n = parent1.length; // size of the magic square
  //   const child1 = new Array(n).fill(0);
  //   const child2 = new Array(n).fill(0);

  //   // Select a random crossover point
  //   const crossoverPoint = Math.floor(Math.random() * n);

  //   // Copy the first part from parent1 to child1 and parent2 to child2
  //   for (let i = 0; i < crossoverPoint; i++) {
  //     child1[i] = parent1[i];
  //     child2[i] = parent2[i];
  //   }

  //   // Create a set to store the used numbers in child1
  //   const usedNumbersInChild1 = new Set();
  //   for (let i = 0; i < crossoverPoint; i++) {
  //     usedNumbersInChild1.add(child1[i]);
  //   }

  //   // Fill the remaining part of child1 with non-duplicate numbers from parent2
  //   let j = crossoverPoint;
  //   for (let i = crossoverPoint; i < n; i++) {
  //     let value = parent2[i];
  //     while (usedNumbersInChild1.has(value)) {
  //       // Find the next non-duplicate number from parent2
  //       value = (value % n) + 1; // wrap around if necessary
  //     }
  //     child1[i] = value;
  //     usedNumbersInChild1.add(value);
  //   }

  //   // Fill the remaining part of child2 using the same logic but with parent1
  //   const usedNumbersInChild2 = new Set();
  //   for (let i = 0; i < crossoverPoint; i++) {
  //     usedNumbersInChild2.add(child2[i]);
  //   }
  //   j = crossoverPoint;
  //   for (let i = crossoverPoint; i < n; i++) {
  //     let value = parent1[i];
  //     while (usedNumbersInChild2.has(value)) {
  //       value = (value % n) + 1;
  //     }
  //     child2[i] = value;
  //     usedNumbersInChild2.add(value);
  //   }
  //   // console.log(`parent1:${parent1} \n \n \n parent2: ${parent2 } \n \n \n child1: ${child1} \n \n \n child2: ${child2} \n \n \n \n \n \n `)

  //   return [child1, child2];
  // }

  // function crossover(parent1, parent2) {
  //   const size = parent1.length;
  //   const child1 = [];
  //   const child2 = [];
  //   const selectedNumbers = new Set();

  //   let index = Math.floor(Math.random() * size);
  //   let currentParent = parent1;

  //   for (let i = 0; i < size; i++) {
  //     const currentNumber = currentParent[index];

  //     if (!selectedNumbers.has(currentNumber)) {
  //       child1.push(currentNumber);
  //       selectedNumbers.add(currentNumber);
  //     } else {
  //       const availableNumbers = parent1.filter(num => !selectedNumbers.has(num));
  //       child1.push(availableNumbers.shift());
  //     }

  //     index = (index + 1) % size;

  //     // switch to the other parent
  //     if (i === size / 2) {
  //       currentParent = parent2;
  //     }
  //   }

  //   for (let num of parent1) {
  //     if (!selectedNumbers.has(num)) {
  //       child2.push(num);
  //     }
  //   }

  //   return [child1, child2];
  // }
