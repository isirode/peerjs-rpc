import { IRpcFetchRequest, IRpcFetchResponse } from "../model/IRpcMessage";
import { Response, Request } from "peerjs-request-response";

export class RpcAggregateError extends Error {

  errors: Error[];
  request: IRpcFetchRequest;
  responses: Response<IRpcFetchResponse>[];

  constructor(message: string, errors: Error[], request: IRpcFetchRequest, responses: Response<IRpcFetchResponse>[]) {
    super(message);

    this.errors = errors;
    this.request = request;
    this.responses = responses;
  }

}