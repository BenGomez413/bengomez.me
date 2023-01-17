const mongoose = require('mongoose')
const User = require('./User')

// CHATROOM SCHEMA
const chatroomSchema = new mongoose.Schema({
  ownerID: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerIcon: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxLength: 20,
  },
  unique: {
    type: String,
    unique: true,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  messages: [
    {
      senderID: {
        type: String,
        required: true,
      },
      senderName: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
        default: 'rgb(149,163,167)',
      },
      text: {
        type: String,
        required: true,
        default: 'rgb(255,255,255)',
      },
      type: {
        type: String,
        default: 'text',
      },
      msg: {
        type: String,
      },
      timestamp: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
      },
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
})

// SAVE DOCUMENT MIDDLEWARE
chatroomSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  console.log('pre save')

  //MESSAGE LIST LIMIT
  const maxMessages = 500
  if (this.messages.length > maxMessages) {
    let amount2Remove = this.messages.length - maxMessages
    // console.log(`amount2Remove: ${amount2Remove}`)
    for (let index = 0; index < amount2Remove; index++) {
      this.messages.shift()
    }
  }
  next()
})

chatroomSchema.post('save', function (doc, next) {
  console.log('Chatroom saved to MongoDB')
  next()
})

//deleteOne
chatroomSchema.pre(
  'deleteOne',
  { document: true, query: false },
  function (next) {
    console.log('pre-deleteOne Chatroom')
    //Delete refs to chatroom
    this.members.forEach((member, i) => {
      User.findByIdAndUpdate(
        member,
        {
          $pullAll: {
            ownedChatrooms: [this._id],
            joinedChatrooms: [this._id],
          },
        },
        { new: true },
        (err, doc) => {
          err
            ? console.log(`pre-deleteOne error: ${err}`)
            : console.log('reference to chatroom deleted')
        }
      )
    })
    next()
  }
)
chatroomSchema.post('deleteOne', function (doc, next) {
  console.log(`Chatroom Deleted: ${doc.name}`)
  next()
})

module.exports = mongoose.model('Chatroom', chatroomSchema)
