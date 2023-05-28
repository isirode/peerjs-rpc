# peerjs-rpc

Disclaimer: Not affiliated with the original peerjs providers.

This is a library based on PeerJS that allow to send RPC messages inside a [P2PRoom](https://github.com/isirode/peerjs-room).

## Features

- [x] Send RPC commands to an object of specified id to
  - [x] A single user
  - [x] To a list of users
  - [x] To all users of the room

## Using the library

```typescript
import { LocalUser, Message, P2PRoom, RenameUserMessage, TextMessage, User, IClient, Peer as DomainPeer, PeerJSServerClient, RoomService } from 'peerjs-room';
import { RpcService, IRpcObject } from 'peerjs-rpc';

// use the appropriates value here
const peerJSClient = new PeerJSServerClient({
  host: "hostname",
  port: 443,
  secure: true,
});

const roomService = new RoomService(peerJSClient);

// that up to you to define for now, it how you create your peerjs instance
const peer = await peerProvider();

const roomId = 'main-room';

const room: IRoom = await roomService.joinRoom(roomId, peer.id);

const localUser = {
  peer: new DomainPeer(peer),
  name: 'an username',
};

const names = ['Bob', 'Francis', 'Jessica', 'Lucie'];

p2pRoom = new P2PRoom(localUser, room, names);

const rpcService = new RpcService(p2pRoom);

const anObject: IRpcObject = {
  id: "id-test",
  nextTarget: {},
  aMethod: (...args) => {
    console.log(args);
  },
  aProperty: "test"
}

const proxiedObject = rpcService.add(anObject);

// Will be sync immediatly
proxiedObject.aProperty = "test2";

// Send to all users by default
proxiedObject.aMethod("test", "test2", 33);

// Specify an user
proxiedObject.nextTarget.userTarget = ...

// Specify a list of users
proxiedObject.nextTarget.usersTarget = ...

```

## Importing the project

It is not published yet, so you will need to follow the steps below:
- Clone the project
- Build it `npm run build`
- Link it `npm link`
- Or use the single liner `npm run local`
- Then, you can import it in your project using `npm link peerjs-room`

### Dependencies

You should not need to do any custom imports.

## Know issues

- It is a work in progress

## Partipating

Open the [DEVELOPER.md](./DEVELOPER.md) section.

## License

It is provided with the GNU LESSER GENERAL PUBLIC LICENSE.

This is a library based on PeerJS that allow to send RPC messages inside a P2PRoom.
Copyright (C) 2023  Isirode

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

