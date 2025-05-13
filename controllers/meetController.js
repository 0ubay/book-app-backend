let meets = [];

exports.createMeet = (req, res) => {
  const { title, date, location } = req.body;
  const newMeet = { id: Date.now(), title, date, location, attendees: [] };
  meets.push(newMeet);
  res.status(201).json(newMeet);
};

exports.getMeets = (req, res) => res.json(meets);

exports.bookMeet = (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const meet = meets.find(m => m.id === id);
  if (!meet) return res.status(404).json({ message: 'Meet not found' });

  meet.attendees.push(name);
  res.json({ message: 'Booked meet', meet });
};
