const express = require("express");
const mysql = require("mysql");
const bodyParser = require('body-parser');
const pool=mysql.createPool({
    host:'127.0.0.1',
    port:3306,
    user:'root',
    password:'',
    database:'holiland',
    connectionLimit:15
});
const cors=require("cors");
const server = express();
server.use(bodyParser());
server.use(cors({
    origin:['http://localhost:8080','http://127.0.0.1:8080']
}));

// 注册
server.post('/register',(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let phone = req.body.phone;
    let sql = 'INSERT INTO h_user (username,password,email,phone) VALUES (?,?,?,?)'
    pool.query(sql,[username,password,email,phone],(err,results)=>{
        if (err) throw err
        res.send('注册成功')
    })
})
// 注册查看是否存在用户名
server.post('/check',(req,res)=>{
    let username = req.body.username;
    // console.log('aa'+username+'aa')
    let sql = 'SELECT * from h_user  WHERE username = ?'
    pool.query(sql,[username],(err,results)=>{
        if (err) throw err;
        // console.log(results)
        res.send({results:results})
    })
})
// 登录
server.post('/login',(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let sql = 'SELECT * from h_user WHERE username = ?'
    let sql2 = 'SELECT u_id,username from h_user WHERE username = ? AND password = ?'
    pool.query(sql,[username],(err,results)=>{
        if (err) throw err;
        // console.log(results)
        if(results.length==0){
            res.send({code:0})
        }else{
            pool.query(sql2,[username,password],(err,results)=>{
                if(err) throw err;
                if(results.length==0){
                    res.send({code:1})
                }else{
                    res.send(results)
                }
            })
        }
    })
})

// 轮播图
server.get('/lunbo',(req,res)=>{
    let sql = 'SELECT * from home WHERE type = 1'
    pool.query(sql,(err,results)=>{
        if (err) throw err;
        res.send(results)
    })
})

// 首页 中 商品
server.get('/shouye',(req,res)=>{
    let sql = 'SELECT * from home WHERE type = 2'
    pool.query(sql,(err,results)=>{
        if(err) throw err;
        res.send(results)
    })
})
// 首页 下 三
server.get('/shouye3',(req,res)=>{
    let sql = 'SELECT * from home WHERE type = 3'
    pool.query(sql,(err,results)=>{
        if(err) throw err;
        res.send(results)
    })
})
// 获取商品信息列表
server.get('/list',(req,res)=>{
    let id = req.query.id
    // console.log(id)
    let sql = 'SELECT * from list WHERE home_id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
    })
})
server.get('/list_car',(req,res)=>{
    let id = req.query.id
    console.log(id)
    let sql = 'SELECT * from list WHERE id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
    })
})
// 获取一个商品的详情
server.get('/details1',(req,res)=>{
    let id = req.query.id
    // console.log(id)
    let sql = 'SELECT name,price,img from list WHERE id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
        // console.log(results)
    })
})
server.get('/details',(req,res)=>{
    let id = req.query.id
    // console.log(id)
    let sql = 'SELECT details from details WHERE list_id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
        // console.log(results)
    })
})
// 获取一个商品的详情  轮播图
server.get('/detailsswiper',(req,res)=>{
    let id = req.query.id
    // console.log(id)
    let sql = 'SELECT img from list_swiper WHERE list_id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
        // console.log(results)
    })
})

server.get('/specification',(req,res)=>{
    let id = req.query.id
    // console.log(id)
    let sql = 'SELECT * from spe WHERE list_id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
        // console.log(results)
    })
})
server.get('/spe',(req,res)=>{
    let id = req.query.id
    // console.log(id)
    let sql = 'SELECT * from spe WHERE id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
        // console.log(results)
    })
})
// 获取产品页右侧
server.get('/foot',(req,res)=>{
    let id = req.query.id
    let sql = 'SELECT img from list WHERE home_id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
    })
})


// 添加到购物车
server.get('/add',(req,res)=>{
    let userid = req.query.userid;
    let listid = req.query.listid
    let speid = req.query.speid
    let count = req.query.count
    let sql = 'INSERT INTO shopcar (user_id,list_id,spe_id,count) VALUES (?,?,?,?)';
    pool.query(sql,[userid,listid,speid,count],(err,results)=>{
        if(err) throw err;
        res.send(results)
    })
})
// 获取购物车的信息
server.get('/car',(req,res)=>{
    let userid = req.query.userid;
    let sql = 'SELECT * FROM shopcar WHERE user_id = ?';
    pool.query(sql,[userid],(err,results)=>{
        if(err) throw err;
        res.send(results)
    })
})
// // 删除购物车信息
// server.get('/del',(req,res)=>{
//     let id = req.query.carid;
//     let sql = 'DELETE FROM shop_car WHERE id = ?'
//     pool.query(sql,[id],(err,results)=>{
//         if(err) throw err;
//         res.send("删除成功")
//     })
// })
// //修改购物车数量
// server.get('/update',(req,res)=>{
//     let id = req.query.carid;
//     let conut = req.query.conut;
//     let sql = 'UPDATE shop_car SET conut = ? WHERE id = ?'
//     pool.query(sql,[conut,id],(err,results)=>{
//         if(err) throw err;
//         // console.log('执行了一次')
//         res.send('修改成功')
//     })
// })
// // 模糊查询
// server.get('/search',(req,res)=>{
//     let id = req.query.id;
//     let sql = 'SELECT * from ocean_list WHERE name LIKE ?'
//     pool.query(sql,["%"+id+"%"],(err,results)=>{
//         if(err) throw err;
//         res.send(results)
//     })
// })
// server.get('/luobotu',(req,res)=>{
//     let sql = 'SELECT src from ocean_list WHERE type = 6'
//     pool.query(sql,(err,results)=>{
//         if(err) throw err;
//         res.send(results)
//     })
// })


server.listen(3000,()=>{
  console.log('服务器启动...');
});