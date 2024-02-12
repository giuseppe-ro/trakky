import axios, { AxiosRequestConfig } from "axios";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

const getUserInfo = (token: string): AxiosRequestConfig => {
    return {
      url: process.env.AUTH_USERINFO_URL,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    };
  }
  
export async function openIdAuth(req: Request, res: Response, next: any) {

  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token) {
      const {status} = await axios(getUserInfo(token))
      if(status === 200) {
        const user = JSON.stringify(jwt.decode(token));

        req.headers["user"] = user;
        req.body["user"] = user;
        return next();
      } 
    }
  } catch(e) {
    console.log(e);
   } 

  return res.status(401).send();
}