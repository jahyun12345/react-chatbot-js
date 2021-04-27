import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { saveMessage } from '../_actions/message_actions';
import Message from './Sections/Message';
import CardItem from './Sections/CardItem';
import { List, Icon, Avatar } from 'antd';

function Chatbot() {
    // trigger the action
    const dispatch = useDispatch();
    // state.message.messages : redux-state
    const messagesFromRedux = useSelector(state => state.message.messages);

    // 입력 없이 반환되는 값이기 때문에 useEffect에서 eventQuery 호출
    useEffect(() => {
        eventQuery('welcomeToMyWebsite');
    }, [])

    const textQuery = async (text) => {
        // need to take care of the message client sent
        let conversation = {
            who: 'user',
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
            // content = response.data.fulfillmentMessages[0]일 때 여러개의 메세지를 반환하더라도 한 값만 보이기 때문에
            for (let content of response.data.fulfillmentMessages) {
                let conversation = {
                    who: 'bot',
                    content: content
                }
                dispatch(saveMessage(conversation));
                // console.log({text_tryConversation:conversation});
            }
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
            for (let content of response.data.fulfillmentMessages) {
                let conversation = {
                    who: 'bot',
                    content: content
                }
                dispatch(saveMessage(conversation));
                // console.log({event_tryConversation:conversation});
            }
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

    const renderCards = (cards) => {
        return cards.map((card, index) => <CardItem key={index} cardInfo={card.structValue} />)
    }

    const renderOneMessage = (message, index) => {
        console.log(message);

        // need to give some condition to seperate message kinds
        // template for text message
        if (message.content && message.content.text && message.content.text.text) {
            return <Message key={index} who={message.who} text={message.content.text.text} />
        // template for card message
        } else if (message.content && message.content.payload.fields.card) {
            const AvatarSrc = message.who === 'bot' ? <Icon type="robot" /> : <Icon type="smile" />;
            return <div>
                <List.Item style={{padding:'1rem'}}>
                    <List.Item.Meta
                        avatar={<Avatar icon={AvatarSrc} />}
                        title={message.who}
                        description={renderCards(message.content.payload.fields.card.listValue.values)}
                    />
                </List.Item>
            </div>
        }
    }

    const renderMessage = (returnedMessages) => {
        if (returnedMessages) {
            return returnedMessages.map((message, index) => {
                return renderOneMessage(message, index);
            })
        } else {
            return null; 
        }
    }

    return (
        <div style={{height:700, width:700, border:'3px solid black', borderRadius:'7px'}}>
            <div style={{height:644, width:'100%', overflow:'auto'}}>
                {renderMessage(messagesFromRedux)}
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