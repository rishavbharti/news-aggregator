import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    return null;
  }
};

const comparePassword = (hashedPassword, password) =>
  bcrypt.compare(hashedPassword, password);

export { hashPassword, comparePassword };
