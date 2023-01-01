import { useEffect, useState } from 'react';
import MQTT from 'mqtt';
// https://github.com/mqttjs/MQTT.js


export default function Test() {
    const mqttTopic = 'chatroom/e0c450ac-3d4b-11ec-8d6c-0242ac110003'; 
    const [client, setClient] =  useState(null);
    useEffect(() => {
        if (client) {
            client.on('connect', () => console.log('Connected'));
            client.on('reconnect', () => console.log('Reconnecting') );
            client.on('error', (err) => {
                console.error('Connection error: ', err);
                client.end();
            });
            client.on('message', (topic, message) => {
                const payload = { topic, message: message.toString() };
                console.log(payload);
            });
        } else {
            setClient(MQTT.connect('mqtt://dev.lulla.co.kr', {port: 1884}));
        }
    }, [client]);

    const handleClickSubscribeTopic = e => {
        client.subscribe(mqttTopic, {}, (err, granted)=>{
            console.log(err, granted);
        });
    };

    const handleClickSendMessage = e => {
        client.publish(mqttTopic, "Hello MQTT", {}, err=>{
            console.log(err);
        });
    };

    return (
        <div>
            <h1>mqtt test</h1> 
            <button
                onClick={handleClickSubscribeTopic}
            >subscribe topic</button>
            <button
                onClick={handleClickSendMessage}
            >send message</button>
        </div>
    );
}