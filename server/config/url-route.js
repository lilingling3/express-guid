/**
 * Created by zhongzhengkai on 2017/5/4.
 */

module.exports = {
  '/api': require('../src/routes/referral-api'),
  '/test': require('../src/routes/test'),
  '/': require('../src/routes/referral-page'),
  '/ling': require('../src/routes/ling'),
};