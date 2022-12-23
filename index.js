const express = require("express");
const socket = require("socket.io");
// App setup
const PORT = process.env.PORT || 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files

// Socket setup
const io = socket(server);
const allPlayer= []

app.get('/',(req,resp)=>{
  resp.sendFile(__dirname+'/index.html')
})

function updatePlayers()
{
  io.emit('msg', allPlayer);

}

io.on("connection", function (socket) {
  

  socket.on("add_player",(data)=>{
    
    data.id= socket.id
    allPlayer.push(data)
    updatePlayers()
    console.log("Added")
  })

  socket.on("update_pos",(player,move)=>{
     
    player.id= socket.id
    player.move= move
    allPlayer.splice(allPlayer.findIndex(obj=> obj.id===socket.id),1)
    allPlayer.push(player)
    updatePlayers()
  })

  socket.on('disconnect',()=>{

    allPlayer.splice(allPlayer.findIndex(obj=> obj.id===socket.id),1)
    updatePlayers()
    console.log("Remove")

  })

});



