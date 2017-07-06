class NonLeafID extends ID {
  private readonly _left: ID;
  private readonly _right: ID;

  constructor(left: ID, right: ID) {
    super();
    this._left = left;
    this._right = right;
  }

  public get left(): ID {
    return this._left;
  }

  public get right(): ID {
    return this._right;
  }

  public isOne(): boolean {
    return false;
  }

  public isZero(): boolean {
    return false;
  }

  public isLeaf(): boolean {
    return false;
  }

  public normalize(): ID {
    return this._normalize(this.left.normalize(), this.right.normalize());
  }

  private _normalize(left: ID, right: ID): ID {
    if (left.isZero() && right.isZero())
      return ID.zero();
    if (left.isOne() && right.isOne())
      return ID.one();
    return ID.with(left, right);
  }

  public split(): ID[] {
    if (this.left.isZero())
      return this.splitWithLeftZero();
    if (this.right.isZero())
      return this.splitWithRightZero();
    return [
      ID.with(this.left, ID.zero()),
      ID.with(ID.zero(), this.right)
    ];
  }

  private splitWithLeftZero(): ID[] {
    let rightSplit: ID[] = this.right.split();
    return [
      ID.with(ID.zero(), rightSplit[0]),
      ID.with(ID.zero(), rightSplit[1])
    ];
  }

  private splitWithRightZero(): ID[] {
    let leftSplit: ID[] = this.left.split();
    return [
      ID.with(leftSplit[0], ID.zero()),
      ID.with(leftSplit[1], ID.zero())
    ];
  }

  public sum(other: ID): ID {
    if (other.isZero())
      return this;
    if (!other.isLeaf())
      return this.sumNonLeaf(other);
    throw new TypeError("Can't sum " + this + " with 1.");
  }

  private sumNonLeaf(other: ID): ID {
    let leftSum: ID = this.left.sum(other.left);
    let rightSum: ID = this.right.sum(other.right);
    let sum: ID = ID.with(leftSum, rightSum);
    return sum.normalize();
  }

  public equals(object: any): boolean {
    if (!(object instanceof NonLeafID))
      return false;
    let other: NonLeafID = object as NonLeafID;
    return this.left.equals(other.left) &&
      this.right.equals(other.right);
  }

  public toString(): string {
    return "(" + this.left + ", " + this.right + ")";
  }
}

