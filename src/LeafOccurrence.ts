class LeafOccurrence extends Occurrence {

  private readonly _value: number;

  constructor(value?: number) {
    super();
    this._value = value || 0;
  }

  public get value(): number {
    return this._value;
  }

  public get left(): Occurrence {
    return null;
  }

  public get right(): Occurrence {
    return null;
  }

  public max(): number {
    return this.value;
  }

  public min(): number {
    return this.value;
  }

  protected maxDepth(depth: number): number {
    return depth;
  }

  public isLeaf(): boolean {
    return true;
  }

  public lift(m: number): Occurrence {
    return new LeafOccurrence(this.value + m);
  }

  public sink(m: number): Occurrence {
    return new LeafOccurrence(this.value - m);
  }

  public normalize(): Occurrence {
    return this;
  }

  public leq(other: Occurrence): boolean {
    return this.value <= other.value;
  }

  public join(other: Occurrence): Occurrence {
    if (other.isLeaf())
      return new LeafOccurrence(Math.max(this.value, other.value));
    return Occurrence.with(this.value, Occurrence.zero(), Occurrence.zero()).join(other);
  }

  public equals(object: any): boolean {
    if (!(object instanceof LeafOccurrence))
      return false;
    const other: LeafOccurrence = object as LeafOccurrence;
    return this.value === other.value;
  }

  public toString(): string {
    return this.value.toString();
  }
}
