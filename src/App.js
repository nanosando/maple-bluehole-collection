import './App.css';
import gLogo from './resource/github-mark.png';
import clearIcon from './resource/clear.png'
import fish from './resource/fish';

import { useState, useEffect } from 'react';

import { Layout, Card, Col, Row } from 'antd';
import { Dropdown, Spin, Modal } from 'antd';

const { Header, Footer } = Layout;
const { Meta } = Card;

function App() {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState(6);
  const [data, setData] = useState(Array(40).fill(0));

  const onClickLoc = (num) => {
    setModalTarget(num)
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const onClickDone = (num) => {
    var newData = data.slice();
    
    if(newData[num] === 0)
      newData[num] = 1;
    else
      newData[num] = 0;

    setData(newData);
    localStorage.setItem('collection_data', JSON.stringify(newData));
    //console.log(newData);
  }

  const makeCard = (num) => {
    const items = [
      { label: data[num] === 0? '완료' : '완료 취소', key: '0'},
      { label: '위치 보기', key: '1', disabled: fish[num]["loc_map"]? false : true},
      // { type: 'divider'},
      // { label: <div onClick={()=>console.log('Close')}> 닫기 </div>, key: '3'},
    ];

    const onClick = ({key}) => {
      if (key === '0')
        onClickDone(num);
      else
        onClickLoc(num);
    }
    const fontColor = fish[num]['loc'] === '초입'? 'desc-light' : (fish[num]['loc'] === '중간수역'? 'desc-middle' : 'desc-deep')

    return (<Dropdown
        menu={{ items, onClick}}
        trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
        <Card hoverable bordered={false}
              cover={
              <div className="imgWrapper">
                {data[num] === 1? <img src={clearIcon} className='overlayImg'/> : <></>}
                <img src={fish[num]['img']} className='baseImg'/>
              </div>}>
          <Meta title={fish[num]['name']} description={<div className={fontColor}>{fish[num]['loc']}</div>}
          />
        </Card>
        </a>
      </Dropdown>);
  }

  useEffect(() => {
    setLoading(true);
    var prevDataS = localStorage.getItem('collection_data');
    var prevData = JSON.parse(prevDataS);
    //console.log(prevData);

    if (prevData) {
      setData(prevData);
      setLoading(false);
      return;
    }
    setLoading(false);
  }, []);

  return (
    <Layout className="globalContainer">
      <Header className="header">
        <a href="/">
          <div className="titleText"> 메이플 블루홀 도감 </div>
        </a>
      </Header>
      <Layout className="whiteback">
        <div className="additionalDesc"> *위치 보기는 일부 물고기만 지원합니다 </div>
        {
          loading? <Spin size="large" className="spin"/> : 
          [...Array(8)].map((x, r) =>
            <Row justify="space-evenly" className="row">
              {[...Array(5)].map((x, c) =>
              <Col span={4}>
                {makeCard(5 * r + c)}
              </Col>
            )}
            </Row>
          )
        }
      </Layout>
      <Modal title="블루홀 지도"
              open={modalOpen}
              onCancel={handleCancel}
              width={500}
              footer={(_, { OkBtn, CancelBtn }) => (
                <>
                  <CancelBtn />
                </>
              )}>
        <img src={fish[modalTarget]["loc_map"]} className="modalImg"/>
      </Modal>
      <Footer className="footer">
        <a href="https://github.com/nanosando" target="_blank">
          <img src={gLogo} width='30px'></img>
        </a>
      </Footer>
    </Layout>
  );
}

export default App;
