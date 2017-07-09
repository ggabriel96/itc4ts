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

class Grower {

  public static grow(id: ID, occurrence: Occurrence): Occurrence {
    return Grower.innerGrow(id, occurrence).occurrence;
  }

  private static innerGrow(id: ID, occurrence: Occurrence): GrowResult {
    if (id.isLeaf()) return Grower.growLeafID(id, occurrence);
    return Grower.growNonLeafID(id, occurrence);
  }

  private static growLeafID(id: ID, occurrence: Occurrence): GrowResult {
    if (id.isOne() && occurrence.isLeaf())
      return new GrowResult(Occurrence.with(occurrence.value + 1), 0);
    throw new TypeError("Illegal arguments: " + id + " and " + occurrence);
  }

  private static growNonLeafID(id: ID, occurrence: Occurrence): GrowResult {
    if (occurrence.isLeaf()) return Grower.growLeafEvent(id, occurrence);
    if (id.left.isZero()) return Grower.growOnRight(id, occurrence);
    if (id.right.isZero()) return Grower.growOnLeft(id, occurrence);
    return Grower.growOnBothSides(id, occurrence);
  }

  private static growLeafEvent(id: ID, occurrence: Occurrence): GrowResult {
    let er: GrowResult = Grower.innerGrow(id, Occurrence.with(occurrence.value, Occurrence.zero(), Occurrence.zero()));
    er.cost = er.cost + occurrence.depth + 1;
    return er;
  }

  private static growOnRight(id: ID, occurrence: Occurrence): GrowResult {
    let rightGrowth: GrowResult = Grower.growRight(id, occurrence);
    return Grower.rightGrowth(occurrence, rightGrowth);
  }

  private static growRight(id: ID, occurrence: Occurrence): GrowResult {
    return Grower.innerGrow(id.right, occurrence.right);
  }

  private static rightGrowth(occurrence: Occurrence, growth: GrowResult): GrowResult {
    let result: Occurrence = Occurrence.with(occurrence.value, occurrence.left, growth.occurrence);
    return new GrowResult(result, growth.cost + 1);
  }

  private static growOnLeft(id: ID, occurrence: Occurrence): GrowResult {
    let leftGrowth: GrowResult = Grower.growLeft(id, occurrence);
    return Grower.leftGrowth(occurrence, leftGrowth);
  }

  private static growLeft(id: ID, occurrence: Occurrence): GrowResult {
    return Grower.innerGrow(id.left, occurrence.left);
  }

  private static leftGrowth(occurrence: Occurrence, growth: GrowResult): GrowResult {
    let result: Occurrence = Occurrence.with(occurrence.value, growth.occurrence, occurrence.right);
    return new GrowResult(result, growth.cost + 1);
  }

  private static growOnBothSides(id: ID, occurrence: Occurrence): GrowResult {
    let leftGrowth: GrowResult = Grower.growLeft(id, occurrence);
    let rightGrowth: GrowResult = Grower.growRight(id, occurrence);
    if (leftGrowth.cost < rightGrowth.cost)
      return Grower.leftGrowth(occurrence, leftGrowth);
    return Grower.rightGrowth(occurrence, rightGrowth);
  }

}
