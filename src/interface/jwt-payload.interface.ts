interface Base {
  readonly id: number;
  readonly name: string;
}
export interface IAdditionalInfo {
  readonly identifier_id: string;
  readonly faculty?: Base;
  readonly study_program?: Base;
}
export default interface JwtPayloadInterface {
  readonly id: number,
  readonly name: string,
  readonly email: string,
  readonly user_type: string,
  readonly additional_info?: IAdditionalInfo,
  readonly roles: string[];
}