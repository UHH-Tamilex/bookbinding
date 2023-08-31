import simplejson as json
import asyncio
import websockets

async def handler(websocket,path):
    data = await websocket.recv()
    # do your ChatGPT magic here with the data and send a real reply
    print(data)
    reply = {
        "tst": "FROM mss WHERE form='codex' AND stringholes != '' AND width > 100",
        "coptic": "FROM mss WHERE leaf_width > 100",
        "betamasaheft": "FROM mss WHERE outer_width > 100"
    }
    await websocket.send(json.dumps(reply))

start_server = websockets.serve(handler, 'localhost', 5353)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
