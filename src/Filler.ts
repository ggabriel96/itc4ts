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

class Filler {

  public static fill(id: ID, event: Occurrence): Occurrence {
    if (id.isLeaf()) return Filler.fillWithLeafID(id, event);
    if (event.isLeaf()) return event;
    return Filler.fillNonLeafs(id, event);
  }

  private static fillWithLeafID(leafID: ID, event: Occurrence): Occurrence {
    if (leafID.isZero()) return event;
    return Occurrence.with(event.max());
  }

  private static fillNonLeafs(id: ID, event: Occurrence): Occurrence {
    if (id.left.isOne()) return Filler.fillLeftOneID(id, event);
    if (id.right.isOne()) return Filler.fillRightOneID(id, event);
    return Filler.fillLeftRight(id, event);
  }

  private static fillLeftOneID(id: ID, event: Occurrence): Occurrence {
    let filledRight: Occurrence = Filler.fillRight(id, event);
    let max: number = Math.max(event.left.max(), filledRight.min());
    return Occurrence.with(event.value, Occurrence.with(max), filledRight).normalize();
  }

  private static fillRight(id: ID, event: Occurrence): Occurrence {
    return Filler.fill(id.right, event.right);
  }

  private static fillRightOneID(id: ID, event: Occurrence): Occurrence {
    let filledLeft: Occurrence = Filler.fillLeft(id, event);
    let max: number = Math.max(event.right.max(), filledLeft.min());
    return Occurrence.with(event.value, filledLeft, Occurrence.with(max)).normalize();
  }

  private static fillLeft(id: ID, event: Occurrence): Occurrence {
    return Filler.fill(id.left, event.left);
  }

  private static fillLeftRight(id: ID, event: Occurrence): Occurrence {
    return Occurrence.with(event.value, Filler.fillLeft(id, event), Filler.fillRight(id, event)).normalize();
  }
}
