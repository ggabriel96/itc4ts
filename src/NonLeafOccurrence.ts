/**
 * Copyright (C) 2017  Gabriel Batista Galli
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

class NonLeafOccurrence extends Occurrence {

  private readonly _value: number;
  private readonly _left: Occurrence;
  private readonly _right: Occurrence;

  constructor(value: number, left: Occurrence, right: Occurrence) {
    super();
    this._value = value;
    this._left = left;
    this._right = right;
  }

  public get value(): number {
    return this._value;
  }

  public get left(): Occurrence {
    return this._left;
  }

  public get right(): Occurrence {
    return this._right;
  }

  public max(): number {
    let max: number = Math.max(this.left.max(), this.right.max());
    return this.value + max;
  }

  public min(): number {
    let min: number = Math.min(this.left.min(), this.right.min());
    return this.value + min;
  }

  protected maxDepth(depth: number): number {
    let leftDepth = (this.left as NonLeafOccurrence).maxDepth(depth + 1);
    let rightDepth = (this.right as NonLeafOccurrence).maxDepth(depth + 1);
    return Math.max(leftDepth, rightDepth);
  }

  public isLeaf(): boolean {
    return false;
  }

  public lift(m: number): Occurrence {
    return Occurrence.with(this.value + m, this.left, this.right);
  }

  public sink(m: number): Occurrence {
    return Occurrence.with(this.value - m, this.left, this.right);
  }

  public normalize(): Occurrence {
    if (this.left.isLeaf() && this.right.isLeaf() && this.left.value == this.right.value)
      return Occurrence.with(this.value + this.left.value);
    let min: number = Math.min(this.left.min(), this.right.min());
    return Occurrence.with(this.value + min, this.left.sink(min), this.right.sink(min));
  }

  public leq(other: Occurrence): boolean {
    if (other.isLeaf()) return this.leqLeaf(other);
    return this.leqNonLeafs(other);
  }

  private leqLeaf(other: Occurrence): boolean {
    return this.value <= other.value && this.liftedLeft(this).leq(other) && this.liftedRight(this).leq(other);
  }

  private liftedLeft(occurrence: Occurrence): Occurrence {
    return occurrence.left.lift(occurrence.value);
  }

  private liftedRight(occurrence: Occurrence): Occurrence {
    return occurrence.right.lift(occurrence.value);
  }

  private leqNonLeafs(other: Occurrence): boolean {
    return this.value <= other.value && this.liftedLeft(this).leq(this.liftedLeft(other)) &&this.liftedRight(this).leq(this.liftedRight(other));
  }

  public join(other: Occurrence): Occurrence {
    if (other.isLeaf())
      return this.join(Occurrence.with(other.value, Occurrence.zero(), Occurrence.zero()));
    return this.joinNonLeaf(other);
  }

  private joinNonLeaf(other: Occurrence): Occurrence {
    if (this.value > other.value) return other.join(this);
    let join: Occurrence = Occurrence.with(this.value, this.leftJoin(other), this.rightJoin(other));
    return join.normalize();
  }

  private leftJoin(other: Occurrence): Occurrence {
    let otherLiftedLeft: Occurrence = other.left.lift(other.value - this.value);
    return this.left.join(otherLiftedLeft);
  }

  private rightJoin(other: Occurrence): Occurrence {
    let otherLiftedRight: Occurrence = other.right.lift(other.value - this.value);
    return this.right.join(otherLiftedRight);
  }

  public equals(object: any): boolean {
    if (!(object instanceof NonLeafOccurrence)) return false;
    let other: NonLeafOccurrence = object as NonLeafOccurrence;
    return this.value == other.value &&
      this.left.equals(other.left) &&
      this.right.equals(other.right);
  }

  public toString(): string {
    return "(" + this.value + ", " + this.left + ", " + this.right + ")";
  }
  
}
