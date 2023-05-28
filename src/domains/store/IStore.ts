import Emittery from 'emittery';
import { IRpcObject } from '../model/IRpcObject';
import { Identifiable } from '../model/Identifiable';

// TODO : implement this ?
export interface Events {

}

export interface IStore {
  // events: Emittery<Events>;

  // FIXME : support Identifiable
  find(id: string): IRpcObject;
  add(object: IRpcObject);
}