/**
 * Created by hao.cheng on 2017/5/6.
 */
import React from 'react'
import { Spin } from 'antd'
import BreadcrumbCustom from '../BreadcrumbCustom'
import { getGalleryList } from '../../axios'
import Gallery from 'react-photo-gallery'
import Lightbox from 'react-images'

const example = {
    textAlign: 'center',
    background: 'rgba(0,0,0,0.05)',
    borderRadius: '4px',
    marginBottom: '20px',
    padding: '30px 50px',
    margin: '20px 0'
}

export const debounce = (func, wait, immediate) => {
    let timeout;
    return function() {
          const context = this, args = arguments;
      let later = function() {
              timeout = null;
              if (!immediate) func.apply(context, args);
            
      };
          const callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        
    };
}

class Galleries extends React.Component {
    constructor(props){
        super(props)
        this.handleScroll = this.handleScroll.bind(this);
        this.loadMorePhotos = debounce(this.loadMorePhotos, 200);
    }
    state = {
        gallery: [],
        images: [],
        pageNum: 1,
        loadedAll: false,
        loading: false,
        totalPages: 10,
        pageSize: 20,
        hasMore: this.pageNum!==this.totalPages,
        currentImage : 0,
    }
    
    componentDidMount() {
        this.getGalleries()
        window.addEventListener('scroll', this.handleScroll,true);
    }

    getGalleries = () => {
        this.setState({
            loading: true,
        });
        getGalleryList().then(({data})=> {
            data.map(v => {
                v.src = 'http://test.multi-phalcon.com' + v.path
                v.width = parseInt(v.width)
                v.height = parseInt(v.height)
            })
            
            this.setState({ gallery : data.slice(0,this.state.pageSize),images: data,totalPages: Math.ceil(data.length/this.state.pageSize),loading: false})
        })
    }

    openLightbox = (event, obj) => {
        this.setState({
            currentImage: obj.index,
            lightboxIsOpen: true,
        });
    }

    closeLightbox = () => {
        this.setState({
          currentImage: 0,
          lightboxIsOpen: false,
        });
    }

    gotoPrevious = () => {
        this.setState({
          currentImage: this.state.currentImage - 1,
        });
    }

    gotoNext = () => {
        this.setState({
          currentImage: this.state.currentImage + 1,
        });
    }

    handleScroll = () => {
        console.log(this.props)
        let that = this
        let right = document.querySelector('#right'),gallery = document.querySelector("#gallery"),navi = document.querySelector('#navi')
        let scrollY = window.scrollY || window.pageYOffset || right.scrollTop;
        //防止在loading过程中切换component 导致元素消失
        if(gallery === null){
            if(this.timer){
                clearTimeout(this.timer);
            }
            return;
        }
        if ((scrollY+window.innerHeight) >= (gallery.parentNode.clientHeight - 50) && this.state.pageNum!==this.state.totalPages && !this.state.loading) {
            if(this.timer){
                clearTimeout(this.timer);
            }
            this.setState({loading: true})
            this.timer = setTimeout(()=>that.loadMorePhotos(),1000);
        }
    }

    loadMorePhotos = () => {
        if (this.state.pageNum > this.state.totalPages){
            this.setState({loadedAll: true});
            return;
        }
        this.setState({
            gallery: this.state.gallery.concat(this.state.images.slice(this.state.gallery.length,this.state.gallery.length+this.state.pageSize)), 
            pageNum: this.state.pageNum + 1,
            loading: false
        });
    }

    render() {
        return (
            <div className="gutter-example button-demo" id="gallery">
                <BreadcrumbCustom first="UI" second="xxxx" />
                <Gallery photos={this.state.gallery} onClick={this.openLightbox} />
                <Lightbox images={this.state.gallery}
                onClose={this.closeLightbox}
                onClickPrev={this.gotoPrevious}
                onClickNext={this.gotoNext}
                currentImage={this.state.currentImage}
                isOpen={this.state.lightboxIsOpen}
                />
                {this.state.loading && <div style={example}><Spin /></div>}
            </div>
        )
    }
}

export default Galleries;