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

import { IDs } from "./IDs";
import { ID } from "./ID";

export class LeafID extends ID {

  public readonly value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  public get left(): ID {
    return null;
  }

  public get right(): ID {
    return null;
  }

  public isOne(): boolean {
    return this.value === 1;
  }

  public isZero(): boolean {
    return this.value === 0;
  }

  public isLeaf(): boolean {
    return true;
  }

  public normalize(): ID {
    return this;
  }

  public split(): ID[] {
    if (this.isZero())
      return [IDs.zero(), IDs.zero()];
    return [
      IDs.with(IDs.one(), IDs.zero()),
      IDs.with(IDs.zero(), IDs.one())
    ];
  }

  public sum(other: ID): ID {
    if (this.isZero()) return other;
    if (other.isZero()) return this;
    throw new TypeError("Can't sum " + this + " with " + other);
  }

  public equals(object: any): boolean {
    if (!(object instanceof LeafID))
      return false;
    let other: LeafID = object as LeafID;
    return this.value === other.value;
  }

  public toString(): string {
    return this.value.toString();
  }

}
