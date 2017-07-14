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

import { NonLeafOccurrence } from "./NonLeafOccurrence";
import { LeafOccurrence } from "./LeafOccurrence";
import { Occurrence } from "./Occurrence";
import { ParseState } from "./ParseState";

export class Occurrences {

  public static zero(): Occurrence {
    return Occurrences.with(0);
  }

  public static with(value: number, left?: Occurrence, right?: Occurrence) {
    if (left !== undefined && right !== undefined)
      return new NonLeafOccurrence(value, left, right);
    return new LeafOccurrence(value);
  }

  public static fromString(occurrence: string): Occurrence {
    let node: Occurrence;
    let nodeStack: Occurrence[] = [];
    let stateStack: ParseState[] = [ParseState.VALUE];
    for (let i: number = 0; stateStack.length > 0; i++) {
      if (occurrence[i] === ' ' || occurrence[i] === ',') continue;
      if (occurrence[i] === ')') {
        node = nodeStack.pop();
        continue;
      }
      let state: ParseState = stateStack.pop();
      switch (state) {
        case ParseState.VALUE:
          if (occurrence[i] === '(') {
            nodeStack.push(new NonLeafOccurrence());
            stateStack.push(ParseState.RIGHT);
            stateStack.push(ParseState.LEFT);
            stateStack.push(ParseState.VALUE);
          } else {
            if (nodeStack.length === 0) node = new LeafOccurrence();
            else node = nodeStack[nodeStack.length - 1];
            node.value = Number(occurrence[i]);
          }
          break;
        case ParseState.LEFT:
          if (occurrence[i] === '(') {
            node = new NonLeafOccurrence();
            nodeStack[nodeStack.length - 1].left = node;
            nodeStack.push(node);
            stateStack.push(ParseState.RIGHT);
            stateStack.push(ParseState.LEFT);
            stateStack.push(ParseState.VALUE);
          } else {
            nodeStack[nodeStack.length - 1].left = new LeafOccurrence(Number(occurrence[i]));
          }
          break;
        case ParseState.RIGHT:
          if (occurrence[i] === '(') {
            node = new NonLeafOccurrence();
            nodeStack[nodeStack.length - 1].right = node;
            nodeStack.push(node);
            stateStack.push(ParseState.RIGHT);
            stateStack.push(ParseState.LEFT);
            stateStack.push(ParseState.VALUE);
          } else {
            nodeStack[nodeStack.length - 1].right = new LeafOccurrence(Number(occurrence[i]));
          }
          break;
      }
    }
    while (nodeStack.length > 0) node = nodeStack.pop();
    return node;
  }

}
