import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './textEditor.css';

const TextEditor = ({ setData }) => {
    const [editorData, setEditorData] = useState('');

    return (
        <div className="text-editor">
            <CKEditor
                editor={ClassicEditor} // editor에 ClassicEditor를 올바르게 전달
                data={editorData}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data); // 로컬 상태 업데이트
                    if (setData) setData(data); // 상위 컴포넌트로 데이터 전달
                }}
                config={{
                    toolbar: {
                        items: [
                            'undo', 'redo', '|', 'heading', '|', 'fontSize', 'fontFamily', 'fontColor', 
                            'fontBackgroundColor', '|', 'bold', 'italic', 'underline', '|', 'link', 
                            'insertTable', 'highlight', 'blockQuote', '|', 'alignment', '|', 'outdent', 'indent'
                        ],
                        shouldNotGroupWhenFull: false
                    },
                    fontFamily: {
                        supportAllValues: true
                    },
                    fontSize: {
                        options: [10, 12, 14, 'default', 18, 20, 22],
                        supportAllValues: true
                    },
                    fontColor: {
                        colors: [
                            { color: 'hsl(0, 0%, 0%)', label: 'Black' },
                            { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
                            { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
                            { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
                            { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true }
                        ]
                    },
                    fontBackgroundColor: {
                        colors: [
                            { color: 'hsl(0, 75%, 60%)', label: 'Red' },
                            { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
                            { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
                            { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
                            { color: 'hsl(120, 75%, 60%)', label: 'Green' }
                        ]
                    },
                    heading: {
                        options: [
                            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                        ]
                    },
                    language: 'ko',
                    link: {
                        addTargetToExternalLinks: true,
                        defaultProtocol: 'https://',
                        decorators: {
                            toggleDownloadable: {
                                mode: 'manual',
                                label: 'Downloadable',
                                attributes: { download: 'file' }
                            }
                        }
                    },
                    placeholder: '내용을 입력해주세요',
                    table: {
                        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
                    },
                }}
            />
        </div>
    );
};

export default TextEditor;
