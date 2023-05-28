import { IRpcObject } from "../model/IRpcObject";

export interface IRpcService {
  add<ObjectType extends IRpcObject>(object: ObjectType): ObjectType;
}

