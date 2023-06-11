const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tell us your name'],
    trim: true,
    match: [
      new RegExp(/^[a-zA-Z\s]+$/),
      '{VALUE} is not valid. Please use only letters',
    ],
  },
  photo: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'tell us your email email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid password'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'lead-guide', 'guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    select: false,

    validate: {
      validator: function (ele) {
        return ele === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  active: {
    type: Boolean,
    select: false,
    default: true,
  },
  passwordChangedAt: Date,
  passwordResetExpires: Date,
  passwordResetToken: String,
});
//You get an error because the arrow function changes the scope of 'this.' Just use
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   // Hash the password with cost of 12
//   this.password = await bcrypt.hash(this.password, 12);

//   // Delete passwordConfirm field
//   this.passwordConfirm = undefined;
//   next();
// });

// userSchema.pre('save',function(next){
// if(!this.isModified('password')||this.isNew)return next();

//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

// userSchema.methods.checkCorrectPassword = async function (
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };
userSchema.pre(/^find/,function(next){
  this.find({ active: { $ne: false } });
  next();
})

userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimestamp > jwtTimestamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex'); //Because the crypto.randomBytes() method generates a cryptographically secure random string, it is highly unlikely that two calls to this method will produce the same output. This makes it suitable for generating unique identifiers that can be used to verify the identity of a user and authorize access to sensitive resources.
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};


/*
GPT answer
The reset token is typically stored in the database to associate it with the user account that initiated the password reset request. 
When a user requests a password reset, the web application generates a unique reset token and sends it to the user's registered email address.
 The token is then stored in the database along with the user account ID and an expiration time.

When the user clicks on the password reset link in the email, the web application checks the reset token against the database to verify that it is valid and has not expired.
 If the token is valid, the web application allows the user to reset their password. If the token is invalid or has expired, the web application denies the password reset request.

Storing the reset token in the database is important for security reasons. 
If the reset token were not stored in the database, an attacker could potentially guess or brute-force the token and gain access to the user's account without their knowledge. 
By storing the token in the database and associating it with a specific user account, the web application can ensure that only the legitimate user who initiated the password reset request can reset their password.

It's important to store the reset token securely in the database, using encryption or hashing to protect it from unauthorized access. 
It's also a good practice to set a short expiration time for the reset token to limit the window of opportunity for attackers to use a stolen token.

*/

const User = mongoose.model('User', userSchema);

module.exports = User;
