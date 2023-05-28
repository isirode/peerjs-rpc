// import { isAsyncFunction } from "util/types";
import { IRpcFetchRequest, IRpcFetchResponse, IRpcMessage, RpcCallType } from "../model/IRpcMessage";
import { IRpcProxyFactory } from "./IRpcProxyFactory";
import { IChannel } from 'peerjs-room';
import { IRpcCallTarget, IRpcObject } from "../model/IRpcObject";
import { IRpcObjectOptions } from "../model/IRpcObjectOptions";
import { RpcAggregateError } from "./RpcAggregateError";
import * as rdfc from 'rfdc';

const clone = rdfc();

const AsyncFunction = (async () => {}).constructor;

export class RpcProxyFactory implements IRpcProxyFactory {

  channel: IChannel<IRpcMessage, IRpcFetchRequest, IRpcFetchResponse>;

  constructor(channel: IChannel<IRpcMessage, IRpcFetchRequest, IRpcFetchResponse>) {
    this.channel = channel;
  }

  proxy<ObjectType extends IRpcObject>(target: ObjectType, options?: IRpcObjectOptions): ObjectType {
    const self = this;

    const proxy = new Proxy(target, {
      set(obj, prop: string | Symbol, newValue) {
        if (prop instanceof Symbol) {
          throw new Error(`Symbol keys are not supported`);
        }

        const nextTarget: IRpcCallTarget = clone(target.nextTarget);

        const value = obj[prop];

        // TODO : make an option to control this ?
        // Could wait for confirmation for instance
        obj[prop] = newValue;

        if (nextTarget.isLocal) {
          return true;
        }

        if (options.immediatePropertySync) {
          const request: IRpcFetchRequest = {
            targetId: nextTarget.targetId ?? target.id,
            property: prop,
            arguments: [newValue],
            rpcCallType: RpcCallType.MethodCall
          }

          // TODO : do something with the result ?
          const result = self.sendRequest(target, nextTarget, request, options);

          return true;

        } else {
          // TODO : implement a batch system for all this
          console.warn('only immediate sync is supported for now');
        }
        
        return true;
      },
      async get(obj, prop: string | Symbol, receiver) {
        if (prop instanceof Symbol) {
          throw new Error(`Symbol keys are not supported`);
        }

        const nextTarget: IRpcCallTarget = clone(target.nextTarget);

        if (AsyncFunction === undefined) {
          console.warn(`AsyncFunction is undefined`);
        }

        const value = obj[prop];
        if (nextTarget.isLocal) {
          if (value instanceof AsyncFunction) {
            return function (...args: any[]) {
              console.log('returning local result', args);
              return (value as any).apply(this === receiver ? obj : this, args);
            };
          } else if (value instanceof Function) {
            return function (...args: any[]) {
              console.log('returning local result', args);
              return value.apply(this === receiver ? obj : this, args);
            };
          } else {
            return value;
          }
        }

        console.log(typeof value)
        if (value instanceof Function || value instanceof AsyncFunction) {

          console.log('is function, proxying');
          // Info : cannot use these
          // Reflect.getMetadata("design:returntype", obj, prop);
          // ReturnType<typeof value>();
          // (false as true) && value(undefined)

          // FIXME : the handling of normal function
          // I return a result but maybe we should not

          return async function (...args: any[]) {
            console.log(args);
            const request: IRpcFetchRequest = {
              targetId: nextTarget.targetId ?? target.id,
              property: prop,
              arguments: args,
              rpcCallType: RpcCallType.MethodCall
            }

            const result = self.sendRequest(target, nextTarget, request, options);

            return result;
          };
        }
        console.log('is not a function, returning the value');
        return value;
      },
      
    } as ProxyHandler<ObjectType>);
    return proxy;
  }

  async sendRequest<ObjectType extends IRpcObject>(target: Omit<ObjectType, "nextTarget">, nextTarget: IRpcCallTarget, request: IRpcFetchRequest, options?: IRpcObjectOptions): Promise<unknown> {

    if (nextTarget.userTarget) {
              
      const response = await this.channel.fetch(request, nextTarget.userTarget);

      if (response.payload.error) {
        throw response.payload.error;
      }
      return response.payload.result;
    } else if (nextTarget.usersTarget) {
      const responses = await this.channel.fetchFromUsers(request, nextTarget.usersTarget);

      const errors = responses.filter((x) => x.payload.error !== undefined).map((x) => x.payload.error);

      if (errors.length !== 0) {
        throw new RpcAggregateError('an error occurred while fetching a rpc request', errors, request, responses);
      }

      const bodies = responses.map((x) => x.payload.result);

      return bodies;
    } else {
      const responses = await this.channel.fetchFromAllUsers(request);

      const errors = responses.filter((x) => x.payload.error !== undefined).map((x) => x.payload.error);

      if (errors.length !== 0) {
        throw new RpcAggregateError('an error occurred while fetching a rpc request', errors, request, responses);
      }

      const bodies = responses.map((x) => x.payload.result);

      return bodies;
    }

  }
}