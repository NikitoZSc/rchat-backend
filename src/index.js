// WS Server
const server = require('http').createServer();
const io = require('socket.io')(server, {
    serveClient: false,
    wsEngine: 'ws'
});

// DB
const db = require('mysql');
const conn = db.createConnection({
    host: "localhost",
    user: "chat_user",
    password: "chat_pass1",
    database: "chat_db"
});

// Classes
const Users = require('./users.js');
const Chats = require('./chats.js');
const Messages = require('./messages.js');


// Defines
const port = 8080;

const result = {
    "class": "",
    "status": "",
    "detail": "",
    "data": []
}; // Result template

let u = {}; // Users controller
let c = {}; // Chats controller
let m = {}; // Messages controller

// Init server

server.listen(port, () => console.log('server listening on port ' + port));

conn.connect((err) => {
    if (err) throw err;
    console.log("DB conn ok");

    // Populating objects
    u = new Users(conn);
    c = new Chats(conn);
    m = new Messages(conn);
});

io.on('connect', onConnect);

// Main route function
function onConnect(socket) {
    console.log('Connect new user ' + socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnect ' + socket.id);
    });

    socket.on('register', (data) => {
        if (data.username != "" && data.nickname != "" && data.passwd != "") {
            let r_res = u.registerUser(conn.escape(data.nickname), conn.escape(data.username), data.passwd);
            r_res.then((res) => {
                socket.emit('auth', res)
            });

        } else {
            let r = Object.assign({}, result);
            r.class = "register";
            r.status = "error";
            r.detail = "Blank field found";
            socket.emit('auth', r);
        }
    });

    socket.on('auth', (data) => {
        if (data.username != "" && data.passwd != "") {
            let a_res = u.authUser(conn.escape(data.username), data.passwd);
            a_res.then((res) => {
                socket.emit('auth', res)
            });
        } else {
            let r = Object.assign({}, result);
            r.class = "auth";
            r.status = "error";
            r.detail = "Blank field found";
            socket.emit('auth', r);
        }
    });

    socket.on('deauth', (data) => {
        if (data.key != "") {
            let d_res = u.deAuthUser(conn.escape(data.key));
            d_res.then((res) => {
                socket.emit('deauth', res)
            });

        } else {
            let r = Object.assign({}, result);
            r.class = "deauth";
            r.status = "error";
            r.detail = "Key must be defined";
            socket.emit('auth', r);
        }
    });

    // Main actions
    socket.on('action', (data) => {
        if (data.key != "") {
            let check_res = checkAccess(conn.escape(data.key), socket.id);
            check_res.then((c_res) => {
                if(c_res.status === "success") {
                    let user_id = c_res.detail;
                    let f_res = {};
                    let err = Object.assign({}, result);
                    switch (data.class) {
                        case "users":
                            switch (data.action) {
                                case "search":
                                    f_res = u.searchUsers(data.q);
                                    f_res.then((r) => {
                                        r.class = data.class;
                                        r.action = data.action;
                                        socket.emit('info', r)
                                    });
                                    break;
                                case "list":
                                    f_res = u.getUsers();
                                    f_res.then((r) => {
                                        r.class = data.class;
                                        r.action = data.action;
                                        socket.emit('info', r)
                                    });
                                    break;
                                default:
                                    err.class = "all";
                                    err.status = "error";
                                    err.detail = "Action must be defined";
                                    socket.emit('info', err);
                                    break;
                            }
                            break;
                        case "chats":
                            switch (data.action) {
                                case "create":
                                    f_res = c.createChat(user_id, conn.escape(data.title));
                                    f_res.then((r) => {
                                        r.class = data.class;
                                        r.action = data.action;
                                        socket.emit('info', r)
                                    });
                                    break;
                                case "get":
                                    f_res = c.getChats(user_id);
                                    f_res.then((r) => {
                                        r.class = data.class;
                                        r.action = data.action;
                                        socket.emit('info', r)
                                    });
                                    break;
                                case "info":
                                    f_res = c.getChatInfo(data.chat_id);
                                    f_res.then((r) => {
                                        r.class = data.class;
                                        r.action = data.action;
                                        socket.emit('info', r)
                                    });
                                    break;
                                case "edit":
                                    f_res = c.editChat(user_id, data.chat_id, conn.escape(data.title));
                                    f_res.then((r) => {
                                        r.class = data.class;
                                        r.action = data.action;
                                        socket.emit('info', r)
                                    });
                                    break;
                                case "add_user":
                                    f_res = c.addUserToChat(user_id, data.chat_id, conn.escape(data.username));
                                    f_res.then((r) => {
                                        r.class = data.class;
                                        r.action = data.action;
                                        socket.emit('info', r)
                                    });
                                    break;
                                case "remove_me":
                                    f_res = c.removeFromChat(user_id, data.chat_id);
                                    f_res.then((r) => {
                                        r.class = data.class;
                                        r.action = data.action;
                                        socket.emit('info', r)
                                    });
                                    break;
                                default:
                                    err.class = "all";
                                    err.status = "error";
                                    err.detail = "Action must be defined";
                                    socket.emit('info', err);
                                    break;
                            }
                            break;
                        case "messages":
                            switch (data.action) {
                                case "send":
                                    f_res = m.sendMessage(user_id, data.chat_id, conn.escape(data.body));
                                    f_res.then((r) => {
                                        r.class = data.class;
                                        r.action = data.action;
                                        socket.emit('info', r);
                                        // Emit event to all users in chat
                                        r.data.forEach((item) => {
                                            try{
                                                io.sockets.connected[item.socket_id].emit('event-msg', data.chat_id);
                                            } catch(e){
                                                // Do nothing...
                                                console.log("Fail to send to " + item.socket_id + ", user " + item.id + ", chat " + data.chat_id);
                                                m.addUnread(item.id, data.chat_id);
                                            }
                                        });
                                    });
                                    // TODO: emit to all in this chat about new msg
                                    break;
                                case "get":
                                    f_res = m.getMessages(user_id, data.chat_id, data.limit);
                                    f_res.then((r) => {
                                        r.class = data.class;
                                        r.action = data.action;
                                        socket.emit('info', r)
                                    });
                                    break;
                                case "search":
                                    f_res = m.searchMessages(user_id, data.chat_id, data.q);
                                    f_res.then((r) => {
                                        r.class = data.class;
                                        r.action = data.action;
                                        socket.emit('info', r)
                                    });
                                    break;
                                default:
                                    err.class = "all";
                                    err.status = "error";
                                    err.detail = "Action must be defined";
                                    socket.emit('info', err);
                                    break;
                            }
                            break;
                        default:
                            err.class = "all";
                            err.status = "error";
                            err.detail = "Class must be defined";
                            socket.emit('info', err);
                    }
                }
            });
        } else {
            err.class = data.class;
            err.action = data.action;
            err.status = "error";
            err.detail = "Key must be defined";
            socket.emit('info', err);
        }
    });
}

// Check API key
function checkAccess(key, socket_id) {
    const q = "SELECT user_id FROM access WHERE hash = " + key;
    let r = Object.assign({}, this.result);
    return new Promise((resolve, reject) => {
        conn.query(q, (err, res) => {
            if(err) throw err;
            if(res.length === 1){
                r.status = "success";
                r.detail = res[0].user_id;
                // Update socket id
                const q = "UPDATE users SET socket_id = '" + socket_id + "' WHERE id = " + res[0].user_id;
                conn.query(q, (err, res) => {
                    if(err) throw err;
                });
                resolve(r);
            } else {
                r.status = "error";
                r.detail = "No such key found";
                resolve(r);
            }
        });
    });
}
