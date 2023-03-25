export default interface JwtPayloadInterface {
  readonly xid: string;
  readonly full_name: string;
  readonly user_type: string;
  readonly roles: string[];
}