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

class Stamp {

  public readonly occurrence: Occurrence;
  private readonly id: ID;

  constructor(id?: ID, occurrence?: Occurrence) {
    this.id = id || ID.one();
    this.occurrence = occurrence || Occurrence.zero();
  }

  public fork(): Stamp[] {
    let ids: ID[] = this.id.split();
    return [
      new Stamp(ids[0], this.occurrence),
      new Stamp(ids[1], this.occurrence)
    ];
  }

  public peek(): Stamp[] {
    return [
      new Stamp(this.id, this.occurrence),
      new Stamp(ID.zero(), this.occurrence)
    ];
  }

  public join(other: Stamp): Stamp {
    return new Stamp(this.id.sum(other.id), this.occurrence.join(other.occurrence));
  }

  public event(): Stamp {
    let filled: Occurrence = Filler.fill(this.id, this.occurrence);
    if (!filled.equals(this.occurrence)) return new Stamp(this.id, filled);
    return new Stamp(this.id, Grower.grow(this.id, this.occurrence));
  }

  public toString(): string {
    return "(" + this.id + ", " + this.occurrence + ")";
  }

  public equals(o: any): boolean {
    if (!(o instanceof Stamp)) return false;
    let other: Stamp = o as Stamp;
    return this.id.equals(other.id) && this.occurrence.equals(other.occurrence);
  }

  public send(): Stamp[] {
    return this.event().peek();
  }

  public receive(other: Stamp): Stamp {
    return this.join(other).event();
  }

  public sync(other: Stamp): Stamp[] {
    return this.join(other).fork();
  }

  public leq(other: Stamp): boolean {
    return this.occurrence.leq(other.occurrence);
  }

}