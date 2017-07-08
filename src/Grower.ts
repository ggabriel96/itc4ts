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

  public static grow(id: ID, event: Occurrence): Occurrence {
    return Grower.innerGrow(id, event).event;
  }

  private static innerGrow(id: ID, event: Occurrence): GrowResult {
    if (id.isLeaf()) return Grower.growLeafID(id, event);
    return Grower.growNonLeafID(id, event);
  }

  private static growLeafID(id: ID, event: Occurrence): GrowResult {
    if (id.isOne() && event.isLeaf())
      return new GrowResult(Occurrence.with(event.value + 1), 0);
    throw new TypeError("Illegal arguments: " + id + " and " + event);
  }

  private static growNonLeafID(id: ID, event: Occurrence): GrowResult {
    if (event.isLeaf()) return Grower.growLeafEvent(id, event);
    if (id.left.isZero()) return Grower.growOnRight(id, event);
    if (id.right.isZero()) return Grower.growOnLeft(id, event);
    return Grower.growOnBothSides(id, event);
  }

  private static growLeafEvent(id: ID, event: Occurrence): GrowResult {
    let er: GrowResult = Grower.innerGrow(id, Occurrence.with(event.value, Occurrence.zero(), Occurrence.zero()));
    er.cost = er.cost + event.depth + 1;
    return er;
  }

  private static growOnRight(id: ID, event: Occurrence): GrowResult {
    let rightGrowth: GrowResult = Grower.growRight(id, event);
    return Grower.rightGrowth(event, rightGrowth);
  }

  private static growRight(id: ID, event: Occurrence): GrowResult {
    return Grower.innerGrow(id.right, event.right);
  }

  private static rightGrowth(event: Occurrence, growth: GrowResult): GrowResult {
    let result: Occurrence = Occurrence.with(event.value, event.left, growth.event);
    return new GrowResult(result, growth.cost + 1);
  }

  private static growOnLeft(id: ID, event: Occurrence): GrowResult {
    let leftGrowth: GrowResult = Grower.growLeft(id, event);
    return Grower.leftGrowth(event, leftGrowth);
  }

  private static growLeft(id: ID, event: Occurrence): GrowResult {
    return Grower.innerGrow(id.left, event.left);
  }

  private static leftGrowth(event: Occurrence, growth: GrowResult): GrowResult {
    let result: Occurrence = Occurrence.with(event.value, growth.event, event.right);
    return new GrowResult(result, growth.cost + 1);
  }

  private static growOnBothSides(id: ID, event: Occurrence): GrowResult {
    let leftGrowth: GrowResult = Grower.growLeft(id, event);
    let rightGrowth: GrowResult = Grower.growRight(id, event);
    if (leftGrowth.cost < rightGrowth.cost)
      return Grower.leftGrowth(event, leftGrowth);
    return Grower.rightGrowth(event, rightGrowth);
  }

}
