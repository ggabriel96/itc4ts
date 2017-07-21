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

import { Occurrence } from "./Occurrence";
import { Occurrences } from "./Occurrences";

export class LeafOccurrence extends Occurrence {

  public value: number;

  constructor(value?: number) {
    super();
    this.value = value || 0;
  }

  public get left(): Occurrence {
    return null;
  }

  public set left(left: Occurrence) {
    throw new ReferenceError("Cannot set left node on a leaf");
  }

  public get right(): Occurrence {
    return null;
  }

  public set right(right: Occurrence) {
    throw new ReferenceError("Cannot set right node on a leaf");
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
    if (other.isLeaf()) return new LeafOccurrence(Math.max(this.value, other.value));
    return Occurrences.with(this.value, Occurrences.zero(), Occurrences.zero()).join(other);
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
