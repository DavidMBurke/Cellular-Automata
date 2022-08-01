const sandMotion = (grid, nextGrid, x, y) => {
  if (swapDown(grid, nextGrid, "empty", x, y)) return;
  if (fallDiagonal(grid, nextGrid, x, y)) return;
  else stay(grid, nextGrid, x, y);
};

const waterMotion = (grid, nextGrid, x, y) => {
  if (fallDiagonal(grid, nextGrid, x, y)) return;
  if (swapUp(grid, nextGrid, "sand", x, y)) return;
  if (swapDown(grid, nextGrid, "empty", x, y)) return;
  if (spread(grid, nextGrid, 1, x, y)) return;
  if (spread(grid, nextGrid, 1, x, y + 1)) return;
  stay(grid, nextGrid, x, y);
  return;
};

const gasMotion = (grid, nextGrid, x, y) => {
  let rand = Math.floor(Math.random()*3);
  if (riseDiagonal(grid, nextGrid, x, y)) return;
  if (spread(grid, nextGrid, 1, x, y)) return;
  if (spread(grid, nextGrid, 1, x, y - 1)) return;
  if (swapUp(grid, nextGrid, "empty", x, y)) return;
  if (swapUp(grid, nextGrid, "water", x, y)) return;
  if (swapUp(grid, nextGrid, "sand", x, y)) return;
  stay(grid, nextGrid, x, y);
  return;
};

const fireMotion = (grid, nextGrid, x, y) => {
  if (consume(nextGrid, x, y, empty, 15)) return;
  burn(grid, nextGrid, x, y, "gas", 90, 3);
  burn(grid, nextGrid, x, y, "wood", 60, 1);
  if (swapUp(grid, nextGrid, "empty", x, y)) return;
}


const burn = (grid, nextGrid, x, y, material, flameFactor, reach) => {
  for (let i = -reach; i < reach+1; i++) {
    for (let j = -reach; j < reach+1; j++) {
      if (x + i > grid.length-1 || y + j > grid[0].length-1 || x + i < 1 || y + j < 1) return;
      if (grid[x + i][y + j].type === material) {
        let rand = Math.floor(Math.random() * 100);
        if (rand < flameFactor) {
          nextGrid[x + i][y + j] = grid[x][y];
        }
      }
    }
  }
};

const consume = (nextGrid, x, y, replacement, consumeFactor) => {
  let rand = Math.floor(Math.random() * 100);
  if (rand > consumeFactor) {
    return false;
  } else {
    nextGrid[x][y] = replacement;
    return true;
  }
}

const stoneMotion = (grid, nextGrid, x, y) => {
  stay(grid, nextGrid, x, y);
  return;
};

const stay = (grid, nextGrid, x, y) => {
  nextGrid[x][y] = grid[x][y];
  return;
};

const swapDown = (grid, nextGrid, floater, x, y) => {
  if (grid[x][y + 1].type === floater && nextGrid[x][y + 1].type === floater) {
    nextGrid[x][y + 1] = grid[x][y];
    nextGrid[x][y] = grid[x][y + 1];
    return true;
  }
  return false;
};

const swapUp = (grid, nextGrid, sinker, x, y) => {
  if (grid[x][y - 1].type === sinker && nextGrid[x][y - 1].type === sinker) {
    nextGrid[x][y - 1] = grid[x][y];
    nextGrid[x][y] = grid[x][y - 1];
    return true;
  }
  return false;
};

const fallDiagonal = (grid, nextGrid, x, y) => {
  if (
    grid[x - 1][y + 1].type === "empty" &&
    grid[x + 1][y + 1].type !== "empty" &&
    nextGrid[x - 1][y + 1].type === "empty" &&
    nextGrid[x + 1][y + 1].type !== "empty"
  ) {
    nextGrid[x][y] = empty;
    nextGrid[x - 1][y + 1] = grid[x][y];
    return true;
  }
  if (
    grid[x - 1][y + 1].type !== "empty" &&
    grid[x + 1][y + 1].type === "empty" &&
    nextGrid[x - 1][y + 1].type !== "empty" &&
    nextGrid[x + 1][y + 1].type === "empty"
  ) {
    nextGrid[x][y] = empty;
    nextGrid[x + 1][y + 1] = grid[x][y];
    return true;
  }
  if (
    grid[x - 1][y + 1].type === "empty" &&
    grid[x + 1][y + 1].type === "empty" &&
    nextGrid[x - 1][y + 1].type === "empty" &&
    nextGrid[x + 1][y + 1].type === "empty"
  ) {
    let rand = Math.floor(Math.random() * 2);
    if (rand) {
      nextGrid[x][y] = empty;

      nextGrid[x + 1][y + 1] = grid[x][y];
    } else {
      nextGrid[x][y] = empty;

      nextGrid[x - 1][y + 1] = grid[x][y];
    }
    return true;
  }
  return false;
};

const riseDiagonal = (grid, nextGrid, x, y) => {
  if (
    grid[x - 1][y - 1].type === "empty" &&
    grid[x + 1][y - 1].type !== "empty" &&
    nextGrid[x - 1][y - 1].type === "empty" &&
    nextGrid[x + 1][y - 1].type !== "empty"
  ) {
    nextGrid[x][y] = empty;
    nextGrid[x - 1][y - 1] = grid[x][y];
    return true;
  }
  if (
    grid[x - 1][y - 1].type !== "empty" &&
    grid[x + 1][y - 1].type === "empty" &&
    nextGrid[x - 1][y - 1].type !== "empty" &&
    nextGrid[x + 1][y - 1].type === "empty"
  ) {
    nextGrid[x][y] = empty;
    nextGrid[x + 1][y - 1] = grid[x][y];
    return true;
  }
  if (
    grid[x - 1][y - 1].type === "empty" &&
    grid[x + 1][y - 1].type === "empty" &&
    nextGrid[x - 1][y - 1].type === "empty" &&
    nextGrid[x + 1][y - 1].type === "empty"
  ) {
    let rand = Math.floor(Math.random() * 2);
    if (rand) {
      nextGrid[x][y] = empty;

      nextGrid[x + 1][y - 1] = grid[x][y];
    } else {
      nextGrid[x][y] = empty;

      nextGrid[x - 1][y - 1] = grid[x][y];
    }
    return true;
  }
  return false;
};

const spread = (grid, nextGrid, spread, x, y) => {
  let left = x - spread;
  if (left < 1) left = 1;
  let right = x + spread;
  if (right > grid.length - 1) right = grid.length - 1;
  if (
    grid[left][y].type === "empty" &&
    grid[right][y].type !== "empty" &&
    nextGrid[left][y].type === "empty" &&
    nextGrid[right][y].type !== "empty"
  ) {
    nextGrid[x][y] = grid[left][y];
    nextGrid[left][y] = grid[x][y];

    return true;
  }
  if (
    grid[left][y].type !== "empty" &&
    grid[right][y].type === "empty" &&
    nextGrid[left][y].type !== "empty" &&
    nextGrid[right][y].type === "empty"
  ) {
    nextGrid[x][y] = grid[right][y];
    nextGrid[right][y] = grid[x][y];
    return true;
  }
  if (
    grid[left][y].type === "empty" &&
    grid[right][y].type === "empty" &&
    nextGrid[left][y].type === "empty" &&
    nextGrid[right][y].type === "empty"
  ) {
    let rand = Math.floor(Math.random() * 2);
    if (rand) {
      nextGrid[x][y] = grid[left][y];
      nextGrid[left][y] = grid[x][y];
    } else {
      nextGrid[x][y] = grid[right][y];
      nextGrid[right][y] = grid[x][y];
    }
    return true;
  }
};

const empty = {
  type: "empty",
  color: "darkgrey",
  motion: () => {},
};

const sand = {
  type: "sand",
  color: "yellow",
  motion: sandMotion,
};

const water = {
  type: "water",
  color: "blue",
  motion: waterMotion,
};

const wall = {
  type: "wall",
  color: "black",
  motion: () => {},
};

const stone = {
  type: "stone",
  color: "lightgrey",
  motion: stoneMotion,
};

const wood = {
  type: "wood",
  color: "brown",
  motion: stoneMotion,
}

const gas = {
  type: "gas",
  color: "purple",
  motion: gasMotion,
};

const fire = {
  type: "fire",
  color: "red",
  motion: fireMotion,
};

module.exports = { empty, sand, water, wall, stone, gas, fire, wood };
