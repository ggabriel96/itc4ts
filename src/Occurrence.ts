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
      return new NonLeafOccurrence(value, left, right);
    return new LeafOccurrence(value);
  }
}
