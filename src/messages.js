class Messages{

    constructor(conn){
        this.db_conn = conn;
        this.result = {
            "class": "",
            "status": "",
            "detail": "",
            "data": []
        }
    }

    sendMessage(user_id, chat_id, body){
        const q = "SELECT user_id FROM user_to_chat WHERE user_id = " + user_id + " AND chat_id = '" + chat_id + "'";
        let r = Object.assign({}, this.result);
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                if(res.length != 0){
                    // Yes, user in chat
                    const q = "INSERT INTO messages (author_id, chat_id, body, ts) VALUES (" + user_id + ", '" + chat_id + "', " + body + ", NOW())";
                    this.db_conn.query(q, (err, res) => {
                        if(err) throw err;
                        const m_id = res.insertId;
                        r.status = "success";
                        r.detail = m_id;
                        // Emit event for all users in chat
                        const q = "SELECT id, socket_id FROM users LEFT JOIN user_to_chat ON user_to_chat.user_id = users.id WHERE chat_id = '" + chat_id + "'";
                        this.db_conn.query(q, (err, res) => {
                            if(err) throw err;
                            r.data = res;
                            resolve(r);
                        });
                    });
                } else {
                    r.status = "error";
                    r.detail = "User not in defined chat";
                    resolve(r);
                }
            });
        });
    }

    getMessages(user_id, chat_id, cnt){
        const q = "SELECT user_id FROM user_to_chat WHERE user_id = " + user_id + " AND chat_id = '" + chat_id + "'";
        let r = Object.assign({}, this.result);
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                if(res.length != 0){
                    // Yes, user in chat
                    const q = "SELECT messages.id, users.id AS author_id, users.nickname, body, DATE_FORMAT(ts, '%d.%m.%Y %H:%i') AS ts FROM messages LEFT JOIN users ON users.id = messages.author_id WHERE chat_id = '" + chat_id + "' LIMIT " + cnt;
                    this.db_conn.query(q, (err, res) => {
                        if(err) throw err;
                        r.status = "success";
                        r.detail = chat_id;
                        r.data = res;
                        const q = "UPDATE user_to_chat SET unread = 0 WHERE user_id = " + user_id + " AND chat_id = '" + chat_id + "'";
                        this.db_conn.query(q, (err, res) => {
                            if(err) throw err;
                            resolve(r);
                        });
                    });
                } else {
                    r.status = "error";
                    r.detail = "User not in defined chat";
                    resolve(r);
                }
            });
        });
    }

    searchMessages(user_id, chat_id, s_q){
        const q = "SELECT user_id FROM user_to_chat WHERE user_id = " + user_id + " AND chat_id = '" + chat_id + "'";
        let r = Object.assign({}, this.result);
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                if(res.length != 0){
                    // Yes, user in chat
                    const q = "SELECT messages.id, users.id AS author_id, users.nickname, body, DATE_FORMAT(ts, '%d.%m.%Y %H:%i') FROM messages LEFT JOIN users ON users.id = messages.author_id WHERE chat_id = '" + chat_id + "' AND messages.body LIKE '%" + s_q + "%' LIMIT " + cnt;
                    this.db_conn.query(q, (err, res) => {
                        if(err) throw err;
                        r.status = "success";
                        r.detail = chat_id;
                        r.data = res;
                        resolve(r);
                    });
                } else {
                    r.status = "error";
                    r.detail = "User not in defined chat";
                    resolve(r);
                }
            });
        });
    }

    addUnread(user_id, chat_id){
        const q = "UPDATE user_to_chat SET unread = unread + 1 WHERE user_id = '" + user_id + "' AND chat_id = '" + chat_id + "'";
        this.db_conn.query(q, (err, res) => {
            if(err) throw err;
        });
    }
}

module.exports = Messages;