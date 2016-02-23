var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs');

// user Schema
var UserSchema = new Schema({
  name: String,
  username: {type: String, required:true, index: { unique: true}},
  password: {type: String, required: true, select: false}
});

//Has Password before save
UserSchema.pre('save', function(next){
  var user = this;

  if(!user.isModified('password')) {return next();}

  bcrypt.hash(user.password, null, null, function(err, hash){
    if(err) {return next(err);}

    // change password to hashed version
    user.password = hash;
    next();
  });
});

//Method to compare given password with db hash
UserSchema.methods.comparePassword = function(password){
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);
