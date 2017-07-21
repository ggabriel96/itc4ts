import { Stamp } from "./Stamp";
// "(0,2,(0,1,0))"
let test = new Stamp().fork()[1].fork()[1].fork()[1].fork()[1].fork()[1].fork()[1].fork()[1];
console.log(test.id.toString())
let stamp: Stamp = Stamp.fromString(test.id.toString(), "(1, (2,1,3), (0, (1, 0, 2), 0))")
console.log(stamp.id.toString())

// let fs: Stamp[] = stamp.fork();
// console.log("fs[0] = " + fs[0]);
// console.log("fs[1] = " + fs[1] + "\n");

// // let e1: Stamp = fs[0].event();
// // console.log("e1 = " + e1);

// // let e2: Stamp = fs[1].event();
// // console.log("e2 = " + e2 + "\n");

// let f1: Stamp[] = fs[0].fork();
// console.log("f1[0] = " + f1[0]);
// console.log("f1[1] = " + f1[1] + "\n");

// let f2: Stamp[] = fs[1].fork();
// console.log("f2[0] = " + f2[0]);
// console.log("f2[1] = " + f2[1] + "\n");

// let e1: Stamp = f1[0].event();
// let e2: Stamp = e1.event();
// let e3: Stamp = e2.event();

// console.log("e1: " + e1);
// console.log("e2: " + e2);
// console.log("e3: " + e3);

// console.log("e3 send[0]: " + e3.send()[0]);
// console.log("e3 send[1]: " + e3.send()[1]);
// console.log("e3 send: " + f2[0].receive(e3.send()[1]));

// console.log("e1 <= e2: " + e1.leq(e2));
// console.log("e1 <= e3: " + e1.leq(e3));
// console.log("e2 <= e3: " + e2.leq(e3));
// console.log("e3 <= e1: " + e3.leq(e1));
// console.log("e3 <= e2: " + e3.leq(e2));
