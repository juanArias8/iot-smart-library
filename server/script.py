import json
import random
import time

import paho.mqtt.client as mqtt

# Global data
broker_name = 'broker.hivemq.com'
topic = 'library'
port = 1883

# Test data
temp = [13, 15, 12, 14, 13, 17, 15, 16, 12, 15]
noise = [10, 15, 17, 25, 24, 11, 10, 17, 18, 20]
counter = [2, 4, 3, 5, 9, 6, 8, 9, 12, 10]


# Return dict with random values from test data
def get_random_data():
    data = {
        'temp': random.choice(temp),
        'noise': random.choice(noise),
        'people': random.choice(counter)
    }
    return json.dumps(data)


# Handle log messages event
def on_log(client, userdata, level, buffer):
    print('Log: ' + buffer)


# Handle connect event
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print('Successful connection')
    else:
        print('Error, code: ' + str(rc))


# Handle disconnect event
def on_disconnect(client, userdata, flags, rc=0):
    print('Disconnected code: ' + str(rc))


# Handle message event
def on_message(client, userdata, message):
    topic_ = message.topic
    message_ = str(message.payload.decode('UTF-8'))
    print('topic: {0}, message: {1}'.format(topic_, message_))


# MQTT instantiation and settings
client = mqtt.Client('sensor1')
client.on_connect = on_connect
client.on_message = on_message
client.on_log = on_log
client.on_disconnect = on_disconnect

# MQTT Client connection
print('Connecting')
client.connect(broker_name, port, 60)
client.subscribe(topic)
client.loop_start()

# Main infinite loop
while True:
    data = get_random_data()
    client.publish(topic, data)
    time.sleep(0.5)
