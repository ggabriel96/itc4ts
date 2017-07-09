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

export abstract class Occurrence {

  public abstract get value(): number;
  public abstract get left(): Occurrence;
  public abstract get right(): Occurrence;
  public abstract min(): number;
  public abstract max(): number;

  public get depth(): number {
    return this.maxDepth(0);
  }

  protected abstract maxDepth(depth: number): number;
  public abstract isLeaf(): boolean;
  public abstract lift(m: number): Occurrence;
  public abstract sink(m: number): Occurrence;
  public abstract normalize(): Occurrence;
  public abstract leq(other: Occurrence): boolean;
  public abstract join(other: Occurrence): Occurrence;
  public abstract equals(object: any): boolean;

}
