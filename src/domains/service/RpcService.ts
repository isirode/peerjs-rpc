import { P2PRoom } from "peerjs-room";
import { IRpcProxyFactory } from "../proxy/IRpcProxyFactory";
import { RpcProxyFactory } from "../proxy/RpcProxyFactory";
import { IRpcService } from "./IRpcService";
import { Response, Request } from "peerjs-request-response";
import { IRpcFetchResponse, IRpcFetchRequest, IRpcMessage, RpcCallType } from "../model/IRpcMessage";
import { IStore } from "../store/IStore";
import { IRpcCallTarget, IRpcObject } from "../model/IRpcObject";
import * as rdfc from 'rfdc';
import { Store } from "../store/Store";

const clone = rdfc();

const AsyncFunction = (async () => {}).constructor;

export class RpcService implements IRpcService {

  // TODO : could need a higher level abstraction of a channel
  // could want a version of all this base on connection only
  p2pRoom: P2PRoom;
  rpcProxyFactory: IRpcProxyFactory;
  store: IStore;

  constructor(p2pRoom: P2PRoom, store: IStore = new Store(), rpcChannelName: string = 'rpc') {
    this.p2pRoom = p2pRoom;
    this.store = store;

    const self = this;
    this.rpcProxyFactory = new RpcProxyFactory(
      p2pRoom.getChannel(rpcChannelName, {
        clientMapper: {
          // FIXME : unwrap should be allowing undefined
          unwrap: function (data: any): Response<IRpcFetchResponse> {
            const rpcMessage = data as IRpcMessage;
            return rpcMessage.response;
          },
          wrap: function (request: Request<IRpcFetchRequest>): IRpcMessage {
            const rpcMessage: IRpcMessage = {
              request: request
            }
            return rpcMessage;
          }
        },
        serverMapper: {
          unwrap: function (data: IRpcMessage): Request<IRpcFetchRequest> {
            const rpcMessage = data as IRpcMessage;
            return rpcMessage.request;
          },
          wrap: function (response: Response<IRpcFetchResponse>): IRpcMessage {
            const rpcMessage: IRpcMessage = {
              response: response
            }
            return rpcMessage;
          }
        },
        serverHandler: {
          handle: async function (request: Request<IRpcFetchRequest>): Promise<Response<IRpcFetchResponse>> {

            console.log(`handling request`, request);
            
            let response: Response<IRpcFetchResponse>;
            let rpcResponse: IRpcFetchResponse;
            let object: IRpcObject;

            try {
              object = self.store.find(request.content.targetId);
              if (object === undefined) {
              throw new Error(`rpc of id '${request.content.targetId} was not found in store of user ${self.p2pRoom.localUser.name}:${self.p2pRoom.localUser.peer.id}`);
              }

              const nextTarget: IRpcCallTarget = clone(object.nextTarget);
              nextTarget.isLocal = true;

              let result: unknown;
              const prop = object[request.content.property];
              switch(request.content.rpcCallType) {
                case RpcCallType.MethodCall:
                  if (prop instanceof Function || prop instanceof AsyncFunction) {
                    // TODO : implement multi arguments request here
                    // if arg is instance of array
                    result = await prop(request.content.arguments);
                  } else {
                    throw new Error(`property '${request.content.property}' is not a method but the RpcCallType is '${request.content.rpcCallType}'`)
                  }
                  break;
                case RpcCallType.Set:
                  if (request.content.arguments.length !== 0) {
                    throw new Error(`arguments length should be exactly 0 when the RpcCallType is '${request.content.rpcCallType}'`);
                  }
                  object[request.content.property] = request.content.arguments[0];
                  result = undefined;
                  break;
                default:
                  throw new Error(`unknown RpcCallType '${request.content.rpcCallType}'`);
              }
              
              rpcResponse = {
                error: undefined,
                result: result
              }
              response = {
                id: request.id,
                payload: rpcResponse
              }
              return response;
            } catch (err: unknown) {
              rpcResponse = {
                result: undefined,
                error: err as Error
              }
              response = {
                id: request.id,
                payload: rpcResponse
              }
              return response;
            }
          }
        },
      })
    );
  }

  add<ObjectType extends IRpcObject>(object: ObjectType): ObjectType {
    
    const proxy = this.rpcProxyFactory.proxy(object);

    this.store.add(proxy);
    
    return proxy;
  }

  // Info : there is not point to send a sync command for a first level object
  // To instantiate it remotly
  // Since the remote side would have to know how to instantiate it
  // TODO : implement it using a factory system

}