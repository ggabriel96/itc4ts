abstract class Occurrence {
  abstract get value(): number;
  abstract get left(): Occurrence;
  abstract get right(): Occurrence;
  abstract min(): number;
  abstract max(): number;

  public get depth(): number {
    return this.maxDepth(0);
  }

  protected abstract maxDepth(depth: number): number;
  abstract isLeaf(): boolean;
  abstract lift(m: number): Occurrence;
  abstract sink(m: number): Occurrence;
  abstract normalize(): Occurrence;
  abstract leq(other: Occurrence): boolean;
  abstract join(other: Occurrence): Occurrence;

  public static zero(): Occurrence {
    return Occurrence.with(0);
  }

  public static with(value: number, left?: Occurrence, right?: Occurrence) {
    if (typeof left !== undefined && typeof right !== undefined)
      return new NonLeafEvent(value, left, right);
    return new LeafOccurrence(value);
  }
}
