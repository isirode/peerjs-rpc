import { IChannel } from "peerjs-room";
import { IRpcFetchRequest, IRpcFetchResponse, IRpcMessage } from "../model/IRpcMessage";
import { IRpcObject } from "../model/IRpcObject";

export interface IRpcProxyFactory {
  channel: IChannel<IRpcMessage, IRpcFetchRequest, IRpcFetchResponse>;
  proxy<T extends IRpcObject>(target: T): T;
}