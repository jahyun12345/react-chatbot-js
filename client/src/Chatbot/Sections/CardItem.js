import React from 'react';
import { Card, Icon } from 'antd';
const { Meta } = Card;

function CardItem(props) {
    const cardInfo = props.cardInfo.fields;
    return (
        <Card 
            style={{width:300}}
            cover={<img 
                        alt={cardInfo.description.stringValue} 
                        src={cardInfo.image.stringValue}
                    />}
            actions={[
                <a target="_blank" rel="noopener noreferrer" href={cardInfo.link.stringValue}>
                    <Icon type="ellipsis" key="ellipsis" />
                </a>
            ]}
        >
            <Meta 
                title={cardInfo.stack.stringValue}
                description={cardInfo.description.stringValue}
            />
        </Card>
    )
}

export default CardItem