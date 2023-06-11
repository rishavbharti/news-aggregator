import jwt from 'jsonwebtoken';

function generateJWT(id, expiresIn = '1d') {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
}

export { generateJWT };
