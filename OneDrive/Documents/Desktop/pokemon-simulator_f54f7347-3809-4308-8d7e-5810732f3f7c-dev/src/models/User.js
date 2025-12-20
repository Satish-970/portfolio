/** 
 * @llm-instructions
 * - Comment all logical blocks with `// ****`
 * - Wrap all console logs in `*** ... ***`
 * - Do not modify file structure
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

userSchema.index({ username: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;