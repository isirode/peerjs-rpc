import { Response, Request } from "peerjs-request-response";

export interface IRpcMessage {
  request?: Request<IRpcFetchRequest>;
  response?: Response<IRpcFetchResponse>;
}

export enum RpcCallType {
  Set, MethodCall
}

export interface IRpcFetchRequest {
  targetId: string;
  property: string;
  arguments: unknown[];
  rpcCallType: RpcCallType;
}

export interface IRpcFetchResponse {
  result: unknown;
  error: Error | undefined;
}