import { Kind, GraphQLError, ValueNode } from 'graphql';
import { Scalar, CustomScalar } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

const MONGODB_OBJECTID_REGEX = /*#__PURE__*/ /^[A-Fa-f0-9]{24}$/;

@Scalar('GraphQLObjectId', (type) => ObjectId)
export class ObjectIdScalar implements CustomScalar<string, ObjectId> {
  description = 'ObjectId custom scalar type';

  parseValue(value: string): ObjectId {
    if (!MONGODB_OBJECTID_REGEX.test(value)) {
      throw new TypeError(
        `Value is not a valid mongodb object id of form: ${value}`,
      );
    }

    return new ObjectId(value);
  }

  serialize(value: ObjectId): string {
    return value.toHexString();
  }

  parseLiteral(ast: ValueNode): ObjectId {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as mongodb object id but got a: ${ast.kind}`,
      );
    }

    if (!MONGODB_OBJECTID_REGEX.test(ast.value)) {
      throw new TypeError(
        `Value is not a valid mongodb object id of form: ${ast.value}`,
      );
    }

    return new ObjectId(ast.value);
  }
}
