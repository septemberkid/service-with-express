interface Base {
  readonly xid: string;
  readonly name: string;
}
export interface StudentInfoInterface {
  readonly xid: string;
  readonly nim: string;
  readonly name: string;
  readonly faculty: Base;
  readonly study_program: Base;
}
export default interface JwtPayloadInterface {
  readonly xid: string;
  readonly full_name: string;
  readonly student_info?: StudentInfoInterface,
  readonly user_type: string;
  readonly roles: string[];
}