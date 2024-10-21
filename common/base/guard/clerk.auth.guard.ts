import { clerkClient } from '@clerk/clerk-sdk-node';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('No authorization token provided');
    }

    const session = authorizationHeader.replace('Bearer ', '') as string;

    try {
      const { userId } = await clerkClient.sessions.getSession(session);
      const user = await clerkClient.users.getUser(userId);
      const isAdmin = user.privateMetadata.isAdmin;
      if (['POST', 'PATCH'].includes(req.method) && !isAdmin) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
