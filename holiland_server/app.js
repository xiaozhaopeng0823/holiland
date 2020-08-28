const express = require("express");
const mysql = require("mysql");
const bodyParser = require('body-parser');
const pool=mysql.createPool({
    host:'127.0.0.1',
    port:3306,
    user:'root',
    password:'',
    database:'holiland',
    connectionLimit:20
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
    let sql = 'SELECT * from h_user  WHERE username = ?'
    pool.query(sql,[username],(err,results)=>{
        if (err) throw err;
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
    console.log(id)
    let sql2 = 'SELECT * from list WHERE home_id = 5 || home_id = 6 || home_id = 7'
    let sql1 = 'SELECT * from list WHERE home_id = ?'
    if(id==20){
        pool.query(sql2,(err,results)=>{
            if(err) throw err;
            res.send(results)
        })
    }else{
        pool.query(sql1,[id],(err,results)=>{
            if(err) throw err;
            res.send(results)
        })
    }
})
server.get('/list_car',(req,res)=>{
    let id = req.query.id
    let sql = 'SELECT * from list WHERE id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
    })
})
// 获取一个商品的详情
server.get('/details1',(req,res)=>{
    let id = req.query.id
    let sql = 'SELECT name,price,img from list WHERE id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
    })
})
server.get('/details',(req,res)=>{
    let id = req.query.id
    let sql = 'SELECT details from details WHERE list_id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
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
    })
})

server.get('/specification',(req,res)=>{
    let id = req.query.id
    // console.log(id)
    let sql = 'SELECT * from spe WHERE list_id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
    })
})
server.get('/spe',(req,res)=>{
    let id = req.query.id
    // console.log(id)
    let sql = 'SELECT * from spe WHERE id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send(results)
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
    let listname = req.query.listname
    let listprice = req.query.listprice
    let listimg = req.query.listimg
    let listspe = req.query.listspe
    let sql = 'INSERT INTO shopcar (user_id,list_id,spe_id,count,list_name,list_img,list_price,list_spe) VALUES (?,?,?,?,?,?,?,?)';
    pool.query(sql,[userid,listid,speid,count,listname,listimg,listprice,listspe],(err,results)=>{
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
// 删除购物车信息
server.get('/del',(req,res)=>{
    let id = req.query.carid;
    let sql = 'DELETE FROM shopcar WHERE id = ?'
    pool.query(sql,[id],(err,results)=>{
        if(err) throw err;
        res.send("删除成功")
    })
})
//修改购物车数量
server.get('/update',(req,res)=>{
    let id = req.query.carid;
    let count = req.query.count;
    let sql = 'UPDATE shopcar SET count = ? WHERE id = ?'
    pool.query(sql,[count,id],(err,results)=>{
        if(err) throw err;
        // console.log('执行了一次')
        res.send('修改成功')
    })
})
// 模糊查询
server.get('/search',(req,res)=>{
    let key = req.query.key;
    let sql = 'SELECT * from list WHERE name LIKE ?'
    pool.query(sql,["%"+key+"%"],(err,results)=>{
        if(err) throw err;
        res.send(results)
    })
})
//结算
server.get('/buy',(req,res)=>{
    let userid = req.query.userid;
    let listid = req.query.listid
    let speid = req.query.speid
    let count = req.query.count
    let sql = 'INSERT INTO buy (user_id,list_id,spe_id,count) VALUES (?,?,?,?)';
    pool.query(sql,[userid,listid,speid,count],(err,results)=>{
        if(err) throw err;
        res.send('添加成功')
    })
})


server.listen(3000,()=>{
  console.log('服务器启动...');
});