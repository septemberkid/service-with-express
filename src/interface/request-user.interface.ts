import { Request } from 'express';
import {IAdditionalInfo} from '@interface/jwt-payload.interface';

export interface IUserPayload {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly user_type: string;
  readonly additional_info?: IAdditionalInfo;
  readonly roles: string[];
}
export interface RequestUserInterface extends Request {
  user: IUserPayload
}