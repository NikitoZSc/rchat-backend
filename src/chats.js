class Chats{

    constructor(conn){
        this.db_conn = conn;
        this.result = {
            "class": "",
            "status": "",
            "detail": "",
            "data": []
        }
    }

    createChat(user_id, title){
        const q = "SELECT title FROM chats WHERE title = " + title;
        let r = Object.assign({}, this.result);
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                if(res.length == 0){
                    // No such chat, ok
                    const q = "INSERT INTO chats (title) VALUES (" + title + ")";
                    this.db_conn.query(q, (err, res) => {
                        if(err) throw err;
                        const c_id = res.insertId;
                        // Add user to chat
                        const q = "INSERT INTO user_to_chat (user_id, chat_id) VALUES ('" + user_id + "', '" + c_id + "')";
                        this.db_conn.query(q, (err, res) => {
                            if(err) throw err;
                            // Return access key
                            r.class = "chats";
                            r.status = "success";
                            r.detail = title;
                            r.id = c_id;
                            resolve(r);
                        });
                    });
                } else {
                    r.class = "chats";
                    r.status = "error";
                    r.detail = "Chat exist";
                    resolve(r);
                }
            });
        });
    }

    getChats(user_id){
        const q = "SELECT id, title, unread FROM chats LEFT JOIN user_to_chat ON user_to_chat.chat_id = chats.id WHERE user_id = " + user_id;
        let r = Object.assign({}, this.result);
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                r.class = "chats";
                r.status = "success";
                r.detail = "";
                r.data = res;
                resolve(r);
            });
        });
    }

    getChatInfo(chat_id){
        const q = "SELECT title FROM chats WHERE id = " + chat_id;
        let r = Object.assign({}, this.result);
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                r.class = "chats";
                r.status = "success";
                r.detail = res[0].title;
                r.id = chat_id;
                const q = "SELECT id, nickname, username FROM users LEFT JOIN user_to_chat ON user_to_chat.user_id = users.id WHERE user_to_chat.chat_id = " + chat_id;
                this.db_conn.query(q, (err, res) => {
                    if(err) throw err;
                    r.data = res;
                    resolve(r);
                });
            });
        });
    }

    addUserToChat(user_id, chat_id, username){
        const q = "SELECT user_id FROM user_to_chat WHERE user_id = " + user_id + " AND chat_id = '" + chat_id + "'";
        let r = Object.assign({}, this.result);
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                if(res.length != 0){
                    // Yes, user in chat, we can add new user
                    const q = "SELECT id FROM users WHERE username = " + username;
                    this.db_conn.query(q, (err, res) => {
                        if(err) throw err;
                        if(res.length > 0){
                            // User found, need check chat
                            const u_id = res[0].id;
                            const q = "SELECT user_id FROM user_to_chat WHERE chat_id = '" + chat_id + "' AND user_id = " + u_id;
                            this.db_conn.query(q, (err, res) => {
                                if(err) throw err;
                                if(res.length == 0){
                                    // No user in this chat, will add
                                    console.log("No at chat yet, ok");
                                    const q = "INSERT INTO user_to_chat (user_id, chat_id) VALUES (" + u_id + ", '" + chat_id + "')";
                                    this.db_conn.query(q, (err, res) => {
                                        if(err) throw err;
                                        const m_id = res.insertId;
                                        r.class = "chats";
                                        r.status = "success";
                                        r.id = u_id;
                                        console.log("Ok all");
                                        resolve(r);
                                    });
                                } else {
                                    r.class = "chats";
                                    r.status = "error";
                                    r.detail = "User aready in this chat";
                                    resolve(r);
                                }
                            });
                        } else {
                            r.class = "chats";
                            r.status = "error";
                            r.detail = "User not found";
                            resolve(r);
                        }
                    });
                } else {
                    r.class = "chats";
                    r.status = "error";
                    r.detail = "User not in defined chat";
                    resolve(r);
                }
            });
        });
    }

    editChat(user_id, chat_id, title){
        const q = "SELECT user_id FROM user_to_chat WHERE user_id = " + user_id + " AND chat_id = '" + chat_id + "'";
        let r = Object.assign({}, this.result);
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                if(res.length != 0){
                    // Yes, user in chat, we can add new user
                    const q = "UPDATE chats SET title = '" + title + "' WHERE id = '" + chat_id + "'";
                    this.db_conn.query(q, (err, res) => {
                        if(err) throw err;
                        r.class = "chats";
                        r.status = "success";
                        r.detail = title;
                        r.id = chat_id;
                        resolve(r);
                    });
                } else {
                    r.class = "chats";
                    r.status = "error";
                    r.detail = "User not in defined chat";
                    resolve(r);
                }
            });
        });
    }

    removeFromChat(user_id, chat_id){
        const q = "SELECT user_id FROM user_to_chat WHERE user_id = " + user_id + " AND chat_id = '" + chat_id + "'";
        let r = Object.assign({}, this.result);
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                if(res.length != 0){
                    // Yes, user in chat, we can add new user
                    const q = "DELETE FROM user_to_chat WHERE user_id = " + user_id + " AND chat_id = '" + chat_id + "'";
                    this.db_conn.query(q, (err, res) => {
                        if(err) throw err;
                        const m_id = res.insertId;
                        r.class = "chats";
                        r.status = "success";
                        r.detail = m_id;
                        resolve(r);
                    });
                } else {
                    r.class = "chats";
                    r.status = "error";
                    r.detail = "User not in defined chat";
                    resolve(r);
                }
            });
        });
    }

}

module.exports = Chats;