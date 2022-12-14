import debug from '../../debug.js';
import {connection, convertRowsHierarchical} from '../../config/connection.js';
//if liked is 1, add to the liked_party table, and if liked is 0, delete from the liked_party table
const Like=function(req, res){
    const userid=req.body.userid;
    const username=req.body.username;
    const party_id=req.body.party_id;
    const liked=req.body.liked;
    const type=req.body.party_type;

    debug(`POST /like\tUSREID : ${userid}, USERNAME : ${username}, PARTY ID : ${party_id}, LIKED : ${liked} TYPE : ${type}`);

    if(userid!==undefined && party_id!==undefined&&liked!==undefined){
        connection.query('select * from users where userid=? and username=?',[userid, username], async(error, rows, field)=>{
            if(error){
                debug("like failed due to query error 0.");
                debug(error.message);
                res.status(400).send(error.message);
            }
            else if(rows.length==0){
                debug(`USERID :${userid} doesn't exist.`)
                res.status(400).send(`USERID :${userid} doesn't exist.`);
            }
            else{//userid, username exists
                //check whether party_id exists
                connection.query('select * from ?? where party_id=?',[type, party_id],async(error, rows, field)=>{
                    if(error){
                        debug("like failed due to query error 1.");
                        debug(error.message);
                        res.status(400).send(error.message);
                    }
                    else if(rows.length==0){
                        debug(`PARTY ID :${party_id} doesn't exist.`)
                        res.status(400).send(`PARTY ID :${party_id} doesn't exist.`);
                    }
                    else{//user and party id exist
                        //if liked==1 -> add to the liked_party table
                        if(liked==1){//insert to liked_party
                            connection.query('insert into liked_party(party_id, userid, username) values (?,?,?)',[party_id, userid, username], async(error, rows, field)=>{
                                if(error){
                                    debug("like failed due to query error 2.");
                                    debug(error.message);
                                    res.status(400).send(error.message);
                                }
                                else {//insert succeed.
                                    debug("insert to liked_table succeed.");
                                    res.status(200).send("insert to liked_table succeed.")
                                }
                            })
                        }
                        else if(liked==0){
                            connection.query('delete from liked_party where party_id=? and userid=? and username=?',[party_id, userid, username], async(error, rows, field)=>{
                                if(error){
                                    debug("like failed due to query error 3.");
                                    debug(error.message);
                                    res.status(400).send(error.message);
                                }
                                else {//insert succeed.
                                    debug("delete from liked_table succeed.");
                                    res.status(200).send("delete from liked_table succeed.")
                                }
                            })
                        }
                    }
                })
            }
        })
    }
    
}

const LikedParty=function (req, res){
    const userid=req.params.userid;
    
    debug(`GET /liked-party\tUSREID : ${userid}`);

    if (userid != undefined ) {
        connection.query('select * from users where userid=?',[userid],async(error, rows, field)=>{
            if (error) {
                // Query error.->mysql error: not null but null or not database or no table etc
                debug("myParty failed due to query error 0.");
                debug(error.message);
                res.status(400).send(error.message);
            }
            else if(rows.length==0){
                debug(`USERID :${userid} doesn't exist.`)
                res.status(400).send(`USERID :${userid} doesn't exist.`);
            }
            else {//userid exists
                debug("Rows : "+JSON.stringify(rows));
                //find the type
                //userid??? ?????? ??????, ?????? user??? ????????????(???????????? ??????) ????????? ???????????? ???.
                //liked_party??? type table(taxi_party, ... etc)??? join ???????????? ???.
                //inner join ???????????? ?????? ???????????? ??????????????? ????????? ?????? userid??? ????????? select.
                //?????? type??? ???????????? ???????????????, ?????? ??? ???????????? ??????.
                //??? ???????????? ????????????
                const type_arr=['taxi_party', 'meal_party','night_meal_party','study_party', 'custom_party'];
                var party_json={
                    'taxi_party':[],
                    'meal_party':[],
                    'night_meal_party':[],
                    'study_party':[],
                    'custom_party':[]
                };
                for(let i=0; i<5;i++){
                    connection.query(`select * from liked_party as u inner join ?? as t on u.party_id=t.party_id and u.userid=?`,[type_arr[i],userid],async(error, rows, field)=>{
                        if(error){
                            debug("LikedParty failed due to query error 1.");
                            debug(error.message);
                            res.status(400).send(error.message);
                        }
                        else if(rows.length==0){
                            debug(`LikedParty PARTY TYPE : ${type_arr[i]}, USERID : ${userid} has no data.`);
                            party_json[type_arr[i]]=[];
                        }
                        else{
                            debug(`!!!!!!!!!!!!`);
                            debug(`${type_arr[i]} Rows : ${JSON.stringify(rows)}`);
                            party_json[type_arr[i]]=convertRowsHierarchical(rows,type_arr[i]);
                        }
                        if(i==4){
                            res.status(200).send(party_json);
                        }
                    })
                }
            }
        })
    }
    else{
        res.status(400).send("Bad request body; you must include userid.");
    }
}


export {Like, LikedParty};
