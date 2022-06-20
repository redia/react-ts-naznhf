import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.css';

export default function app() {
  const maxLength = 30;
  const formats = ['bold', 'italic', 'strike', 'underline'];
  enum AcceptedKeyCode {
    Backspace = '8',
    Shift = '16',
    Ctrl = '17',
    Alt = '18',
    LeftArrow = '37',
    UpArrow = '38',
    RightArrow = '39',
    DownArrow = '40',
    Delete = '46',
  }

  const quillRef = useRef<ReactQuill>(null);
  const [content, setContent] = useState('');
  const [counter, setCounter] = useState(0);

  const modules = {
    toolbar: [...formats],
  };

  const removeMaxlengthText = () => {
    quillRef?.current?.getEditor().deleteText(maxLength, counter);
  };

  const onChange = useCallback(
    (content) => {
      const getEditorTextLength =
        quillRef?.current?.getEditor().getText().length ?? 1;
      setContent(content);
      setCounter(getEditorTextLength - 1);
    },
    [content, counter]
  );

  const onKeyDown = useCallback(
    (e) => {
      counter >= maxLength &&
        Object.values(AcceptedKeyCode).indexOf(e.keyCode.toString()) === -1 &&
        e.preventDefault();
    },
    [content, counter]
  );

  useLayoutEffect(() => {
    quillRef?.current?.getEditor().addContainer('ql-counter');
  }, []);

  useEffect(() => {
    const counterContainer = document?.querySelector(
      '.ql-counter'
    ) as HTMLDivElement;
    counterContainer.innerText = `${counter}/${maxLength}`;
    counter >= maxLength && removeMaxlengthText();
  }, [content, counter]);

  return (
    <React.Fragment>
      <ReactQuill
        theme="snow"
        ref={quillRef}
        value={content}
        onChange={onChange}
        onKeyPress={onKeyDown}
        modules={modules}
        formats={formats}
        placeholder="본문을 입력해주세요"
      />
    </React.Fragment>
  );
}
