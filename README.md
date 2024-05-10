# PathfindingAlgorithmVisualizer

Welcome to the Pathfinding Algorithm Visualizer! This project, written in Angular, allows you to explore and visualize pathfinding algorithms and maze generation techniques.

# Functionalities

## Pathfinding

The primary functionality of this visualizer is to demonstrate various pathfinding algorithms by finding the shortest path between two given points on a grid. Currently supported pathfinding algorithms include:

* **Depth-First Search (DFS):** Explores as far as possible along each branch before backtracking, often used for maze generation but not optimal for finding shortest paths.
* **Breadth-First Search (BFS):** Searches level by level to find the shortest path between two points, guaranteeing the shortest path for unweighted graphs.
* **Dijkstra's Algorithm:** Finds the shortest path between two points by exploring all possible paths
* **A star Algorithm:** Utilizes heuristics to efficiently find the shortest path between two points, often outperforming Dijkstra's Algorithm.

### Preview

https://github.com/SashoVas/PathfindingAlgorithmVisualizer/assets/98760930/84bc5abc-ea97-4922-b31d-00df145a7117

## Maze Generation

In addition to pathfinding, this visualizer also allows you to generate mazes using different algorithms. Mazes serve as interesting environments to test and visualize pathfinding algorithms. Supported maze generation algorithms include:

* **Randomized Depth-First Search (Recursive Backtracking):** A recursive algorithm that creates mazes by randomly selecting paths and backtracking when it reaches a dead-end.
* **Randomized Prim's Algorithm:** Creates mazes by randomly selecting a starting cell and adding adjacent cells to the maze one at a time until there are no more unvisited cells.
* **Recursive division Algorithm:** Generates mazes by randomly the screen in halfs recursively.

### Preview

https://github.com/SashoVas/PathfindingAlgorithmVisualizer/assets/98760930/c53665d2-36d8-48fb-8e14-1c9b5e84ac27

## Getting Started
To start using the Pathfinding Algorithm Visualizer, follow these steps:

1. Clone the repository to your local machine.
2. Install Node.js and npm if you haven't already.
3. Navigate to the project directory and run `npm install` to install dependencies.
4. After the installation is complete, run `ng serve` to start the development server.
5. Open your web browser and navigate to `http://localhost:4200/` to access the visualizer.

Enjoy exploring different pathfinding algorithms and generating mazes with the Pathfinding Algorithm Visualizer! If you have any questions or feedback, feel free to reach out to us. Happy pathfinding!
