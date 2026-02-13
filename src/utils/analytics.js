/**
 * Google Analytics 4 埋点
 * 衡量 ID: G-VLC2CG5SV0 (seedance2.cn)
 * 用于 PV、生成视频、开始充值、支付成功等转化事件
 */

import ReactGA from 'react-ga4';

const TRACKING_ID = 'G-VLC2CG5SV0';
const CATEGORY_USER = 'User_Action';
const CATEGORY_ECOMMERCE = 'Ecommerce';

let isInitialized = false;

/**
 * 初始化 GA4（在 App 入口调用一次）
 * @param {Object} options - { gtagOptions: { send_page_view: false } } 若需手发 PV
 */
export function initGA4(options = {}) {
  if (typeof window === 'undefined' || isInitialized) return;
  ReactGA.initialize(TRACKING_ID, {
    gaOptions: { send_page_view: false }, // 我们按路由手发 pageview
    ...options,
  });
  isInitialized = true;
  if (process.env.NODE_ENV !== 'production') {
    console.log('[GA4] Initialized:', TRACKING_ID);
  }
}

/**
 * 发送页面浏览（SPA 路由变化时调用）
 */
export function sendPageView(path = window.location.pathname, search = window.location.search) {
  if (!isInitialized) return;
  const page = path + search;
  ReactGA.send({ hitType: 'pageview', page });
  if (process.env.NODE_ENV !== 'production') {
    console.log('[GA4] Page View:', page);
  }
}

export const Analytics = {
  /**
   * 用户点击「生成视频」
   * @param {number} promptLength - 提示词长度（可选，图生视频可传 0）
   */
  trackGenerate(promptLength = 0) {
    if (!isInitialized) return;
    ReactGA.gtag('event', 'generate_lead', {
      event_category: CATEGORY_USER,
      event_label: 'Video_Generation',
      value: promptLength,
    });
    ReactGA.event({
      category: CATEGORY_USER,
      action: 'Click_Generate',
      label: 'Video_Generation',
      value: promptLength,
    });
    if (process.env.NODE_ENV !== 'production') {
      console.log('[GA4] Event: Click_Generate', { promptLength });
    }
  },

  /**
   * 用户开始充值（点击支付、创建订单成功）
   * @param {string} planName - 套餐名或描述，如 "Lite_Pack" 或 "99_CNY"
   * @param {number} [value] - 金额（可选）
   * @param {string} [currency] - 币种，如 CNY
   */
  trackCheckoutStart(planName, value, currency = 'CNY') {
    if (!isInitialized) return;
    ReactGA.event({
      category: CATEGORY_ECOMMERCE,
      action: 'Begin_Checkout',
      label: planName,
      value: value,
    });
    ReactGA.gtag('event', 'begin_checkout', {
      currency,
      value,
      items: [{ item_name: planName }],
    });
    if (process.env.NODE_ENV !== 'production') {
      console.log('[GA4] Event: Begin_Checkout', { planName, value, currency });
    }
  },

  /**
   * 支付成功（转化）
   * @param {string} transactionId - 订单号
   * @param {number} value - 支付金额
   * @param {string} currency - 币种，如 CNY
   * @param {string} [itemName] - 商品/套餐名
   */
  trackPurchaseSuccess(transactionId, value, currency = 'CNY', itemName = 'Recharge') {
    if (!isInitialized) return;
    ReactGA.event({
      category: CATEGORY_ECOMMERCE,
      action: 'Purchase',
      label: 'Premium_Subscription',
      value,
      nonInteraction: false,
    });
    ReactGA.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value,
      currency,
      items: [
        {
          item_id: transactionId,
          item_name: itemName,
          price: value,
          quantity: 1,
        },
      ],
    });
    if (process.env.NODE_ENV !== 'production') {
      console.log('[GA4] Event: Purchase', { transactionId, value, currency });
    }
  },
};

export default Analytics;
