/**
 * Created by hao.cheng on 2017/5/6.
 */
import React from 'react';
import { Row, Col, Card } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import PhotoSwipe from 'photoswipe';
import PhotoswipeUIDefault from 'photoswipe/dist/photoswipe-ui-default';
import { getGalleryList } from '../../axios';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';

class Gallery extends React.Component {
    state = {
        gallery: null,
        images: [],
    };
    componentDidMount() {
        getGalleryList().then(({data})=> {
            let imgsTags = new Array();
            for(const i in data){
                let imgsTag = [];
                const image = <div className="gutter-box" key={'http://test.multi-phalcon.com' + data[i].path}>
                    <Card bordered={false} bodyStyle={{ padding: 0 }}>
                        <div>
                            <img onClick={() => this.openGallery('http://test.multi-phalcon.com' + data[i].path)} alt="example" width="100%" src={'http://test.multi-phalcon.com' + data[i].path} />
                        </div>
                        <div className="pa-m">
                            <h3>React Admin</h3>
                            <small><a href="https://yezihaohao.github.io/" target="_blank" rel="noopener noreferrer">https://yezihaohao.github.io/</a></small>
                        </div>
                    </Card>
                </div>
                 console.log(image);
                if(i%4 > 0){
                    imgsTag.push(image)
                    console.log(imgsTag,i);
                }else{
                    imgsTags.push(imgsTag)
                    console.log(imgsTag);
                }
                
            }
            
            this.setState({images:imgsTags})
        })
    }
    componentWillUnmount = () => {
        this.closeGallery();
    };
    openGallery = (item) => {
        const items = [
            {
                src: item,
                w: 0,
                h: 0,
            }
        ];
        const pswpElement = this.pswpElement;
        const options = {index: 0};
        this.gallery = new PhotoSwipe( pswpElement, PhotoswipeUIDefault, items, options);
        this.gallery.listen('gettingData', (index, item) => {
            const _this = this;
            if (item.w < 1 || item.h < 1) { // unknown size
                var img = new Image();
                img.onload = function() { // will get size after load
                    item.w = this.width; // set image width
                    item.h = this.height; // set image height
                    _this.gallery.invalidateCurrItems(); // reinit Items
                    _this.gallery.updateSize(true); // reinit Items
                };
                img.src = item.src; // let's download image
            }
        });
        this.gallery.init();
    };
    closeGallery = () => {
        if (!this.gallery) return;
        this.gallery.close();
    };
    render() {
        // const imgsTag = this.state.images.map((value,index) => (

                    // <div className="gutter-box" key={'http://test.multi-phalcon.com' + value.path}>
                    //     <Card bordered={false} bodyStyle={{ padding: 0 }}>
                    //         <div>
                    //             <img onClick={() => this.openGallery('http://test.multi-phalcon.com' + value.path)} alt="example" width="100%" src={'http://test.multi-phalcon.com' + value.path} />
                    //         </div>
                    //         <div className="pa-m">
                    //             <h3>React Admin</h3>
                    //             <small><a href="https://yezihaohao.github.io/" target="_blank" rel="noopener noreferrer">https://yezihaohao.github.io/</a></small>
                    //         </div>
                    //     </Card>
                    // </div>
        // ));
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom first="UI" second="画廊(图片来自花瓣网，仅学习，若侵权请联系删除)" />
                <Row gutter={10}>
                    <Col className="gutter-row" md={5}>
                        {this.state.images[0]}
                    </Col>
                    <Col className="gutter-row" md={5}>
                        {this.state.images[1]}
                    </Col>
                    <Col className="gutter-row" md={5}>
                        {this.state.images[2]}
                    </Col>
                    <Col className="gutter-row" md={5}>
                        {this.state.images[3]}
                    </Col>
                    <Col className="gutter-row" md={4}>
                        {this.state.images[4]}
                    </Col>
                </Row>
                <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true" ref={(div) => {this.pswpElement = div;} }>

                    <div className="pswp__bg" />

                    <div className="pswp__scroll-wrap">

                        <div className="pswp__container">
                            <div className="pswp__item" />
                            <div className="pswp__item" />
                            <div className="pswp__item" />
                        </div>

                        <div className="pswp__ui pswp__ui--hidden">

                            <div className="pswp__top-bar">

                                <div className="pswp__counter" />

                                <button className="pswp__button pswp__button--close" title="Close (Esc)" />

                                <button className="pswp__button pswp__button--share" title="Share" />

                                <button className="pswp__button pswp__button--fs" title="Toggle fullscreen" />

                                <button className="pswp__button pswp__button--zoom" title="Zoom in/out" />

                                <div className="pswp__preloader">
                                    <div className="pswp__preloader__icn">
                                        <div className="pswp__preloader__cut">
                                            <div className="pswp__preloader__donut" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                                <div className="pswp__share-tooltip" />
                            </div>

                            <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)" />

                            <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)" />

                            <div className="pswp__caption">
                                <div className="pswp__caption__center" />
                            </div>

                        </div>

                    </div>

                </div>
                <style>{`
                    .ant-card-body img {
                        cursor: pointer;
                    }
                `}</style>
            </div>
        )
    }
}

export default Gallery;