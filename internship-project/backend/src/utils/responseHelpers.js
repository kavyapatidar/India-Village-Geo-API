function sendSuccess(res, data, extra = {}) {
  res.json({
    success: true,
    ...extra,
    data
  });
}

function sendNotFound(res, message) {
  res.status(404).json({
    success: false,
    message
  });
}

module.exports = {
  sendSuccess,
  sendNotFound
};
