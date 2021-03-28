// this whole file is a copy from 
// https://slingshotlabs.io/blog/cursor-pagination-graphql-mongodb/
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export default class PageData {
  @Field()
  public count: number

  @Field()
  public limit: number

  @Field()
  public offset: number
}