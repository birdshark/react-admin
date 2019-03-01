/**
 * Created by hao.cheng on 2017/4/16.
 */
import axios from 'axios';
import { get, post } from './tools';
import * as config from './config';

export const getBbcNews = () => get({ url: config.NEWS_BBC });
export const npmDependencies = () => axios.get('./npm.json').then(res => res.data).catch(err => console.log(err));

export const weibo = () => axios.get('./weibo.json').then(res => res.data).catch(err => console.log(err));

export const gitOauthLogin = () => get({ url: `${config.GIT_OAUTH}/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin` });
export const gitOauthToken = code => post({ 
    url: `https://cors-anywhere.herokuapp.com/${config.GIT_OAUTH}/access_token`,
    data: {
        client_id: '792cdcd244e98dcd2dee',
        client_secret: '81c4ff9df390d482b7c8b214a55cf24bf1f53059',
        redirect_uri: 'http://localhost:3006/',
        state: 'reactAdmin',
        code,
    } 
});
// {headers: {Accept: 'application/json'}}
export const gitOauthInfo = access_token => get({ url: `${config.GIT_USER}access_token=${access_token}` });

// easy-mock数据交互
// 管理员权限获取
export const admin = () => post({ url: config.MOCK_AUTH_ADMIN });
// 访问权限获取
export const guest = () => post({ url: config.MOCK_AUTH_VISITOR });

/**
 * 权限验证
 * @param {*} params 参数
 */
export const auth = (params) => post({ url: config.MOCK_AUTH_ADMIN, data: params });

/**
 * 获取管理员列表
 * @param {*} page 偏移量
 * @param {*} pageSize 
 */
export const getAdminList = (page,pageSize) => post({url : config.ADMIN_LIST, data: {current: page, limit: pageSize}})

/**
 * 保存管理员信息
 * @param {*} data 
 */
export const saveAdmin = (data) => post({url: config.ADMIN_SAVE, data: data});

/**
 * 获取文章列表
 * @param {*} page 
 * @param {*} pageSize 
 */
export const getArticleList = (page, pageSize) => post({url : config.ARTICLE_LIST, data: {current: page, limit: pageSize}})

/**
 * 保存文章信息
 * @param {*} data 
 */
export const saveArticle = (data) => post({url : config.ARTICLE_SAVE, data: data})

/**
 * 获取所有标签
 */
export const getAllLabels = () => post({url: config.LABEL_LIST})

/**
 * 获取所有类别
 */
export const getAllTypes = () => post({url: config.TYPE_LIST})

export const getGalleryList = () => post({ url: config.GALLERY_LIST })