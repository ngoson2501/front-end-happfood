// controllers/authController.ts
import {  NextResponse } from 'next/server';
import { JwtPayload } from 'jsonwebtoken';
import User from '../models/user';
import connect from '../utils/db';
import { Types } from 'mongoose'; // Import Types từ mongoose
import { hashPassword, comparePassword } from '../services/authService';
import { createAccessToken, createRefreshToken, verifyRefreshToken, verifyAccessToken } from '../utils/jwt';




// export const registerUser = async (req: Request) => {
//   try {
//     const body = await req.json();
//     const { username, email, password, role } = body;
    
//     console.log("body",body)

//     await connect();

//     // Kiểm tra xem người dùng đã tồn tại trong csdl chưa
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { message: 'User already exists' },
//         { status: 400 }
//       );
//     }

//     // Hash mật khẩu của người dùng
//     const hashedPassword = await hashPassword(password);

//     // URL avatar mặc định
//     const defaultAvatars = [
//       '/defaultAvatars/cat.png',
//       '/defaultAvatars/cow.png',
//       '/defaultAvatars/frog.png',
//       '/defaultAvatars/elephant.png',
//     ];
    
//     // Chọn một URL avatar ngẫu nhiên từ danh sách avatar mặc định
//     const avatarUrl = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    
//     // Tạo người dùng mới
//     const newUser = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       avatar: avatarUrl, // Gán avatar ngẫu nhiên
//     });


    

//     //gửi thông báo thành công 
//     return NextResponse.json(
//       { message: 'User registered successfully', user: newUser },
//       { status: 201 }
//     );

//   } catch (error: any) {
//     console.error('Error during registration:', error);
//     return NextResponse.json(
//       { message: 'Error registering user', error: error.message },
//       { status: 500 }
//     );
//   }
// };


export const registerUser = async (req: Request) => {
  try {
    const body = await req.json();
    const { username, email, password, role } = body;
    
    console.log("body", body);

    await connect();

    // Kiểm tra xem người dùng đã tồn tại trong csdl chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash mật khẩu của người dùng
    const hashedPassword = await hashPassword(password);

    // URL avatar mặc định
    const defaultAvatars = [
      '/defaultAvatars/cat.png',
      '/defaultAvatars/cow.png',
      '/defaultAvatars/frog.png',
      '/defaultAvatars/elephant.png',
    ];
    
    // Chọn một URL avatar ngẫu nhiên từ danh sách avatar mặc định
    const avatarUrl = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    // Tạo người dùng mới với role từ client
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role, // Thêm trường role vào đây
      avatar: avatarUrl,
    });

    // Gửi thông báo thành công
    return NextResponse.json(
      { message: 'User registered successfully', user: newUser },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { message: 'Error registering user', error: error.message },
      { status: 500 }
    );
  }
};






export const loginUser = async (req: Request) => {
  const body = await req.json();
  const { email, password } = body;

  await connect(); // Kết nối đến cơ sở dữ liệu

  try {
    // Tìm người dùng bằng email
    const user = await User.findOne({ email });

    // Kiểm tra nếu email hoặc mật khẩu không đúng
    if (!user || !(await comparePassword(password, user.password))) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid credentials' }),
        { status: 401 }
      );
    }

    // Tạo accessToken và refreshToken với role của người dùng
    const accessToken = await createAccessToken({ userId: user._id, role: user.role });
    const refreshToken = await createRefreshToken({ userId: user._id, role: user.role });

    console.log("refreshToken:", refreshToken);

    // Cập nhật refreshToken vào cơ sở dữ liệu
    user.refreshToken = refreshToken; // Lưu refreshToken vào trường mới
    await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

    // Trả về accessToken và refreshToken cho người dùng
    return new NextResponse(
      JSON.stringify({ accessToken, refreshToken }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error logging in:', error); // Ghi lại lỗi
    return new NextResponse(
      'Error logging in: ' + error.message,
      { status: 500 }
    );
  }
};







export const logoutUser = async (req: Request) => {
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { accessToken} = body; // Lấy cả accessToken và refreshToken từ body
      const payload = await verifyAccessToken(accessToken) as JwtPayload;

     

      if (!payload || !payload.userId) {
        return NextResponse.json({ message: 'Invalid access token' }, { status: 401 });
      }

      // // Kết nối đến MongoDB
      // await connect();

      // // Xóa refreshToken của user theo userId và refreshToken
      // const result = await User.updateOne(
      //   { _id: payload.userId}, // Xác định userId và refreshToken
      //   { $unset: { refreshToken: "" } } // Xóa refreshToken
      // );

      await connect();
      const user = await User.findById((payload as JwtPayload).userId);

      user.refreshToken = null;
        await user.save();

      

      // if (result.modifiedCount === 0) {
      //   return NextResponse.json({ message: 'Không tìm thấy token để xóa' }, { status: 404 });
      // }

      return NextResponse.json({ message: 'Đăng xuất thành công' }, { status: 200 });
    } catch (error) {


      console.error('Error during logout:', error);
      return NextResponse.json({ message: 'Lỗi server khi đăng xuất' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Phương thức không được hỗ trợ' }, { status: 405 });
  }
};







// export const refreshAccessToken = async (req: Request) => {
//   const body = await req.json();
//   const { accessToken } = body;

//   try {
//     // Giải mã accessToken để lấy userId
//     const payload = await verifyAccessToken(accessToken);
    

//     // Kiểm tra nếu accessToken đã hết hạn, hoặc nếu accessToken hợp lệ nhưng cần tạo lại
//     await connect();
//     const user = await User.findById((payload as JwtPayload).userId);
//     if (!user) {
//       return NextResponse.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     const refreshToken = user.refreshToken;
//     if (!refreshToken) {
//       return NextResponse.json(
//         { message: 'No refresh token found for this user' },
//         { status: 401 }
//       );
//     }

//     // Xác thực refreshToken
//     const refreshTokenPayload = await verifyRefreshToken(refreshToken);
//     if (
//       refreshTokenPayload &&
//       typeof refreshTokenPayload !== 'string' &&
//       'exp' in refreshTokenPayload &&
//       refreshTokenPayload.exp !== undefined
//     ) {
//       const remainingTime = (refreshTokenPayload.exp * 1000) - Date.now();
//       const oneMinute = 60 * 1000;

//       // Nếu refreshToken còn ít hơn 1 phút hoặc đã hết hạn, xóa refreshToken và báo lỗi
//       if (remainingTime < oneMinute) {

//         console.log("refreshToken hết hạn")
//         user.refreshToken = null;
//         await user.save();
//         return NextResponse.json(
//           { message: 'Refresh token has expired' },
//           { status: 403 }
//         );
//       }

//       // Nếu accessToken hết hạn nhưng refreshToken còn hạn, tạo accessToken mới
//       const newAccessToken = await createAccessToken({ userId: user._id });
//       return NextResponse.json(
//         { accessToken: newAccessToken },
//         { status: 200 }
//       );
//     } else {
//       // Nếu refreshToken đã hết hạn
//       user.refreshToken = null;
//       await user.save();
//       return NextResponse.json(
//         { message: 'Refresh token has expired' },
//         { status: 403 }
//       );
//     }
//   } catch (accessTokenError) {
//     // Nếu accessToken hết hạn và refreshToken cũng hết hạn hoặc không hợp lệ
//     return NextResponse.json(
//       { message: 'Unauthorized' },
//       { status: 401 }
//     );
//   }
// };


export const refreshAccessToken = async (req: Request) => {
  const body = await req.json();
  const { accessToken } = body;

  try {
    // Giải mã accessToken để lấy userId
    let payload;
    try {
      payload = await verifyAccessToken(accessToken);
    } catch (accessTokenError) {
      console.log("Access token expired or invalid:", accessTokenError);
      // Nếu accessToken hết hạn, tiếp tục kiểm tra refreshToken
    }

    await connect();

    console.log("<<<<<<payload>>>>>:", payload)

    // Tìm userId từ payload hoặc từ refreshToken nếu accessToken không còn hợp lệ
    const userId = (payload as JwtPayload)?.userId;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const refreshToken = user.refreshToken;
    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No refresh token found for this user' },
        { status: 401 }
      );
    }

    // Xác thực refreshToken
    const refreshTokenPayload = await verifyRefreshToken(refreshToken);
    if (
      refreshTokenPayload &&
      typeof refreshTokenPayload !== 'string' &&
      'exp' in refreshTokenPayload &&
      refreshTokenPayload.exp !== undefined
    ) {
      const remainingTime = (refreshTokenPayload.exp * 1000) - Date.now();
      const oneMinute = 60 * 1000;

      // Nếu refreshToken còn ít hơn 1 phút hoặc đã hết hạn, xóa refreshToken và báo lỗi
      if (remainingTime < oneMinute) {
        console.log("refreshToken hết hạn");
        user.refreshToken = null;
        await user.save();
        return NextResponse.json(
          { message: 'Refresh token has expired' },
          { status: 403 }
        );
      }

      // Nếu accessToken hết hạn nhưng refreshToken còn hạn, tạo accessToken mới
      const newAccessToken = await createAccessToken({ userId: user._id });
      return NextResponse.json(
        { accessToken: newAccessToken },
        { status: 200 }
      );
    } else {
      // Nếu refreshToken đã hết hạn
      user.refreshToken = null;
      await user.save();
      return NextResponse.json(
        { message: 'Refresh token has expired' },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Error during token refresh:', error);
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
};








// import { NextResponse, NextRequest } from 'next/server';
// import { JwtPayload } from 'jsonwebtoken';
// import User from '../models/user';
// import { hashPassword, comparePassword } from '../services/authService';
// import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../utils/jwt';
// import connect from '../utils/db';

// // Xác định file này chỉ chạy trên server
// export const registerUser = async (req: NextRequest) => {
//   // Kiểm tra method của request
//   if (req.method !== 'POST') {
//     return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
//   }

//   try {
//     const body = await req.json(); // Trích xuất body của request
//     const { username, email, password } = body;
//     await connect()
//     // Kiểm tra user đã tồn tại hay chưa
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ message: 'User already exists' }, { status: 400 });
//     }

//     // Hash password và tạo user mới
//     const hashedPassword = await hashPassword(password);
//     const newUser = await User.create({ username, email, password: hashedPassword });

//     return NextResponse.json({ message: 'User registered successfully', user: newUser }, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json({ message: 'Error registering user: ' + error.message }, { status: 500 });
//   }
// };

// export const loginUser = async (req: NextRequest) => {
//   if (req.method !== 'POST') {
//     return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
//   }

//   try {
//     const body = await req.json();
//     const { email, password } = body;

//     // Tìm user với email
//     const user = await User.findOne({ email });
//     if (!user || !(await comparePassword(password, user.password))) {
//       return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
//     }

//     // Tạo access token và refresh token
//     const accessToken = createAccessToken({ userId: user._id });
//     const refreshToken = createRefreshToken({ userId: user._id });

//     return NextResponse.json({ accessToken, refreshToken }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ message: 'Error logging in: ' + error.message }, { status: 500 });
//   }
// };

// export const refreshAccessToken = async (req: NextRequest) => {
//   if (req.method !== 'POST') {
//     return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
//   }

//   try {
//     const body = await req.json();
//     const { refreshToken } = body;

//     // Kiểm tra refresh token hợp lệ
//     const payload = verifyRefreshToken(refreshToken);
//     if (typeof payload !== 'string' && (payload as JwtPayload).userId) {
//       const newAccessToken = createAccessToken({ userId: (payload as JwtPayload).userId });
//       return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
//     } else {
//       return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
//     }
//   } catch (error: any) {
//     return NextResponse.json({ message: 'Invalid refresh token: ' + error.message }, { status: 401 });
//   }
// };
