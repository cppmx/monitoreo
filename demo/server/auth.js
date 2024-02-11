import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from './db/users.js';
import { logger } from './logs.js'

const secret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

export const authMiddleware = expressjwt({
  algorithms: ['HS256'],
  credentialsRequired: false,
  secret,
});

export async function handleLogin(req, res) {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user || user.password !== password) {
    logger.error("Invalid user!");
    res.sendStatus(401);
  } else {
    logger.info("Access granted to " + user.email);
    const claims = { sub: user.id, email: user.email };
    const token = jwt.sign(claims, secret);
    res.json({ token });  
  }
}
