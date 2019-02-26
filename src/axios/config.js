/**
 * Created by 叶子 on 2017/7/30.
 * 接口地址配置文件
 */

//easy-mock模拟数据接口地址
// const EASY_MOCK = 'https://www.easy-mock.com/mock';
// const MOCK_AUTH = EASY_MOCK + '/597b5ed9a1d30433d8411456/auth'; // 权限接口地址
// export const MOCK_AUTH_ADMIN = MOCK_AUTH + '/admin'; // 管理员权限接口
// export const MOCK_AUTH_VISITOR = MOCK_AUTH + '/visitor' // 访问权限接口

const HOSTS = 'http://test.multi-phalcon.com';
export const MOCK_AUTH_ADMIN = HOSTS + '/api/auth/start';
export const MOCK_AUTH_VISITOR = HOSTS + '/api/auth/start';

export const ADMIN_LIST = HOSTS + '/api/admin/list';
export const ADMIN_SAVE = HOSTS + '/api/admin/save';

export const ARTICLE_LIST = HOSTS + '/api/article/list';
export const ARTICLE_SAVE = HOSTS + '/api/article/save';

export const LABEL_LIST = HOSTS + '/api/label/all' ;

export const TYPE_LIST = HOSTS + '/api/type/all';
// github授权
export const GIT_OAUTH = 'https://github.com/login/oauth';
// github用户
export const GIT_USER = 'https://api.github.com/user';

// bbc top news
export const NEWS_BBC = 'https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=429904aa01f54a39a278a406acf50070';




