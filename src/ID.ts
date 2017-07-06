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

abstract class ID {
  abstract get left(): ID;
  abstract get right(): ID;
  abstract isLeaf(): boolean;
  abstract isZero(): boolean;
  abstract isOne(): boolean;
  abstract normalize(): ID;
  abstract split(): ID[];
  abstract sum(other: ID): ID;
  abstract equals(object: any): boolean;

  public static zero(): ID {
    return new LeafID(0);
  }

  public static one(): ID {
    return new LeafID(1);
  }

  public static with(left: ID, right: ID): ID {
    return new NonLeafID(left, right);
  }
}
