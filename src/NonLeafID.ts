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

import { ID } from "./ID";
import { IDs } from "./IDs";

export class NonLeafID extends ID {

  public left: ID;
  public right: ID;

  constructor(left?: ID, right?: ID) {
    super();
    this.left = left;
    this.right = right;
  }

  public get value(): number {
    throw new ReferenceError("Cannot get value on an internal node");
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
      return IDs.zero();
    if (left.isOne() && right.isOne())
      return IDs.one();
    return IDs.with(left, right);
  }

  public split(): ID[] {
    if (this.left.isZero())
      return this.splitWithLeftZero();
    if (this.right.isZero())
      return this.splitWithRightZero();
    return [
      IDs.with(this.left, IDs.zero()),
      IDs.with(IDs.zero(), this.right)
    ];
  }

  private splitWithLeftZero(): ID[] {
    let rightSplit: ID[] = this.right.split();
    return [
      IDs.with(IDs.zero(), rightSplit[0]),
      IDs.with(IDs.zero(), rightSplit[1])
    ];
  }

  private splitWithRightZero(): ID[] {
    let leftSplit: ID[] = this.left.split();
    return [
      IDs.with(leftSplit[0], IDs.zero()),
      IDs.with(leftSplit[1], IDs.zero())
    ];
  }

  public sum(other: ID): ID {
    if (other.isZero()) return this;
    if (!other.isLeaf()) return this.sumNonLeaf(other);
    throw new TypeError("Can't sum " + this + " with 1.");
  }

  private sumNonLeaf(other: ID): ID {
    let leftSum: ID = this.left.sum(other.left);
    let rightSum: ID = this.right.sum(other.right);
    let sum: ID = IDs.with(leftSum, rightSum);
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
