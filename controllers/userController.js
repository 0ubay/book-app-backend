let user = { name: 'John Doe', email: 'john@example.com' };

exports.getProfile = (req, res) => res.json(user);

exports.updateProfile = (req, res) => {
  const { name, email } = req.body;
  user = { ...user, name, email };
  res.json({ message: 'Profile updated', user });
};
