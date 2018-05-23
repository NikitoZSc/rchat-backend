class Users{

    constructor(conn){
        this.db_conn = conn;
        this.result = {
            "class": "",
            "status": "",
            "detail": "",
            "data": []
        }
    }

    registerUser(nickname, username, passwd){
        const q = "SELECT username FROM users WHERE username = " + username;
        let r = Object.assign({}, this.result);
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                if(res.length == 0){
                    // No user, ok
                    const q = "INSERT INTO users (nickname, username, passwd) VALUES (" + nickname + ", " + username + ", MD5('" + passwd + "'))";
                    this.db_conn.query(q, (err, res) => {
                        if(err) throw err;
                        const u_id = res.insertId;
                        // Do login
                        const a_key = this.getAuthHash(passwd);
                        const q = "INSERT INTO access (user_id, hash, ts) VALUES ('" + u_id + "', '" + a_key + "', NOW())";
                        this.db_conn.query(q, (err, res) => {
                            if(err) throw err;
                            const u_id = res.insertId;
                            // Return access key
                            r.class = "register";
                            r.status = "success";
                            r.detail = a_key;
                            resolve(r);
                        });
                    });
                } else {
                    r.class = "register";
                    r.status = "error";
                    r.detail = "User exist";
                    resolve(r);
                }
            });
        });
    }

    authUser(username, passwd){
        console.log("Try to auth with name " + username + " and pass " + passwd);
        const q = "SELECT username FROM users WHERE username = " + username;
        let r = Object.assign({}, this.result);
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                if(res.length != 0){
                    // No user, ok
                    const q = "SELECT id, passwd, MD5('" + passwd + "') AS db_passwd FROM users WHERE username = " + username;
                    this.db_conn.query(q, (err, res) => {
                        if(err) throw err;
                        if(res[0].passwd == res[0].db_passwd){
                            // Do login
                            // Remove all exist hashes
                            const q1 = "DELETE FROM access WHERE user_id = '" + res[0].id + "'";
                            this.db_conn.query(q1, (err, res) => {
                                if(err) throw err;

                            });
                            const a_key = this.getAuthHash(passwd);
                            const q2 = "INSERT INTO access (user_id, hash, ts) VALUES ('" + res[0].id + "', '" + a_key + "', NOW())";
                            this.db_conn.query(q2, (err, res) => {
                                if(err) throw err;
                                // Return access key
                                r.class = "auth";
                                r.status = "success";
                                r.detail = a_key;
                                resolve(r);
                            });
                        } else {
                            r.class = "auth";
                            r.status = "error";
                            r.detail = "Something is wrong (ex. password?)";
                            resolve(r);
                        }
                    });
                } else {
                    r.class = "auth";
                    r.status = "error";
                    r.detail = "No such user";
                    resolve(r);
                }
            });
        });
    }

    deAuthUser(key){
        const q = "DELETE FROM access WHERE hash = " + key;
        let r = Object.assign({}, this.result);
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                // Logoff ok
                r.class = "deauth";
                r.status = "success";
                r.detail = "";
                resolve(r);
            });
        });
    }

    getUser(id){
        let r = Object.assign({}, this.result);
        const q = "SELECT nickname, avatar, socket_id FROM users WHERE id = " + id;
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                r.status = "success";
                r.data = res;
                resolve(r);
            });
        });
    }

    getUsers(){
        let r = Object.assign({}, this.result);
        const q = "SELECT id, nickname, username FROM users";
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if(err) throw err;
                r.status = "success";
                r.data = res;
                resolve(r);
            });
        });
    }

    searchUsers(s_q){
        let r = Object.assign({}, this.result);
        const q = "SELECT id, nickname, username FROM users WHERE ((nickname LIKE '%" + s_q + "%') OR (username LIKE '%" + s_q + "%'))";
        return new Promise((resolve, reject) => {
            this.db_conn.query(q, (err, res) => {
                if (err) throw err;
                r.status = "success";
                r.data = res;
                resolve(r);
            });
        });
    }

    getAuthHash(passwd){
        const crypto = require('crypto');
        const ts = new Date();
        const key = passwd + ts.toISOString();
        const hash =  crypto.createHash('sha256').update(key);
        return hash.digest('base64');
    }
}

module.exports = Users;