let userName=prompt("what is your name");
let password=123


const clientOptions={
    query:{
        userName,password
    },
    auth:{
        userName,password
    }
}


// always join the main nameSpace that's where the clinet get the othere namespaces  from
// const socket=io("http://localhost:3000",clientOptions);
const socket=io("https://nearby-krill-night-coders-8d05e488.koyeb.app/",clientOptions);





const NameSpaceSocket=[];

const listeners={
    nsChange:[],
    messageToRoom:[]
}

let selectedNsId=0;

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const newMssg=document.querySelector('#user-message').value;
    console.log(newMssg,selectedNsId);
    NameSpaceSocket[selectedNsId].emit('newMssgToRoom',{
        newMssg,
        date:Date.now(),
        avatar:'https://via.placeholder.com/30',
        userName,
        selectedNsId
    })

    document.querySelector('#user-message').value="";
})


const addListeners=(nsId)=>{

    if(!listeners.nsChange[nsId]){
            NameSpaceSocket[nsId].on('nsChange',(data)=>{
            console.log("NameSpace has Changed");
            console.log(data);
        })
        listeners.nsChange[nsId]=true;
    }

    if(!listeners.messageToRoom[nsId]){

        NameSpaceSocket[nsId].on('mssgToRoom',(mssgObj)=>{
            console.log(mssgObj);
            document.querySelector('#messages').innerHTML+=buildMessageHtml(mssgObj);
        })
            
        listeners.messageToRoom[nsId]=true;

    }    



}

socket.on('connect',()=>{
    console.log("connected");
    socket.emit('clientConnect');
});


socket.on('welcome',(data)=>{
    console.log(data);
});

// listen for the nsList event from the server which gives the list of nameSpaces

socket.on('nsList',(nsData)=>{
    console.log(nsData);
    const nameSpaceDiv=document.querySelector('.namespaces');
    nameSpaceDiv.innerHTML="";

    nsData.forEach(ns =>{
        nameSpaceDiv.innerHTML+=`<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`

        let thisNs=NameSpaceSocket[ns.id];
        //join the namespaces as one by one by looping over each namespace 

        if(!NameSpaceSocket[ns.id]){
            thisNs=io(`https://nearby-krill-night-coders-8d05e488.koyeb.app${ns.endpoint}`);
        }

        
        NameSpaceSocket[ns.id]=thisNs;

         addListeners(ns.id);
     })

    Array.from(document.getElementsByClassName('namespace')).forEach(element=>{
        // console.log(element);
        element.addEventListener('click' ,e => {
            joinNs(element,nsData);
        
        });
           
    joinNs(document.getElementsByClassName('namespace')[0],nsData);    
   
    });

});



