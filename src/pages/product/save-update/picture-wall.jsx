import React, { Component } from 'react';
import { Upload, Icon, Modal, message } from 'antd';

import { reqDeleteProductImg } from '../../../api';

export default class PicturesWall extends Component {
  state = {
    previewVisible: false, // 预览图显示和隐藏
    previewImage: '', // 预览图
    fileList: this.props.imgs.map((img, index) => {
      return {
        uid: -index,
        name: img,
        status: 'done',
        url: `http://localhost:5000/upload/${img}`,
      }
    })
  };

  /**
   * 取消预览
   */
  handleCancel = () => this.setState({ previewVisible: false });
  /**
   * 点击预览
   * @param file
   * @returns {Promise<void>}
   */
  handlePreview = async file => {
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({ file, fileList }) => {
    console.log(file);
    if (file.status === 'uploading') {
       // 上传中

    } else if (file.status === 'done') {
      // 上传成功~
      message.success('上传图片成功~', 2);
    } else if (file.status === 'error') {
      // 上传失败
      message.error('上传图片失败！', 2);
    } else {
      // 删除图片
      // 发送请求，删除服务器的图片数据
      const id = this.props.id;
      const name = file.name;

      const result = await reqDeleteProductImg(name, id);
      if (result) {
        message.success('删除图片成功~', 2);
      }
    }

    this.setState({ fileList });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    // 上传按钮
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          // 上传的服务器地址
          action="/manage/img/upload"
          listType="picture-card"
          // 展示图片文件
          fileList={fileList}
          // 点击预览的回调
          onPreview={this.handlePreview}
          // 点击删除/上传的回调
          onChange={this.handleChange}
          // 请求参数
          data={{
            id: this.props.id
          }}
          name="image"
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
