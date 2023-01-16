import * as jwt from 'jsonwebtoken';
export function routeGuard(req) {
  try {
    const token = req.headers['authorization'] || req.cookies['token'];

    if (!token) {
      return {
        data: {
          message: 'FORBIDDEN',
          status_code: 403
        },
        error: true
      };
    }
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    return {
      data: {
        userId
      },
      error: false
    };
  } catch (err) {
    return {
      data: {
        message: 'FORBIDDEN',
        status_code: 403
      },
      error: true
    };
  }
}
