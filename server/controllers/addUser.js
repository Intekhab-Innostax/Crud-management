import express from 'express'
import { prisma } from '../db.js';
export const router = express.Router();

export const handleUser = async(req, res) => {
    const {name, email, age, role} = req.body;
    try {

        const userExist = await prisma.user.findUnique({where: {
            email: email
          }})
        if(userExist){
            res.status(201).json({message: "User already exist"})
        }
        const data = await prisma.user.create({
            data: {
                name: name,
                role: role,
                email: email,
                age: age,
            }
        })

        res.status(200).json({data, message: "added User"})
    } catch (error) {
        console.error(error)
        res.status(400).json({error})
    }
}

router.post('/adduser', handleUser);
