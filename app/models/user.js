var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs');

// user Schema
var UserSchema = new Schema({
  name: String,
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true, select: false },
  admin: {type: Boolean, require: true, default: false},
  sourceFeeds: [{type: Schema.Types.ObjectId, ref: 'SourceFeed'}],  // Array of Source Feed ID's
  outputFeeds: [{type: Schema.Types.ObjectId, ref: 'OutputFeed'}] // Array of Output Feed ID's
});

//Hash password before save
UserSchema.pre('save', function(next) {
  var user = this;

  // Has only if modified
  if (!user.isModified('password')) {
    return next();
  }

 // Generate Hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) {
      return next(err);
    }

    // change password to hashed version
    user.password = hash;
    next();
  });
});

//Method to compare given password with db hash
UserSchema.methods.comparePassword = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);
