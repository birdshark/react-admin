/**
 * Created by hao.cheng on 2017/5/3.
 */
import React from 'react';
import { Row } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
// import EchartsViews from './EchartsViews';
// import EchartsProjects from './EchartsProjects';
// import b1 from '../../style/imgs/b1.jpg';


class Dashboard extends React.Component {
    render() {
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom />
                <Row gutter={10}>
                </Row>
            </div>
        )
    }
}

export default Dashboard;