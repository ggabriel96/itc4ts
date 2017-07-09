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

import { Stamp } from "./Stamp";
import { Occurrence } from "./Occurrence";

/**
 * Reasons about the order of two events.
 */
class Causality {

  private static lift(e: Occurrence): number {
    return e.isLeaf() ? 0 : e.value;
  }

  private static tryLeft(e: Occurrence): Occurrence {
    return e.isLeaf() ? e : e.left;
  }

  private static tryRight(e: Occurrence): Occurrence {
    return e.isLeaf() ? e : e.right;
  }

	/**
	 * Less than-equal operator for causality: either e1 happens before e2 or e1
	 * equals e2.
	 *
	 * @param offset1	The accumulated lifted value for occurrence e1.
	 * @param e1 The first occurrence being compared.
	 * @param offset2	The accumulated lifted value for occurrence e2
	 * @param e2 The second occurrence being compared.
	 * @return Returns if e1 is precedes or equals e2.
	 */
  private static lessThanEquals(offset1: number, e1: Occurrence, offset2: number, e2: Occurrence): boolean {
    let new_a: number = offset1 + e1.value;
    if (e1.isLeaf()) return new_a <= offset2 + e2.value;
    let new_b: number = Causality.lift(e2) + offset2;
    if (!Causality.lessThanEquals(new_a, e1.left, new_b, Causality.tryLeft(e2)))
      return false;
    return Causality.lessThanEquals(new_a, e1.right, new_b, Causality.tryRight(e2));
  }

  private static isUnordered(o: Order): boolean {
    return o === Order.EQUALS || o === Order.UNCOMPARABLE;
  }

  /**
   * Compose two causality events.
   */
  private static compose(c1: Order, c2: Order): Order {
    switch (c1) {
      case Order.EQUALS:
        return c2;
      case Order.UNCOMPARABLE:
        return Order.UNCOMPARABLE;
      case Order.HAPPENS_BEFORE: {
        switch (c2) {
          case Order.HAPPENS_BEFORE:
          case Order.EQUALS:
            return Order.HAPPENS_BEFORE;
          default:
            return Order.UNCOMPARABLE;
        }
      }
      default: {
        switch (c2) {
          case Order.HAPPENS_AFTER:
          case Order.EQUALS:
            return Order.HAPPENS_AFTER;
          default:
            return Order.UNCOMPARABLE;
        }
      }
    }
  }

	/**
	 * Base case of comparison.
	 */
  private static compare0(offset: number, e1: Occurrence, e2: Occurrence): Order {
    if (e1.value < e2.value)
      return Causality.lessThanEquals(offset, e1, offset, e2) ? Order.HAPPENS_BEFORE
        : Order.UNCOMPARABLE;
    if (e1.value > e2.value)
      return Causality.lessThanEquals(offset, e2, offset, e1) ? Order.HAPPENS_AFTER
        : Order.UNCOMPARABLE;
    // Since one of the events is a leaf occurrence, then only one leq is called.
    if (Causality.lessThanEquals(offset, e1, offset, e2)) {
      if (Causality.lessThanEquals(offset, e2, offset, e1))
        return Order.EQUALS;
      return Order.HAPPENS_BEFORE;
    }
    if (Causality.lessThanEquals(offset, e2, offset, e1))
      return Order.HAPPENS_AFTER;
    return Order.UNCOMPARABLE;
  }

	/**
	 * Checks if a given occurrence happens-before (LT), happens-after (GT), equals,
	 * or is undefined
	 */
  private static compare(offset: number, e1: Occurrence, e2: Occurrence): Order {
    if (e1.value != e2.value || e1.isLeaf() || e2.isLeaf())
      return Causality.compare0(offset, e1, e2);
    let newOffset: number = offset + e1.value;
    return Causality.compose(Causality.compare(newOffset, e1.left, e2.left), Causality.compare(newOffset, e1.right, e2.right));
  }

	/**
	 * Check if timestamp {@code s1} happens before or equals to timestamp {@code s2}
	 */
  public static stampLessThanEquals(s1: Stamp, s2: Stamp): boolean {
    return Causality.occurrenceLessThanEquals(s1.occurrence, s2.occurrence);
  }

	/**
	 * Check if occurrence {@code e1} precedes or equals occurrence {@code e2}
	 */
  public static occurrenceLessThanEquals(e1: Occurrence, e2: Occurrence): boolean {
    return Causality.lessThanEquals(0, e1, 0, e2);
  }

	/**
	 * Checks if this occurrence is concurrent with {@code e}. If
	 * {@code e1.isConcurrent(e2)}, then {@code e2.isConcurrent(e1)}.
	 *
	 * @param other The occurrence this object is being compared against.
	 * @return
	 */
  public static isConcurrent(e1: Occurrence, e2: Occurrence): boolean {
    return Causality.isUnordered(Causality.compare(0, e1, e2));
  }

	/**
	 * Checks if this occurrence happened before the other. If neither occurrence happened
	 * before the other, we say that they are concurrent.
	 */
  public static stampHappensBefore(s1: Stamp, s2: Stamp): boolean {
    return Causality.happensBefore(s1.occurrence, s2.occurrence);
  }

	/**
	 * Checks if this occurrence happened before the other. If neither occurrence happened
	 * before the other, we say that they are concurrent.
	 */
  public static happensBefore(e1: Occurrence, e2: Occurrence): boolean {
    return Causality.compare(0, e1, e2) == Order.HAPPENS_BEFORE;
  }

}
