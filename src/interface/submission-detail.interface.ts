import TrxSubmissionEntity from '@entity/trx/trx-submission.entity';

export interface IDocument {
    readonly name: string;
    readonly size: number;
    readonly url: string;
    readonly etag: string;
    readonly path: string;
    readonly context: string;
}
export default interface SubmissionDetailInterface {
    readonly detail: TrxSubmissionEntity,
    readonly documents: IDocument[]
}