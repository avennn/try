import Taro, { Component } from '@tarojs/taro';
import { View, LivePlayer, Button } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import './play.less';

@inject('wandouStore')
@observer
class WandouLivePlay extends Component {
  config = {
    navigationBarTitleText: '豌豆直播',
  };

  componentDidMount() {
    const { wandouStore: { room } } = this.props;
    if (room.title) {
      Taro.setNavigationBarTitle({
        title: room.title || room.user_nicename
      });
    }
  }

  componentWillUnmount() {
    this.props.wandouStore.resetRoom();
  }

  handleStateChange = (e) => {
    console.log('live-player state change:', JSON.stringify(e.detail));
  };

  setClipBoard = () => {
    const room = this.props.wandouStore.room;
    const { rtmpUrl = '' } = room;
    Taro.setClipboardData({
      data: rtmpUrl
    });
  };

  render() {
    const room = this.props.wandouStore.room;
    const { rtmpUrl = '' } = room;
    return (
      <View className='wrap'>
        <LivePlayer
          className='player'
          src={rtmpUrl}
          mode='live'
          autoplay
          muted={false}
          orientation='vertical'
          objectFit='contain'
          backgroundMute={false}
          minCache={1}
          maxCache={3}
          onStateChange={this.handleStateChange}
        />
        {
          rtmpUrl
            ? <Button type='primary' onClick={this.setClipBoard}>复制地址</Button>
            : <Button loading>获取播放地址</Button>
        }
      </View>
    );
  }
}

export default WandouLivePlay;
