import express from 'express';
import { hash_password, verify } from './encrypt.js';
import debug from '../debug.js';
import {connection} from '../config/connection.js';
import {getPartyList, createTaxiParty} from '../party/partyList.js';

global.global_id=0;
var id_array=[0,0,0,0,0];//order same as table order : taxi, meal, etc

const port=process.env.PORT||80;

connection.connect();//필요??
  
const app=express();
app.use(express.json());

//test
app.get('/',(req, res)=>{
    // res.status(200).sendFile(path.join(__dirname, "test.html"))
    res.send("<h1>Hello in user.js<h1>")
});

//update global variable global_id
const party=['taxi_party', 'meal_party','night_meal_party','study_party','custom_party']
for(let i=0;i<5;i++){
    connection.query('select party_id from ?? order by party_id desc limit 1;',[party[i]],async(error, rows, field)=>{
        debug(`Rows in user.js for global id : ${JSON.stringify(rows)}`)
        if(error){
            // Query error.->mysql error: not null but null or not database or no table etc
            debug("GETTING PARTY ID failed due to query error.");
            debug(error.message);
        }
        else if(rows.length==0){//taxi_party has no element
            debug(`There is no party_id in ${party[i]}. Set global_id to 0`);
            id_array[i]=0;
        }
        else{//taxi_party has more than 1 element
            debug(`Set taxi_global_id to the rows length to ${rows.length}.`);
            id_array[i]=rows[0].party_id;
        }
        if (i==4){
            global_id=Math.max(...id_array);
            global_id++;
            debug(`GLOBAL_ID CHECK!!!! : ${global_id}`)
        }
    })
}


//login
app.post("/login", (req, res)=>{
    const userid=req.body.userid;
    const pw=req.body.pw;

    debug(`POST /login\t${userid}, ${pw}`);

    if (userid != undefined && pw != undefined) {
        connection.query('select * from users where userid=?', [userid], async (error, rows, field) => {
            if (error) {
                // Query error.->mysql error: not null but null or not database or no table etc
                debug("Login failed due to query error.");
                debug(error.message);
                res.status(400).send(error.message);
            }
            else if (rows.length == 0) {
                debug("There is no such user, or password is incorrect.");
                res.status(400).send("There is no such user, or password is incorrect.");
            }
            else {
                debug("Rows : "+JSON.stringify(rows));
                const user_info = rows[0];
                debug("Rows[0] : "+JSON.stringify(rows[0]));
                if (await verify(pw, user_info.salt, user_info.pw)) {
                    debug("Login success.");
                    res.status(200).send({msg: "Login succeeded.", username: user_info.username});
                }
                else {
                    debug("There is no such user, or password is incorrect.");
                    res.status(400).send("There is no such user, or password is incorrect.");
                }
            }
        });
    }
    else {
        res.status(400).send("Bad request body; you must include userid and pw.");
    }


});

//register
app.post("/register", (req, res) => {
    const userid = req.body.userid;
    const pw = req.body.pw;
    const username=req.body.username;
    const age=req.body.age;
    const place1=req.body.place1;
    const place2=req.body.place2;
    const place3=req.body.place3;
    

    debug(`POST /register\t${userid}, ${pw}`);

    if (userid !== undefined && pw !== undefined) {
        connection.query('select userid from users where userid=?', [userid], async (error, rows, field) => {
            if (error) {
                // Query error.
                debug("Register failed due to query error 1");
                debug(error.message);
                res.status(400).send(error.message);
            }
            else if (rows.length > 0) {
                debug(`User ID ${userid} already exists.`);
                res.status(400).send("The ID already exists.");
            }
            else {
                debug("OK, you can use this userid..");
                const hashed_pw = await hash_password(pw);
                connection.query('insert into users(username, userid, pw, age, place1, place2, place3, salt) values(?, ?, ?,?,?,?,?,?)', [username, userid, hashed_pw.hashed_pw, age, place1, place2, place3, hashed_pw.salt], (error, rows, field) => {
                    if (error) {
                        // Query error again..
                        debug("Register failed due to query error 2");
                        debug(error.message);
                        res.status(400).send(error.message);
                    }
                    else {
                        debug(`User ${userid}, successfully registered.`);
                        // Redirect to login page.
                        res.status(200).send("Register succeeded.");
                    }
                })
            }
        })
    }
    else {
        res.status(400).send("Bad request body; you must include userid, pw, and username etc.");
    }
});

//register/duplicate_id
app.get("/register/duplicate-id", (req, res) => {
    const userid = req.query.userid;
    debug("QUERY!!!"+JSON.stringify(req.query));

    debug(`GET /register/duplicate-id\t${userid}`);

    if (userid !== undefined) {
        connection.query('select userid from users where userid=?', [userid], async (error, rows, field) => {
            if (error) {
                // Query error.
                debug("Register/duplicate-id failed due to query error 1");
                debug(error.message);
                res.status(400).send(error.message);
            }
            else if (rows.length > 0) {//rows: connection query의 결과
                debug(`User ID ${userid} already exists.`);
                debug(`Rows : ${JSON.stringify(rows)}`);
                res.status(400).send("The ID already exists.");
            }
            else {
                debug("OK, you can use this userid..");
                res.status(200).send("You can use this ID.");
            }
        })
    }
    else {
        res.status(400).send("Bad request; you must include userid.");
    }
});


//show partyList
app.get("/party-list/:type", getPartyList);

//create new party
app.post("/create-party/taxi-party",createTaxiParty);

// connection.end();

app.listen(port,()=>{
    console.log("<> Server start. Running on port " +port);
})