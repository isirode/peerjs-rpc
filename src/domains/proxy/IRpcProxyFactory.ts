import { IRpcObject } from "../model/IRpcObject";

export interface IRpcProxyFactory {
  proxy<T extends IRpcObject>(target: T): T;
}