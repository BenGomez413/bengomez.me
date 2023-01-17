const { default: mongoose } = require('mongoose')
const Chatroom = require('../models/Chatroom')
const User = require('../models/User')

//Creates dummy rooms. GLOBAL by Default
const createDummyRoom = (name, messages) => {
  return {
    _id: name ? name : 'GLOBAL',
    name: name ? name : 'GLOBAL',
    ownerID: '...',
    ownerName: '...',
    messages: messages
      ? messages
      : [
          {
            _id: '...',
            senderID: '...',
            senderName: 'BenGomez.me',
            color: 'rgb(186, 104, 69)',
            text: 'rgb(255,255,255)',
            msg: 'Welcome to the Global Chatroom',
            timestamp: new Date(),
          },
        ],
    members: [
      {
        _id: '...',
        name: 'Database Not Connected',
        icon: 'BROWSER',
        color: 'rgb(197, 69, 69)',
        text: 'rgb(255,255,255)',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

//Makes sure each socket can only be connected to one room at a time
const manageSocketRooms = (socket, roomToJoinID) => {
  socket.leaveAll()
  socket.join(socket.id)
  socket.join(roomToJoinID)
  // console.log(socket.rooms)
}

module.exports = (io, socket) => {
  const createChatroom = async (payload, callback) => {
    try {
      //0. Setup
      let newChatroom = await new Chatroom(payload)
      let roomOwner = await User.findById(newChatroom.ownerID)

      //1. check owner user exists
      if (roomOwner === null) {
        console.log('User Not Found')
        socket.emit('error', 'User Not Found')
        return
      }
      //2. check owner chose unique name
      roomOwner.ownedChatrooms.forEach((room) => {
        if (room.name === newChatroom.name) {
          console.log('Room with this name already exists')
          socket.emit('error', 'Room with this name already exists')
          return
        }
      })
      //-- room valid match to schema --

      //3.1 Save chatroom/ populate and send to user
      await newChatroom.save()
      console.log('New Chatroom Created')
      newChatroom = await newChatroom.populate({
        path: 'members',
        select: 'name icon color text',
      })

      //Socket Join Room
      let join = newChatroom._id.toString().match('(.+)')
      manageSocketRooms(socket, join[1])

      //3.2 Add Reference to Creator's ownedChatrooms list
      let target = { _id: newChatroom.ownerID }
      let update = {
        ownedChatrooms: newChatroom._id,
      }
      const updatedUser = await User.findOneAndUpdate(
        target,
        {
          $addToSet: update,
        },
        { returnDocument: 'after' }
      ).populate([
        { path: 'ownedChatrooms', select: 'ownerID name ownerIcon' },
        { path: 'joinedChatrooms', select: 'ownerID name ownerIcon' },
      ])
      console.log('+ User Updated with new chatroom')

      callback({
        user: updatedUser,
        chatroom: newChatroom,
      })
    } catch (error) {
      console.log(`createChatroom Catch Error:${error.message}`)
    }
  }

  const readChatroom = async (payload, callback) => {
    // payload = {
    //   _id: chatroomID,
    // }
    try {
      manageSocketRooms(socket, payload._id)

      if (payload._id === 'GLOBAL') {
        callback(createDummyRoom())
        return
      }

      let chatroom = await Chatroom.findById(payload._id).populate({
        path: 'members',
        select: 'name icon color text',
      })

      if (chatroom) {
        callback(chatroom)
      }
    } catch (error) {
      console.log(`readChatroom Catch Error: ${error.message}`)
    }
  }

  const updateChatroom = async (payload) => {
    try {
      const chatroom = await Chatroom.findByIdAndUpdate(payload.filter, {
        $set: payload.update,
      })
      await chatroom.save()
      socket.emit('chatroom', chatroom)
    } catch (error) {
      console.log(`updateChatroom Catch Error: ${error.message}`)
    }
  }

  const deleteChatroom = async (payload, callback) => {
    // payload = { _id: 'mongodb._id' }
    try {
      const chatroom = await Chatroom.findById(payload._id)
      chatroom.deleteOne()

      //To Sender
      callback({
        body: createDummyRoom(),
        message: `Chatroom Deleted: ${chatroom.name}`,
      })

      //TO EVERYONE EXCEPT SENDER
      socket.to(payload._id).emit('chatroom', createDummyRoom())
      socket.to(payload._id).emit('refresh', { message: 'Chatroom Deleted' })
    } catch (error) {
      console.log(`deleteChatroom Catch Error: ${error.message}`)
    }
  }

  //Chatroom App Specific
  const joinChatroom = async (payload, callback) => {
    // payload={
    //   userID: userID,
    //   chatroomID: chatroomID
    // }
    try {
      let user = await User.findById(payload.userID)
      let chatroom = await Chatroom.findById(payload.chatroomID)

      //check if user owns or already joined room
      let updateNeeded = true
      if (user.ownedChatrooms.includes(chatroom._id)) updateNeeded = false
      if (user.joinedChatrooms.includes(chatroom._id)) updateNeeded = false

      if (updateNeeded) {
        // add user to chatroom
        chatroom = await Chatroom.findByIdAndUpdate(
          chatroom._id,
          { $addToSet: { members: user._id } },
          { new: true }
        )

        // add chatroom to user
        user = await User.findByIdAndUpdate(
          user._id,
          { $addToSet: { joinedChatrooms: chatroom._id } },
          { new: true }
        )
        console.log(`${user.name} joined ${chatroom.name}`)
      }

      // callback updated user and chatroom
      await user.populate([
        { path: 'ownedChatrooms', select: '_id name ownerIcon' },
        { path: 'joinedChatrooms', select: '_id name ownerIcon' },
      ])
      await chatroom.populate({
        path: 'members',
        select: 'name icon color text',
      })
      callback({ user: user, chatroom: chatroom })

      // Tell everyone connected to socket room that an update was made
      io.sockets
        .in(payload.chatroomID)
        .emit('refresh', { target: 'ALL', message: 'New User Joined Room' })
    } catch (error) {
      const dummyChatroom = createDummyRoom(payload.chatroomID, [
        {
          _id: '...',
          senderID: '...',
          senderName: 'BenGomez.me',
          color: 'rgb(61, 132, 153)',
          text: 'rgb(255,255,255)',
          msg: 'Chatroom does not exist in database.',
          timestamp: new Date(),
        },
        {
          _id: '...',
          senderID: '...',
          senderName: 'BenGomez.me',
          color: 'rgb(186, 104, 69)',
          text: 'rgb(255,255,255)',
          msg: `Socket Channel Opened: ${payload.chatroomID}`,
          timestamp: new Date(),
        },
        {
          _id: '...',
          senderID: '...',
          senderName: 'BenGomez.me',
          color: 'rgb(199, 176, 92)',
          text: 'rgb(255,255,255)',
          msg: 'Messages here can be sent but cannot be saved',
          timestamp: new Date(),
        },
      ])
      callback({ chatroom: dummyChatroom })
      console.log(`joinChatroom Catch Error: ${error.message}`)
    }
  }

  const leaveChatroom = async (payload) => {
    //Remove Chatroom ref in User.joinedChatrooms
    const user = await User.findByIdAndUpdate(
      payload.userID,
      {
        $pullAll: { joinedChatrooms: [payload.chatroomID] },
      },
      { new: true }
    )

    //Remove User ref in Chatroom.members
    const chatroom = await Chatroom.findByIdAndUpdate(
      payload.chatroomID,
      {
        $pullAll: { members: [payload.userID] },
      },
      { new: true }
    )

    // //Refresh Sender this shouldn't be necessary
    // socket.emit('user', user)
    // socket.emit('chatroom', createDummyRoom())

    //REFRESH TO EVERYONE INCLUDING SENDER
    io.sockets.in(payload.chatroomID).emit('refresh', `User left Chatroom `)
    console.log(`User ${user.name} Left Chatroom ${chatroom.name} `)
    manageSocketRooms(socket, 'GLOBAL')
  }

  const messageChatroom = async (payload) => {
    // payload = {
    //   target: $currentChatroom._id,
    //   save: boolean, 
    //   message: {
    //     senderID: $currentUser._id,
    //     senderName: $currentUser.name,
    //     color: $currentUser.color,
    //     text: $currentUser.text,
    //     type: parsedMessage.type,
    //     msg: e.target.message.value,
    //     timestamp: Date.now(),
    //   },
    // }

    try {
      //Double Check socket rooms
      manageSocketRooms(socket, payload.target)
      //Socket emit 
      socket.to(payload.target).emit('message', payload.message)
      //if chatroom exists and save === true then push message to database
      if (payload.save === true) {
        await Chatroom.findByIdAndUpdate(payload.target, {
          $push: { messages: payload.message },
        })
      }
    } catch (error) {
      console.log(`messageChatroom Catch Error: `)
      console.log(error)
    }
  }

  //CRUD
  socket.on('chatroom:create', createChatroom)
  socket.on('chatroom:read', readChatroom)
  socket.on('chatroom:update', updateChatroom)
  socket.on('chatroom:delete', deleteChatroom)

  //Chatroom App Specific
  socket.on('chatroom:join', joinChatroom)
  socket.on('chatroom:leave', leaveChatroom)
  socket.on('chatroom:message', messageChatroom)
}
