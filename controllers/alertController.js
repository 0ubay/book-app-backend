let alerts = [
    { id: 1, userId: 123, message: 'Someone liked your book taste!', read: false },
  ];
  
  exports.getAlertsForUser = (req, res) => {
    const userId = 123; // mock ID
    const userAlerts = alerts.filter(alert => alert.userId === userId);
    res.json(userAlerts);
  };
  
  exports.markAlertAsRead = (req, res) => {
    const id = parseInt(req.params.id);
    const alert = alerts.find(a => a.id === id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
  
    alert.read = true;
    res.json({ message: 'Alert marked as read', alert });
  };
  