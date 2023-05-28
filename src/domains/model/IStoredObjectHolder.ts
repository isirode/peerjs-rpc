import { Identifiable } from "./Identifiable";

// TODO : could proxy the target
export interface IStoredObjectHolder extends Identifiable {
  target: unknown;
}