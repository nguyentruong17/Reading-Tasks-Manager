// this whole file is a copy from 
// https://slingshotlabs.io/blog/cursor-pagination-graphql-mongodb/
import { Field, Int, ObjectType } from '@nestjs/graphql'
//import { Filterable, FilterableMongo } from './connection.args'

@ObjectType()
export default class PageData {
  @Field((types) => Int)
  public count: number

  @Field((types) => Int)
  public limit: number

  @Field((types) => Int)
  public offset: number
}

export abstract class PageDataConfig<T> {
  offset: number
  limit: number
  filter?: T
}