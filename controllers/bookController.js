let toRead = [];
let finished = [];

exports.getToReadList = (req, res) => res.json(toRead);

exports.getFinishedBooks = (req, res) => res.json(finished);

exports.addBook = (req, res) => {
  const { title, author} = req.body;
  const newBook = { id: Date.now(), title, author };
  toRead.push(newBook);
  res.status(201).json(newBook);
};

exports.markAsFinished = (req, res) => {
  const id = parseInt(req.params.id);
  const book = toRead.find(b => b.id === id);
  if (!book) return res.status(404).json({ message: 'Book not found in to-read list' });

  toRead = toRead.filter(b => b.id !== id);
  finished.push(book);
  res.json({ message: 'Book marked as finished', book });
};

exports.removeBook = (req, res) => {
  const id = parseInt(req.params.id);
  toRead = toRead.filter(b => b.id !== id);
  finished = finished.filter(b => b.id !== id);
  res.json({ message: 'Book removed if it existed' });
};
 