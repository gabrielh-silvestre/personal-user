import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';

import type { ITokenGateway } from '@users/infra/gateway/token/token.gateway.interface';

import { ExceptionFactory } from '@exceptions/factory/Exception.factory';

import { TOKEN_GATEWAY } from '@users/utils/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_GATEWAY) private readonly authGateway: ITokenGateway,
  ) {}

  private recoverToken(context: ExecutionContext): string | null {
    const isRequestHttp = context.getType() === 'http';

    if (isRequestHttp) {
      const request = context.switchToHttp().getRequest();
      const bearerToken = request.headers.authorization;

      if (!bearerToken) return null;

      const token = bearerToken.split(' ')[1];
      return token;
    }

    const isRequestRpc = context.getType() === 'rpc';

    if (isRequestRpc) {
      const request = context.switchToRpc().getData();

      return request.token;
    }

    throw ExceptionFactory.forbidden('Invalid request type');
  }

  private saveUserId(context: ExecutionContext, userId: string): void | never {
    const isRequestHttp = context.getType() === 'http';

    if (isRequestHttp) {
      const request = context.switchToHttp().getRequest();
      request.user = { userId };
      return;
    }

    const isRequestRpc = context.getType() === 'rpc';

    if (isRequestRpc) {
      const request = context.switchToRpc().getData();
      request.user = { userId };
      return;
    }

    throw ExceptionFactory.forbidden('Invalid request type');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = this.recoverToken(context);

    if (!token) {
      throw ExceptionFactory.forbidden('Missing token');
    }

    try {
      const response = await this.authGateway.validate(token);

      this.saveUserId(context, response.userId);

      return true;
    } catch (err) {
      throw ExceptionFactory.forbidden('Invalid token');
    }
  }
}
