import {Kafka} from "kafkajs";

// the client ID lets kafka know who's producing the messages
const clientId = "my-app"
// we can define the list of brokers in the cluster
const brokers = ["localhost:9092"]
// this is the topic to which we want to write messages
const topic = "my-kafka-topic"

const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer();

const produce = async ({key, value}) => {
    await producer.connect()
    // after the produce has connected, we can send our data
    try {
        // send a message to the configured topic with
        // the key and value formed from the current value of `i`
        await producer.send({
            topic,
            messages: [{key, value: JSON.stringify(value)}],
        })

        // if the message is written successfully, log it and increment `i`
        console.log(`Published to kafka topic [${key}] : ${JSON.stringify(value)}`)
    } catch (err) {
        console.error("Could not write message " + err)
    }
}

const publishKafkaMessage = ({key, value}) => {
    produce({key, value}).catch((err) => {
        console.error("Error in producer: ", err)
    })
}

export default publishKafkaMessage;
