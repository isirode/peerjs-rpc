import Emittery from "emittery";
import { IRpcObject } from "../model/IRpcObject";
import { Events, IStore } from "./IStore";

export class Store implements IStore {

  // events: Emittery<Events>;
  protected objectMap: Map<string, IRpcObject> = new Map();

  find(id: string): IRpcObject {
    return this.objectMap.get(id);
  }

  add(object: IRpcObject) {
    this.objectMap.set(object.id, object);
  }
  
}