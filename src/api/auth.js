import axios from './axios';

export const auth = {
  // 登录
  login: async ({ email, password }) => {
    try {
      const { data } = await axios.post('/productx/user/login', { 
        username: email, 
        password 
      });
      
      if (data.success) {
        const token = data.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 登录成功后立即获取用户信息
        const userInfoResult = await auth.getUserInfo();
        if (!userInfoResult.success) {
          return { success: false, message: '获取用户信息失败' };
        }
        
        return { success: true };
      }
      return data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || '登录失败' };
    }
  },

  // 注册
  register: async (data) => {
    try {
      const response = await axios.post('/productx/user/cos-register', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '注册失败'
      };
    }
  },

  // 发送验证码
  sendVerificationCode: (email) => {
    return axios.post('/auth/verification-code', { email });
  },

  // 验证邮箱验证码
  verifyCode: (email, code) => {
    return axios.post('/auth/verify-code', { email, code });
  },

  // 退出登录（可选 redirectTo，默认 /login）
  logout: (options) => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    const redirectTo = (options && options.redirectTo) || '/login';
    window.location.href = redirectTo;
  },

  // 获取用户信息
  getUserInfo: async () => {
    try {
      const { data } = await axios.get('/productx/user/user-detail');
      if (data.success) {
        localStorage.setItem('userInfo', JSON.stringify(data.data));
      }
      return data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || '获取用户信息失败' };
    }
  },

  // 获取用户实名认证信息
  getUserRealnameInfo: async () => {
    try {
      const { data } = await axios.get('/productx/user/realname-info');
      return data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || '获取实名认证信息失败' };
    }
  },

  // 刷新 token
  refreshToken: () => {
    return axios.post('/auth/refresh-token');
  },

  // 获取谷歌登录授权URL
  // targetUrl: 目标前端回调地址（可选），如果不传则使用后端默认配置
  getGoogleAuthUrl: async (targetUrl) => {
    try {
      const url = targetUrl 
        ? `/base/productx/auth/google/auth-url?targetUrl=${encodeURIComponent(targetUrl)}`
        : '/base/productx/auth/google/auth-url';
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '获取谷歌授权URL失败' 
      };
    }
  },

  // 处理谷歌登录回调
  handleGoogleAuth: async ({ code, redirectUri, state }) => {
    try {
      const { data } = await axios.post('/base/productx/auth/google/handle-auth', {
        code,
        redirectUri,
        state
      });
      
      if (data.success) {
        const token = data.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 登录成功后立即获取用户信息
        const userInfoResult = await auth.getUserInfo();
        if (!userInfoResult.success) {
          return { success: false, message: '获取用户信息失败' };
        }
        
        return { success: true };
      }
      return data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '谷歌登录失败' 
      };
    }
  },

  // 获取 Google Client ID（用于 One Tap）
  getGoogleClientId: async () => {
    try {
      const { data } = await axios.get('/base/productx/auth/google/client-id');
      return data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '获取 Google Client ID 失败' 
      };
    }
  },

  // 处理 Google One Tap 登录（使用 credential JWT）
  handleGoogleOneTap: async ({ credential }) => {
    try {
      const { data } = await axios.post('/base/productx/auth/google/one-tap', {
        credential
      });
      
      if (data.success) {
        const token = data.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 登录成功后立即获取用户信息
        const userInfoResult = await auth.getUserInfo();
        if (!userInfoResult.success) {
          return { success: false, message: '获取用户信息失败' };
        }
        
        return { success: true };
      }
      return data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Google One Tap 登录失败' 
      };
    }
  }
}; 