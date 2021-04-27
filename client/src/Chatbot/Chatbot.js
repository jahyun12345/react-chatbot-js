import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { saveMessage } from '../_actions/message_actions';

function Chatbot() {
    // trigger the action
    const dispatch = useDispatch();

    // 입력 없이 반환되는 값이기 때문에 useEffect에서 eventQuery 호출
    useEffect(() => {
        eventQuery('welcomeToMyWebsite');
    }, [])

    const textQuery = async (text) => {
        // need to take care of the message client sent
        let conversation = {
            who: 'client',
            content: {
                text: {
                    text: text
                }
            }
        }
        dispatch(saveMessage(conversation));
        // console.log({clientConversation:conversation});

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
            dispatch(saveMessage(conversation));
            // console.log({text_tryConversation:conversation});
        } catch (error) {
            conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "Error just occured, please check the problem."
                    }
                }
            }
            dispatch(saveMessage(conversation));
            // console.log({text_catchConversation:conversation});
        }
    }

    const eventQuery = async (event) => {
        // 입력 없이 반환되는 값이기 때문에 conversation 필요 X
        // need to take care of the message chatbot sent
        const textQueryVariables = {
            event
        }
        
        try {
            // send request to text query route
            // text query route에서 async await 사용하였으므로 설정 필요
            const response = await Axios.post('/api/dialogflow/eventQuery', textQueryVariables);
            const content = response.data.fulfillmentMessages[0];
            let conversation = {
                who: 'bot',
                content: content
            }
            dispatch(saveMessage(conversation));
            // console.log({event_tryConversation:conversation});
        } catch (error) {
            let conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "Error just occured, please check the problem."
                    }
                }
            }
            dispatch(saveMessage(conversation));
            // console.log({event_catchConversation:conversation});
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