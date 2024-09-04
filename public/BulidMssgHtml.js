
const buildMessageHtml=(messageObj)=>{
    
    return `
         <li>
             <div class="user-image">
                   <img src="${messageObj.avatar}" />
             </div>
             <div class="user-message">
                   <div class="user-name-time">${messageObj.userName}  <span>${new Date(messageObj.date).toLocaleDateString()}</span></div>
                   <div class="message-text">${messageObj.newMssg}.</div>
            </div>
        </li>
    
    `
}
