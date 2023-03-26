import { Request } from 'express';

export interface IUserPayload {
  readonly xid: string;
  readonly name: string;
  readonly type: string;
  readonly roles: string[];
}
export interface RequestUserInterface extends Request {
  user: IUserPayload
}