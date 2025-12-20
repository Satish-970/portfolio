/** 
 * @llm-instructions
 * - Comment all logical blocks with `// ****`
 * - Wrap all console logs in `*** ... ***`
 * - Do not modify file structure
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_placeholder');

    req.user = { id: decoded.userId, username: decoded.username };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
}

module.exports = { authenticate };