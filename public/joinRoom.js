const joinRoom=async(roomTitle,namespaceId)=>{

    console.log(roomTitle,namespaceId);

    const ackRes=await NameSpaceSocket[namespaceId].emitWithAck('joinRoom',{roomTitle,namespaceId})
    
    // console.log(ackRes);
    document.querySelector('.curr-room-num-users').innerHTML=`${ackRes.numUsers} <span class="fa-solid fa-user"></span>`
    document.querySelector('.curr-room-text').innerHTML=roomTitle;
    
    // we get room chat history here

    document.querySelector('#messages').innerHTML="";

    ackRes.thisRoomHistory.forEach(message =>{
        document.querySelector('#messages').innerHTML+=buildMessageHtml(message);
    })
    
    


   
  
    // NameSpaceSocket[namespaceId].emit('joinRoom',roomTitle,(ackRes)=>{
    //     console.log(ackRes);

    //     document.querySelector('.curr-room-num-users').innerHTML=`${ackRes.numUsers} <span class="fa-solid fa-user"></span>`
    //     document.querySelector('.curr-room-text').innerHTML=roomTitle;


    // });

}





