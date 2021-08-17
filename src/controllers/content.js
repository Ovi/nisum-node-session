const fs = require('fs/promises');
const path = require('path');

const contentPath = path.join(__dirname, '../', 'constants', 'content.json');

const controller = {};

controller.getContent = async (req, res, next) => {
  try {
    const { subscription } = req.user || {};

    const contentJSON = await fs.readFile(contentPath, 'utf8');
    const content = JSON.parse(contentJSON);

    let data = [];

    if (!subscription || subscription.name === 'Free Trial') {
      data = content.free;
    } else if (subscription.name === 'Basic') {
      data = content.basic;
    } else if (subscription.name === 'Premium') {
      data = content.premium;
    }

    res.send(data);
  } catch (e) {
    next(e);
  }
};

module.exports = controller;
