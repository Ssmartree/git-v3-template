// //刷新token函数
// async function refreshToken() {
//   try {
//     const response = await service.get('/refresh', {
//       params: {
//         token: getRefreshTokenFromCookie(); // 从 HttpOnly Cookie 获取 Refresh Token
//       },
//       timeout: 30000, // 单独设置超时时间
//     });
//     return response.data.accessToken; // 返回新的 access_token
//   } catch (error) {
//     // 清除本地存储的 token
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     throw error; // 抛出错误
//   }
// }
