import { User } from "peerjs-room";
import { Identifiable } from "./Identifiable";

export interface IRpcCallTarget {
  // FIXME : test wether or not this is sufficient to have local calls
  isLocal?: boolean;
  targetId?: string;
  userTarget?: User;
  usersTarget?: User[];
}

export interface IRpcObject extends Identifiable {
  nextTarget: IRpcCallTarget;
}

// TODO : implement a class or interface where the proxy can be skipped using a property named passthrough
// Or something similar
// Maybe an alternative to self / this
