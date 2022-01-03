const { create,getUserByUserId,getUsers,updateUser,deleteUser,getUserByUserEmail } = require("./user.service")


const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } =require("jsonwebtoken")


// const bcrypt = require('bcrypt')
// const genSaltSync = bcrypt.genSaltSync

const createUser = (req,res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password,salt);
    create(body, (err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                success:0,
                message:"Database Connection error"
            })
        }
        return res.status(200).json({
            sucess:1,
            data:results
        })
    })
}

const getUserByUser =(req,res) =>{
  const id = req.params.id;
  getUserByUserId(id, (err,results)=>{
     if(err){
         console.log(err);
         return;
     }
     if(!results){
         return res.json({
             success:0,
             message:"Record Not Found"
         });
     }
     return res.json({
         success:1,
         data:results
     })
  });
}


const getUser =(req,res) =>{
    getUsers((err,results) =>{
        if(err){
            console.log(err);
            return;
        }
        return res.json({
            success:1,
            data:results
        })
    })
}


const updateUsers =(req,res) =>{
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password,salt);
    updateUser(body,(err,results) =>{
        if(err){
            console.log(err);
            return false;
        }
         if(!results){
             return res.json({
                 success:0,
                 message:"Failed to Update User"
             })
         }
        return res.json({
            success:1,
            message:"Updated Sucessfully"
        })
    })
}


const deleteUsers =(req,res) =>{
    const data =req.body;
    deleteUser(data,(err,results) =>{
        if(err){
            console.log(err);
            return;
        }
        if(!results){
            return res.json({
                success:0,
                message:"Record not found"
            });
        }
        return res.json({
            success:1,
            message:"user deleted Sucessfully"
        })
    })
}


const login =(req,res) =>{
  const body =req.body;
  getUserByUserEmail(body.email,(err,results) =>{
      if(err){
          console.log(err)
      }
      if(!results){
          return res.json({
              success:0,
              data:"Invalid email or password"
          })
      }
      const result = compareSync(body.password,results.password)
      if(result){
          results.password = undefined;
          const jsontoken = sign({result : results}, "qwe1234",{expiresIn:"1h"})
           return res.json({
               success:1,
               message:"login successfully",
               token:jsontoken

           })
      }else{
          return res.json({
              sucess:0,
              data:"Invalid email or password"
          })
      }
  })
}

module.exports = {
    createUser: createUser,
    getUserByUserId:getUserByUser,
    getUsers:getUser,
    updateUser:updateUsers,
    deleteUser:deleteUsers,
    login:login
}