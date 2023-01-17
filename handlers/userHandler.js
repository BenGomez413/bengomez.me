const bcrypt = require('bcrypt')
const Chatroom = require('../models/Chatroom')
const User = require('../models/User')

module.exports = (io, socket) => {
  const loginUser = async (payload, callback) => {
    /*
     payload = {
      email: 'email@domain.com',
      password: 'password'
     } 
    */
    try {
      const user = await User.findOne({ email: payload.email }).populate([
        { path: 'ownedChatrooms', select: 'ownerID name ownerIcon' },
        { path: 'joinedChatrooms', select: 'ownerID name ownerIcon' },
      ])
      if (user === null) {
        console.log(`Login Failed: ${payload.email} Not Found`)
        callback({
          status: 'User Not Found',
          code: 404,
          message: 'User Not Found',
          style: 'warning',
        })
        return
      }

      if (await bcrypt.compare(payload.password, user.password)) {
        console.log(`User Connected: ${user.email}`)
        callback({
          status: 'Success',
          code: 200,
          message: 'User Login Success',
          style: 'success',
          payload: user,
        })
      } else {
        console.log(`Password Failed: ${user.email}`)
        callback({
          status: 'Incorrect Password',
          code: 403,
          message: 'Incorrect Password',
          style: 'warning',
        })
      }
    } catch (error) {
      console.log(`loginUser Catch Error: ${error.message}`)
    }
  }

  const createUser = async (payload, callback) => {
    try {
      /*
        payload = {
          email: email@domain.com,
          password: password,
          name: username,
          color: rgb(255,255,255),
          text: rgb(255,255,255),
          icon: 'BROWSER',
        }
      */

      //immediately hash password
      payload.password = await bcrypt.hash(payload.password, 10)

      const checkUser = await User.findOne({ email: payload.email })
      if (checkUser) {
        callback({
          status: 'Email Taken',
          code: 400,
          message: 'Email Taken',
          style: 'warning',
        })
        console.log(`Create Failed: Duplicate Email`)
      } else {
        const newUser = await User.create(payload)
        //If we need to populate in the future
        // .populate([
        //   { path: 'ownedChatrooms', select: 'ownerID name ownerIcon' },
        //   { path: 'joinedChatrooms', select: 'ownerID name ownerIcon' },
        // ])
        callback({
          status: 'User Created',
          code: 201,
          message: 'User Created',
          style: 'success',
          payload: newUser,
        })
        console.log(newUser)
      }
    } catch (error) {
      console.log(`createUser Catch Error: ${error.message}`)
    }
  }

  const readUser = async (payload, callback) => {
    // payload = {_id: 'userID', name: userName}
    try {
      const user = await User.findById(payload._id).populate([
        { path: 'ownedChatrooms', select: '_id name ownerIcon' },
        { path: 'joinedChatrooms', select: '_id name ownerIcon' },
      ])

      if (user) {
        callback(user)
      }
    } catch (error) {
      console.log(`readUser Catch Error: ${error.message}`)
    }
  }

  const updateUser = async (payload, callback) => {
    // payload = {
    //   _id: 'mongoDB generated ID',
    //   update: {
    //     username: ' Ben',
    //     email: 'benjamingomez413@gmail.com',
    //     password: 'plain text password',
    //     color: 'rgb(255,255,255)',
    //     text: 'rgb(255,255,255)',
    //     ownedChatrooms: [],
    //     joinedChatrooms: [],
    //   },
    // }

    try {
      let user = await User.findByIdAndUpdate(
        payload._id,
        {
          $set: payload.update,
        },
        { new: true }
      )

      user = await user.populate([
        { path: 'ownedChatrooms', select: 'name ownerIcon' },
        { path: 'joinedChatrooms', select: 'name ownerIcon' },
      ])
      callback(user)
      console.log(`User Updated: ${user.email}`)
      // console.dir(user)
    } catch (error) {
      console.log(`updateUser Catch Error: ${error.message}`)
    }
  }

  const deleteUser = async (payload, callback) => {
    // payload = {_id: $currentUser._id, respond: true}
    try {
      const user = await User.findById(payload._id)

      //Delete ownedChatrooms
      user.ownedChatrooms.forEach(async (roomID) => {
        const chatroom = await Chatroom.findById(roomID)
        chatroom.deleteOne()
      })
      //Leave joinedChatrooms
      user.joinedChatrooms.forEach(async (roomID) => {
        await Chatroom.findByIdAndUpdate(roomID, {
          $pullAll: { members: [payload._id] },
        })
      })

      user.deleteOne()

      if (payload.respond) {
        callback({
          body: {},
          message: `User Deleted: ${user.email}`,
        })
      }
    } catch (error) {
      console.log(`deleteUser Catch Error: ${error.message}`)
    }
  }

  socket.on('user:login', loginUser) //clean refs
  socket.on('user:create', createUser)
  socket.on('user:read', readUser) //clean refs?
  socket.on('user:update', updateUser) //clean refs?
  socket.on('user:delete', deleteUser)
}
