const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");
const bcrypt = require("bcryptjs")

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Complete userSchema, a Mongoose schema for "users" collection
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type:String,
      required:true,
      trim: true,
      unique: true,
      lowercase:true,
      validate:(value)=>validator.isEmail(value),
    },
    password: {
      type: String,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      required:true, 
      trim: true,
      minLength:8
    },
    walletMoney: {
      type:Number,
      required:true,
      default: config.default_wallet_money
    },
    address: {
      type: String,
      default: config.default_address,
    },
  },
  // Create createdAt and updatedAt fields automatically
  {
    timestamps: true,
  }
);

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement the isEmailTaken() static method
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
    const emailSearch = await this.findOne({email:email});
    if(emailSearch){
      return true
    }else{
      return false
    }
};

/**
 * Check if entered password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
      const user = this;
      return  bcrypt.compare(password, user.password)

};

/**
 * Inside static method "this" always point to the model created using the schema 
 * in this case "this" is pointing to the user model
 * 
 * Inside method "this" always points to record or document from a collection
 * thst's why "this" here can give email, name or password property
 */


/**
 * Note: encrypting of password can be implemented directly using the pre-save hook or directly in the create() user service
 * userSchema.pre("save", async function(next){
 *    const user = this;
 *    // only hash the password if it has been modified (or is new)
        if (!user.isModified('password')) {
          return next();
        }
 *    if(user.isModified("password")){
         const salt = await bcrypt.genSalt();
 *      user.password = await bcrypt.hash(user.password,salt)
 *      }
 *      next();
 * })
 *  
 */

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS

/**
 * Check if user have set an address other than the default address
 * - should return true if user has set an address other than default address
 * - should return false if user's address is the default address
 *
 * @returns {Promise<boolean>}
 */
userSchema.methods.hasSetNonDefaultAddress = async function () {
  const user = this;
   return user.address !== config.default_address;
};

/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */
/**
 * @typedef User
 */

const User = mongoose.model("users", userSchema);

module.exports = {User};
