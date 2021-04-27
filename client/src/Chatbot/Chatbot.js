import React from 'react';
import Axios from 'axios';

function Chatbot() {
    const textQuery = async (text) => {
        // let conversations = [];

        // need to take care of the message client sent
        let conversation = {
            who: 'user',
            content: {
                text: {
                    text: text
                }
            }
        }
        // conversations.push(conversation);
        // need to take care of the message chatbot sent
        const textQueryVariables = {
            text
        }
        
        try {
            // send request to text query route
            // text query route에서 async await 사용하였으므로 설정 필요
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariables);
            const content = response.data.fulfillmentMessages[0];
            conversation = {
                who: 'bot',
                content: content
            }
            console.log({tryConversation:conversation});
            // conversations.push(conversation);
        } catch (error) {
            conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "Error just occured, please check the problem."
                    }
                }
            }
            console.log({catchConversation:conversation});
            // conversations.push(conversation);
        }
    }

    const keyPressHandler = (e) => {
        if (e.key === "Enter") {
            if (!e.target.value) {
                return alert('you need to type something first!');
            }
            // send request to text query route
            textQuery(e.target.value);
            e.target.value = "";
        }
    }

    return (
        <div style={{height:700, width:700, border:'3px solid black', borderRadius:'7px'}}>
            <div style={{height:644, width:'100%', overflow:'auto'}}>

            </div>
            <input
                style={{margin:0, width:'100%', height:50,
                        borderRarius:'4px', padding:'5px', fontSize:'1rem'}}
                placeholder="Send a message..."
                onKeyPress={keyPressHandler}
                type="text"
            />

        </div>
    )
}

export default Chatbot