import PageMetaInterface from '@interface/page-meta.interface';

export default interface CrudInterface<Entity, Dto> {
  create(dto: Dto): Promise<Entity>;
  retrieve<T>(pk: T): Promise<Entity>;
  update(where: Record<string, unknown>, dto: Dto): Promise<Entity>;
  delete(where: Record<string, unknown>): Promise<boolean>;
  pagination(where: Record<string, unknown>, order: string, limit: number, offset: number): Promise<{
    readonly result: Entity[],
    readonly meta: PageMetaInterface
  }>
}