// models/index.js

const Post = require('./post');
const Comment = require('./comment');
const User = require('./user');

// Define associations
User.hasMany(Post, {
  foreignKey: 'userId',
});
Post.belongsTo(User, {
  foreignKey: 'userId',
});
Post.hasMany(Comment, {
  foreignKey: 'postId',
});
Comment.belongsTo(Post, {
  foreignKey: 'postId',
});
User.hasMany(Comment, {
  foreignKey: 'userId',
});
Comment.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = {
  Post,
  Comment,
  User,
};
