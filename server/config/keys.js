// // 배포 전인 경우
// if (process.env.NODE_ENV == 'development') {
//     module.exports = require('./dev.js');
// // 배포 후인 경우
// } else if (process.env.NODE_ENV == 'production') {
//     module.exports = require('./prod.js');
// }

module.exports = require('./dev.js');
// console.log(process.env);
// // undefined value return
// console.log(process.env.NODE_ENV);