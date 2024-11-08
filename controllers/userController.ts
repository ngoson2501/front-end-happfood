import {  NextResponse } from 'next/server';
import { JwtPayload } from 'jsonwebtoken';
import User from '../models/user';
import connect from '../utils/db';
import { Types } from 'mongoose'; // Import Types từ mongoose
import { hashPassword, comparePassword } from '../services/authService';
import { createAccessToken, createRefreshToken, verifyRefreshToken, verifyAccessToken } from '../utils/jwt';




// export const getUser = async (req: Request) => {
//     try {
//       const body = await req.json();
//       const { accessToken } = body; // Lấy accessToken từ request body
  
//       // Xác thực accessToken (dùng verifyAccessToken để giải mã và kiểm tra token)
//       const payload = verifyAccessToken(accessToken) as JwtPayload;
  
//       if (!payload || !payload.userId) {
//         return new NextResponse('Invalid access token', { status: 401 });
//       }
  
//       // Kết nối cơ sở dữ liệu
//       await connect();
  
//       // Tìm kiếm người dùng dựa trên userId từ payload
//       const user = await User.findById(payload.userId);
  
//       if (!user) {
//         return new NextResponse('User not found', { status: 404 });
//       }
  
//       // Trả về thông tin người dùng dưới dạng JSON
//       const userData = {
//         id: user._id,
//         email: user.email,
//         name: user.name,
       
//       };

//       console.log("infoUser:", user)
  
//       return new NextResponse(JSON.stringify(userData), { status: 200 });
//     } catch (error: any) {
//       return new NextResponse(`Error fetching user data: ${error.message}`, {
//         status: 500,
//       });
//     }
//   };





export const getUser = async (req: Request) => {
  try {
    const body = await req.json();
    const { accessToken } = body; // Lấy accessToken từ request body

    // Xác thực accessToken
    const payload = await verifyAccessToken(accessToken) as JwtPayload;

    if (!payload || !payload.userId) {
      
      return new NextResponse('Invalid access token', { status: 401 });
    }

    // Kết nối cơ sở dữ liệu
    await connect();

    // Tìm kiếm người dùng
    const user = await User.findById(payload.userId);

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    // Trả về thông tin người dùng
    const userData = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      refreshToken: user.refreshToken

    };

    

  

    return new NextResponse(JSON.stringify(userData), { status: 200 });
  } catch (error: any) {
    return new NextResponse(`Error fetching user data: ${error.message}`, { status: 500 });
  }
};
