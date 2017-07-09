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

  public static fill(id: ID, occurrence: Occurrence): Occurrence {
    if (id.isLeaf()) return Filler.fillWithLeafID(id, occurrence);
    if (occurrence.isLeaf()) return occurrence;
    return Filler.fillNonLeafs(id, occurrence);
  }

  private static fillWithLeafID(leafID: ID, occurrence: Occurrence): Occurrence {
    if (leafID.isZero()) return occurrence;
    return Occurrence.with(occurrence.max());
  }

  private static fillNonLeafs(id: ID, occurrence: Occurrence): Occurrence {
    if (id.left.isOne()) return Filler.fillLeftOneID(id, occurrence);
    if (id.right.isOne()) return Filler.fillRightOneID(id, occurrence);
    return Filler.fillLeftRight(id, occurrence);
  }

  private static fillLeftOneID(id: ID, occurrence: Occurrence): Occurrence {
    let filledRight: Occurrence = Filler.fillRight(id, occurrence);
    let max: number = Math.max(occurrence.left.max(), filledRight.min());
    return Occurrence.with(occurrence.value, Occurrence.with(max), filledRight).normalize();
  }

  private static fillRight(id: ID, occurrence: Occurrence): Occurrence {
    return Filler.fill(id.right, occurrence.right);
  }

  private static fillRightOneID(id: ID, occurrence: Occurrence): Occurrence {
    let filledLeft: Occurrence = Filler.fillLeft(id, occurrence);
    let max: number = Math.max(occurrence.right.max(), filledLeft.min());
    return Occurrence.with(occurrence.value, filledLeft, Occurrence.with(max)).normalize();
  }

  private static fillLeft(id: ID, occurrence: Occurrence): Occurrence {
    return Filler.fill(id.left, occurrence.left);
  }

  private static fillLeftRight(id: ID, occurrence: Occurrence): Occurrence {
    return Occurrence.with(occurrence.value, Filler.fillLeft(id, occurrence), Filler.fillRight(id, occurrence)).normalize();
  }
  
}
