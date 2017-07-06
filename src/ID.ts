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
