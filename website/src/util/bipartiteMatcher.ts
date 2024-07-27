export class BipartiteMatcher {
    private graph: Map<number, number[]>;
    private matchL: Map<number, number>;
    private matchR: Map<number, number>;
    private dist: Map<number, number>;
    public NIL = 0;
    private INF = Infinity;
  
    constructor(graph: Map<number, number[]>) {
      this.graph = graph;
      this.matchL = new Map();
      this.matchR = new Map();
      this.dist = new Map();
    }
  
    public maxBipartiteMatching(): number {
      let matching = 0;
  
      while (this.bfs()) {
        this.graph.forEach((_, u) => {
          if (this.matchL.get(u) === this.NIL && this.dfs(u)) {
            matching++;
          }
        });
      }
  
      return matching;
    }
  
    private bfs(): boolean {
      const queue: number[] = [];
  
      this.graph.forEach((_, u) => {
        if (this.matchL.get(u) === this.NIL) {
          this.dist.set(u, 0);
          queue.push(u);
        } else {
          this.dist.set(u, this.INF);
        }
      });
  
      this.dist.set(this.NIL, this.INF);
  
      while (queue.length > 0) {
        const u = queue.shift()!;
        if (this.dist.get(u) < this.dist.get(this.NIL)) {
          this.graph.get(u)?.forEach((v) => {
            if (this.dist.get(this.matchR.get(v) ?? this.NIL) === this.INF) {
              this.dist.set(this.matchR.get(v) ?? this.NIL, this.dist.get(u)! + 1);
              queue.push(this.matchR.get(v) ?? this.NIL);
            }
          });
        }
      }
  
      return this.dist.get(this.NIL) !== this.INF;
    }
  
    private dfs(u: number): boolean {
      if (u !== this.NIL) {
        for (const v of this.graph.get(u) ?? []) {
          if (this.dist.get(this.matchR.get(v) ?? this.NIL) === this.dist.get(u)! + 1) {
            if (this.dfs(this.matchR.get(v) ?? this.NIL)) {
              this.matchR.set(v, u);
              this.matchL.set(u, v);
              return true;
            }
          }
        }
        this.dist.set(u, this.INF);
        return false;
      }
      return true;
    }
  
    public getMatches(): Map<number, number> {
      return this.matchL;
    }
  }
  