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

import { ParseState } from "./ParseState";
import { NonLeafID } from "./NonLeafID";
import { LeafID } from "./LeafID";
import { ID } from "./ID";

export class IDs {

  public static zero(): ID {
    return new LeafID(0);
  }

  public static one(): ID {
    return new LeafID(1);
  }

  public static with(left: ID, right: ID): ID {
    return new NonLeafID(left, right);
  }

  public static fromString(id: string): ID {
    let node: ID;
    let nodeStack: ID[] = [];
    let stateStack: ParseState[] = [ParseState.VALUE];
    for (let i: number = 0; stateStack.length > 0; i++) {
      if (id[i] === ' ' || id[i] === ',') continue;
      if (id[i] === ')') {
        node = nodeStack.pop();
        continue;
      }
      let state: ParseState = stateStack.pop();
      switch (state) {
        case ParseState.VALUE:
          if (id[i] === '(') {
            nodeStack.push(new NonLeafID());
            stateStack.push(ParseState.RIGHT);
            stateStack.push(ParseState.LEFT);
          } else {
            node = new LeafID(Number(id[i]));
          }
          break;
        case ParseState.LEFT:
          if (id[i] === '(') {
            node = new NonLeafID();
            nodeStack[nodeStack.length - 1].left = node;
            nodeStack.push(node);
            stateStack.push(ParseState.RIGHT);
            stateStack.push(ParseState.LEFT);
          } else {
            nodeStack[nodeStack.length - 1].left = new LeafID(Number(id[i]));
          }
          break;
        case ParseState.RIGHT:
          if (id[i] === '(') {
            node = new NonLeafID();
            nodeStack[nodeStack.length - 1].right = node;
            nodeStack.push(node);
            stateStack.push(ParseState.RIGHT);
            stateStack.push(ParseState.LEFT);
          } else {
            nodeStack[nodeStack.length - 1].right = new LeafID(Number(id[i]));
          }
          break;
      }
    }
    while (nodeStack.length > 0) node = nodeStack.pop();
    return node;
  }

}
