

const joinNs=(element,nsData)=>{

    const nsEndpoint=element.getAttribute('ns');
            
            
    const ClickedNs=nsData.find( row=>row.endpoint===nsEndpoint);
    // global so we can submit new message to the right place
    selectedNsId=ClickedNs.id;


    const rooms = ClickedNs.rooms;

    let roomList=document.querySelector('.room-list');
    roomList.innerHTML=" ";
    
    let firstRoom;

    rooms.forEach( (room,i)=>{

        if(i==0){
            firstRoom=room.roomTitle;
        }
        roomList.innerHTML+=` <li class="room" namespaceId=${room.namespaceId}>
        <span class=" fa-solid fa-${room.privateRoom ? 'lock': 'globe'}"></span>${room.roomTitle}
        </li> `
       
    });
    joinRoom(firstRoom,ClickedNs.id);

    const roomNodes=document.querySelectorAll('.room');
    Array.from(roomNodes).forEach(el =>{
        el.addEventListener('click',e=>{
            // console.log("someone clicked on "+e.target.innerText);
            const namespaceId=el.getAttribute('namespaceId');
            joinRoom(e.target.innerText,namespaceId)
        })
    })



};











