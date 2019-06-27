import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, ContentState  } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props); // 不传就不能再constructor使用props。传了就可以使用

    const blocksFromHtml = htmlToDraft(this.props.detail);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);

    this.state = {
      editorState
    };
  }



  onEditorStateChange = (editorState) => {
    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          // wrapperClassName="editor-wrapper"
          editorClassName="editor"
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}