const mongoose = require('mongoose')
const Chatroom = require('./Chatroom')

// USER SCHEMA
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 20,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    validate: {
      validator: /rgb\((\d+),(\d+),(\d+)\)/,
      message: `Not correct rgb format. Expected rgb(255,255,255)`,
    },
  },
  text: {
    type: String,
    required: true,
    validate: {
      validator: /rgb\((\d+),(\d+),(\d+)\)/,
      message: `Not correct rgb format. Expected rgb(255,255,255)`,
    },
  },
  icon: {
    type: String,
    uppercase: true,
    default: 'UNKNOWN',
  },
  ownedChatrooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chatroom',
    },
  ],
  joinedChatrooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chatroom',
    },
  ],
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  devices: [
    {
      name: {
        type: String,
        default: 'unnamed',
      },
      brand: {
        type: String,
        default: 'unknown',
      },
      properties: {},
      createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
      },
      updatedAt: {
        type: Date,
        default: () => Date.now(),
      },
    },
  ],
})

//save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

userSchema.post('save', function (doc, next) {
  console.log('User saved to MongoDB')
  next()
})

//Never let password out of server
userSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['password']
    return ret
  },
})

//deleteOne
userSchema.pre('deleteOne', { document: true, query: false }, function (next) {
  console.log('pre-deleteOne User')
  // //Delete ownedChatrooms
  // this.ownedChatrooms.forEach((roomID) => {
  //   const chatroom = Chatroom.findById(roomID)
  //   chatroom.deleteOne()
  // })
  // //Leave joinedChatrooms
  // this.joinedChatrooms.forEach((roomID) => {
  //   const chatroom = Chatroom.findById(roomID)
  //   chatroom.updateOne({
  //     $pullAll: { members: [this._id] },
  //   })
  // })
  next()
})

userSchema.post(
  'deleteOne',
  { document: true, query: false },
  function (doc, next) {
    console.log(`User deleted: ${doc}`)
    next()
  }
)

module.exports = mongoose.model('User', userSchema)
